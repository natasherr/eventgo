import { useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import api, { errMsg } from '../api';
import { useAuth } from '../context/AuthContext';
import { fmtDate, kes } from '../utils';
import { getEventCover } from '../eventCovers';

const MAX_PER_TYPE = 10;

const normalizeEvent = (event) => ({
  ...event,
  title: event.title ?? event.event_name ?? 'Event',
  event_date: event.event_date ?? event.date_time,
  Category: event.Category ?? event.category,
  TicketTypes: event.TicketTypes ?? event.ticketTypes ?? [],
});

export default function EventDetails() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [event, setEvent] = useState(null);
  const [qty, setQty] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    let active = true;
    api.get(`/events/${id}`)
      .then(({ data }) => { if (active) setEvent(normalizeEvent(data.event ?? data)); })
      .catch((e) => { if (active) setError(e.response?.status === 404 ? 'This event could not be found.' : errMsg(e)); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [id]);

  const selected = useMemo(() => event?.TicketTypes.filter((ticket) => qty[ticket.ticket_type_id] > 0) ?? [], [event, qty]);
  const total = selected.reduce((sum, ticket) => sum + Number(ticket.price) * qty[ticket.ticket_type_id], 0);

  const change = (ticket, delta) => {
    const available = Number(ticket.available ?? ticket.quantity_available ?? ticket.quantity_total ?? MAX_PER_TYPE);
    const max = Math.min(MAX_PER_TYPE, available);
    setQty((current) => ({ ...current, [ticket.ticket_type_id]: Math.min(max, Math.max(0, (current[ticket.ticket_type_id] || 0) + delta)) }));
  };

  const proceed = () => {
    setError('');
    if (!selected.length) return setError('Choose at least one ticket to continue.');
    if (!user) return navigate('/login', { state: { from: location } });
    setBusy(true);
    navigate('/payment', {
      state: {
        event: { event_id: event.event_id, title: event.title, event_date: event.event_date, venue: event.venue },
        items: selected.map((ticket) => ({ ticketTypeId: ticket.ticket_type_id, ticketName: ticket.name, price: Number(ticket.price), quantity: qty[ticket.ticket_type_id] })),
      },
    });
  };

  if (loading) return <div className="text-center py-5"><div className="spinner-border text-primary" /></div>;
  if (!event) return <div className="alert alert-danger">{error || 'This event could not be found.'}</div>;
  const category = event.Category;
  const cover = getEventCover(event);

  return (
    <div className="mx-auto eg-event-detail-page" style={{ maxWidth: 820 }}>
      <div className="eg-detail-cover mb-4">
        <img className="eg-cover-image" src={cover.src} alt={`${event.title}: ${cover.description}`} decoding="async" title={cover.photographer ? `Photo by ${cover.photographer} on Unsplash` : event.title} onError={(e) => { e.currentTarget.remove(); }} />
        {cover.place && <span className="eg-cover-place">{cover.place}</span>}
      </div>
      <h2>{event.title}</h2>
      <p className="text-muted mb-1">
        <i className="fa-regular fa-calendar me-1" />{fmtDate(event.event_date)} &nbsp;
        <i className="fa-solid fa-location-dot me-1" />{event.venue}
        {category && <span className="badge bg-light text-primary ms-2">{category.name}</span>}
      </p>
      <p className="mt-3">{event.description || 'No description provided.'}</p>

      <h5 className="mt-4">Choose ticket type</h5>
      {event.TicketTypes.length === 0 && <p className="text-muted">Tickets are not on sale yet.</p>}
      {event.TicketTypes.map((ticket) => {
        const available = Number(ticket.available ?? ticket.quantity_available ?? ticket.quantity_total ?? MAX_PER_TYPE);
        const soldOut = available <= 0;
        return (
          <div className="card mb-2" key={ticket.ticket_type_id}>
            <div className="card-body d-flex flex-wrap align-items-center justify-content-between gap-2">
              <div>
                <strong>{ticket.name}</strong> <span className="ms-2">{kes(ticket.price)}</span>
                <div className="small text-muted">{soldOut ? 'Sold out' : ticket.available != null ? `${ticket.available} available` : 'On sale now'}</div>
              </div>
              <div className="d-flex align-items-center gap-2">
                <span className="small text-muted">Quantity</span>
                <button className="btn btn-outline-secondary btn-sm" disabled={soldOut || !qty[ticket.ticket_type_id]} onClick={() => change(ticket, -1)} aria-label={`Decrease ${ticket.name}`}><i className="fa-solid fa-minus" /></button>
                <span className="px-2 fw-semibold" aria-live="polite">{qty[ticket.ticket_type_id] || 0}</span>
                <button className="btn btn-outline-secondary btn-sm" disabled={soldOut || qty[ticket.ticket_type_id] >= Math.min(MAX_PER_TYPE, available)} onClick={() => change(ticket, 1)} aria-label={`Increase ${ticket.name}`}><i className="fa-solid fa-plus" /></button>
              </div>
            </div>
          </div>
        );
      })}

      {error && <div className="alert alert-danger mt-3">{error}</div>}
      <div className="d-flex justify-content-between align-items-center mt-3">
        <span className="fw-semibold">Total: {kes(total)}</span>
        <button className="btn btn-eg btn-lg" onClick={proceed} disabled={busy || event.TicketTypes.length === 0}>Continue to payment <i className="fa-solid fa-arrow-right ms-2" /></button>
      </div>
      {!user && <p className="small text-muted mt-2">You will be asked to log in or register before paying.</p>}
    </div>
  );
}
