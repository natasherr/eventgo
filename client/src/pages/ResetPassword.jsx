import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import api, { errMsg } from '../api';

// Eye / eye-off SVG toggle icons
const EyeIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
    <circle cx="12" cy="12" r="3"/>
  </svg>
);
const EyeOffIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/>
    <line x1="1" y1="1" x2="23" y2="23"/>
  </svg>
);

export default function ResetPassword() {
  const { token } = useParams();
  const [password, setPassword]     = useState('');
  const [confirm, setConfirm]       = useState('');
  const [showPw, setShowPw]         = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [msg, setMsg]               = useState('');
  const [error, setError]           = useState('');
  const [busy, setBusy]             = useState(false);

  const submit = async (e) => {
    e.preventDefault(); setError('');
    if (password.length < 8) return setError('Password must be at least 8 characters.');
    if (password !== confirm) return setError('Passwords do not match.');
    setBusy(true);
    try {
      const { data } = await api.post('/auth/reset-password', { token, newPassword: password });
      setMsg(data.message || 'Your password has been updated.');
    } catch (err) {
      setError(errMsg(err));
    } finally {
      setBusy(false);
    }
  };

  if (!token) return (
    <div className="eg-auth-wrap">
      <div className="eg-auth-bg" aria-hidden="true" />
      <div className="eg-auth-card-wrap">
        <div className="eg-auth-card">
          <div className="alert alert-danger eg-auth-alert">
            <i className="fa-solid fa-circle-exclamation me-2" />
            This reset link is missing its token.{' '}
            <Link to="/forgot-password" className="eg-auth-link">Request a new one</Link>.
          </div>
        </div>
      </div>
    </div>
  );

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
          Set a new<br />password for<br /><em>your account.</em>
        </h1>
        <p className="eg-auth-copy-sub">
          Choose a strong password you haven't used before. It must be at least 8 characters.
        </p>
        <ul className="eg-auth-perks">
          <li><i className="fa-solid fa-lock" /> Minimum 8 characters</li>
          <li><i className="fa-solid fa-clock" /> This link expires in 15 minutes</li>
          <li><i className="fa-solid fa-shield-halved" /> Stored securely with bcrypt</li>
        </ul>
      </div>

      {/* Right card */}
      <div className="eg-auth-card-wrap">
        <div className="eg-auth-card">
          <h3 className="eg-auth-title">Set a new password</h3>
          <p className="eg-auth-subtitle">Enter and confirm your new password below</p>

          {error && (
            <div className="alert alert-danger eg-auth-alert">
              <i className="fa-solid fa-circle-exclamation me-2" />{error}
            </div>
          )}

          {msg ? (
            <div className="alert alert-success eg-auth-alert">
              <i className="fa-solid fa-circle-check me-2" />{msg}
              <div className="mt-2">
                <Link to="/login" className="eg-auth-link">Sign in now</Link>
              </div>
            </div>
          ) : (
            <form onSubmit={submit} noValidate>
              <div className="mb-3">
                <label className="form-label eg-auth-label">New password</label>
                <div className="eg-pw-wrap">
                  <input
                    type={showPw ? 'text' : 'password'}
                    className="form-control eg-auth-input"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    autoComplete="new-password"
                    placeholder="8+ characters"
                  />
                  <button type="button" className="eg-pw-toggle" onClick={() => setShowPw((v) => !v)} aria-label={showPw ? 'Hide password' : 'Show password'}>
                    {showPw ? <EyeOffIcon /> : <EyeIcon />}
                  </button>
                </div>
              </div>
              <div className="mb-4">
                <label className="form-label eg-auth-label">Confirm password</label>
                <div className="eg-pw-wrap">
                  <input
                    type={showConfirm ? 'text' : 'password'}
                    className="form-control eg-auth-input"
                    value={confirm}
                    onChange={(e) => setConfirm(e.target.value)}
                    autoComplete="new-password"
                    placeholder="Repeat password"
                  />
                  <button type="button" className="eg-pw-toggle" onClick={() => setShowConfirm((v) => !v)} aria-label={showConfirm ? 'Hide password' : 'Show password'}>
                    {showConfirm ? <EyeOffIcon /> : <EyeIcon />}
                  </button>
                </div>
              </div>
              <button className="btn btn-eg w-100 eg-auth-btn" disabled={busy}>
                {busy
                  ? <><span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true" />Saving…</>
                  : 'Update password'}
              </button>
            </form>
          )}

          <p className="eg-auth-footer-note">
            <Link to="/login" className="eg-auth-link">Back to login</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
