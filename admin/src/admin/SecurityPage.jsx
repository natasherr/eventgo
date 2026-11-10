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

  if (loading) return <p>Loading security activity...</p>;

  if (error) {
    return <div className="alert alert--error">{error}</div>;
  }

  return (
    <div className="admin-page">
      <div className="page-header">
        <div>
          <h1>Security</h1>
          <p className="muted">
            Monitor administrator and system activity.
          </p>
        </div>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <span>Total Activities</span>
          <h2>{logs.length}</h2>
        </div>

        <div className="stat-card">
          <span>Latest Activity</span>
          <h2>{logs.length ? formatDate(logs[0].created_at) : '—'}</h2>
        </div>
      </div>

      <section className="panel">
        <h2>Recent Security Activity</h2>

        {logs.length === 0 ? (
          <p className="muted">No security activity recorded yet.</p>
        ) : (
          <div className="sales-table-wrapper">
            <table className="sales-table">
              <thead>
                <tr>
                  <th>Action</th>
                  <th>User</th>
                  <th>Description</th>
                  <th>IP Address</th>
                  <th>Date</th>
                </tr>
              </thead>

              <tbody>
                {logs.map((log) => (
                  <tr key={log.log_id}>
                    <td>{log.action}</td>
                    <td>
                      {log.User?.full_name || 'System'}
                      {log.User?.email && (
                        <div className="muted">{log.User.email}</div>
                      )}
                    </td>
                    <td>{log.description || '—'}</td>
                    <td>{log.ip_address || '—'}</td>
                    <td>{formatDate(log.created_at)}</td>
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