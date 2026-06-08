import { API_BASE, getFetchOptions, fetchWithAuth } from './apiClient';

export const createOrGetRoom = async (partnerId, venueId = null) => {
  const url = new URL(`${API_BASE}/chat/rooms`, window.location.origin);
  url.searchParams.append('partner_id', partnerId);
  if (venueId) url.searchParams.append('venue_id', venueId);

  const res = await fetchWithAuth(url.toString(), getFetchOptions({ method: 'POST' }));
  if (!res.ok) throw new Error('Failed to create or get chat room');
  return res.json();
};

export const fetchMyRooms = async () => {
  const res = await fetchWithAuth(`${API_BASE}/chat/rooms`, getFetchOptions({ cache: 'no-store' }));
  if (!res.ok) throw new Error('Failed to fetch chat rooms');
  return res.json();
};

export const fetchRoomMessages = async (roomId) => {
  const res = await fetchWithAuth(`${API_BASE}/chat/rooms/${roomId}/messages`, getFetchOptions({ cache: 'no-store' }));
  if (!res.ok) throw new Error('Failed to fetch messages');
  return res.json();
};
