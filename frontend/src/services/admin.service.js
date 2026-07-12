import { api } from '../api/client.js';

// Fetches the admin review queue for a single review status.
//   status     "PENDING" (new venues) or "CHANGES_PENDING" (submitted edits) — required
//   sortOrder  "asc" | "desc" by submission time (default "desc")
//   page/limit pagination
// Returns { data, pagination } straight from the API.
export const getAdminVenues = async ({ status, sortOrder = 'desc', page = 1, limit = 10 }) => {
  const params = new URLSearchParams({ status, sortOrder, page, limit });
  const res = await api.get(`/admin/venues?${params}`);
  return res; // { data, pagination }
};

// Returns just the count of venues in a review status — used to populate the
// tab badges without fetching the rows.
export const getAdminVenuesCount = async ({ status }) => {
  const params = new URLSearchParams({ status, countOnly: 'true' });
  const res = await api.get(`/admin/venues?${params}`);
  return res.data.total;
};

// Fetches one venue awaiting review (PENDING or CHANGES_PENDING) for the review
// page. For an edit copy the returned venue carries `editOf` (the original's id).
export const adminGetVenueById = async (id) => {
  const res = await api.get(`/admin/venues/${id}`);
  return res.data;
};

// Approves a venue under review. A new venue goes live;
// an edit copy is merged into its original and hard-deleted server-side.
export const adminApproveVenue = async (id) => {
  const res = await api.post(`/admin/venues/${id}/approve`);
  return res.data;
};

// Rejects a venue under review. `rejectionReason` is required (min length is
// enforced server-side) and shown to the owner.
export const adminRejectVenue = async (id, rejectionReason) => {
  const res = await api.post(`/admin/venues/${id}/reject`, { rejectionReason });
  return res.data;
};
