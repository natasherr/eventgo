import { useEffect, useMemo, useState } from 'react';
import { fetchSalesReport } from './api';

const currency = new Intl.NumberFormat('en-KE', {
  style: 'currency',
  currency: 'KES',
  maximumFractionDigits: 0,
});

const SORT_OPTIONS = [
  { value: 'revenue_desc', label: 'Revenue: High → Low' },
  { value: 'revenue_asc',  label: 'Revenue: Low → High' },
  { value: 'tickets_desc', label: 'Tickets: High → Low' },
  { value: 'tickets_asc',  label: 'Tickets: Low → High' },
  { value: 'name_asc',     label: 'Event name: A → Z' },
  { value: 'name_desc',    label: 'Event name: Z → A' },
];

function sortReports(data, sortKey) {
  const copy = [...data];
  switch (sortKey) {
    case 'revenue_desc': return copy.sort((a, b) => Number(b.totalRevenue) - Number(a.totalRevenue));
    case 'revenue_asc':  return copy.sort((a, b) => Number(a.totalRevenue) - Number(b.totalRevenue));
    case 'tickets_desc': return copy.sort((a, b) => Number(b.ticketsSold)  - Number(a.ticketsSold));
    case 'tickets_asc':  return copy.sort((a, b) => Number(a.ticketsSold)  - Number(b.ticketsSold));
    case 'name_asc':  return copy.sort((a, b) => (a.eventName || '').localeCompare(b.eventName || ''));
    case 'name_desc': return copy.sort((a, b) => (b.eventName || '').localeCompare(a.eventName || ''));
    default: return copy;
  }
}

export default function ReportsPage() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState('revenue_desc');

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

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    const base = q
      ? reports.filter((r) => (r.eventName || '').toLowerCase().includes(q))
      : reports;
    return sortReports(base, sort);
  }, [reports, search, sort]);

  const totalRevenue = filtered.reduce((sum, item) => sum + Number(item.totalRevenue || 0), 0);
  const totalTickets = filtered.reduce((sum, item) => sum + Number(item.ticketsSold  || 0), 0);

  // ── PDF / Print export ────────────────────────────────────────────────────
  function handlePrint() {
    const generatedOn = new Date().toLocaleString('en-KE', {
      dateStyle: 'long',
      timeStyle: 'short',
    });

    const rows = filtered.map((item, index) => `
      <tr>
        <td>${String(index + 1).padStart(2, '0')}</td>
        <td>${item.eventName || 'Unknown event'}</td>
        <td style="text-align:right">${Number(item.ticketsSold || 0).toLocaleString()}</td>
        <td style="text-align:right">${currency.format(Number(item.totalRevenue || 0))}</td>
      </tr>
    `).join('');

    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <title>EventGo — Sales Report</title>
        <style>
          * { box-sizing: border-box; margin: 0; padding: 0; }
          body { font-family: "Segoe UI", system-ui, sans-serif; color: #1e293b; padding: 32px; font-size: 13px; }
          .header { display: flex; align-items: flex-start; justify-content: space-between; margin-bottom: 28px; border-bottom: 2px solid #0d9488; padding-bottom: 16px; }
          .brand-name { font-size: 22px; font-weight: 800; color: #0d9488; letter-spacing: -.5px; }
          .brand-sub  { font-size: 11px; color: #64748b; margin-top: 2px; }
          .meta       { text-align: right; font-size: 11px; color: #64748b; line-height: 1.6; }
          .meta strong { color: #1e293b; }
          .summary { display: flex; gap: 24px; margin-bottom: 24px; }
          .summary-box { flex: 1; border: 1px solid #e2e8f0; border-radius: 8px; padding: 12px 16px; }
          .summary-box .label { font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: .05em; color: #94a3b8; }
          .summary-box .value { font-size: 20px; font-weight: 800; color: #0f172a; margin-top: 2px; }
          table { width: 100%; border-collapse: collapse; }
          thead th { background: #f1f5f9; padding: 9px 12px; text-align: left; font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: .05em; color: #64748b; border-bottom: 1px solid #e2e8f0; }
          tbody td { padding: 9px 12px; border-bottom: 1px solid #f1f5f9; }
          tbody tr:last-child td { border-bottom: none; }
          .footer { margin-top: 32px; text-align: center; font-size: 10px; color: #94a3b8; border-top: 1px solid #e2e8f0; padding-top: 12px; }
          @media print { body { padding: 20px; } }
        </style>
      </head>
      <body>
        <div class="header">
          <div>
            <div class="brand-name">EventGo</div>
            <div class="brand-sub">Event Ticketing &amp; Reservation System</div>
          </div>
          <div class="meta">
            <div><strong>Sales Report</strong></div>
            <div>Generated: ${generatedOn}</div>
            <div>Events shown: ${filtered.length}</div>
          </div>
        </div>

        <div class="summary">
          <div class="summary-box">
            <div class="label">Total Revenue</div>
            <div class="value">${currency.format(totalRevenue)}</div>
          </div>
          <div class="summary-box">
            <div class="label">Tickets Sold</div>
            <div class="value">${totalTickets.toLocaleString()}</div>
          </div>
          <div class="summary-box">
            <div class="label">Events with Sales</div>
            <div class="value">${filtered.length}</div>
          </div>
        </div>

        <table>
          <thead>
            <tr>
              <th>#</th>
              <th>Event Name</th>
              <th style="text-align:right">Tickets Sold</th>
              <th style="text-align:right">Total Revenue</th>
            </tr>
          </thead>
          <tbody>${rows}</tbody>
        </table>

        <div class="footer">
          &copy; ${new Date().getFullYear()} EventGo Ticketing. All rights reserved. &nbsp;|&nbsp; This report is generated automatically.
        </div>

        <script>window.onload = function() { window.print(); };<\/script>
      </body>
      </html>
    `);
    printWindow.document.close();
  }

  if (loading) return <div className="reports-loading">Loading reports...</div>;
  if (error)   return <div className="alert alert--error">{error}</div>;

  return (
    <div className="admin-page reports-page">

      <div className="reports-heading">
        <div>
          <span className="reports-eyebrow">ANALYTICS & INSIGHTS</span>
          <h1>Sales Reports</h1>
          <p>Track event performance, ticket sales and revenue.</p>
        </div>

        <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
          <div className="reports-live">
            <span></span> Sales Overview
          </div>
          <button
            className="ef-submit-btn"
            onClick={handlePrint}
            style={{ gap: 7 }}
            title="Export this report as a printable PDF"
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" aria-hidden="true">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
              <polyline points="14 2 14 8 20 8"/>
              <line x1="12" y1="11" x2="12" y2="17"/>
              <line x1="9" y1="14" x2="15" y2="14"/>
            </svg>
            Export PDF
          </button>
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
          <h2>{filtered.length}</h2>
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
            {filtered.length} Events
          </span>
        </div>

        {/* ── Filters ── */}
        <div className="sales-filters" style={{ marginBottom: 16 }}>
          <input
            type="search"
            placeholder="Filter by event name…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <select value={sort} onChange={(e) => setSort(e.target.value)}>
            {SORT_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>
        </div>

        {filtered.length === 0 ? (
          <div className="reports-empty">
            <span>▤</span>
            <h3>{search ? 'No matching events' : 'No sales available'}</h3>
            <p>{search ? `No events match "${search}".` : 'Paid event sales will appear here.'}</p>
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
                {filtered.map((item, index) => (
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
