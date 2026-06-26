import { Injectable, Inject } from '@nestjs/common';
import { type IBookingRepository } from '../../../domain/bookings/repositories/booking-repository.interface';
import type { IVenueRepository } from 'src/core/domain/venues/repositories/venue-repository.interface';
import { NotFoundException } from 'src/core/domain/_shared/exception/notfound.exception';
import { BusinessRuleException } from 'src/core/domain/_shared/exception/business-rule.exception';
import type { BookingStatus } from 'src/core/domain/bookings/enum/booking-status.enum';
import type { PaymentStatus } from 'src/core/domain/_shared/enum/PaymentStatus.enum';

export interface BookingResponseDto {
    id: string;
    userId: string;
    venueId: string;
    startDate: Date;
    endDate: Date;
    guestsCount: number;
    totalAmount: number;
    status: BookingStatus
    paymentStatus: PaymentStatus
    createdAt: Date;
}

@Injectable()
export class GetBookingsByVenueQuery {
    constructor(
        @Inject('IBookingRepository')
        private readonly bookingRepository: IBookingRepository,
        @Inject('IVenueRepository')
        private readonly venueRepository: IVenueRepository,
    ) { }

    async execute(venueId: string, ownerId: string): Promise<BookingResponseDto[]> {

        const venue = await this.venueRepository.findById(venueId)

        if (!venue) throw new NotFoundException('Venue not found')
        if (venue.ownerId !== ownerId) throw new BusinessRuleException('invalid ownership')

        const bookings = await this.bookingRepository.findByVenueId(venueId);

        return bookings.map((b) => ({
            id: b.id,
            userId: b.userId,
            venueId: b.venueId,
            startDate: b.dateRange.startDate,
            endDate: b.dateRange.endDate,
            guestsCount: b.guestsCount,
            totalAmount: b.totalAmount,
            status: b.status,
            paymentStatus: b.paymentStatus,
            createdAt: b.createdAt,
        }));
    }
}
