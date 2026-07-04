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
