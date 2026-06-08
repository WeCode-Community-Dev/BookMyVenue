import { API_BASE, getFetchOptions, fetchWithAuth } from './apiClient';

export const fetchVenues = async (filters = {}) => {
  const url = new URL(`${API_BASE}/venues/`, window.location.origin);
  Object.keys(filters).forEach(key => {
    if (filters[key] !== undefined && filters[key] !== '') {
      url.searchParams.append(key, filters[key]);
    }
  });
  const res = await fetchWithAuth(url.toString(), getFetchOptions({ cache: 'no-store' }));
  if (!res.ok) throw new Error('Failed to fetch venues');
  return res.json();
};

export const fetchVenueById = async (id) => {
  const res = await fetchWithAuth(`${API_BASE}/venues/${id}`, getFetchOptions({ cache: 'no-store' }));
  if (!res.ok) throw new Error('Failed to fetch venue');
  return res.json();
};

export const fetchMyVenues = async () => {
  const res = await fetchWithAuth(`${API_BASE}/venues/my-venues`, getFetchOptions({ cache: 'no-store' }));
  if (!res.ok) throw new Error('Failed to fetch your venues');
  return res.json();
};

export const fetchVenueAnalytics = async () => {
  const res = await fetchWithAuth(`${API_BASE}/venues/my-venues/analytics`, getFetchOptions({ cache: 'no-store' }));
  if (!res.ok) throw new Error('Failed to fetch venue analytics');
  return res.json();
};

export const fetchMyBookings = async () => {
  const res = await fetchWithAuth(`${API_BASE}/venues/my-bookings`, getFetchOptions({ cache: 'no-store' }));
  if (!res.ok) throw new Error('Failed to fetch your bookings');
  return res.json();
};

export const createVenue = async (venueData) => {
  const res = await fetchWithAuth(`${API_BASE}/venues/`, getFetchOptions({
    method: 'POST',
    body: JSON.stringify(venueData),
  }));
  if (!res.ok) {
    const data = await res.json().catch(() => null);
    throw new Error(data?.detail || 'Failed to create venue');
  }
  return res.json();
};

export const updateVenue = async (venueId, venueData) => {
  const res = await fetchWithAuth(`${API_BASE}/venues/${venueId}`, getFetchOptions({
    method: 'PUT',
    body: JSON.stringify(venueData),
  }));
  if (!res.ok) throw new Error('Failed to update venue');
  return res.json();
};

export const uploadImage = async (file) => {
  const formData = new FormData();
  formData.append('file', file);
  
  const res = await fetchWithAuth(`${API_BASE}/upload/`, {
    method: 'POST',
    credentials: 'include',
    body: formData,
  });
  if (!res.ok) {
    const data = await res.json().catch(() => null);
    throw new Error(data?.detail || 'Failed to upload image');
  }
  return res.json();
};

export const updateBookingStatus = async (bookingId, status) => {
  const res = await fetchWithAuth(`${API_BASE}/venues/bookings/${bookingId}/status`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status }),
  });
  if (!res.ok) {
    const data = await res.json().catch(() => null);
    throw new Error(data?.detail || 'Failed to update booking status');
  }
  return res.json();
};
