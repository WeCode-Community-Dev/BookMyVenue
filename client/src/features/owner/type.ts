// src/app/features/owner/types.ts

export type VenueStatus = "active" | "inactive" | "pending";

export interface Amenity {
  id: string;
  name: string;
}

export interface Venue {
  id: string;
  name: string;
  description: string;
  location: string;
  city: string;
  capacity: number;
  price_per_hour: number;
  status: VenueStatus;
  category: string;
  amenities: string[];
  images: string[];
  created_at: string;
  total_bookings?: number;
  rating?: number;
}

export interface CreateVenuePayload {
  name: string;
  description: string;
  location: string;
  city: string;
  capacity: number;
  price_per_hour: number;
  category: string;
  amenities: string[];
  images?: string[];
}

export interface VenueStats {
  total: number;
  active: number;
  pending: number;
  inactive: number;
}