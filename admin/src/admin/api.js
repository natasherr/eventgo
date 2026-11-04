// client/src/admin/api.js
// One place that talks to the backend. Everything else imports from here.
// The Vite proxy forwards /api -> http://localhost:5000, so we use relative URLs.

const TOKEN_KEY = 'eventgo_admin_token';
const USER_KEY = 'eventgo_admin_user';

export function getToken() {
  return localStorage.getItem(TOKEN_KEY);
}

export function getStoredUser() {
  try {
    return JSON.parse(localStorage.getItem(USER_KEY));
  } catch {
    return null;
  }
}

export function saveSession(token, user) {
  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(USER_KEY, JSON.stringify(user));
}

export function clearSession() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
}

export class ApiError extends Error {
  constructor(message, status) {
    super(message);
    this.status = status;
  }
}

async function request(path, { method = 'GET', body, auth = false } = {}) {
  const headers = { 'Content-Type': 'application/json' };
  if (auth) {
    const token = getToken();
    if (token) headers.Authorization = `Bearer ${token}`;
  }

  let res;
  try {
    res = await fetch(`/api${path}`, {
      method,
      headers,
      body: body ? JSON.stringify(body) : undefined,
    });
  } catch {
    // fetch only throws on network failure (backend not running, etc.)
    throw new ApiError('Cannot reach the server. Is the backend running on port 5000?', 0);
  }

  // The backend always answers with JSON, but guard against an empty body anyway.
  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    // An expired/invalid token on a protected call: drop the session so the
    // ProtectedRoute sends the admin back to the login page.
    if (res.status === 401 && auth) {
      clearSession();
      window.dispatchEvent(new Event('eventgo:session-expired'));
    }
    throw new ApiError(data.message || `Request failed (${res.status})`, res.status);
  }
  return data;
}

// ---- Auth -----------------------------------------------------------------
// Backend returns: { message, token, user: { id, name, role } }
export async function loginRequest(email, password) {
  return request('/auth/login', { method: 'POST', body: { email, password } });
}

// ---- Events ---------------------------------------------------------------
// GET returns an ARRAY of events, each shaped like:
// { event_id, title, description, venue, event_date, status, created_at,
//   Category: { category_id, name, ... },
//   TicketTypes: [{ ticket_type_id, name, price, quantity_total }] }
// NOTE: it only returns events whose status is 'published'.
export async function fetchEvents() {
  return request('/events');
}

// Body: { category_id, title, description, venue, event_date (ISO string) }
export async function createEvent(payload) {
  return request('/events', { method: 'POST', body: payload, auth: true });
}
