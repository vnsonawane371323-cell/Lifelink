import { createContext, useContext, useMemo, useState } from 'react';
import api from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(() => localStorage.getItem('token') || null);
  const [user, setUser] = useState(() => {
    const raw = localStorage.getItem('user');
    if (!raw) return null;
    try {
      return JSON.parse(raw);
    } catch {
      return null;
    }
  });
  const [loading] = useState(false);

  const login = async (email, password) => {
    const response = await api.post('/api/auth/login', { email, password });
    const payload = response?.data?.data || {};
    const tokenValue = payload.token;
    const userValue = {
      _id: payload._id,
      name: payload.name,
      email: payload.email,
      role: payload.role,
    };

    if (!tokenValue) {
      throw new Error('Login failed: token not returned by server.');
    }

    localStorage.setItem('token', tokenValue);
    localStorage.setItem('user', JSON.stringify(userValue));

    setToken(tokenValue);
    setUser(userValue);

    return userValue;
  };

  const register = async (payload) => {
    const response = await api.post('/api/auth/register', payload);
    return response.data;
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setToken(null);
    setUser(null);
  };

  const value = useMemo(
    () => ({
      user,
      token,
      isAuthenticated: Boolean(token),
      loading,
      login,
      register,
      logout,
    }),
    [user, token, loading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;
