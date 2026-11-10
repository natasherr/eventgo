// Global auth state (Context API). Persists the JWT in localStorage.
import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import api, { TOKEN_KEY } from '../api';

const AuthContext = createContext(null);
export const useAuth = () => useContext(AuthContext);
const USER_KEY = 'eventgo_user';

const readStoredUser = () => {
  try { return JSON.parse(localStorage.getItem(USER_KEY) || 'null'); }
  catch { localStorage.removeItem(USER_KEY); return null; }
};

export function AuthProvider({ children }) {
  const [user, setUser] = useState(readStoredUser);
  const [loading] = useState(false);

  const logout = useCallback(() => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    setUser(null);
  }, []);

  // The API client fires this when a protected call returns 401 (expired token).
  useEffect(() => {
    const onExpired = () => { localStorage.removeItem(USER_KEY); setUser(null); };
    window.addEventListener('eventgo:session-expired', onExpired);
    return () => window.removeEventListener('eventgo:session-expired', onExpired);
  }, []);

  const saveSession = ({ token, user: u }) => {
    localStorage.setItem(TOKEN_KEY, token);
    localStorage.setItem(USER_KEY, JSON.stringify(u));
    setUser(u);
  };

  // Returns the API payload so the caller can react to { requires2FA } (admin accounts).
  const login = async (email, password) => {
    const { data } = await api.post('/auth/login', { email, password });
    if (data.token) saveSession(data);
    return data;
  };
  const register = async (form) => {
    const { data } = await api.post('/auth/register', {
      full_name: form.full_name ?? form.name,
      email: form.email,
      phone_number: form.phone_number,
      password: form.password,
    });
    saveSession(data);
  };

  const updateUser = (nextUser) => {
    localStorage.setItem(USER_KEY, JSON.stringify(nextUser));
    setUser(nextUser);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, saveSession, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
}
