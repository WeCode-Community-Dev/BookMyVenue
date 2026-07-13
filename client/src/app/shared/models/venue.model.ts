import { VenueStatus } from '../enums/venue-status.enum';

export interface Venue {
  id: string;
  name: string;
  description: string;
  address: string;
  district: string;
  capacity: number;
  pricePerSlot: number;
  advancePercentage: number;
  category: string;
  status: VenueStatus;
  imageUrls?: string[];
}

export interface VenueCategory {
  id: number;
  name: string;
  description?: string;
}

export interface CreateVenueRequest {
  name: string;
  description: string;
  address: string;
  district: string;
  capacity: number;
  pricePerSlot: number;
  advancePercentage: number;
  categoryId: number;
  imageUrls?: string[];
}

export interface UpdateVenueRequest {
  name?: string;
  description?: string;
  address?: string;
  district?: string;
  capacity?: number;
  pricePerSlot?: number;
  advancePercentage?: number;
  categoryId?: number;
  imageUrls?: string[];
}

export interface VenueFilter {
  search?: string;
  district?: string;
  categoryId?: number;
}
