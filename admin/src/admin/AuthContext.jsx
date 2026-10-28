// client/src/admin/AuthContext.jsx
import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { loginRequest, saveSession, clearSession, getStoredUser, getToken } from './api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  // Only treat the user as logged in if BOTH a token and a stored user exist.
  const [user, setUser] = useState(() => (getToken() ? getStoredUser() : null));

  const login = useCallback(async (email, password) => {
    const data = await loginRequest(email, password);

    // The backend's /login accepts ANY valid account, including normal
    // customers. The admin panel must refuse anyone who isn't an admin.
    if (data.user?.role !== 'admin') {
      throw new Error('This account does not have administrator access.');
    }

    saveSession(data.token, data.user);
    setUser(data.user);
    return data.user;
  }, []);

  const logout = useCallback(() => {
    clearSession();
    setUser(null);
  }, []);

  // api.js fires this when the server says the token is no longer valid (24h expiry).
  useEffect(() => {
    const onExpired = () => setUser(null);
    window.addEventListener('eventgo:session-expired', onExpired);
    return () => window.removeEventListener('eventgo:session-expired', onExpired);
  }, []);

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>');
  return ctx;
}
