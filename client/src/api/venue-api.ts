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
