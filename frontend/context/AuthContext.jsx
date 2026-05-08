'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import { fetchApi } from '../lib/api';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in
    const storedUser = localStorage.getItem('user');
    const token = localStorage.getItem('accessToken');
    
    if (storedUser && token) {
      setUser(JSON.parse(storedUser));
      // Optionally fetch latest profile
      fetchApi('/auth/profile/')
        .then(data => {
            setUser(data);
            localStorage.setItem('user', JSON.stringify(data));
        })
        .catch(() => {
            // Token might be invalid
            logout();
        });
    }
    setLoading(false);
  }, []);

  const login = (userData, accessToken, refreshToken) => {
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
    localStorage.setItem('accessToken', accessToken);
    localStorage.setItem('refreshToken', refreshToken);
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
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
