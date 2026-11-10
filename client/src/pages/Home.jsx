import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api, { errMsg } from '../api';
import EventCard from '../components/EventCard';
import { fmtShort, kes, minPrice } from '../utils';
import { getEventCover } from '../eventCovers';

const quickSearches = ['Music', 'Culture', 'Business'];

export default function Home() {
  const [q, setQ] = useState('');
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    api.get('/events')
      .then(({ data }) => {
        const list = Array.isArray(data) ? data : data?.events;
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const upcoming = Array.isArray(list) ? list.filter((event) => {
          const date = new Date(event.event_date ?? event.date_time);
          return !Number.isNaN(date.getTime()) && date >= today;
        }) : [];
        setEvents(upcoming.slice(0, 3));
      })
      .catch((e) => setError(errMsg(e)))
      .finally(() => setLoading(false));
  }, []);

  const search = (e) => {
    e.preventDefault();
    navigate(`/events?q=${encodeURIComponent(q.trim())}`);
  };

  const feature = events[0];
  const featureTitle = feature?.event_name ?? feature?.title ?? 'Upcoming event';
  const featureDate = feature?.date_time ?? feature?.event_date;
  const featureCategory = feature?.category ?? feature?.Category;
  const featurePrice = feature ? minPrice(feature.ticketTypes ?? feature.TicketTypes ?? []) : null;
  const featureCover = feature ? getEventCover(feature) : null;

  return (
    <>
      <section className="eg-hero mb-5">
        <div className="eg-hero-copy">
          <span className="eg-eyebrow">MADE FOR GOOD DAYS OUT <span className="eg-live-dot" /></span>
          <h1>Make room for<br /><span>something live.</span></h1>
          <p className="eg-hero-lede">Find concerts, culture, sport and ideas worth stepping out for, all across Kenya.</p>
          <form onSubmit={search} className="eg-search">
            <i className="fa-solid fa-magnifying-glass" aria-hidden="true" />
            <input placeholder="Search events, artists, or places" value={q} onChange={(e) => setQ(e.target.value)} aria-label="Search events" />
            <button type="submit">Find events <i className="fa-solid fa-arrow-right ms-2" /></button>
          </form>
          <div className="eg-quick-search">
            <span>Popular:</span>
            {quickSearches.map((item) => <button key={item} type="button" onClick={() => navigate(`/events?q=${encodeURIComponent(item)}`)}>{item}</button>)}
          </div>
        </div>
        <div className="eg-hero-art">
          {feature ? (
            <Link className="eg-spotlight" to={`/events/${feature.event_id}`}>
              <div className="eg-spotlight-photo">
                <img className="eg-cover-image" src={featureCover.src} alt={`${featureTitle}: ${featureCover.description}`} loading="lazy" decoding="async" title={featureCover.photographer ? `Photo by ${featureCover.photographer} on Unsplash` : featureTitle} onError={(e) => { e.currentTarget.remove(); }} />
                <span className="eg-spotlight-label">UP NEXT <i className="fa-solid fa-arrow-up-right-from-square" /></span>
                {featureCover.place && <span className="eg-spotlight-category">{featureCover.place}</span>}
              </div>
              <div className="eg-spotlight-body">
                <div><span className="eg-spotlight-date">{featureDate ? fmtShort(featureDate) : 'DATE TO BE ANNOUNCED'}{feature?.venue ? ` · ${feature.venue}` : ''}</span><h2>{featureTitle}</h2><span className="small text-muted">{featureCategory?.name}</span></div>
                <span className="eg-spotlight-price">{featurePrice == null ? 'Tickets soon' : <>From<br /><strong>{kes(featurePrice)}</strong></>}</span>
              </div>
            </Link>
          ) : (
            <div className="eg-spotlight-placeholder"><i className="fa-regular fa-calendar" /><span>LOCAL PLANS, ALL IN ONE PLACE</span><strong>Find your next reason to go out.</strong></div>
          )}
        </div>
      </section>

      <section className="eg-events-section">
        <div className="eg-section-head">
          <div><span className="eg-section-kicker">HAPPENING SOON</span><h2>Plans worth making</h2><p>Handpicked moments to get excited about.</p></div>
          <Link className="eg-view-all" to="/events">Explore all events <i className="fa-solid fa-arrow-right" /></Link>
        </div>
        {loading && <div className="eg-loading-grid" aria-label="Loading events"><div /><div /><div /></div>}
        {error && <div className="alert alert-danger">{error}</div>}
        {!loading && !error && events.length === 0 && <div className="eg-empty"><i className="fa-regular fa-calendar" /><strong>Something good is on its way.</strong><span>No upcoming events just yet. Check back soon.</span></div>}
        <div className="row g-4">
          {events.map((ev) => <div className="col-12 col-md-6 col-lg-4" key={ev.event_id}><EventCard event={ev} /></div>)}
        </div>
      </section>
      <section className="eg-bottom-note"><span className="eg-note-icon"><i className="fa-solid fa-heart" /></span><p><strong>Life’s better out there.</strong> Find a reason to get together this week.</p><Link to="/events">Find your next event <i className="fa-solid fa-arrow-right ms-2" /></Link></section>
    </>
  );
}
