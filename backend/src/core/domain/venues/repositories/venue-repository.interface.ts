import type { Venue } from '../entities/venue.entity';

export interface VenueFilters {
  city?: string;
  venueType?: string;
  capacity?: number;
  status?: string;
}

export interface IVenueRepository {
  findById(id: string): Promise<Venue | null>;
  findAll(filters?: VenueFilters): Promise<Venue[]>;
  save(venue: Venue): Promise<void>;
}
