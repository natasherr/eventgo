import { useEffect, useState } from 'react';
import { fetchAuditLogs } from './api';

export default function SecurityPage() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function loadLogs() {
      try {
        const data = await fetchAuditLogs();
        setLogs(Array.isArray(data) ? data : []);
      } catch (err) {
        setError(err.message || 'Unable to load security activity.');
      } finally {
        setLoading(false);
      }
    }

    loadLogs();
  }, []);

  const formatDate = (date) => {
    if (!date) return '—';

    return new Date(date).toLocaleString('en-KE', {
      dateStyle: 'medium',
      timeStyle: 'short',
    });
  };

  const getActionClass = (action = '') => {
    const value = action.toUpperCase();

    if (value.includes('LOGIN') || value.includes('REGISTER')) {
      return 'security-badge security-badge--success';
    }

    if (value.includes('FAILED') || value.includes('CANCELLED')) {
      return 'security-badge security-badge--danger';
    }

    if (value.includes('PASSWORD') || value.includes('2FA')) {
      return 'security-badge security-badge--warning';
    }

    if (value.includes('PAYMENT')) {
      return 'security-badge security-badge--info';
    }

    return 'security-badge security-badge--default';
  };

  if (loading) {
    return <div className="security-loading">Loading security activity...</div>;
  }

  if (error) {
    return <div className="alert alert--error">{error}</div>;
  }

  return (
    <div className="admin-page security-page">

      <div className="security-heading">
        <div>
          <span className="security-eyebrow">SYSTEM MONITORING</span>
          <h1>Security Centre</h1>
          <p>Monitor administrator and system activity.</p>
        </div>

        <div className="security-status">
          <span></span>
          Audit logs active
        </div>
      </div>

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
            {logs.length} Records
          </span>
        </div>

        {logs.length === 0 ? (
          <div className="security-empty">
            <span>▤</span>
            <h3>No activity recorded</h3>
            <p>Security events will appear here when recorded.</p>
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
                {logs.map((log) => (
                  <tr key={log.log_id}>

                    <td>
                      <span className={getActionClass(log.action)}>
                        {log.action || 'UNKNOWN'}
                      </span>
                    </td>

                    <td>
                      <div className="security-user">
                        <strong>
                          {log.User?.full_name || 'System'}
                        </strong>

                        {log.User?.email && (
                          <span>{log.User.email}</span>
                        )}
                      </div>
                    </td>

                    <td className="security-description">
                      {log.description || '—'}
                    </td>

                    <td className="security-ip">
                      {log.ip_address || '—'}
                    </td>

                    <td className="security-date-cell">
                      {formatDate(log.created_at)}
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