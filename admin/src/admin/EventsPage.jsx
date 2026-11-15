import { useEffect, useMemo, useState } from 'react';
import { createEvent, createTicketType, fetchCategories, updateEvent, deleteEvent } from './api';
import { useEvents, formatDate } from './useEvents';

const EMPTY_FORM = { category_id: '', title: '', description: '', venue: '', event_date: '', status: 'published' };
const EMPTY_TICKET = { name: '', price: '', quantity_total: '' };

// ── Shared field-level validation ──────────────────────────────────────────────
function validateEventForm(form, tickets) {
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

// ── Edit Modal ─────────────────────────────────────────────────────────────────
function EditModal({ event, categories, onClose, onSaved }) {
  const [form, setForm] = useState({
    category_id: String(event.category_id ?? ''),
    title: event.title ?? '',
    description: event.description ?? '',
    venue: event.venue ?? '',
    // Convert ISO date to datetime-local format (strip seconds/ms)
    event_date: event.event_date ? new Date(event.event_date).toISOString().slice(0, 16) : '',
    status: event.status ?? 'published',
  });
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const update = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }));

  function validate() {
    const next = {};
    if (!form.title.trim()) next.title = 'Give the event a title.';
    if (!form.category_id) next.category_id = 'Choose a category.';
    if (!form.venue.trim()) next.venue = 'Enter the venue.';
    if (!form.event_date) next.event_date = 'Pick the date and time.';
    return next;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setServerError('');
    const found = validate();
    setErrors(found);
    if (Object.keys(found).length) return;
    setSubmitting(true);
    try {
      await updateEvent(event.event_id, {
        category_id: Number(form.category_id),
        title: form.title.trim(),
        description: form.description.trim(),
        venue: form.venue.trim(),
        event_date: new Date(form.event_date).toISOString(),
        status: form.status,
      });
      onSaved();
    } catch (err) {
      setServerError(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-box" onClick={(e) => e.stopPropagation()} role="dialog" aria-modal="true" aria-labelledby="edit-modal-title">
        <div className="modal-header">
          <h2 id="edit-modal-title">Edit Event</h2>
          <button className="modal-close" onClick={onClose} aria-label="Close">✕</button>
        </div>

        {serverError && <div className="alert alert--error" role="alert">{serverError}</div>}

        <form onSubmit={handleSubmit} noValidate>
          <div className="ef-field">
            <label className="ef-label" htmlFor="edit-title">Event title *</label>
            <input id="edit-title" className={`ef-input${errors.title ? ' ef-input--error' : ''}`} value={form.title} onChange={update('title')} />
            {errors.title && <span className="ef-error">{errors.title}</span>}
          </div>

          <div className="ef-field">
            <label className="ef-label" htmlFor="edit-category">Category *</label>
            <select id="edit-category" className={`ef-input${errors.category_id ? ' ef-input--error' : ''}`} value={form.category_id} onChange={update('category_id')}>
              <option value="">Select a category…</option>
              {categories.map((c) => (
                <option key={c.category_id} value={c.category_id}>{c.name}</option>
              ))}
            </select>
            {errors.category_id && <span className="ef-error">{errors.category_id}</span>}
          </div>

          <div className="ef-field">
            <label className="ef-label" htmlFor="edit-venue">Venue *</label>
            <input id="edit-venue" className={`ef-input${errors.venue ? ' ef-input--error' : ''}`} value={form.venue} onChange={update('venue')} />
            {errors.venue && <span className="ef-error">{errors.venue}</span>}
          </div>

          <div className="ef-field">
            <label className="ef-label" htmlFor="edit-date">Date &amp; time *</label>
            <input id="edit-date" type="datetime-local" className={`ef-input${errors.event_date ? ' ef-input--error' : ''}`} value={form.event_date} onChange={update('event_date')} />
            {errors.event_date && <span className="ef-error">{errors.event_date}</span>}
          </div>

          <div className="ef-field">
            <label className="ef-label" htmlFor="edit-status">Status</label>
            <select id="edit-status" className="ef-input" value={form.status} onChange={update('status')}>
              <option value="published">Published</option>
              <option value="draft">Draft</option>
              <option value="cancelled">Cancelled</option>
              <option value="completed">Completed</option>
            </select>
          </div>

          <div className="ef-field">
            <label className="ef-label" htmlFor="edit-description">Description</label>
            <textarea id="edit-description" className="ef-input ef-textarea" rows={3} value={form.description} onChange={update('description')} />
          </div>

          <div className="modal-actions">
            <button type="button" className="btn-secondary" onClick={onClose} disabled={submitting}>Cancel</button>
            <button type="submit" className="ef-submit-btn" disabled={submitting}>
              {submitting ? 'Saving…' : 'Save changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ── Delete Confirmation Modal ──────────────────────────────────────────────────
function DeleteModal({ event, onClose, onDeleted }) {
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState('');

  async function handleDelete() {
    setSubmitting(true);
    setServerError('');
    try {
      await deleteEvent(event.event_id);
      onDeleted();
    } catch (err) {
      setServerError(err.message);
      setSubmitting(false);
    }
  }

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-box modal-box--sm" onClick={(e) => e.stopPropagation()} role="dialog" aria-modal="true" aria-labelledby="delete-modal-title">
        <div className="modal-header">
          <h2 id="delete-modal-title">Delete Event</h2>
          <button className="modal-close" onClick={onClose} aria-label="Close">✕</button>
        </div>
        <p>Are you sure you want to permanently delete <strong>{event.title}</strong>? This action cannot be undone.</p>
        {serverError && <div className="alert alert--error" role="alert">{serverError}</div>}
        <div className="modal-actions">
          <button type="button" className="btn-secondary" onClick={onClose} disabled={submitting}>Cancel</button>
          <button type="button" className="btn-danger" onClick={handleDelete} disabled={submitting}>
            {submitting ? 'Deleting…' : 'Yes, delete'}
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Main Page ──────────────────────────────────────────────────────────────────
export default function EventsPage() {
  const { events, loading, error, reload } = useEvents({ admin: true });
  const [form, setForm] = useState(EMPTY_FORM);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState('');
  const [success, setSuccess] = useState('');

  // Ticket types for create form
  const [tickets, setTickets] = useState([{ ...EMPTY_TICKET }]);

  // Modal state
  const [editTarget, setEditTarget] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);

  // ── Table filters ──────────────────────────────────────────────────────────
  const [search, setSearch]         = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [dateFrom, setDateFrom]     = useState('');
  const [dateTo, setDateTo]         = useState('');

  function addTicket() { setTickets((t) => [...t, { ...EMPTY_TICKET }]); }
  function removeTicket(i) { setTickets((t) => t.filter((_, idx) => idx !== i)); }
  function updateTicket(i, field) {
    return (e) => setTickets((t) => t.map((row, idx) => idx === i ? { ...row, [field]: e.target.value } : row));
  }

  const filteredEvents = useMemo(() => {
    const q      = search.toLowerCase();
    const fromMs = dateFrom ? new Date(dateFrom).getTime() : null;
    const toMs   = dateTo   ? new Date(dateTo + 'T23:59:59').getTime() : null;

    return events.filter((ev) => {
      if (q) {
        const hay = [ev.title, ev.venue, ev.Category?.name].filter(Boolean).join(' ').toLowerCase();
        if (!hay.includes(q)) return false;
      }
      if (statusFilter !== 'all' && ev.status !== statusFilter) return false;
      const ts = ev.event_date ? new Date(ev.event_date).getTime() : null;
      if (fromMs && ts && ts < fromMs) return false;
      if (toMs   && ts && ts > toMs)   return false;
      return true;
    });
  }, [events, search, statusFilter, dateFrom, dateTo]);

  const isFiltered = search || statusFilter !== 'all' || dateFrom || dateTo;

  const clearFilters = () => {
    setSearch('');
    setStatusFilter('all');
    setDateFrom('');
    setDateTo('');
  };

  const [categories, setCategories] = useState([]);
  useEffect(() => {
    fetchCategories()
      .then((data) => setCategories(Array.isArray(data) ? data : (data?.categories ?? [])))
      .catch(() => setCategories([]));
  }, []);

  const update = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }));

  async function handleSubmit(e) {
    e.preventDefault();
    setServerError('');
    setSuccess('');
    const found = validateEventForm(form, tickets);
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
      {/* ── Modals ── */}
      {editTarget && (
        <EditModal
          event={editTarget}
          categories={categories}
          onClose={() => setEditTarget(null)}
          onSaved={async () => { setEditTarget(null); await reload(); }}
        />
      )}
      {deleteTarget && (
        <DeleteModal
          event={deleteTarget}
          onClose={() => setDeleteTarget(null)}
          onDeleted={async () => { setDeleteTarget(null); await reload(); }}
        />
      )}

      {/* ── Page header ── */}
      <div className="page-head">
        <div>
          <h1>Manage Events</h1>
          <p className="muted">Create, edit and delete events on the platform.</p>
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
                    Add Type
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
          <h2>All Events</h2>
          <span className="badge">
            {isFiltered ? `${filteredEvents.length} of ${events.length}` : events.length} events
          </span>
        </div>

        {/* ── Filters bar ── */}
        <div className="sales-filters" style={{ marginBottom: '12px', display: 'flex', flexWrap: 'nowrap', alignItems: 'flex-end', gap: 10 }}>
          <input
            type="search"
            placeholder="Search title, venue, category…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ flex: '0 1 220px', minWidth: 0 }}
          />
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} style={{ flex: '0 0 150px' }}>
            <option value="all">All statuses</option>
            <option value="published">Published</option>
            <option value="draft">Draft</option>
            <option value="cancelled">Cancelled</option>
            <option value="completed">Completed</option>
          </select>
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: 8, flexWrap: 'nowrap' }}>
            <label style={{ display: 'flex', flexDirection: 'column', gap: 3, fontSize: '.76rem', fontWeight: 600, color: '#64748b', textTransform: 'uppercase', letterSpacing: '.04em' }}>
              From
              <input
                type="date"
                style={{ padding: '7px 10px', border: '1px solid #e2e8f0', borderRadius: 8, fontSize: '.84rem', background: '#fff', color: '#0f172a', outline: 'none' }}
                value={dateFrom}
                onChange={(e) => setDateFrom(e.target.value)}
              />
            </label>
            <label style={{ display: 'flex', flexDirection: 'column', gap: 3, fontSize: '.76rem', fontWeight: 600, color: '#64748b', textTransform: 'uppercase', letterSpacing: '.04em' }}>
              To
              <input
                type="date"
                style={{ padding: '7px 10px', border: '1px solid #e2e8f0', borderRadius: 8, fontSize: '.84rem', background: '#fff', color: '#0f172a', outline: 'none' }}
                value={dateTo}
                onChange={(e) => setDateTo(e.target.value)}
              />
            </label>
          </div>
          {isFiltered && (
            <button className="btn-secondary" onClick={clearFilters} style={{ alignSelf: 'flex-end' }}>
              Clear filters
            </button>
          )}
        </div>

        {loading && <p className="muted">Loading events…</p>}
        {error && <div className="alert alert--error" role="alert">{error}</div>}
        {!loading && !error && events.length === 0 && <p className="muted">No events yet.</p>}
        {!loading && !error && events.length > 0 && filteredEvents.length === 0 && (
          <p className="muted">No events match your filters. <button className="btn-secondary" onClick={clearFilters} style={{ marginLeft: 8 }}>Clear filters</button></p>
        )}

        {filteredEvents.length > 0 && (
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
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredEvents.map((ev) => (
                  <tr key={ev.event_id}>
                    <td><strong>{ev.title}</strong></td>
                    <td>{ev.Category?.name ?? '—'}</td>
                    <td>{ev.venue}</td>
                    <td>{formatDate(ev.event_date)}</td>
                    <td>{ev.TicketTypes?.length ? ev.TicketTypes.map((t) => t.name).join(', ') : <span className="muted">None yet</span>}</td>
                    <td><span className={`ef-status-badge ef-status-badge--${ev.status}`}>{ev.status}</span></td>
                    <td>
                      <div className="row-actions">
                        <button
                          className="action-btn action-btn--edit"
                          onClick={() => setEditTarget(ev)}
                          title="Edit event"
                        >
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" aria-hidden="true"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                          Edit
                        </button>
                        <button
                          className="action-btn action-btn--delete"
                          onClick={() => setDeleteTarget(ev)}
                          title="Delete event"
                        >
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" aria-hidden="true"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6M14 11v6"/><path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/></svg>
                          Delete
                        </button>
                      </div>
                    </td>
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
