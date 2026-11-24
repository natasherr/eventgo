import { useState } from 'react';
import { Link } from 'react-router-dom';
import api, { errMsg } from '../api';
import { isEmail } from '../utils';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [msg, setMsg]     = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy]   = useState(false);

  const submit = async (e) => {
    e.preventDefault(); setError(''); setMsg('');
    if (!isEmail(email)) return setError('Please enter a valid email address.');
    setBusy(true);
    try {
      const { data } = await api.post('/auth/forgot-password', { email });
      setMsg(data.message);
    } catch (err) {
      setError(errMsg(err));
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="eg-auth-wrap">
      <div className="eg-auth-bg" aria-hidden="true" />

      {/* Left copy */}
      <div className="eg-auth-copy">
        <span className="eg-auth-kicker">
          <span className="eg-live-dot" />
          EventGo
        </span>
        <h1 className="eg-auth-headline">
          Forgot your<br />password?<br /><em>No problem.</em>
        </h1>
        <p className="eg-auth-copy-sub">
          Enter your registered email and we'll send you a secure link to set a new password.
        </p>
        <ul className="eg-auth-perks">
          <li><i className="fa-solid fa-envelope" /> Check your inbox after submitting</li>
          <li><i className="fa-solid fa-clock" /> Link expires in 15 minutes</li>
          <li><i className="fa-solid fa-shield-halved" /> One-time use, then it's gone</li>
        </ul>
      </div>

      {/* Right card */}
      <div className="eg-auth-card-wrap">
        <div className="eg-auth-card">
          <h3 className="eg-auth-title">Reset your password</h3>
          <p className="eg-auth-subtitle">We'll email you a secure reset link</p>

          {error && (
            <div className="alert alert-danger eg-auth-alert">
              <i className="fa-solid fa-circle-exclamation me-2" />{error}
            </div>
          )}

          {msg ? (
            <div className="alert alert-success eg-auth-alert">
              <i className="fa-solid fa-circle-check me-2" />{msg}
              <div className="mt-2">
                <Link to="/login" className="eg-auth-link">Back to login</Link>
              </div>
            </div>
          ) : (
            <form onSubmit={submit} noValidate>
              <div className="mb-4">
                <label className="form-label eg-auth-label">Email address</label>
                <input
                  type="email"
                  className="form-control eg-auth-input"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  autoComplete="email"
                  placeholder="you@example.com"
                />
              </div>
              <button className="btn btn-eg w-100 eg-auth-btn" disabled={busy}>
                {busy
                  ? <><span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true" />Sending…</>
                  : 'Send Reset Link'}
              </button>
            </form>
          )}

          <p className="eg-auth-footer-note">
            Remembered it?{' '}
            <Link to="/login" className="eg-auth-link">Back to login</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
