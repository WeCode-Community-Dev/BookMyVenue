import { Types } from 'mongoose';

export interface VenueCardDto {
  _id: Types.ObjectId;
  name: string;
  description?: string;
  images: string[];
  address: {
    city: string;
    district: string;
    state?: string;
  };
  location: {
    coordinates: [number, number];
  };
  capacity: number;
  pricing: {
    amount: number;
    unit: 'hour' | 'day';
  };
  isFeatured: boolean;
  isElite: boolean;
  bookingCount?: number;
  availability?: {
    pricePerHour: number;
    minBookingDuration: number;
    maxBookingDuration?: number | null;
  };
}

export interface DistrictDto {
  id: string;
  name: string;
  coordinates: [number, number];
  venueCount: number;
  featuredVenues: VenueCardDto[];
}
