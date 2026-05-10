'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import { fetchApi } from '../lib/api';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    const token = localStorage.getItem('accessToken');
    
    if (storedUser && token) {
      const parsedUser = JSON.parse(storedUser);
      if (parsedUser.is_admin) {
        setUser(parsedUser);
        // Refresh profile to ensure they are still admin
        fetchApi('/auth/profile/')
          .then(data => {
              if (data.is_admin) {
                setUser(data);
                localStorage.setItem('user', JSON.stringify(data));
              } else {
                logout();
              }
          })
          .catch(() => logout());
      } else {
        logout();
      }
    }
    setLoading(false);
  }, []);

  const login = (userData, accessToken, refreshToken) => {
    if (!userData.is_admin) {
        throw new Error("Access denied. Admin privileges required.");
    }
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
    if (typeof window !== 'undefined') {
        window.location.href = '/login';
    }
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
