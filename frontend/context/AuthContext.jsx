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

    if (token) {
      if (storedUser) {
        try { setUser(JSON.parse(storedUser)); } catch {}
      }
      fetchApi('/auth/profile/')
        .then(data => {
            setUser(data);
            const { profile_photo, profile_photo_mimetype, ...cookieSafeUser } = data;
            setCookie('user', JSON.stringify(cookieSafeUser));
        })
        .catch(() => logout());
    }
    setLoading(false);
  }, []);

  const login = (userData, accessToken, refreshToken) => {
    setUser(userData);
    const { profile_photo, profile_photo_mimetype, ...cookieSafeUser } = userData;
    setCookie('user', JSON.stringify(cookieSafeUser));
    if (accessToken) setCookie('accessToken', accessToken);
    if (refreshToken) setCookie('refreshToken', refreshToken);
  };

  const logout = async () => {
    const refreshToken = getCookie('refreshToken');
    if (refreshToken) {
      try {
        await fetchApi('/auth/logout/', {
          method: 'POST',
          body: JSON.stringify({ refresh: refreshToken })
        });
      } catch (e) {
        console.error("Server logout failed:", e);
      }
    }
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
