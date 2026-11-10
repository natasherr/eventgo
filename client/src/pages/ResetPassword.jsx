import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import api, { errMsg } from '../api';

export default function ResetPassword() {
  const { token } = useParams();
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [msg, setMsg] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const submit = async (e) => {
    e.preventDefault(); setError('');
    if (password.length < 8) return setError('Password must be at least 8 characters.');
    if (password !== confirm) return setError('Passwords do not match.');
    setBusy(true);
    try { const { data } = await api.post('/auth/reset-password', { token, newPassword: password }); setMsg(data.message || 'Your password has been updated.'); }
    catch (err) { setError(errMsg(err)); } finally { setBusy(false); }
  };

  if (!token) return <div className="alert alert-danger">This reset link is missing its token. Request a new one from the <Link to="/forgot-password">forgot password</Link> page.</div>;

  return (
    <div className="mx-auto card card-body" style={{ maxWidth: 420 }}>
      <h3 className="mb-3">Set a new password</h3>
      {error && <div className="alert alert-danger">{error}</div>}
      {msg ? <div className="alert alert-success">{msg} <Link to="/login">Log in</Link></div> : (
        <form onSubmit={submit} noValidate>
          <div className="mb-3"><label className="form-label">New password</label><input type="password" className="form-control" value={password} onChange={(e) => setPassword(e.target.value)} autoComplete="new-password" /></div>
          <div className="mb-3"><label className="form-label">Confirm password</label><input type="password" className="form-control" value={confirm} onChange={(e) => setConfirm(e.target.value)} autoComplete="new-password" /></div>
          <button className="btn btn-eg w-100" disabled={busy}>{busy ? 'Saving...' : 'Update password'}</button>
        </form>
      )}
    </div>
  );
}
