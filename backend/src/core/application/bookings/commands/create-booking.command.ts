import { Injectable, Inject } from '@nestjs/common';
import { Booking } from '../../../domain/bookings/entities/booking.entity';
import { DateRange } from '../../../domain/bookings/value-objects/date-range.vo';
import { type IBookingRepository } from '../../../domain/bookings/repositories/booking-repository.interface';
import { type IVenueRepository } from '../../../domain/venues/repositories/venue-repository.interface';
import { NotFoundException } from '../../../domain/_shared/exception/notfound.exception';
import { BusinessRuleException } from '../../../domain/_shared/exception/business-rule.exception';
import * as crypto from 'crypto';
import { BookingStatus } from 'src/core/domain/bookings/enum/booking-status.enum';
import { PaymentStatus } from 'src/core/domain/_shared/enum/PaymentStatus.enum';
import type { INotificationService } from 'src/core/domain/notification/notification.service.interface';

export interface CreateBookingDto {
  userId: string;
  venueId: string;
  startDate: Date;
  endDate: Date;
  guestsCount: number;
}

@Injectable()
export class CreateBookingCommand {
  constructor(
    @Inject('IBookingRepository')
    private readonly bookingRepository: IBookingRepository,
    @Inject('IVenueRepository')
    private readonly venueRepository: IVenueRepository,
    @Inject('INotificationService')
    private readonly notificationService: INotificationService
  ) { }

  async execute(dto: CreateBookingDto): Promise<{ bookingId: string; totalAmount: number }> {
    const venue = await this.venueRepository.findById(dto.venueId);
    if (!venue) {
      throw new NotFoundException('Venue not found');
    }

    if (venue.status !== 'APPROVED') {
      throw new BusinessRuleException('Cannot book a venue that is not approved');
    }

    if (dto.guestsCount > venue.capacity) {
      throw new BusinessRuleException(`Guests count exceeds venue capacity of ${venue.capacity}`);
    }

    const dateRange = DateRange.create(dto.startDate, dto.endDate);

    const isAvailable = await this.bookingRepository.checkAvailability(
      dto.venueId,
      dateRange.startDate,
      dateRange.endDate,
    );
    if (!isAvailable) {
      throw new BusinessRuleException('Venue is already booked for the selected dates');
    }

    const bookingId = crypto.randomUUID();
    const booking = Booking.create(bookingId, {
      userId: dto.userId,
      venueId: dto.venueId,
      dateRange,
      guestsCount: dto.guestsCount,
      totalAmount: 0,
      status: BookingStatus.BOOKED,
      paymentStatus: PaymentStatus.PENDING,
    });

    booking.calculateTotalAmount(venue.pricePerDay);

    await this.bookingRepository.save(booking);

    await this.notificationService.trigger({
      subscriberId: dto.userId,
      payload: {
        title: 'Booking confirmed',
        message: `Your booking for ${venue.title} has been success`
      }
    })

    return {
      bookingId,
      totalAmount: booking.totalAmount,
    };
  }
}
