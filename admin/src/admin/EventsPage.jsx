import { useEffect, useState } from 'react';
import { createEvent, createTicketType, fetchCategories } from './api';
import { useEvents, formatDate } from './useEvents';

const EMPTY_FORM = { category_id: '', title: '', description: '', venue: '', event_date: '' };
const EMPTY_TICKET = { name: '', price: '', quantity_total: '' };

export default function EventsPage() {
  const { events, loading, error, reload } = useEvents();
  const [form, setForm] = useState(EMPTY_FORM);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState('');
  const [success, setSuccess] = useState('');

  // Ticket types: array of { name, price, quantity_total }
  const [tickets, setTickets] = useState([{ ...EMPTY_TICKET }]);

  function addTicket() {
    setTickets((t) => [...t, { ...EMPTY_TICKET }]);
  }

  function removeTicket(i) {
    setTickets((t) => t.filter((_, idx) => idx !== i));
  }

  function updateTicket(i, field) {
    return (e) => setTickets((t) => t.map((row, idx) => idx === i ? { ...row, [field]: e.target.value } : row));
  }

  // Categories fetched from the live API
  const [categories, setCategories] = useState([]);
  useEffect(() => {
    fetchCategories()
      .then((data) => setCategories(Array.isArray(data) ? data : (data?.categories ?? [])))
      .catch(() => setCategories([]));
  }, []);

  function update(field) {
    return (e) => setForm((f) => ({ ...f, [field]: e.target.value }));
  }

  function validate() {
    const next = {};
    if (!form.title.trim()) next.title = 'Give the event a title.';
    if (!form.category_id) next.category_id = 'Choose a category.';
    if (!form.venue.trim()) next.venue = 'Enter the venue.';
    if (!form.event_date) next.event_date = 'Pick the date and time.';
    tickets.forEach((t, i) => {
      if (!t.name.trim()) next[`ticket_name_${i}`] = 'Enter a ticket name.';
      if (!t.price || isNaN(Number(t.price)) || Number(t.price) < 0) next[`ticket_price_${i}`] = 'Enter a valid price (0 for free).';
      if (!t.quantity_total || !Number.isInteger(Number(t.quantity_total)) || Number(t.quantity_total) < 1) next[`ticket_qty_${i}`] = 'Enter a quantity (min 1).';
    });
    return next;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setServerError('');
    setSuccess('');
    const found = validate();
    setErrors(found);
    if (Object.keys(found).length) return;

    setSubmitting(true);
    try {
      const created = await createEvent({
        category_id: Number(form.category_id),
        title: form.title.trim(),
        description: form.description.trim(),
        venue: form.venue.trim(),
        event_date: new Date(form.event_date).toISOString(),
      });
      // Create each ticket type against the new event_id
      await Promise.all(
        tickets.map((t) =>
          createTicketType(created.event_id, {
            name: t.name.trim(),
            price: Number(t.price),
            quantity_total: Number(t.quantity_total),
          })
        )
      );
      setForm(EMPTY_FORM);
      setTickets([{ ...EMPTY_TICKET }]);
      setSuccess('Event created and published.');
      await reload();
    } catch (err) {
      setServerError(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="admin-page">
      {/* ── Page header ── */}
      <div className="page-head">
        <div>
          <h1>Manage Events</h1>
          <p className="muted">Create and publish events to the platform.</p>
        </div>
      </div>

      {/* ── Create form card ── */}
      <section className="card ef-card">
        <div className="ef-card-header">
          <div>
            <h2 className="ef-card-title">Create a new event</h2>
            <p className="ef-card-sub">Fill in the details below. All fields marked * are required.</p>
          </div>
        </div>

        {serverError && <div className="alert alert--error" role="alert">{serverError}</div>}
        {success && <div className="alert alert--success" role="status">{success}</div>}

        <form onSubmit={handleSubmit} noValidate>
          <div className="ef-grid">

            {/* ── Left column ── */}
            <div className="ef-col">

              <div className="ef-field">
                <label className="ef-label" htmlFor="ef-title">Event title *</label>
                <input
                  id="ef-title"
                  className={`ef-input${errors.title ? ' ef-input--error' : ''}`}
                  placeholder="e.g. Nairobi Jazz Night 2026"
                  value={form.title}
                  onChange={update('title')}
                  aria-invalid={!!errors.title}
                />
                {errors.title && <span className="ef-error">{errors.title}</span>}
              </div>

              <div className="ef-field">
                <label className="ef-label" htmlFor="ef-category">Category *</label>
                <select
                  id="ef-category"
                  className={`ef-input${errors.category_id ? ' ef-input--error' : ''}`}
                  value={form.category_id}
                  onChange={update('category_id')}
                  aria-invalid={!!errors.category_id}
                >
                  <option value="">Select a category…</option>
                  {categories.map((c) => (
                    <option key={c.category_id} value={c.category_id}>{c.name}</option>
                  ))}
                </select>
                {errors.category_id && <span className="ef-error">{errors.category_id}</span>}
              </div>

              <div className="ef-field">
                <label className="ef-label" htmlFor="ef-venue">Venue *</label>
                <input
                  id="ef-venue"
                  className={`ef-input${errors.venue ? ' ef-input--error' : ''}`}
                  placeholder="e.g. Carnivore Grounds, Nairobi"
                  value={form.venue}
                  onChange={update('venue')}
                  aria-invalid={!!errors.venue}
                />
                {errors.venue && <span className="ef-error">{errors.venue}</span>}
              </div>

              <div className="ef-field">
                <label className="ef-label" htmlFor="ef-date">Date &amp; time *</label>
                <input
                  id="ef-date"
                  type="datetime-local"
                  className={`ef-input${errors.event_date ? ' ef-input--error' : ''}`}
                  value={form.event_date}
                  onChange={update('event_date')}
                  aria-invalid={!!errors.event_date}
                />
                {errors.event_date && <span className="ef-error">{errors.event_date}</span>}
              </div>

            </div>

            {/* ── Right column ── */}
            <div className="ef-col">

              {/* Description */}
              <div className="ef-field">
                <label className="ef-label" htmlFor="ef-description">Description</label>
                <textarea
                  id="ef-description"
                  className="ef-input ef-textarea"
                  rows={4}
                  placeholder="Tell attendees what to expect…"
                  value={form.description}
                  onChange={update('description')}
                />
              </div>

              {/* ── Ticket types ── */}
              <div className="ef-field">
                <div className="ef-tickets-header">
                  <label className="ef-label">Ticket types *</label>
                  <button type="button" className="ef-add-ticket-btn" onClick={addTicket}>
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true"><path d="M12 5v14M5 12h14"/></svg>
                    Add type
                  </button>
                </div>

                <div className="ef-tickets-list">
                  {tickets.map((t, i) => (
                    <div key={i} className="ef-ticket-row">
                      <div className="ef-ticket-row-fields">
                        <div className="ef-ticket-field">
                          <label className="ef-label" htmlFor={`tt-name-${i}`}>Name</label>
                          <input
                            id={`tt-name-${i}`}
                            className={`ef-input${errors[`ticket_name_${i}`] ? ' ef-input--error' : ''}`}
                            placeholder="e.g. Regular, VIP"
                            value={t.name}
                            onChange={updateTicket(i, 'name')}
                          />
                          {errors[`ticket_name_${i}`] && <span className="ef-error">{errors[`ticket_name_${i}`]}</span>}
                        </div>
                        <div className="ef-ticket-field ef-ticket-field--narrow">
                          <label className="ef-label" htmlFor={`tt-price-${i}`}>Price (KES)</label>
                          <input
                            id={`tt-price-${i}`}
                            type="number"
                            min="0"
                            step="0.01"
                            className={`ef-input${errors[`ticket_price_${i}`] ? ' ef-input--error' : ''}`}
                            placeholder="0"
                            value={t.price}
                            onChange={updateTicket(i, 'price')}
                          />
                          {errors[`ticket_price_${i}`] && <span className="ef-error">{errors[`ticket_price_${i}`]}</span>}
                        </div>
                        <div className="ef-ticket-field ef-ticket-field--narrow">
                          <label className="ef-label" htmlFor={`tt-qty-${i}`}>Quantity</label>
                          <input
                            id={`tt-qty-${i}`}
                            type="number"
                            min="1"
                            step="1"
                            className={`ef-input${errors[`ticket_qty_${i}`] ? ' ef-input--error' : ''}`}
                            placeholder="100"
                            value={t.quantity_total}
                            onChange={updateTicket(i, 'quantity_total')}
                          />
                          {errors[`ticket_qty_${i}`] && <span className="ef-error">{errors[`ticket_qty_${i}`]}</span>}
                        </div>
                      </div>
                      {tickets.length > 1 && (
                        <button type="button" className="ef-remove-ticket-btn" onClick={() => removeTicket(i)} aria-label={`Remove ticket type ${i + 1}`}>
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true"><path d="M18 6 6 18M6 6l12 12"/></svg>
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

            </div>
          </div>

          {/* Submit row */}
          <div className="ef-submit-row">
            <button type="submit" className="ef-submit-btn" disabled={submitting}>
              {submitting ? (
                <>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true" className="ef-spin">
                    <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
                  </svg>
                  Creating event…
                </>
              ) : (
                <>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
                    <path d="M12 5v14M5 12h14" />
                  </svg>
                  Create event
                </>
              )}
            </button>
          </div>
        </form>
      </section>

      {/* ── Events table ── */}
      <section className="card">
        <div className="page-head" style={{ marginBottom: '16px' }}>
          <h2>Published events</h2>
          <span className="badge">{events.length} events</span>
        </div>
        {loading && <p className="muted">Loading events…</p>}
        {error && <div className="alert alert--error" role="alert">{error}</div>}
        {!loading && !error && events.length === 0 && <p className="muted">No published events yet.</p>}

        {events.length > 0 && (
          <div style={{ overflowX: 'auto' }}>
            <table className="data-table">
              <thead>
                <tr>
                  <th>Event</th>
                  <th>Category</th>
                  <th>Venue</th>
                  <th>Date</th>
                  <th>Ticket types</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {events.map((ev) => (
                  <tr key={ev.event_id}>
                    <td><strong>{ev.title}</strong></td>
                    <td>{ev.Category?.name ?? '—'}</td>
                    <td>{ev.venue}</td>
                    <td>{formatDate(ev.event_date)}</td>
                    <td>{ev.TicketTypes?.length ? ev.TicketTypes.map((t) => t.name).join(', ') : <span className="muted">None yet</span>}</td>
                    <td><span className={`ef-status-badge ef-status-badge--${ev.status}`}>{ev.status}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}
