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
    (sum, item) => sum + Number(item.totalRevenue || 0), 0
  );

  const totalTickets = reports.reduce(
    (sum, item) => sum + Number(item.ticketsSold || 0), 0
  );

  if (loading) {
    return <div className="reports-loading">Loading reports...</div>;
  }

  if (error) {
    return <div className="alert alert--error">{error}</div>;
  }

  return (
    <div className="admin-page reports-page">

      <div className="reports-heading">
        <div>
          <span className="reports-eyebrow">ANALYTICS & INSIGHTS</span>
          <h1>Sales Reports</h1>
          <p>Track event performance, ticket sales and revenue.</p>
        </div>

        <div className="reports-live">
          <span></span> Sales overview
        </div>
      </div>

      <div className="reports-stats">

        <div className="report-stat revenue-stat">
          <div className="report-stat-top">
            <span className="report-icon">KSh</span>
            <span className="report-label">TOTAL REVENUE</span>
          </div>
          <h2>{currency.format(totalRevenue)}</h2>
          <p>Revenue from paid ticket sales</p>
        </div>

        <div className="report-stat tickets-stat">
          <div className="report-stat-top">
            <span className="report-icon">▤</span>
            <span className="report-label">TICKETS SOLD</span>
          </div>
          <h2>{totalTickets.toLocaleString()}</h2>
          <p>Total tickets purchased</p>
        </div>

        <div className="report-stat events-stat">
          <div className="report-stat-top">
            <span className="report-icon">▦</span>
            <span className="report-label">EVENTS WITH SALES</span>
          </div>
          <h2>{reports.length}</h2>
          <p>Events generating revenue</p>
        </div>

      </div>

      <section className="reports-panel">
        <div className="reports-panel-heading">
          <div>
            <h2>Sales by Event</h2>
            <p>Revenue and ticket performance across events.</p>
          </div>

          <span className="reports-count">
            {reports.length} Events
          </span>
        </div>

        {reports.length === 0 ? (
          <div className="reports-empty">
            <span>▤</span>
            <h3>No sales available</h3>
            <p>Paid event sales will appear here.</p>
          </div>
        ) : (
          <div className="sales-table-wrapper">
            <table className="sales-table reports-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>EVENT NAME</th>
                  <th>TICKETS SOLD</th>
                  <th>TOTAL REVENUE</th>
                </tr>
              </thead>

              <tbody>
                {reports.map((item, index) => (
                  <tr key={`${item.eventName}-${index}`}>
                    <td className="report-number">
                      {String(index + 1).padStart(2, '0')}
                    </td>

                    <td className="report-event-name">
                      {item.eventName || 'Unknown event'}
                    </td>

                    <td>
                      <span className="ticket-count">
                        {Number(item.ticketsSold || 0).toLocaleString()}
                      </span>
                    </td>

                    <td className="report-revenue">
                      {currency.format(Number(item.totalRevenue || 0))}
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