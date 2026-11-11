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

  const field = (k, label, type = 'text', auto, placeholder) => (
    <div className="mb-3">
      <label className="form-label eg-auth-label">{label}</label>
      <input
        type={type}
        className={`form-control eg-auth-input${errors[k] ? ' is-invalid' : ''}`}
        value={form[k]}
        onChange={set(k)}
        autoComplete={auto}
        placeholder={placeholder}
      />
      {errors[k] && <div className="invalid-feedback">{errors[k]}</div>}
    </div>
  );

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
          Join thousands<br />of <em>event-goers</em><br />across Kenya.
        </h1>
        <p className="eg-auth-copy-sub">
          Create a free account and never miss out on the events that matter to you.
        </p>
        <ul className="eg-auth-perks">
          <li><i className="fa-solid fa-ticket" /> Access all events in one place</li>
          <li><i className="fa-solid fa-envelope-open-text" /> Tickets delivered to your inbox</li>
          <li><i className="fa-solid fa-star" /> Save favourites &amp; get reminders</li>
        </ul>
      </div>

      {/* Right: floating white form card */}
      <div className="eg-auth-card-wrap">
        <div className="eg-auth-card">
          <h3 className="eg-auth-title">Create your account</h3>
          <p className="eg-auth-subtitle">It&apos;s free and only takes a minute</p>

          {apiError && (
            <div className="alert alert-danger eg-auth-alert">
              <i className="fa-solid fa-circle-exclamation me-2" />
              {apiError}
            </div>
          )}

          <form onSubmit={submit} noValidate>
            {field('name', 'Full name', 'text', 'name', 'Jane Doe')}
            {field('email', 'Email address', 'email', 'email', 'you@example.com')}
            {field('phone_number', 'Phone number', 'tel', 'tel', '0712 345 678')}
            {field('password', 'Password', 'password', 'new-password', '8+ characters')}
            {field('confirm', 'Confirm password', 'password', 'new-password', 'Repeat password')}
            <button className="btn btn-eg w-100 eg-auth-btn mt-1" disabled={busy}>
              {busy
                ? <><span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true" />Creating account…</>
                : 'Create Account'}
            </button>
          </form>

          <p className="eg-auth-footer-note">
            Already have an account?{' '}
            <Link to="/login" className="eg-auth-link">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
