import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from 'react';

import {
  loginRequest,
  verify2FARequest,
  saveSession,
  clearSession,
  getStoredUser,
  getToken,
} from './api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() =>
    getToken() ? getStoredUser() : null
  );

  const [pendingEmail, setPendingEmail] = useState('');

  const login = useCallback(async (email, password) => {
    const data = await loginRequest(email, password);

    // Admin accounts must complete two-factor authentication.
    if (data.requires2FA) {
      setPendingEmail(data.email);
      return { requires2FA: true, email: data.email };
    }

    // Normal customer accounts cannot access the admin panel.
    if (data.user?.role !== 'admin') {
      throw new Error(
        'This account does not have administrator access.'
      );
    }

    throw new Error('Administrator verification was not completed.');
  }, []);

  const verify2FA = useCallback(async (otp) => {
    if (!pendingEmail) {
      throw new Error('Please sign in again to request a verification code.');
    }

    const data = await verify2FARequest(pendingEmail, otp);

    if (data.user?.role !== 'admin' || !data.token) {
      throw new Error('Administrator verification failed.');
    }

    saveSession(data.token, data.user);
    setUser(data.user);
    setPendingEmail('');

    return data.user;
  }, [pendingEmail]);

  const logout = useCallback(() => {
    clearSession();
    setUser(null);
    setPendingEmail('');
  }, []);

  useEffect(() => {
    const onExpired = () => {
      clearSession();
      setUser(null);
    };

    window.addEventListener('eventgo:session-expired', onExpired);

    return () => {
      window.removeEventListener('eventgo:session-expired', onExpired);
    };
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        login,
        verify2FA,
        pendingEmail,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);

  if (!ctx) {
    throw new Error('useAuth must be used inside <AuthProvider>');
  }

  return ctx;
}