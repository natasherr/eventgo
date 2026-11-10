// Shared axios client. Attaches the JWT, turns errors into friendly messages,
// and signals the app when the session has expired (HTTP 401 on a protected call).
import axios from 'axios';

export const TOKEN_KEY = 'eventgo_token';
export const EXPIRED_KEY = 'eventgo_session_expired';

const api = axios.create({ baseURL: import.meta.env.VITE_API_URL || '/api' });

api.interceptors.request.use((cfg) => {
  const token = localStorage.getItem(TOKEN_KEY);
  if (token) cfg.headers.Authorization = `Bearer ${token}`;
  return cfg;
});

api.interceptors.response.use(
  (res) => res,
  (err) => {
    const url = err.config?.url || '';
    // 401 on a normal call while holding a token = expired/invalid session.
    // /auth/* calls are excluded (wrong password etc. also return 401).
    if (err.response?.status === 401 && localStorage.getItem(TOKEN_KEY) && !url.startsWith('/auth/')) {
      localStorage.removeItem(TOKEN_KEY);
      sessionStorage.setItem(EXPIRED_KEY, '1');
      window.dispatchEvent(new Event('eventgo:session-expired'));
    }
    return Promise.reject(err);
  }
);

export const errMsg = (e, fallback = 'Something went wrong. Please try again.') =>
  e.response?.data?.message || (e.request ? 'Cannot reach the server. Check your connection.' : fallback);

export default api;
