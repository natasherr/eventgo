import { useState } from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext';

export default function LoginPage() {
  const { login, verify2FA, isAuthenticated, pendingEmail } = useAuth();

  const navigate = useNavigate();
  const location = useLocation();
  const redirectTo = location.state?.from || '/admin';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [requires2FA, setRequires2FA] = useState(false);

  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  if (isAuthenticated) {
    return <Navigate to="/admin" replace />;
  }

  async function handleLogin(e) {
    e.preventDefault();
    setServerError('');

    const next = {};

    if (!email.trim()) {
      next.email = 'Enter your email address.';
    } else if (!/^\S+@\S+\.\S+$/.test(email)) {
      next.email = 'Enter a valid email address.';
    }

    if (!password) {
      next.password = 'Enter your password.';
    }

    setErrors(next);

    if (Object.keys(next).length) return;

    setSubmitting(true);

    try {
      const result = await login(email.trim(), password);

      if (result.requires2FA) {
        setRequires2FA(true);
      }
    } catch (err) {
      setServerError(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  async function handleVerify(e) {
    e.preventDefault();
    setServerError('');

    if (!/^\d{6}$/.test(otp)) {
      setServerError('Enter the six-digit verification code.');
      return;
    }

    setSubmitting(true);

    try {
      await verify2FA(otp);
      navigate(redirectTo, { replace: true });
    } catch (err) {
      setServerError(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  function goBack() {
    setRequires2FA(false);
    setOtp('');
    setServerError('');
  }

  return (
    <div className="admin-login">
      {/* ── Left: hero panel ── */}
      <div className="admin-login__hero">
        <div className="admin-login__hero-brand">
          <span className="admin-login__hero-brand-icon">
            <img src="/logo-icon.png" alt="EventGo logo" />
          </span>
          <div>
            <span>EventGo</span>
            <small>ADMINISTRATION</small>
          </div>
        </div>

        <div className="admin-login__hero-copy">
          <span className="admin-login__hero-eyebrow">
            <span className="admin-login__hero-dot" />
            Organizer Portal
          </span>
          <h2>The operating system for <em>unforgettable</em> events.</h2>
          <p>
            Manage events, track ticket sales, and monitor security —
            all from one powerful dashboard.
          </p>
        </div>
      </div>

      {/* ── Right: form panel ── */}
      <div className="admin-login__form-side">
        <form
          className="admin-login__card"
          onSubmit={requires2FA ? handleVerify : handleLogin}
          noValidate
        >
          {requires2FA ? (
            <>
              <h1 className="admin-login__card-title">Check your email</h1>
              <p className="admin-login__card-sub">
                We sent a six-digit code to <strong>{pendingEmail || email}</strong>
              </p>

              {serverError && (
                <div className="alert alert--error" role="alert">
                  {serverError}
                </div>
              )}

              <label htmlFor="otp">Verification code</label>

              <input
                id="otp"
                type="text"
                inputMode="numeric"
                autoComplete="one-time-code"
                maxLength={6}
                value={otp}
                onChange={(e) =>
                  setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))
                }
                placeholder="000000"
              />

              <button type="submit" disabled={submitting}>
                {submitting ? 'Verifying…' : 'Verify code'}
              </button>

              <button type="button" onClick={goBack} disabled={submitting}>
                ← Back to sign in
              </button>
            </>
          ) : (
            <>
              <h1 className="admin-login__card-title">Welcome back</h1>
              <p className="admin-login__card-sub">
                Sign in to your EventGo Admin account
              </p>

              {serverError && (
                <div className="alert alert--error" role="alert">
                  {serverError}
                </div>
              )}

              <label htmlFor="email">Email address</label>

              <input
                id="email"
                type="email"
                autoComplete="username"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                aria-invalid={!!errors.email}
                placeholder="admin@example.com"
              />

              {errors.email && (
                <span className="field-error">{errors.email}</span>
              )}

              <label htmlFor="password">Password</label>

              <input
                id="password"
                type="password"
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                aria-invalid={!!errors.password}
                placeholder="••••••••"
              />

              {errors.password && (
                <span className="field-error">{errors.password}</span>
              )}

              <button type="submit" disabled={submitting}>
                {submitting ? 'Signing in…' : 'Sign in'}
              </button>
            </>
          )}
        </form>
      </div>
    </div>
  );
}
