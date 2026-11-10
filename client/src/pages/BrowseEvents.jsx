// Search + filter (name, category, date range, price) with pagination.
import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import api, { errMsg } from '../api';
import EventCard from '../components/EventCard';

export default function BrowseEvents() {
  const [params] = useSearchParams();
  const empty = { q: params.get('q') || '', category: '', from: '', to: '', minPrice: '', maxPrice: '' };
  const [form, setForm] = useState(empty);
  const [applied, setApplied] = useState(empty);
  const [page, setPage] = useState(1);
  const [data, setData] = useState({ events: [], totalPages: 1, total: 0 });
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    api.get('/categories')
      .then(({ data }) => setCategories(Array.isArray(data) ? data : (data?.categories ?? [])))
      .catch(() => {});
  }, []);

  useEffect(() => {
    setLoading(true); setError('');
    api.get('/events', { params: { search: applied.q, category: applied.category } })
      .then(({ data: response }) => {
        const allEvents = Array.isArray(response) ? response : (response?.events ?? []);
        const filtered = allEvents.filter((event) => {
          const eventDate = new Date(event.event_date ?? event.date_time ?? event.date);
          const ticketTypes = event.TicketTypes ?? event.ticketTypes ?? [];
          const minEventPrice = ticketTypes.length ? Math.min(...ticketTypes.map((ticket) => Number(ticket.price) || 0)) : 0;
          const categoryName = event.Category?.name ?? event.category?.name ?? event.category_name ?? '';
          return (!applied.from || eventDate >= new Date(`${applied.from}T00:00:00`))
            && (!applied.to || eventDate <= new Date(`${applied.to}T23:59:59`))
            && (applied.minPrice === '' || minEventPrice >= Number(applied.minPrice))
            && (applied.maxPrice === '' || minEventPrice <= Number(applied.maxPrice))
            && (!applied.category || categoryName.toLowerCase() === applied.category.toLowerCase());
        });
        const pageSize = 9;
        const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
        setData({
          events: filtered.slice((page - 1) * pageSize, page * pageSize),
          totalPages,
          total: filtered.length,
        });
      })
      .catch((e) => setError(errMsg(e)))
      .finally(() => setLoading(false));
  }, [applied, page]);

  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });
  const apply = (e) => { e.preventDefault(); setPage(1); setApplied(form); };
  const reset = () => { setForm({ ...empty, q: '' }); setApplied({ ...empty, q: '' }); setPage(1); };

  return (
    <>
      <header className="eg-browse-heading">
        <div>
          <span className="eg-browse-kicker"><i className="fa-solid fa-sparkles" /> YOUR NEXT GOOD DAY STARTS HERE</span>
          <h1>Browse events</h1>
          <p>Find a plan worth getting out for.</p>
        </div>
        {!loading && !error && <span className="eg-results-count">{data.total} {data.total === 1 ? 'event' : 'events'} to explore</span>}
      </header>
      <form className="eg-filter-panel mb-4" onSubmit={apply}>
        <div className="eg-filter-panel-head">
          <div className="eg-filter-icon"><i className="fa-solid fa-sliders" /></div>
          <div><h2>Make it your kind of day</h2><p>Choose what you’re in the mood for.</p></div>
        </div>
        <div className="row g-3">
          <div className="col-12 col-lg-4">
            <label className="eg-filter-label" htmlFor="event-search">Search</label>
            <div className="eg-filter-input eg-search-input"><i className="fa-solid fa-magnifying-glass" /><input id="event-search" className="form-control" placeholder="Try ‘live music’ or ‘Lamu’" value={form.q} onChange={set('q')} /></div>
          </div>
          <div className="col-12 col-sm-6 col-lg-3">
            <label className="eg-filter-label" htmlFor="event-category">Category</label>
            <select id="event-category" className="form-select" value={form.category} onChange={set('category')}>
              <option value="">All categories</option>
              {categories.map((c) => <option key={c.category_id} value={c.name}>{c.name}</option>)}
            </select>
          </div>
          <div className="col-6 col-lg-2">
            <label className="eg-filter-label" htmlFor="event-from">From</label>
            <input id="event-from" type="date" className="form-control" value={form.from} onChange={set('from')} />
          </div>
          <div className="col-6 col-lg-3">
            <label className="eg-filter-label" htmlFor="event-to">To</label>
            <input id="event-to" type="date" className="form-control" value={form.to} onChange={set('to')} />
          </div>
          <div className="col-6 col-sm-4 col-lg-2">
            <label className="eg-filter-label" htmlFor="event-min-price">Min price <span>(KSh)</span></label>
            <input id="event-min-price" type="number" min="0" className="form-control" placeholder="Any" value={form.minPrice} onChange={set('minPrice')} />
          </div>
          <div className="col-6 col-sm-4 col-lg-2">
            <label className="eg-filter-label" htmlFor="event-max-price">Max price <span>(KSh)</span></label>
            <input id="event-max-price" type="number" min="0" className="form-control" placeholder="Any" value={form.maxPrice} onChange={set('maxPrice')} />
          </div>
          <div className="col-12 col-sm-4 col-lg-8 d-flex align-items-end gap-2 eg-filter-actions">
            <button className="btn btn-eg eg-filter-submit flex-fill" type="submit"><i className="fa-solid fa-arrow-right me-2" />Show me events</button>
            <button className="btn eg-filter-reset" type="button" onClick={reset}>Clear filters</button>
          </div>
        </div>
      </form>

      {loading && <div className="text-center py-4"><div className="spinner-border text-primary" /></div>}
      {error && <div className="alert alert-danger">{error}</div>}
      {!loading && !error && data.events.length === 0 && <p className="text-muted">No events match your search.</p>}
      <div className="row g-4">
        {data.events.map((ev) => <div className="col-12 col-md-6 col-lg-4" key={ev.event_id}><EventCard event={ev} /></div>)}
      </div>

      {data.totalPages > 1 && (
        <nav className="mt-4 d-flex justify-content-center align-items-center gap-3">
          <button className="btn btn-outline-primary btn-sm" disabled={page <= 1} onClick={() => setPage(page - 1)}>Previous</button>
          <span className="small text-muted">Page {page} of {data.totalPages}</span>
          <button className="btn btn-outline-primary btn-sm" disabled={page >= data.totalPages} onClick={() => setPage(page + 1)}>Next</button>
        </nav>
      )}
    </>
  );
}
