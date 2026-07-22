import { api } from "@/lib/api";
import { mapBackendVenue, toBackendAmenities, toBackendCategory } from "@/lib/backend-mappers";
import { BackendVenue } from "@/types/backend";

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

export async function getMyVenues() {
  const response = await api.get<BackendVenue[]>("/venue/my-venues");
  return response.data.map(mapBackendVenue);
}
