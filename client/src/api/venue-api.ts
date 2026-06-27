import { apiClient } from "@/lib/axios-client";
import type { Venue, VenueType } from "@/types/venue.types";

export interface CreateVenuePayload {
  name: string;
  description?: string;
  venueType: VenueType;
  address?: string;
  city?: string;
  capacity?: number;
  pricePerHour: number;
  openingTime: number;
  closingTime: number;
  amenities?: string[];
  images?: string[];
}

export const createVenueRequest = async (payload: CreateVenuePayload): Promise<Venue> => {
  const { data } = await apiClient.post("/venue/create-venue", payload);
  return data.venue;
};

export interface VenuesQuery {
  page?: number;
  limit?: number;
  city?: string;
  venueType?: string;
}

export interface VenuesResponse {
  venues: Venue[];
  pagination: { page: number; limit: number; total: number; totalPages: number };
}

export const getVenues = async (params: VenuesQuery): Promise<VenuesResponse> => {
  const { data } = await apiClient.get("/venue", { params });
  return { venues: data.venues, pagination: data.pagination };
};

export const getVenueById = async (venueId: string): Promise<Venue> => {
  const { data } = await apiClient.get(`/venue/get/${venueId}`);
  return data.venue;
};

export const getMyVenues = async (): Promise<Venue[]> => {
  const { data } = await apiClient.get("/venue/my-venues");
  return data.venues;
};

export const updateVenueRequest = async ({
  venueId,
  payload,
}: {
  venueId: string;
  payload: Partial<CreateVenuePayload>;
}): Promise<Venue> => {
  const { data } = await apiClient.patch(`/venue/update/${venueId}`, payload);
  return data.venue;
};
