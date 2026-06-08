import { API_BASE, getFetchOptions } from './apiClient';

export const login = async (username, password) => {
  const formData = new URLSearchParams();
  formData.append('username', username);
  formData.append('password', password);
  
  const res = await fetch(`${API_BASE}/auth/login`, getFetchOptions({
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: formData,
  }));
  if (!res.ok) {
    const data = await res.json().catch(() => null);
    throw new Error(data?.detail || 'Login failed');
  }
  const data = await res.json();
  // We still return data, but token is in HttpOnly cookie now.
  // We can set a local flag or decoded user.role to simulate the token parse
  localStorage.setItem('user_role', data.role);
  return data;
};

export const register = async (userData) => {
  const res = await fetch(`${API_BASE}/auth/register`, getFetchOptions({
    method: 'POST',
    body: JSON.stringify(userData),
  }));
  if (!res.ok) {
    const data = await res.json().catch(() => null);
    let errorMessage = 'Registration failed';
    if (data?.detail) {
      if (Array.isArray(data.detail)) {
        errorMessage = data.detail.map(err => err.msg.replace('Value error, ', '')).join(', ');
      } else if (typeof data.detail === 'string') {
        errorMessage = data.detail;
      }
    }
    throw new Error(errorMessage);
  }
  return res.json();
};

export const logout = async () => {
  await fetch(`${API_BASE}/auth/logout`, getFetchOptions({
    method: 'POST'
  })).catch(e => console.error(e));
  localStorage.removeItem('user_role');
  localStorage.removeItem('token');
};

export const parseJwt = (token) => {
  // Mocked for compatibility, since we use cookies now.
  // We rely on user_role set in localStorage during login.
  return { role: localStorage.getItem('user_role') || 'CUSTOMER' };
};

export const fetchMyProfile = async () => {
  const { fetchWithAuth } = await import('./apiClient');
  const res = await fetchWithAuth(`${API_BASE}/auth/me`);
  if (!res.ok) throw new Error('Failed to fetch profile');
  return res.json();
};

export const updateMyProfile = async (data) => {
  const { fetchWithAuth } = await import('./apiClient');
  const res = await fetchWithAuth(`${API_BASE}/auth/me`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => null);
    throw new Error(err?.detail || 'Failed to update profile');
  }
  return res.json();
};
