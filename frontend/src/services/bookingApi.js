import { API_BASE, getFetchOptions, fetchWithAuth } from './apiClient';

export const fetchVenueBookings = async (venueId) => {
  const res = await fetchWithAuth(`${API_BASE}/venues/${venueId}/bookings`, getFetchOptions({ cache: 'no-store' }));
  if (!res.ok) throw new Error('Failed to fetch venue bookings');
  return res.json();
};

export const bookVenue = async (bookingData) => {
  const res = await fetchWithAuth(`${API_BASE}/venues/book`, getFetchOptions({
    method: 'POST',
    body: JSON.stringify(bookingData),
  }));
  if (!res.ok) {
    const errorData = await res.json().catch(() => null);
    throw new Error((errorData && errorData.detail) || 'Failed to book venue');
  }
  return res.json();
};

export const checkAvailability = async (venueId, startTime, endTime) => {
  const url = new URL(`${API_BASE}/venues/${venueId}/availability`, window.location.origin);
  url.searchParams.append('start_time', startTime);
  url.searchParams.append('end_time', endTime);
  
  const res = await fetchWithAuth(url.toString(), getFetchOptions({ cache: 'no-store' }));
  if (!res.ok) throw new Error('Failed to check availability');
  return res.json();
};
