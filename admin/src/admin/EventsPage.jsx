// client/src/admin/EventsPage.jsx
import { useState } from 'react';
import { createEvent } from './api';
import { useEvents, formatDate } from './useEvents';

// The backend has no GET /api/categories yet, so the dropdown is hard-coded to
// match what seed.js creates (Music is inserted first -> id 1, Technology -> id 2).
// TODO: replace with a fetch once Ashley adds the endpoint.
const CATEGORIES = [
  { category_id: 1, name: 'Music' },
  { category_id: 2, name: 'Technology' },
];

const EMPTY_FORM = { category_id: '', title: '', description: '', venue: '', event_date: '' };

export default function EventsPage() {
  const { events, loading, error, reload } = useEvents();
  const [form, setForm] = useState(EMPTY_FORM);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState('');
  const [success, setSuccess] = useState('');

  function update(field) {
    return (e) => setForm((f) => ({ ...f, [field]: e.target.value }));
  }

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
    setSuccess('');
    const found = validate();
    setErrors(found);
    if (Object.keys(found).length) return;

    setSubmitting(true);
    try {
      await createEvent({
        category_id: Number(form.category_id),
        title: form.title.trim(),
        description: form.description.trim(),
        venue: form.venue.trim(),
        // <input type="datetime-local"> gives "2026-12-01T10:00" with no timezone.
        // new Date() reads it as the admin's local time (Nairobi), and
        // toISOString() converts that to the UTC string the backend expects.
        event_date: new Date(form.event_date).toISOString(),
      });
      setForm(EMPTY_FORM);
      setSuccess('Event created and published.');
      await reload(); // refresh the table so the new row appears
    } catch (err) {
      setServerError(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="admin-page">
      <h1>Manage Events</h1>

      <section className="card">
        <h2>Create a new event</h2>
        {serverError && <div className="alert alert--error" role="alert">{serverError}</div>}
        {success && <div className="alert alert--success" role="status">{success}</div>}

        <form onSubmit={handleSubmit} noValidate className="event-form">
          <label htmlFor="title">Title</label>
          <input id="title" value={form.title} onChange={update('title')} aria-invalid={!!errors.title} />
          {errors.title && <span className="field-error">{errors.title}</span>}

          <label htmlFor="category">Category</label>
          <select id="category" value={form.category_id} onChange={update('category_id')} aria-invalid={!!errors.category_id}>
            <option value="">Select a category…</option>
            {CATEGORIES.map((c) => (
              <option key={c.category_id} value={c.category_id}>{c.name}</option>
            ))}
          </select>
          {errors.category_id && <span className="field-error">{errors.category_id}</span>}

          <label htmlFor="venue">Venue</label>
          <input id="venue" value={form.venue} onChange={update('venue')} aria-invalid={!!errors.venue} />
          {errors.venue && <span className="field-error">{errors.venue}</span>}

          <label htmlFor="event_date">Date &amp; time</label>
          <input id="event_date" type="datetime-local" value={form.event_date} onChange={update('event_date')} aria-invalid={!!errors.event_date} />
          {errors.event_date && <span className="field-error">{errors.event_date}</span>}

          <label htmlFor="description">Description</label>
          <textarea id="description" rows={4} value={form.description} onChange={update('description')} />

          <button type="submit" disabled={submitting}>
            {submitting ? 'Creating…' : 'Create event'}
          </button>
        </form>
      </section>

      <section className="card">
        <h2>Published events</h2>
        {loading && <p className="muted">Loading events…</p>}
        {error && <div className="alert alert--error" role="alert">{error}</div>}
        {!loading && !error && events.length === 0 && <p className="muted">No published events yet.</p>}

        {events.length > 0 && (
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
                  <td>{ev.title}</td>
                  <td>{ev.Category?.name ?? '—'}</td>
                  <td>{ev.venue}</td>
                  <td>{formatDate(ev.event_date)}</td>
                  <td>{ev.TicketTypes?.length ? ev.TicketTypes.map((t) => t.name).join(', ') : 'None yet'}</td>
                  <td>{ev.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>
    </div>
  );
}
