import { Link } from 'react-router-dom';
import { fmtShort, kes, minPrice } from '../utils';
import { getEventCover } from '../eventCovers';

const artFor = (name = '') => {
  const category = name.toLowerCase();
  if (category.includes('music') || category.includes('concert')) return { tone: 'music', icon: 'fa-music' };
  if (category.includes('business') || category.includes('tech') || category.includes('conference')) return { tone: 'ideas', icon: 'fa-lightbulb' };
  if (category.includes('culture') || category.includes('food') || category.includes('art')) return { tone: 'culture', icon: 'fa-masks-theater' };
  if (category.includes('sport') || category.includes('race')) return { tone: 'sport', icon: 'fa-flag-checkered' };
  return { tone: 'default', icon: 'fa-ticket' };
};

export default function EventCard({ event }) {
  const ticketTypes = event.ticketTypes ?? event.TicketTypes ?? [];
  const category = event.category ?? event.Category;
  const title = event.event_name ?? event.title ?? 'Untitled event';
  const date = event.date_time ?? event.event_date;
  const from = minPrice(ticketTypes);
  const art = artFor(category?.name);
  const cover = getEventCover(event);

  return (
    <article className="card h-100 eg-card">
      <div className={`eg-event-art eg-event-art-${art.tone} has-image`}>
        <img className="eg-cover-image" src={cover.src} alt={`${title}: ${cover.description}`} loading="lazy" decoding="async" title={cover.photographer ? `Photo by ${cover.photographer} on Unsplash` : title} onError={(e) => { e.currentTarget.remove(); }} />
        <span className="eg-event-brand"><i className="fa-solid fa-ticket" /> EVENTGO</span>
        {cover.place && <span className="eg-cover-place">{cover.place}</span>}
        {!cover.photographer && <i className={`fa-solid ${art.icon} eg-event-art-icon`} aria-hidden="true" />}
        {category?.name && <span className="eg-event-category">{category.name}</span>}
        <span className="eg-event-art-date">{date ? fmtShort(date) : 'COMING SOON'}</span>
      </div>
      <div className="card-body d-flex flex-column">
        <h3 className="card-title">{title}</h3>
        <p className="eg-event-detail"><i className="fa-regular fa-calendar" />{date ? fmtShort(date) : 'Date to be announced'}</p>
        <p className="eg-event-detail"><i className="fa-solid fa-location-dot" />{event.venue || 'Location to be announced'}</p>
        {ticketTypes.length > 0 && <div className="eg-ticket-tags">{ticketTypes.slice(0, 2).map((ticket) => <span key={ticket.ticket_type_id}>{ticket.name}</span>)}</div>}
        <div className="eg-card-footer mt-auto">
          <span className="eg-card-price">{from == null ? 'Tickets soon' : <><small>From</small> {kes(from)}</>}</span>
          <Link to={`/events/${event.event_id}`} className="eg-card-link" aria-label={`View ${title}`}><i className="fa-solid fa-arrow-right" /></Link>
        </div>
      </div>
    </article>
  );
}
