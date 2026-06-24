import type { PaginationFilter } from 'src/core/application/_shared/dto/pagination';
import type { Venue } from '../entities/venue.entity';

export interface VenueFilters {
  city?: string;
  venueType?: string;
  capacity?: number;
  status?: string;
  ownerId?: string
}

export interface VenuePaginationFilters extends VenueFilters, PaginationFilter { }

export interface IVenueRepository {
  findById(id: string): Promise<Venue | null>;
  findAll(filters?: VenueFilters): Promise<Venue[]>;
  findAndCountAll(filters?: VenuePaginationFilters): Promise<{ count: number, venues: Venue[] }>
  save(venue: Venue): Promise<void>;
}
