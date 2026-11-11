import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { fetchOrders, fetchSalesReport } from './api';
import { useEvents, eventStats, formatDate } from './useEvents';

const formatMoney = (n) =>
  new Intl.NumberFormat('en-KE', { style: 'currency', currency: 'KES', maximumFractionDigits: 0 }).format(n);

export default function Dashboard() {
  const { events, loading, error } = useEvents();
  const { totalEvents, upcomingCount } = eventStats(events);
  const upcoming = events.filter((e) => new Date(e.event_date) >= new Date()).slice(0, 5);

  // Live orders for metric cards
  const [orders, setOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(true);

  // Live sales-by-event for the chart
  const [salesData, setSalesData] = useState([]);
  const [salesLoading, setSalesLoading] = useState(true);

  useEffect(() => {
    fetchOrders()
      .then((data) => setOrders(Array.isArray(data) ? data : []))
      .catch(() => setOrders([]))
      .finally(() => setOrdersLoading(false));

    fetchSalesReport()
      .then((data) => setSalesData(Array.isArray(data) ? data : []))
      .catch(() => setSalesData([]))
      .finally(() => setSalesLoading(false));
  }, []);

  const paidOrders = orders.filter((o) => o.status === 'paid');
  const ticketsSold = paidOrders.reduce((sum, o) => sum + Number(o.quantity || 0), 0);
  const totalRevenue = paidOrders.reduce((sum, o) => sum + Number(o.total_amount || 0), 0);

  // Chart: up to 8 events by revenue, truncate long names
  const chartData = salesData
    .slice()
    .sort((a, b) => Number(b.totalRevenue) - Number(a.totalRevenue))
    .slice(0, 8);
  const chartMax = Math.max(...chartData.map((d) => Number(d.totalRevenue)), 1);

  return (
    <div className="admin-page">
      <div className="page-head">
        <div>
          <h1>Dashboard</h1>
          <p className="muted">Welcome back! Here's what's happening with your events.</p>
        </div>
        <Link className="btn" to="/admin/events">
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          Manage Events
        </Link>
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
        <div className="card stat">
          <span className="muted">Tickets Sold</span>
          <strong>{ordersLoading ? '…' : ticketsSold.toLocaleString()}</strong>
          <small>From paid orders</small>
        </div>
        <div className="card stat">
          <span className="muted">Total Revenue</span>
          <strong>{ordersLoading ? '…' : formatMoney(totalRevenue)}</strong>
          <small>From paid orders</small>
        </div>
      </div>

      <section className="card">
        <div className="page-head">
          <h2>Revenue by Event</h2>
          <Link to="/admin/reports">Full report →</Link>
        </div>
        <p className="muted" style={{ marginBottom: '4px' }}>Live revenue from paid ticket sales, grouped by event.</p>

        {salesLoading && <p className="muted">Loading…</p>}

        {!salesLoading && chartData.length === 0 && (
          <p className="muted">No paid sales recorded yet.</p>
        )}

        {!salesLoading && chartData.length > 0 && (
          <div className="bars" role="img" aria-label="Revenue by event bar chart">
            {chartData.map((d) => {
              const label = (d.eventName || 'Unknown').length > 14
                ? (d.eventName || 'Unknown').slice(0, 13) + '…'
                : (d.eventName || 'Unknown');
              return (
                <div key={d.eventName} className="bars__col" title={`${d.eventName}: ${formatMoney(Number(d.totalRevenue))}`}>
                  <div className="bars__bar" style={{ height: `${(Number(d.totalRevenue) / chartMax) * 100}%` }} />
                  <span>{label}</span>
                </div>
              );
            })}
          </div>
        )}
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
