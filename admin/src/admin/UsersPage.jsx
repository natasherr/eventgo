import { useEffect, useMemo, useState } from 'react';
import { fetchUsers, updateUserAdmin } from './api';

const DELETION_WARNING_ICON = (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true" style={{ flexShrink: 0 }}>
    <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
    <line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>
  </svg>
);

const ROLE_LABELS = {
  user: 'User',
  admin: 'Admin',
  supervisor: 'Supervisor',
  super_admin: 'Super Admin',
};

const ROLE_BADGE = {
  user: 'role-badge role-badge--user',
  admin: 'role-badge role-badge--admin',
  supervisor: 'role-badge role-badge--supervisor',
  super_admin: 'role-badge role-badge--super',
};

const formatDate = (date) =>
  date
    ? new Date(date).toLocaleString('en-KE', { dateStyle: 'medium', timeStyle: 'short' })
    : '—';

// ── Edit User Modal ────────────────────────────────────────────────────────────
function EditUserModal({ user, currentAdminRole, onClose, onSaved }) {
  const [role, setRole] = useState(user.role);
  const [isActive, setIsActive] = useState(user.is_active);
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState('');

  // Which roles this admin is allowed to assign
  const assignableRoles =
    currentAdminRole === 'super_admin'
      ? ['user', 'admin', 'supervisor', 'super_admin']
      : ['user', 'admin'];

  const hasChanged = role !== user.role || isActive !== user.is_active;

  async function handleSubmit(e) {
    e.preventDefault();
    if (!hasChanged) return;
    setServerError('');
    setSubmitting(true);
    try {
      await updateUserAdmin(user.user_id, { role, is_active: isActive });
      onSaved();
    } catch (err) {
      setServerError(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-box modal-box--sm" onClick={(e) => e.stopPropagation()} role="dialog" aria-modal="true" aria-labelledby="edit-user-title">
        <div className="modal-header">
          <h2 id="edit-user-title">Edit User</h2>
          <button className="modal-close" onClick={onClose} aria-label="Close">✕</button>
        </div>

        <p className="muted" style={{ marginTop: 0, marginBottom: 16 }}>
          <strong>{user.full_name}</strong> — {user.email}
        </p>

        {serverError && <div className="alert alert--error" role="alert">{serverError}</div>}

        <form onSubmit={handleSubmit} noValidate>
          <div className="ef-field">
            <label className="ef-label" htmlFor="user-role">Role</label>
            <select id="user-role" className="ef-input" value={role} onChange={(e) => setRole(e.target.value)}>
              {assignableRoles.map((r) => (
                <option key={r} value={r}>{ROLE_LABELS[r]}</option>
              ))}
            </select>
            {currentAdminRole !== 'super_admin' && (
              <span className="ef-error" style={{ color: '#94a3b8', fontSize: '.75rem' }}>
                Only a Super Admin can assign Supervisor or Super Admin roles.
              </span>
            )}
          </div>

          <div className="ef-field">
            <label className="ef-label">Account Status</label>
            <div style={{ display: 'flex', gap: 12, marginTop: 4 }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer' }}>
                <input type="radio" name="is_active" value="true" checked={isActive === true} onChange={() => setIsActive(true)} />
                Active
              </label>
              <label style={{ display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer' }}>
                <input type="radio" name="is_active" value="false" checked={isActive === false} onChange={() => setIsActive(false)} />
                Disabled
              </label>
            </div>
          </div>

          <div className="modal-actions">
            <button type="button" className="btn-secondary" onClick={onClose} disabled={submitting}>Cancel</button>
            <button type="submit" className="ef-submit-btn" disabled={submitting || !hasChanged} title={!hasChanged ? 'No changes to save' : undefined}>
              {submitting ? 'Saving…' : 'Save changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ── Main Page ──────────────────────────────────────────────────────────────────
export default function UsersPage({ currentAdminRole }) {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [editTarget, setEditTarget] = useState(null);
  const [dismissingId, setDismissingId] = useState(null);

  async function loadUsers() {
    setLoading(true);
    setError('');
    try {
      const data = await fetchUsers();
      setUsers(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.message || 'Unable to load users.');
    } finally {
      setLoading(false);
    }
  }

  async function dismissDeletionRequest(userId) {
    setDismissingId(userId);
    try {
      await updateUserAdmin(userId, { deletion_requested: false });
      setUsers((prev) => prev.map((u) => u.user_id === userId ? { ...u, deletion_requested: false } : u));
    } catch (err) {
      setError(err.message || 'Unable to dismiss request.');
    } finally {
      setDismissingId(null);
    }
  }

  useEffect(() => { loadUsers(); }, []);

  const filtered = useMemo(() => {
    return users.filter((u) => {
      const matchesSearch = [u.full_name, u.email, u.phone_number]
        .some((v) => (v || '').toLowerCase().includes(search.toLowerCase()));
      const matchesRole = roleFilter === 'all' || u.role === roleFilter;
      return matchesSearch && matchesRole;
    });
  }, [users, search, roleFilter]);

  const activeCount = users.filter((u) => u.is_active).length;
  const deletionCount = users.filter((u) => u.deletion_requested).length;

  return (
    <div className="admin-page">
      {editTarget && (
        <EditUserModal
          user={editTarget}
          currentAdminRole={currentAdminRole || 'admin'}
          onClose={() => setEditTarget(null)}
          onSaved={async () => { setEditTarget(null); await loadUsers(); }}
        />
      )}

      <div className="page-head">
        <div>
          <h1>User Management</h1>
          <p className="muted">View, manage roles and enable/disable user accounts.</p>
        </div>
        <button onClick={loadUsers} disabled={loading}>
          {loading ? 'Refreshing…' : 'Refresh'}
        </button>
      </div>

      <section className="stats">
        <div className="card stat">
          <span className="muted">Total Users</span>
          <strong>{users.length}</strong>
          <small>Registered accounts</small>
        </div>
        <div className="card stat">
          <span className="muted">Active</span>
          <strong>{activeCount}</strong>
          <small>Enabled accounts</small>
        </div>
        <div className="card stat">
          <span className="muted">Disabled</span>
          <strong>{users.length - activeCount}</strong>
          <small>Suspended accounts</small>
        </div>
        <div className="card stat">
          <span className="muted">Admins</span>
          <strong>{users.filter((u) => ['admin', 'supervisor', 'super_admin'].includes(u.role)).length}</strong>
          <small>Elevated access</small>
        </div>
        <div className="card stat" style={deletionCount > 0 ? { borderColor: '#f59e0b', background: '#fffbeb' } : {}}>
          <span className="muted">Deletion Requests</span>
          <strong style={deletionCount > 0 ? { color: '#b45309' } : {}}>{deletionCount}</strong>
          <small>Pending review</small>
        </div>
      </section>

      <section className="card">
        <h2>All Users</h2>

        <div className="sales-filters">
          <input
            type="search"
            placeholder="Search name, email or phone…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <select value={roleFilter} onChange={(e) => setRoleFilter(e.target.value)}>
            <option value="all">All roles</option>
            <option value="user">User</option>
            <option value="admin">Admin</option>
            <option value="supervisor">Supervisor</option>
            <option value="super_admin">Super Admin</option>
          </select>
        </div>

        {error && <div className="alert alert--error" role="alert">{error}</div>}
        {loading && <p className="muted">Loading users…</p>}
        {!loading && !error && filtered.length === 0 && <p className="muted">No users found.</p>}

        {!loading && !error && filtered.length > 0 && (
          <div style={{ overflowX: 'auto' }}>
            <table className="data-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Name / Flags</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Role</th>
                  <th>Status</th>
                  <th>Registered</th>
                  <th>Last Login</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((u, idx) => (
                  <tr key={u.user_id} style={u.deletion_requested ? { background: '#fffbeb' } : {}}>
                    <td className="report-number">{String(idx + 1).padStart(2, '0')}</td>
                    <td>
                      <strong>{u.full_name}</strong>
                      {u.deletion_requested && (
                        <span className="deletion-request-badge" title="User has requested account deletion">
                          {DELETION_WARNING_ICON} Deletion Requested
                        </span>
                      )}
                    </td>
                    <td>{u.email}</td>
                    <td>{u.phone_number}</td>
                    <td>
                      <span className={ROLE_BADGE[u.role] || 'role-badge'}>
                        {ROLE_LABELS[u.role] || u.role}
                      </span>
                    </td>
                    <td>
                      <span className={u.is_active ? 'ef-status-badge ef-status-badge--published' : 'ef-status-badge ef-status-badge--cancelled'}>
                        {u.is_active ? 'Active' : 'Disabled'}
                      </span>
                    </td>
                    <td>{formatDate(u.created_at)}</td>
                    <td>{formatDate(u.last_login)}</td>
                    <td style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                      <button
                        className="action-btn action-btn--edit"
                        onClick={() => setEditTarget(u)}
                        title="Edit user"
                      >
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" aria-hidden="true"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                        Edit
                      </button>
                      {u.deletion_requested && (
                        <button
                          className="action-btn action-btn--delete"
                          onClick={() => dismissDeletionRequest(u.user_id)}
                          disabled={dismissingId === u.user_id}
                          title="Dismiss deletion request"
                        >
                          {dismissingId === u.user_id ? '…' : 'Dismiss'}
                        </button>
                      )}
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
