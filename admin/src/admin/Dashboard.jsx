// client/src/admin/Dashboard.jsx
import { Link } from 'react-router-dom';
import { useEvents, eventStats, formatDate } from './useEvents';

// No backend endpoint exists yet for sales/revenue. These are clearly labelled
// sample values so nobody mistakes them for live data. Replace when Ashley ships it.
const SAMPLE_MONTHS = [
  { m: 'Apr', v: 210 }, { m: 'May', v: 260 }, { m: 'Jun', v: 240 },
  { m: 'Jul', v: 320 }, { m: 'Aug', v: 380 }, { m: 'Sep', v: 350 }, { m: 'Oct', v: 440 },
];

export default function Dashboard() {
  const { events, loading, error } = useEvents();
  const { totalEvents, upcomingCount } = eventStats(events);
  const max = Math.max(...SAMPLE_MONTHS.map((d) => d.v));
  const upcoming = events.filter((e) => new Date(e.event_date) >= new Date()).slice(0, 5);

  return (
    <div className="admin-page">
      <div className="page-head">
        <div>
          <h1>Dashboard</h1>
          <p className="muted">Welcome back! Here's what's happening with your events.</p>
        </div>
        <Link className="btn" to="/admin/events">＋ Manage Events</Link>
      </div>

      {error && <div className="alert alert--error" role="alert">{error}</div>}

      <div className="stats">
        <div className="card stat">
          <span className="muted">Total Events</span>
          <strong>{loading ? '…' : totalEvents}</strong>
          <small>Published events</small>
        </div>
        <div className="card stat">
          <span className="muted">Upcoming Events</span>
          <strong>{loading ? '…' : String(upcomingCount).padStart(2, '0')}</strong>
          <small>Next 30 days</small>
        </div>
        <div className="card stat stat--sample">
          <span className="muted">Tickets Sold</span>
          <strong>—</strong>
          <small>Available after the sales API update</small>
        </div>
        <div className="card stat stat--sample">
          <span className="muted">Total Revenue</span>
          <strong>—</strong>
          <small>Available after the sales API update</small>
        </div>
      </div>

      <section className="card">
        <h2>Sales Overview <span className="badge">Sample data</span></h2>
        <p className="muted">Illustrative only until the sales endpoint exists.</p>
        <div className="bars" role="img" aria-label="Sample monthly sales bar chart">
          {SAMPLE_MONTHS.map((d) => (
            <div key={d.m} className="bars__col">
              <div className="bars__bar" style={{ height: `${(d.v / max) * 100}%` }} />
              <span>{d.m}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="card">
        <div className="page-head">
          <h2>Upcoming Events</h2>
          <Link to="/admin/events">View all events →</Link>
        </div>
        {loading && <p className="muted">Loading…</p>}
        {!loading && upcoming.length === 0 && <p className="muted">No upcoming events.</p>}
        {upcoming.length > 0 && (
          <table className="data-table">
            <thead>
              <tr><th>Event</th><th>Date</th><th>Venue</th><th>Status</th></tr>
            </thead>
            <tbody>
              {upcoming.map((e) => (
                <tr key={e.event_id}>
                  <td>{e.title}</td>
                  <td>{formatDate(e.event_date)}</td>
                  <td>{e.venue}</td>
                  <td>{e.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>
    </div>
  );
}
