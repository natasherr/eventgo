import { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { errMsg, EXPIRED_KEY } from '../api';
import { isEmail } from '../utils';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/';
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const [expired] = useState(() => !!sessionStorage.getItem(EXPIRED_KEY));
  useEffect(() => () => sessionStorage.removeItem(EXPIRED_KEY), []);
  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  const submit = async (e) => {
    e.preventDefault(); setError('');
    if (!isEmail(form.email)) return setError('Please enter a valid email address.');
    if (!form.password) return setError('Please enter your password.');
    setBusy(true);
    try {
      const data = await login(form.email, form.password);
      if (data.requires2FA) return setError('Administrator accounts sign in through the Admin Panel.');
      navigate(from, { replace: true });
    } catch (err) { setError(errMsg(err)); } finally { setBusy(false); }
  };

  return (
    <div className="eg-auth-wrap">
      {/* Full-bleed concert photo background + dark overlay */}
      <div className="eg-auth-bg" aria-hidden="true" />

      {/* Left: headline copy over the photo */}
      <div className="eg-auth-copy">
        <span className="eg-auth-kicker">
          <span className="eg-live-dot" />
          EventGo
        </span>
        <h1 className="eg-auth-headline">
          Your tickets,<br />your plans,<br /><em>one place.</em>
        </h1>
        <p className="eg-auth-copy-sub">
          Discover concerts, festivals, talks and more — all across Kenya.
        </p>
        <ul className="eg-auth-perks">
          <li><i className="fa-solid fa-bolt" /> Instant e-ticket delivery</li>
          <li><i className="fa-solid fa-shield-halved" /> Secure M-Pesa checkout</li>
          <li><i className="fa-solid fa-qrcode" /> Scan-in at the gate</li>
        </ul>
      </div>

      {/* Right: floating white form card */}
      <div className="eg-auth-card-wrap">
        <div className="eg-auth-card">
          <h3 className="eg-auth-title">Welcome back</h3>
          <p className="eg-auth-subtitle">Sign in to your EventGo account</p>

          {expired && !error && (
            <div className="alert alert-warning eg-auth-alert">
              <i className="fa-solid fa-clock me-2" />
              Your session has expired. Please log in again.
            </div>
          )}
          {error && (
            <div className="alert alert-danger eg-auth-alert">
              <i className="fa-solid fa-circle-exclamation me-2" />
              {error}
            </div>
          )}

          <form onSubmit={submit} noValidate>
            <div className="mb-3">
              <label className="form-label eg-auth-label">Email address</label>
              <input type="email" className="form-control eg-auth-input" value={form.email} onChange={set('email')} autoComplete="email" placeholder="you@example.com" />
            </div>
            <div className="mb-4">
              <div className="d-flex justify-content-between align-items-center mb-2">
                <label className="form-label eg-auth-label mb-0">Password</label>
                <Link to="/forgot-password" className="eg-auth-link-sm">Forgot password?</Link>
              </div>
              <input type="password" className="form-control eg-auth-input" value={form.password} onChange={set('password')} autoComplete="current-password" placeholder="••••••••" />
            </div>
            <button className="btn btn-eg w-100 eg-auth-btn" disabled={busy}>
              {busy
                ? <><span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true" />Signing in…</>
                : 'Sign In'}
            </button>
          </form>

          <p className="eg-auth-footer-note">
            Don&apos;t have an account?{' '}
            <Link to="/register" state={{ from: location.state?.from }} className="eg-auth-link">Create An Account</Link>
          </p>
        </div>
      </div>
    </div>
  );
}