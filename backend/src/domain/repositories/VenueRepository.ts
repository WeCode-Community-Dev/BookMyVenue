import { Venue } from "../entities/Venue.js";

export interface VenueFilters {
  city?: string;
  minCapacity?: number;
  maxCapacity?: number;
  minPrice?: number;
  maxPrice?: number;
  amenities?: string[];
  ownerId?: string;
  isActive?: boolean;
}

export interface VenueRepository {
  findById(id: string): Promise<Venue | null>;
  findByOwnerId(ownerId: string): Promise<Venue[]>;
  findAll(filters?: VenueFilters): Promise<Venue[]>;
  search(query: string, filters?: VenueFilters): Promise<Venue[]>;
  save(venue: Venue): Promise<Venue>;
  update(venue: Venue): Promise<Venue>;
  delete(id: string): Promise<void>;
}
