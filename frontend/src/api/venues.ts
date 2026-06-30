import { apiClient } from "./client";
import type { Venue, VenueType } from "@/lib/types";

export interface VenueSearchParams {
  lat?: number;
  lng?: number;
  radius_km?: number;
  type?: VenueType;
  min_price?: number;
  max_price?: number;
  min_capacity?: number;
  q?: string;
  skip?: number;
  limit?: number;
}

export interface VenueCreatePayload {
  name: string;
  type: VenueType;
  description?: string;
  address: string;
  lat?: number;
  lng?: number;
  price_per_hour: number;
  capacity: number;
  photos?: string[];
  amenities?: string[];
}

export const venuesApi = {
  search: (params: VenueSearchParams = {}) =>
    apiClient.get<Venue[]>("/venues", { params }).then((r) => r.data),

  get: (id: number) =>
    apiClient.get<Venue>(`/venues/${id}`).then((r) => r.data),

  ownerList: () =>
    apiClient.get<Venue[]>("/owner/venues").then((r) => r.data),

  ownerCreate: (data: VenueCreatePayload) =>
    apiClient.post<Venue>("/owner/venues", data).then((r) => r.data),

  ownerUpdate: (id: number, data: Partial<VenueCreatePayload>) =>
    apiClient.put<Venue>(`/owner/venues/${id}`, data).then((r) => r.data),
};
