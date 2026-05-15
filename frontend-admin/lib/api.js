import { getCookie, removeCookie } from './cookies';

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

export async function fetchApi(endpoint, options = {}) {
  const token = typeof window !== 'undefined' ? getCookie('accessToken') : null;

  const headers = {
    'Content-Type': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` }),
    ...options.headers,
  };

  if (options.body instanceof FormData) {
    delete headers['Content-Type'];
  }

  const config = {
    ...options,
    headers,
  };

  try {
    const response = await fetch(`${BASE_URL}${endpoint}`, config);
    
    if (response.status === 401) {
        if (typeof window !== 'undefined') {
            removeCookie('accessToken');
            removeCookie('refreshToken');
            removeCookie('user');
            window.location.href = '/login';
        }
    }

    const contentType = response.headers.get("content-type");
    const isJson = contentType && contentType.includes("application/json");

    if (!response.ok) {
      const errorText = isJson ? (await response.json()).detail || (await response.json()).error : await response.text();
      throw new Error(errorText || `API Error: ${response.status} ${response.statusText}`);
    }

    if (response.status === 204) {
        return null;
    }

    if (!isJson) {
        // If not JSON but status is OK, just return text or null
        return await response.text();
    }

    return await response.json();
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
}
