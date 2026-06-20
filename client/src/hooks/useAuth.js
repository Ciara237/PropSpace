import { createContext, createElement, useCallback, useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext(null);

function decodeToken(token) {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    return JSON.parse(atob(base64));
  } catch {
    return null;
  }
}

export function AuthProvider({ children }) {
  const navigate = useNavigate();
  const [user, setUser] = useState(() => {
    const token = localStorage.getItem('token');
    return token ? decodeToken(token) : null;
  });

  const login = useCallback((token) => {
    localStorage.setItem('token', token);
    setUser(decodeToken(token));
  }, []);

  const updateUser = useCallback((updates) => {
    setUser((current) => ({ ...(current || {}), ...updates }));
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('token');
    setUser(null);
    navigate('/login');
  }, [navigate]);

  return createElement(
    AuthContext.Provider,
    { value: { user, login, logout, updateUser } },
    children
  );
}

export default function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  return context;
}
