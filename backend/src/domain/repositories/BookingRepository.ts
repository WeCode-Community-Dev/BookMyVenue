import type { Booking, BookingStatus } from "../entities/Booking.js";

export interface BookingFilters {
  userId?: string;
  venueId?: string;
  status?: BookingStatus;
  startDate?: Date;
  endDate?: Date;
}

export interface BookingRepository {
  findById(id: string): Promise<Booking | null>;
  findByUserId(userId: string): Promise<Booking[]>;
  findByVenueId(venueId: string): Promise<Booking[]>;
  findAll(filters?: BookingFilters): Promise<Booking[]>;
  findOverlapping(venueId: string, startTime: Date, endTime: Date): Promise<Booking[]>;
  save(booking: Booking): Promise<Booking>;
  update(booking: Booking): Promise<Booking>;
  delete(id: string): Promise<void>;
}
