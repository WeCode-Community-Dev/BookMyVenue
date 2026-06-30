import { apiClient } from "./client";
import type { Booking, OverviewStats, Venue, VenueStatus } from "@/lib/types";

export const adminApi = {
  overview: () =>
    apiClient.get<OverviewStats>("/admin/overview").then((r) => r.data),

  pendingVenues: () =>
    apiClient.get<Venue[]>("/admin/venues/pending").then((r) => r.data),

  allVenues: () => apiClient.get<Venue[]>("/admin/venues").then((r) => r.data),

  setVenueStatus: (id: number, status: VenueStatus) =>
    apiClient.patch<Venue>(`/admin/venues/${id}`, { status }).then((r) => r.data),

  allBookings: () =>
    apiClient.get<Booking[]>("/admin/bookings").then((r) => r.data),
};
