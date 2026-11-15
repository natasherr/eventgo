import { useEffect, useMemo, useState } from 'react';
import { fetchAuditLogs } from './api';

const ACTION_CATEGORIES = [
  { value: 'all',      label: 'All actions' },
  { value: 'auth',     label: 'Auth (login / register)' },
  { value: 'password', label: 'Password & 2FA' },
  { value: 'payment',  label: 'Payment' },
  { value: 'profile',  label: 'Profile & account' },
  { value: 'admin',    label: 'Admin actions' },
  { value: 'failed',   label: 'Failed / cancelled' },
  { value: 'other',    label: 'Other' },
];

function categorise(action = '') {
  const v = action.toUpperCase();
  if (v.includes('LOGIN') || v.includes('REGISTER'))            return 'auth';
  if (v.includes('PASSWORD') || v.includes('2FA'))              return 'password';
  if (v.includes('PAYMENT'))                                     return 'payment';
  if (v.includes('PROFILE') || v.includes('DELETION'))          return 'profile';
  if (v.includes('EVENT') || v.includes('USER_UPDATED') ||
      v.includes('USER_REGISTER') === false && v.includes('USER')) return 'admin';
  if (v.includes('FAILED') || v.includes('CANCELLED'))          return 'failed';
  return 'other';
}

function getActionClass(action = '') {
  const v = action.toUpperCase();
  if (v.includes('LOGIN') || v.includes('REGISTER'))  return 'security-badge security-badge--success';
  if (v.includes('FAILED') || v.includes('CANCELLED')) return 'security-badge security-badge--danger';
  if (v.includes('PASSWORD') || v.includes('2FA'))     return 'security-badge security-badge--warning';
  if (v.includes('PAYMENT'))                            return 'security-badge security-badge--info';
  return 'security-badge security-badge--default';
}

function formatDate(date) {
  if (!date) return '—';
  return new Date(date).toLocaleString('en-KE', { dateStyle: 'medium', timeStyle: 'short' });
}

export default function SecurityPage() {
  const [logs, setLogs]       = useState([]);
  const [loading, setLoading] = useState(true);
  const [logsOk, setLogsOk]   = useState(null);
  const [error, setError]     = useState('');

  // ── Filters ────────────────────────────────────────────────────────────────
  const [search, setSearch]       = useState('');
  const [category, setCategory]   = useState('all');
  const [dateFrom, setDateFrom]   = useState('');
  const [dateTo, setDateTo]       = useState('');

  useEffect(() => {
    async function loadLogs() {
      try {
        const data = await fetchAuditLogs();
        setLogs(Array.isArray(data) ? data : []);
        setLogsOk(true);
      } catch (err) {
        setError(err.message || 'Unable to load security activity.');
        setLogsOk(false);
      } finally {
        setLoading(false);
      }
    }
    loadLogs();
  }, []);

  const filtered = useMemo(() => {
    const q        = search.toLowerCase();
    const fromMs   = dateFrom ? new Date(dateFrom).getTime() : null;
    // dateTo: treat as end-of-day
    const toMs     = dateTo   ? new Date(dateTo + 'T23:59:59').getTime() : null;

    return logs.filter((log) => {
      // text search
      if (q) {
        const hay = [
          log.action,
          log.description,
          log.ip_address,
          log.User?.full_name,
          log.User?.email,
        ].filter(Boolean).join(' ').toLowerCase();
        if (!hay.includes(q)) return false;
      }

      // category
      if (category !== 'all' && categorise(log.action) !== category) return false;

      // date range
      const ts = log.created_at ? new Date(log.created_at).getTime() : null;
      if (fromMs && ts && ts < fromMs) return false;
      if (toMs   && ts && ts > toMs)   return false;

      return true;
    });
  }, [logs, search, category, dateFrom, dateTo]);

  const isFiltered = search || category !== 'all' || dateFrom || dateTo;

  const clearFilters = () => {
    setSearch('');
    setCategory('all');
    setDateFrom('');
    setDateTo('');
  };

  const badgeColor = logsOk === null ? '#94a3b8' : logsOk ? '#22c55e' : '#ef4444';
  const badgeLabel = logsOk === null ? 'Checking…' : logsOk ? 'Audit logs active' : 'Audit logs unavailable';
  const badgeClass = `security-status${logsOk === false ? ' security-status--error' : ''}`;

  if (loading) {
    return <div className="security-loading">Loading security activity...</div>;
  }

  return (
    <div className="admin-page security-page">

      <div className="security-heading">
        <div>
          <span className="security-eyebrow">SYSTEM MONITORING</span>
          <h1>Security Centre</h1>
          <p>Monitor administrator and system activity.</p>
        </div>
        <div className={badgeClass}>
          <svg width="8" height="8" viewBox="0 0 8 8" aria-hidden="true" style={{ flexShrink: 0 }}>
            <circle cx="4" cy="4" r="4" fill={badgeColor} />
          </svg>
          {badgeLabel}
        </div>
      </div>

      {error && <div className="alert alert--error" role="alert">{error}</div>}

      <div className="security-stats">
        <div className="security-stat">
          <div className="security-stat-top">
            <span className="security-icon security-icon--blue">▤</span>
            <span className="security-stat-label">TOTAL ACTIVITIES</span>
          </div>
          <h2>{logs.length.toLocaleString()}</h2>
          <p>Recorded system activities</p>
        </div>

        <div className="security-stat">
          <div className="security-stat-top">
            <span className="security-icon security-icon--green">◷</span>
            <span className="security-stat-label">LATEST ACTIVITY</span>
          </div>
          <h2 className="security-date">
            {logs.length ? formatDate(logs[0].created_at) : '—'}
          </h2>
          <p>Most recently recorded activity</p>
        </div>
      </div>

      <section className="security-panel">

        <div className="security-panel-heading">
          <div>
            <h2>Recent Security Activity</h2>
            <p>Review recorded user and system events.</p>
          </div>
          <span className="security-count">
            {isFiltered ? `${filtered.length} of ${logs.length}` : logs.length} Records
          </span>
        </div>

        {/* ── Filters bar ── */}
        <div className="security-filters">
          <input
            className="security-filter-input"
            type="search"
            placeholder="Search user, action, description, IP…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <select
            className="security-filter-select"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            {ACTION_CATEGORIES.map((c) => (
              <option key={c.value} value={c.value}>{c.label}</option>
            ))}
          </select>

          <div className="security-filter-dates">
            <label className="security-filter-date-label">
              From
              <input
                className="security-filter-input security-filter-input--date"
                type="date"
                value={dateFrom}
                onChange={(e) => setDateFrom(e.target.value)}
              />
            </label>
            <label className="security-filter-date-label">
              To
              <input
                className="security-filter-input security-filter-input--date"
                type="date"
                value={dateTo}
                onChange={(e) => setDateTo(e.target.value)}
              />
            </label>
          </div>

          {isFiltered && (
            <button className="security-filter-clear" onClick={clearFilters}>
              Clear filters
            </button>
          )}
        </div>

        {filtered.length === 0 ? (
          <div className="security-empty">
            <span>▤</span>
            <h3>{isFiltered ? 'No matching records' : 'No activity recorded'}</h3>
            <p>
              {isFiltered
                ? 'Try adjusting your filters.'
                : 'Security events will appear here when recorded.'}
            </p>
            {isFiltered && (
              <button className="security-filter-clear" style={{ marginTop: 12 }} onClick={clearFilters}>
                Clear filters
              </button>
            )}
          </div>
        ) : (
          <div className="security-table-wrapper">
            <table className="security-table">
              <thead>
                <tr>
                  <th>ACTION</th>
                  <th>USER</th>
                  <th>DESCRIPTION</th>
                  <th>IP ADDRESS</th>
                  <th>DATE & TIME</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((log) => (
                  <tr key={log.log_id}>
                    <td>
                      <span className={getActionClass(log.action)}>
                        {log.action || 'UNKNOWN'}
                      </span>
                    </td>
                    <td>
                      <div className="security-user">
                        <strong>{log.User?.full_name || 'System'}</strong>
                        {log.User?.email && <span>{log.User.email}</span>}
                      </div>
                    </td>
                    <td className="security-description">{log.description || '—'}</td>
                    <td className="security-ip">{log.ip_address || '—'}</td>
                    <td className="security-date-cell">{formatDate(log.created_at)}</td>
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
