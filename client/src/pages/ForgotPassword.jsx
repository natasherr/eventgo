import { useState } from 'react';
import { Link } from 'react-router-dom';
import api, { errMsg } from '../api';
import { isEmail } from '../utils';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [msg, setMsg] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const submit = async (e) => {
    e.preventDefault(); setError(''); setMsg('');
    if (!isEmail(email)) return setError('Please enter a valid email address.');
    setBusy(true);
    try { const { data } = await api.post('/auth/forgot-password', { email }); setMsg(data.message); }
    catch (err) { setError(errMsg(err)); } finally { setBusy(false); }
  };

  return (
    <div className="mx-auto card card-body" style={{ maxWidth: 420 }}>
      <h3 className="mb-3">Forgot Password</h3>
      {msg && <div className="alert alert-success">{msg}</div>}
      {error && <div className="alert alert-danger">{error}</div>}
      <form onSubmit={submit} noValidate>
        <label className="form-label">Enter your registered email</label>
        <input type="email" className="form-control mb-3" value={email} onChange={(e) => setEmail(e.target.value)} />
        <button className="btn btn-eg w-100" disabled={busy}>{busy ? 'Sending...' : 'Send Reset Link'}</button>
      </form>
      <p className="small text-muted mt-3">A time-limited link will be sent.</p>
      <Link to="/login" className="small">Back to login</Link>
    </div>
  );
}