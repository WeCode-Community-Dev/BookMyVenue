import { api } from "@/lib/api";
import { mapBackendVenue, toBackendAmenities, toBackendCategory } from "@/lib/backend-mappers";
import { BackendVenue, BackendVenueAvailability, BackendVenueDocumentType } from "@/types/backend";

export interface CreateVenuePayload {
  name: string;
  description?: string;
  city: string;
  address: string;
  latitude?: number;
  longitude?: number;
  capacity?: number;
  price?: number;
  categories?: string[];
  amenities?: string[];
  imageUrls?: string[];
  documents?: Array<{
    type: BackendVenueDocumentType;
    documentUrl: string;
  }>;
}

export interface BlockVenueDatesPayload {
  startDate: string;
  endDate: string;
  blockType?: "FULL_DAY" | "TIME_SLOT";
  reason?: string;
}

export async function createVenue(payload: CreateVenuePayload) {
  const response = await api.post<BackendVenue>("/venue", {
    ...payload,
    categories: (payload.categories || [])
      .map((category) => toBackendCategory(category))
      .filter((value): value is NonNullable<ReturnType<typeof toBackendCategory>> => Boolean(value)),
    amenities: toBackendAmenities(payload.amenities || []),
  });

  return mapBackendVenue(response.data);
}

export async function uploadVenueImage(formData: FormData) {
  const response = await api.post("/storage/venue-images", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response.data;
}

export async function uploadVenueDocuments(formData: FormData) {
  const response = await api.post("/storage/venue-documents", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response.data;
}

export async function getMyVenues() {
  const response = await api.get<BackendVenue[]>("/venue/my-venues");
  return response.data.map(mapBackendVenue);
}

export async function getVenueAvailability(venueId: string) {
  const response = await api.get<BackendVenueAvailability>(`/venue/${venueId}/availability`);
  return response.data;
}

export async function blockVenueDates(venueId: string, payload: BlockVenueDatesPayload) {
  const response = await api.post(`/venue/${venueId}/blocked-slots`, payload);
  return response.data;
}

export async function updateVenueBookingApproval(venueId: string, bookingApprovalRequired: boolean) {
  const response = await api.patch<{ message: string; venue: BackendVenue }>(`/venue/${venueId}/booking-approval`, {
    bookingApprovalRequired,
  });
  return {
    message: response.data.message,
    venue: mapBackendVenue(response.data.venue),
  };
}
