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
  // Shows a notice if the API client logged the user out because the token expired.
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
    <div className="mx-auto card card-body" style={{ maxWidth: 420 }}>
      <h3 className="mb-3">Login</h3>
      {expired && !error && <div className="alert alert-warning">Your session has expired. Please log in again.</div>}
      {error && <div className="alert alert-danger">{error}</div>}
      <form onSubmit={submit} noValidate>
        <div className="mb-3"><label className="form-label">Email</label><input type="email" className="form-control" value={form.email} onChange={set('email')} autoComplete="email" /></div>
        <div className="mb-3"><label className="form-label">Password</label><input type="password" className="form-control" value={form.password} onChange={set('password')} autoComplete="current-password" /></div>
        <button className="btn btn-eg w-100" disabled={busy}>{busy ? 'Logging in...' : 'Log In'}</button>
      </form>
      <div className="d-flex justify-content-between mt-3 small">
        <Link to="/register" state={{ from: location.state?.from }}>Create Account</Link>
        <Link to="/forgot-password">Forgot password?</Link>
      </div>
    </div>
  );
}