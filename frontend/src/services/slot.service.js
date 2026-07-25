import { api } from '../api/client.js';

export const getVenueSlots = async (venueId) => {
  const res = await api.get(`/venueOwner/venues/${venueId}/slots`);
  return res.data;
};

// payload: { label, startTime, endTime, price } — startTime/endTime are
// minutes since midnight.
export const createVenueSlot = async (venueId, payload) => {
  const res = await api.post(`/venueOwner/venues/${venueId}/slots`, payload);
  return res.data;
};
