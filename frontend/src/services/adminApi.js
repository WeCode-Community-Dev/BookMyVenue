import { API_BASE, getFetchOptions, fetchWithAuth } from './apiClient';

export const fetchAdminUsers = async () => {
  const res = await fetchWithAuth(`${API_BASE}/admin/users`, getFetchOptions({ cache: 'no-store' }));
  if (!res.ok) throw new Error('Failed to fetch users');
  return res.json();
};

export const fetchAdminBookings = async () => {
  const res = await fetchWithAuth(`${API_BASE}/admin/bookings`, getFetchOptions({ cache: 'no-store' }));
  if (!res.ok) throw new Error('Failed to fetch bookings');
  return res.json();
};

export const deleteAdminVenue = async (venueId) => {
  const res = await fetchWithAuth(`${API_BASE}/admin/venues/${venueId}`, getFetchOptions({
    method: 'DELETE',
  }));
  if (!res.ok) throw new Error('Failed to delete venue');
  return res.json();
};

export const moderateAdminVenue = async (venueId, status) => {
  const res = await fetchWithAuth(`${API_BASE}/admin/venues/${venueId}/moderate`, getFetchOptions({
    method: 'PUT',
    body: JSON.stringify({ status }),
  }));
  if (!res.ok) {
    const data = await res.json().catch(() => null);
    throw new Error(data?.detail || 'Failed to moderate venue');
  }
  return res.json();
};

export const updateAdminUser = async (userId, userData) => {
  const res = await fetchWithAuth(`${API_BASE}/admin/users/${userId}`, getFetchOptions({
    method: 'PUT',
    body: JSON.stringify(userData),
  }));
  if (!res.ok) throw new Error('Failed to update user');
  return res.json();
};

export const deleteAdminUser = async (userId) => {
  const res = await fetchWithAuth(`${API_BASE}/admin/users/${userId}`, getFetchOptions({
    method: 'DELETE',
  }));
  if (!res.ok) throw new Error('Failed to delete user');
  return res.json();
};
