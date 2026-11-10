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
      <form
        className="admin-login__card"
        onSubmit={requires2FA ? handleVerify : handleLogin}
        noValidate
      >
        <h1>EventGo Admin</h1>

        {requires2FA ? (
          <>
            <p className="muted">
              Check your email for the six-digit verification code.
            </p>

            <p className="muted">
              Verification email: {pendingEmail || email}
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
              placeholder="Enter 6-digit code"
            />

            <button type="submit" disabled={submitting}>
              {submitting ? 'Verifying...' : 'Verify code'}
            </button>

            <button type="button" onClick={goBack} disabled={submitting}>
              Back to login
            </button>
          </>
        ) : (
          <>
            <p className="muted">
              Sign in to manage events and sales.
            </p>

            {serverError && (
              <div className="alert alert--error" role="alert">
                {serverError}
              </div>
            )}

            <label htmlFor="email">Email</label>

            <input
              id="email"
              type="email"
              autoComplete="username"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              aria-invalid={!!errors.email}
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
            />

            {errors.password && (
              <span className="field-error">{errors.password}</span>
            )}

            <button type="submit" disabled={submitting}>
              {submitting ? 'Signing in...' : 'Sign in'}
            </button>
          </>
        )}
      </form>
    </div>
  );
}