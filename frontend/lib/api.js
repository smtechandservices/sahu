export const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

export const fetchApi = async (endpoint, options = {}) => {
  const token = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;
  
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  // Handle FormData
  if (options.body instanceof FormData) {
    delete headers['Content-Type'];
  }

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (response.status === 401) {
    // Handle token refresh logic here in production
    // For now, logout if 401
    if (typeof window !== 'undefined') {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('user');
    }
  }

  let data = null;
  if (response.status !== 204) {
    try {
      data = await response.json();
    } catch (e) {
      data = null;
    }
  }

  if (!response.ok) {
    throw { status: response.status, data };
  }

  return data;
};
