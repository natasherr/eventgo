import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { errMsg } from '../api';
import { isEmail } from '../utils';

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const from = useLocation().state?.from?.pathname || '/';
  const [form, setForm] = useState({ name: '', email: '', phone_number: '', password: '', confirm: '' });
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState('');
  const [busy, setBusy] = useState(false);
  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  const validate = () => {
    const e = {};
    if (form.name.trim().length < 2) e.name = 'Please enter your full name.';
    if (!isEmail(form.email)) e.email = 'Please enter a valid email address.';
    if (!/^(\+?254|0)[17]\d{8}$/.test(form.phone_number.replace(/\s/g, ''))) e.phone_number = 'Enter a valid Kenyan number, e.g. 0712345678.';
    if (form.password.length < 8) e.password = 'Password must be at least 8 characters.';
    if (form.confirm !== form.password) e.confirm = 'Passwords do not match.';
    return e;
  };

  const submit = async (ev) => {
    ev.preventDefault(); setApiError('');
    const e = validate(); setErrors(e);
    if (Object.keys(e).length) return;
    setBusy(true);
    try {
      await register({ name: form.name.trim(), email: form.email, phone_number: form.phone_number, password: form.password });
      navigate(from, { replace: true });
    } catch (err) { setApiError(errMsg(err)); } finally { setBusy(false); }
  };

  const field = (k, label, type = 'text', auto) => (
    <div className="mb-3">
      <label className="form-label">{label}</label>
      <input type={type} className={`form-control${errors[k] ? ' is-invalid' : ''}`} value={form[k]} onChange={set(k)} autoComplete={auto} />
      {errors[k] && <div className="invalid-feedback">{errors[k]}</div>}
    </div>
  );

  return (
    <div className="mx-auto card card-body" style={{ maxWidth: 440 }}>
      <h3 className="mb-3">Create Account</h3>
      {apiError && <div className="alert alert-danger">{apiError}</div>}
      <form onSubmit={submit} noValidate>
        {field('name', 'Full name', 'text', 'name')}
        {field('email', 'Email', 'email', 'email')}
        {field('phone_number', 'Phone number', 'tel', 'tel')}
        {field('password', 'Password', 'password', 'new-password')}
        {field('confirm', 'Confirm password', 'password', 'new-password')}
        <button className="btn btn-eg w-100" disabled={busy}>{busy ? 'Creating account...' : 'Create Account'}</button>
      </form>
      <p className="small mt-3 mb-0">Already registered? <Link to="/login">Log in</Link></p>
    </div>
  );
}