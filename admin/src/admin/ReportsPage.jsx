import { useEffect, useState } from 'react';
import { fetchSalesReport } from './api';

const currency = new Intl.NumberFormat('en-KE', {
  style: 'currency',
  currency: 'KES',
  maximumFractionDigits: 0,
});

export default function ReportsPage() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function loadReports() {
      try {
        const data = await fetchSalesReport();
        setReports(Array.isArray(data) ? data : []);
      } catch (err) {
        setError(err.message || 'Unable to load reports.');
      } finally {
        setLoading(false);
      }
    }

    loadReports();
  }, []);

  const totalRevenue = reports.reduce(
    (sum, item) => sum + Number(item.totalRevenue || 0),
    0
  );

  const totalTickets = reports.reduce(
    (sum, item) => sum + Number(item.ticketsSold || 0),
    0
  );

  if (loading) return <p>Loading reports...</p>;

  if (error) {
    return <div className="alert alert--error">{error}</div>;
  }

  return (
    <div className="admin-page">
      <div className="page-header">
        <div>
          <h1>Reports</h1>
          <p className="muted">Review event sales and revenue performance.</p>
        </div>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <span>Total Revenue</span>
          <h2>{currency.format(totalRevenue)}</h2>
        </div>

        <div className="stat-card">
          <span>Tickets Sold</span>
          <h2>{totalTickets.toLocaleString()}</h2>
        </div>

        <div className="stat-card">
          <span>Events With Sales</span>
          <h2>{reports.length}</h2>
        </div>
      </div>

      <section className="panel">
        <h2>Sales by Event</h2>

        {reports.length === 0 ? (
          <p className="muted">No paid sales available yet.</p>
        ) : (
          <div className="sales-table-wrapper">
            <table className="sales-table">
              <thead>
                <tr>
                  <th>Event</th>
                  <th>Tickets Sold</th>
                  <th>Total Revenue</th>
                </tr>
              </thead>

              <tbody>
                {reports.map((item, index) => (
                  <tr key={`${item.eventName}-${index}`}>
                    <td>{item.eventName || 'Unknown event'}</td>
                    <td>{Number(item.ticketsSold || 0).toLocaleString()}</td>
                    <td>{currency.format(Number(item.totalRevenue || 0))}</td>
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