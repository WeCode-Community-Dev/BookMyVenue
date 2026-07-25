import { api } from "@/lib/api";
import { mapBackendVenue } from "@/lib/backend-mappers";
import { BackendVenue } from "@/types/backend";

export async function getPendingVenues() {
  const response = await api.get<BackendVenue[]>("/admin/venues/pending");
  return response.data.map(mapBackendVenue);
}

export async function approveVenue(venueId: string) {
  const response = await api.patch<{ message: string; venue: BackendVenue }>(`/admin/venues/${venueId}/approve`);
  return {
    message: response.data.message,
    venue: mapBackendVenue(response.data.venue),
  };
}

export async function rejectVenue(venueId: string, reason: string) {
  const response = await api.patch<{ message: string; venue: BackendVenue }>(
    `/admin/venues/${venueId}/reject`,
    { reason },
  );

  return {
    message: response.data.message,
    venue: mapBackendVenue(response.data.venue),
  };
}
