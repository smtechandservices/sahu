'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import { fetchApi } from '../lib/api';
import { setCookie, getCookie, removeCookie } from '../lib/cookies';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = getCookie('user');
    const token = getCookie('accessToken');

    if (storedUser && token) {
      setUser(JSON.parse(storedUser));
      fetchApi('/auth/profile/')
        .then(data => {
            setUser(data);
            setCookie('user', JSON.stringify(data));
        })
        .catch(() => logout());
    }
    setLoading(false);
  }, []);

  const login = (userData, accessToken, refreshToken) => {
    setUser(userData);
    setCookie('user', JSON.stringify(userData));
    setCookie('accessToken', accessToken);
    setCookie('refreshToken', refreshToken);
  };

  const logout = () => {
    setUser(null);
    removeCookie('user');
    removeCookie('accessToken');
    removeCookie('refreshToken');
    window.location.href = '/login';
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
