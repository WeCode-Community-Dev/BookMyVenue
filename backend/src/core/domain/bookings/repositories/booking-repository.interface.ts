import type { PaymentStatus } from '../../_shared/enum/PaymentStatus.enum';
import type { Booking } from '../entities/booking.entity';

export type UpdateBookingDto = {
  paymentStatus?: PaymentStatus
}
export interface IBookingRepository {
  findById(id: string): Promise<Booking | null>;
  findByVenueId(venueId: string): Promise<Booking[]>;
  findByUserId(userId: string): Promise<Booking[]>;
  findByOwnerId(ownerId: string): Promise<Booking[]>;
  checkAvailability(venueId: string, startDate: Date, endDate: Date): Promise<boolean>;
  save(booking: Booking): Promise<void>;
  delete(id: string): Promise<void>;
  update(id: string, data: UpdateBookingDto): Promise<void>
}
