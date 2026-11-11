// One place that talks to the backend. Everything else imports from here.
// Uses VITE_API_URL for production (Vercel) or falls back to the Vite proxy for local dev.

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

  // Use the deployed backend URL from Vercel, or fall back to relative path for local development
  const baseUrl = import.meta.env.VITE_API_URL || '/api';

  let res;
  try {
    res = await fetch(`${baseUrl}${path}`, {
      method,
      headers,
      body: body ? JSON.stringify(body) : undefined,
    });
  } catch {
    // fetch only throws on network failure (backend not running, etc.)
    throw new ApiError('Cannot reach the server. Check your connection.', 0);
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

export async function verify2FARequest(email, otp) {
  return request('/auth/verify-2fa', {
    method: 'POST',
    body: { email, otp },
  });
}

// ---- Events ---------------------------------------------------------------
export async function fetchEvents() {
  return request('/events');
}

export async function createEvent(payload) {
  return request('/events', { method: 'POST', body: payload, auth: true });
}

export async function fetchCategories() {
  return request('/categories');
}

export async function createTicketType(eventId, payload) {
  return request(`/events/${eventId}/ticket-types`, { method: 'POST', body: payload, auth: true });
}

// ---- Tickets & Sales ------------------------------------------------------
export async function fetchOrders() {
  return request('/admin/orders', { auth: true });
}

export async function fetchSalesReport() {
  return request('/admin/sales-by-event', { auth: true });
}

export async function fetchAuditLogs() {
  return request('/admin/audit-logs', { auth: true });
}