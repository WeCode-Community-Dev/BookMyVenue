import { api } from '../api/client.js';

export const getVenueOwnerVenues = async ({ status, page = 1, limit = 10 } = {}) => {
  const params = new URLSearchParams({ page, limit });
  if (status) params.set('status', status);
  const res = await api.get(`/venueOwner/venues?${params}`);
  return res; // { data, pagination }
};

export const getVenueOwnerVenuesCount = async ({ status } = {}) => {
  const params = new URLSearchParams({ countOnly: 'true' });
  if (status) params.set('status', status);
  const res = await api.get(`/venueOwner/venues?${params}`);
  return res.data.total;
};

// Fetches one of the owner's own venues in any status (incl. DRAFT)
export const getVenueOwnerVenueById = async (id) => {
  const res = await api.get(`/venueOwner/venues/${id}`);
  return res.data;
};

// Starts (or resumes) editing of a live APPROVED venue. `originalId` is the
// APPROVED original's id; the backend returns the EDIT_DRAFT copy to actually
// edit (creating it on first call, returning the existing one thereafter).
// Throws a 409 when an edit is already submitted for approval (CHANGES_PENDING).
export const getVenueForEdit = async (originalId) => {
  const res = await api.post(`/venueOwner/getVenueForEdit/${originalId}`);
  return res.data;
};

// Pulls a REJECTED venue back into editing.
export const reEditRejectedVenue = async (id) => {
   const res = await api.post(`/venueOwner/reEditRejectedVenue/${id}`);
   return res.data;
};

// Creates an empty DRAFT venue and returns the created doc ({ _id, status, ... }).
// The form is then filled on the edit page, which autosaves via updateVenue().
export const createDraftVenue = async () => {
  const res = await api.post('/venueOwner/venues');
  return res.data;
};

export const submitVenue = async (id) => {
  const res = await api.post(`/venueOwner/venues/submit/${id}`);
  return res.data;
};

export const updateVenue = async (id, payload) => {
  const res = await api.patch(`/venueOwner/venues/update/${id}`, payload);
  return res.data;
};

export const setVenueVisibility = async (id, isActive) => {
  const res = await api.patch(`/venueOwner/venues/visibility/${id}`, { isActive });
  return res.data;
};

export const deleteVenue = async (id) => {
  const res = await api.del(`/venueOwner/venues/delete/${id}`);
  return res.data;
};
