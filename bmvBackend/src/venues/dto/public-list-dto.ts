import { VenueType } from "src/common/enums/venue-type.enum";
import { BookingType } from "src/common/enums/booking-type.enum";
import { VenueImage } from "../entities/venue-image.entity";
import { VenueStatus } from "src/common/enums/venue-status.enum";
export class PublicVenueResponseDto {
  id: string;
  venueName: string;
  city: string;
  venueType: VenueType;
  maxCapacity: number;
  startingPrice: number;
  thumbnailImage: string;
}

export class PublicVenueDetailResponseDto {
  id: string;
  venueName: string;
  venueType: VenueType;
  description: string;
  address: string;
  city: string;
  district: string;
  state: string;
  pincode: string;
  maxCapacity: number;
  squareFeet: number;
  hasParking: boolean;
  parkingCapacity: number | null;
  startingPrice: number;
  bookingType: BookingType;
  // status: VenueStatus
  images: VenueImage[];

}