import { apiFetch } from "../lib/api";

// ─── Customers ────────────────────────────────────────────────────────────────
export const getCustomers = () => apiFetch<any[]>("/admin/customers");
export const getCustomerDetails = (id: string) =>
  apiFetch<any>(`/admin/customers/${id}`);

// ─── Venue Owners ─────────────────────────────────────────────────────────────
export const getVenueOwners = () => apiFetch<any[]>("/admin/venue-owners");
export const getVenueOwnerDetails = (id: string) =>
  apiFetch<any>(`/admin/venue-owners/${id}`);

// ─── Verification Queue ───────────────────────────────────────────────────────
export const getPendingVenues = () => apiFetch<any[]>("/venues/pending");
export const getVenueDetails = (venueId: string) =>
  apiFetch<any>(`/venues/${venueId}`);

export const acceptVerification = (venueId: string, reviewNotes: string) =>
  apiFetch<any>(`/venues/${venueId}/accept`, {
    method: "POST",
    body: { reviewNotes },
  });

export const rejectVerification = (venueId: string, reviewNotes: string) =>
  apiFetch<any>(`/venues/${venueId}/reject`, {
    method: "POST",
    body: { reviewNotes },
  });

export const requestChangesVerification = (venueId: string, reviewNotes: string) =>
  apiFetch<any>(`/venues/${venueId}/changes`, {
    method: "POST",
    body: { reviewNotes },
  });

// ─── User Management ──────────────────────────────────────────────────────────
export const updateUser = (
  id: string,
  data: {
    name?: string;
    email?: string;
    phone?: string;
    isActive?: boolean;
  }
) =>
  apiFetch<any>(`/admin/users/${id}`, {
    method: "PATCH",
    body: data,
  });

export const deactivateUser = (id: string) =>
  apiFetch<any>(`/admin/users/${id}`, { method: "DELETE" });

// ─── Venues Management ────────────────────────────────────────────────────────
export const getAdminVenues = (status?: string) => {
  const query = status ? `?status=${status}` : "";
  return apiFetch<any[]>(`/admin/venues${query}`);
};

export const getAdminVenueDetails = (venueId: string) =>
  apiFetch<any>(`/admin/venues/${venueId}`);

export const getAdminVenuePhotos = (venueId: string) =>
  apiFetch<any[]>(`/admin/venues/${venueId}/photos`);

export const getAdminVenueDocs = (venueId: string) =>
  apiFetch<any[]>(`/admin/venues/${venueId}/docs`);
