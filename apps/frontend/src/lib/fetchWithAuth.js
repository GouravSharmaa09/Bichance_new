import store from '../store';
import { logout } from '../store/authSlice';

export async function fetchWithAuth(url, options = {}) {
  const token = localStorage.getItem('access_token');
  const headers = {
    ...options.headers,
    Authorization: `Bearer ${token}`,
    'Content-Type': 'application/json',
  };

  const response = await fetch(url, { ...options, headers });

  if (response.status === 401) {
    store.dispatch(logout());
    localStorage.removeItem('access_token');
    localStorage.removeItem('auth_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('token');
    sessionStorage.removeItem('token');
    window.location.href = '/auth';
    return null;
  }

  return response;
} 