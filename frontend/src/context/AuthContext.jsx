import { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { authService } from '../services/authService';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem('user');
    return stored ? JSON.parse(stored) : null;
  });
  const [loading, setLoading] = useState(true);

  const setTokens = (tokens) => {
    localStorage.setItem('access_token', tokens.access);
    localStorage.setItem('refresh_token', tokens.refresh);
  };

  const clearAuth = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('user');
    setUser(null);
  };

  const persistUser = (userData) => {
    localStorage.setItem('user', JSON.stringify(userData));
    setUser(userData);
  };

  const register = async (data) => {
    const { data: res } = await authService.register(data);
    setTokens(res.tokens);
    persistUser(res.user);
    return res;
  };

  const login = async (data) => {
    const { data: res } = await authService.login(data);
    setTokens(res.tokens);
    persistUser(res.user);
    return res;
  };

  const logout = async () => {
    const refresh = localStorage.getItem('refresh_token');
    try {
      if (refresh) await authService.logout(refresh);
    } finally {
      clearAuth();
    }
  };

  const refreshProfile = useCallback(async () => {
    const token = localStorage.getItem('access_token');
    if (!token) {
      setLoading(false);
      return;
    }
    try {
      const { data } = await authService.getProfile();
      persistUser(data);
    } catch {
      clearAuth();
    } finally {
      setLoading(false);
    }
  }, []);

  const updateProfile = async (data) => {
    const { data: updated } = await authService.updateProfile(data);
    persistUser(updated);
    return updated;
  };

  useEffect(() => {
    refreshProfile();
  }, [refreshProfile]);

  const isAuthenticated = !!user && !!localStorage.getItem('access_token');

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isAuthenticated,
        register,
        login,
        logout,
        updateProfile,
        refreshProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
