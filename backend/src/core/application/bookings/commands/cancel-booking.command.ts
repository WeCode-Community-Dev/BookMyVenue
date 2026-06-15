import { Injectable, Inject } from '@nestjs/common';
import { type IBookingRepository } from '../../../domain/bookings/repositories/booking-repository.interface';
import { NotFoundException } from '../../../domain/_shared/exception/notfound.exception';
import { BusinessRuleException } from '../../../domain/_shared/exception/business-rule.exception';

export interface CancelBookingDto {
  bookingId: string;
  userId: string;
  userRole: string;
}

@Injectable()
export class CancelBookingCommand {
  constructor(
    @Inject('IBookingRepository')
    private readonly bookingRepository: IBookingRepository,
  ) { }

  async execute(dto: CancelBookingDto): Promise<void> {
    const booking = await this.bookingRepository.findById(dto.bookingId);
    if (!booking) {
      throw new NotFoundException('Booking not found');
    }

    // Authorization
    if (booking.userId !== dto.userId && dto.userRole !== 'ADMIN') {
      throw new BusinessRuleException('You do not have permission to cancel this booking');
    }

    // Enforce booking cancellation rules, e.g. cannot cancel past bookings
    if (booking.dateRange.startDate < new Date()) {
      throw new BusinessRuleException('Cannot cancel a booking that has already started');
    }

    await this.bookingRepository.delete(dto.bookingId);
  }
}
