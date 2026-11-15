import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import api, { errMsg } from '../api';

const DELETION_REQUESTED_KEY = 'eventgo_deletion_requested';

const initials = (name) =>
  (name || '')
    .trim()
    .split(/\s+/)
    .map((part) => part[0])
    .slice(0, 2)
    .join('')
    .toUpperCase() || '?';

export default function Profile() {
  const { user, updateUser } = useAuth();

  const [editing, setEditing]       = useState(false);
  const [fullName, setFullName]     = useState('');
  const [phone, setPhone]           = useState('');
  const [origName, setOrigName]     = useState('');
  const [origPhone, setOrigPhone]   = useState('');
  const [saving, setSaving]         = useState(false);
  const [error, setError]           = useState('');
  const [success, setSuccess]       = useState('');
  const [deleting, setDeleting]         = useState(false);
  const [deleteError, setDeleteError]   = useState('');
  const [confirmingDelete, setConfirmingDelete] = useState(false);
  const [deleteSuccess, setDeleteSuccess] = useState(
    () => localStorage.getItem(DELETION_REQUESTED_KEY) === '1'
  );

  const openEdit = () => {
    const name = user?.name || '';
    const ph   = user?.phone_number || '';
    setFullName(name);
    setPhone(ph);
    setOrigName(name);
    setOrigPhone(ph);
    setError('');
    setSuccess('');
    setEditing(true);
  };

  const cancelEdit = () => {
    setEditing(false);
    setError('');
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setError('');
    setSaving(true);
    try {
      const { data } = await api.put('/auth/profile', {
        full_name: fullName,
        phone_number: phone,
      });
      updateUser({ ...user, name: data.user.name, phone_number: data.user.phone_number });
      setSuccess('Profile updated successfully.');
      setEditing(false);
    } catch (err) {
      setError(errMsg(err));
    } finally {
      setSaving(false);
    }
  };

  const handleDeletionRequest = async () => {
    setDeleteError('');
    setDeleting(true);
    try {
      await api.post('/auth/deletion-request');
      localStorage.setItem(DELETION_REQUESTED_KEY, '1');
      setDeleteSuccess(true);
      setConfirmingDelete(false);
    } catch (err) {
      setDeleteError(errMsg(err));
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="eg-profile">
      <div className="eg-profile-header">
        <span className="eg-profile-avatar">{initials(user?.name)}</span>
        <div>
          <h1 className="eg-profile-title">My Profile</h1>
          <p className="eg-profile-sub">Your account details</p>
        </div>
      </div>

      <dl className="eg-profile-list">
        <div className="eg-profile-row">
          <dt><i className="fa-regular fa-user" />Full name</dt>
          <dd>{user?.name || <span className="eg-profile-empty">Not provided</span>}</dd>
        </div>

        <div className="eg-profile-row">
          <dt><i className="fa-solid fa-phone" />Phone</dt>
          <dd>{user?.phone_number || <span className="eg-profile-empty">Not provided</span>}</dd>
        </div>

        <div className="eg-profile-row">
          <dt><i className="fa-regular fa-envelope" />Email</dt>
          <dd>{user?.email || <span className="eg-profile-empty">Not provided</span>}</dd>
        </div>

        <div className="eg-profile-row">
          <dt><i className="fa-solid fa-shield-halved" />Account type</dt>
          <dd><span className="eg-profile-badge">{user?.role || 'user'}</span></dd>
        </div>
      </dl>

      {success && !editing && (
        <p className="eg-profile-success">{success}</p>
      )}

      {editing ? (
        <form className="eg-profile-edit-form" onSubmit={handleSave} noValidate>
          <h2 className="eg-profile-edit-title">Edit Profile</h2>

          <label className="eg-profile-edit-label">
            Full Name
            <input
              className="eg-profile-edit-input"
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
              autoFocus
            />
          </label>

          <label className="eg-profile-edit-label">
            Phone Number
            <input
              className="eg-profile-edit-input"
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="e.g. +254 712 345 678"
            />
          </label>

          {error && <p className="eg-profile-edit-error">{error}</p>}

          <div className="eg-profile-edit-actions">
            <button type="button" className="eg-profile-edit-cancel" onClick={cancelEdit} disabled={saving}>
              Cancel
            </button>
            <button
              type="submit"
              className="eg-profile-edit-save"
              disabled={saving || (fullName.trim() === origName.trim() && phone.trim() === origPhone.trim())}
              title={fullName.trim() === origName.trim() && phone.trim() === origPhone.trim() ? 'No changes to save' : undefined}
            >
              {saving ? 'Saving…' : 'Save changes'}
            </button>
          </div>
        </form>
      ) : (
        <>
          <div className="eg-profile-footer">
            <button className="eg-profile-edit-btn" onClick={openEdit}>
              <i className="fa-regular fa-pen-to-square" /> Edit Profile
            </button>
            {deleteSuccess ? (
              <span className="eg-profile-deletion-notice">
                <i className="fa-solid fa-clock" /> Deletion request submitted — awaiting admin review.
              </span>
            ) : (
              <button
                className="eg-profile-delete-btn"
                onClick={() => { setConfirmingDelete(true); setDeleteError(''); }}
                disabled={deleting}
              >
                Request Account Deletion
              </button>
            )}
          </div>

          {confirmingDelete && (
            <div className="eg-profile-confirm-panel">
              <div className="eg-profile-confirm-icon">
                <i className="fa-solid fa-triangle-exclamation" />
              </div>
              <div className="eg-profile-confirm-body">
                <p className="eg-profile-confirm-title">Request account deletion?</p>
                <p className="eg-profile-confirm-text">
                  Your request will be reviewed by an administrator. Your account won't be deleted immediately.
                </p>
                {deleteError && <p className="eg-profile-confirm-error">{deleteError}</p>}
                <div className="eg-profile-confirm-actions">
                  <button
                    className="eg-profile-edit-cancel"
                    onClick={() => { setConfirmingDelete(false); setDeleteError(''); }}
                    disabled={deleting}
                  >
                    Cancel
                  </button>
                  <button
                    className="eg-profile-confirm-submit"
                    onClick={handleDeletionRequest}
                    disabled={deleting}
                  >
                    {deleting ? 'Submitting…' : 'Yes, submit request'}
                  </button>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
