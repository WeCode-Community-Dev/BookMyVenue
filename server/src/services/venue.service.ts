import { VenueTypeEnumType } from "../enums/venue-enum";
import VenueModel from "../models/venue.model";

interface CreateVenueParams {
  owner: string;
  name: string;
  description?: string;
  venueType: VenueTypeEnumType;
  address?: string;
  city?: string;
  capacity?: number;
  pricePerHour: number;
  openingTime: number; // minutes from midnight
  closingTime: number; // minutes from midnight
  images?: string[];
  amenities?: string[];
}

export const createVenueService = async (data: CreateVenueParams) => {
  const venue = await VenueModel.create(data);
  return venue;
};
