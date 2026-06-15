import type { Booking } from '../entities/booking.entity';

export interface IBookingRepository {
  findById(id: string): Promise<Booking | null>;
  findByVenueId(venueId: string): Promise<Booking[]>;
  findByUserId(userId: string): Promise<Booking[]>;
  checkAvailability(venueId: string, startDate: Date, endDate: Date): Promise<boolean>;
  save(booking: Booking): Promise<void>;
  delete(id: string): Promise<void>;
}
