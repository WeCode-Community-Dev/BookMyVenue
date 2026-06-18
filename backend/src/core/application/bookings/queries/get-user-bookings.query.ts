import { Injectable, Inject } from '@nestjs/common';
import { type IBookingRepository } from '../../../domain/bookings/repositories/booking-repository.interface';

export interface BookingResponseDto {
  id: string;
  userId: string;
  startDate: Date;
  endDate: Date;
  guestsCount: number;
  totalAmount: number;
  createdAt: Date;
  venue: {
    id: string;
    title: string
  }
}

@Injectable()
export class GetUserBookingsQuery {
  constructor(
    @Inject('IBookingRepository')
    private readonly bookingRepository: IBookingRepository,
  ) { }

  async execute(userId: string): Promise<BookingResponseDto[]> {
    const bookings = await this.bookingRepository.findByUserId(userId);

    return bookings.map((b) => ({
      id: b.id,
      userId: b.userId,
      startDate: b.dateRange?.startDate,
      endDate: b.dateRange?.endDate,
      guestsCount: b.guestsCount,
      totalAmount: b.totalAmount,
      createdAt: b.createdAt,
      venue: {
        id: b.venue!.id,
        title: b.venue!.title
      }
    }));
  }
}
