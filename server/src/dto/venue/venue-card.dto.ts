import { Types } from 'mongoose';

export interface VenueCardDto {
  _id: Types.ObjectId;
  name: string;
  images: string[];
  address: {
    city: string;
    district: string;
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
}

export interface DistrictDto {
  id: string;
  name: string;
  coordinates: [number, number];
  venueCount: number;
  featuredVenues: VenueCardDto[];
}
