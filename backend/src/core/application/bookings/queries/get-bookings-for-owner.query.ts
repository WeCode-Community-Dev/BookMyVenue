import { Injectable, Inject } from '@nestjs/common';
import { type IBookingRepository } from '../../../domain/bookings/repositories/booking-repository.interface';
import { Pagination } from '../../_shared/dto/pagination';

export interface BookingResponseDto {
    id: string;
    userId: string;
    venueId: string;
    startDate: Date;
    endDate: Date;
    guestsCount: number;
    totalAmount: number;
    createdAt: Date;
}

@Injectable()
export class GetBookingsByOwnerQuery {
    constructor(
        @Inject('IBookingRepository')
        private readonly bookingRepository: IBookingRepository,
    ) { }

    async execute(ownerId: string): Promise<Pagination<BookingResponseDto>> {
        const bookings = await this.bookingRepository.findByOwnerId(ownerId);

        const docs = bookings.map((b) => ({
            id: b.id,
            userId: b.userId,
            venueId: b.venueId,
            startDate: b.dateRange.startDate,
            endDate: b.dateRange.endDate,
            guestsCount: b.guestsCount,
            totalAmount: b.totalAmount,
            createdAt: b.createdAt,
            venue: {
                id: b.venue!.id,
                title: b.venue!.title,
            }
        }));

        return new Pagination(docs, docs.length, 1, docs.length,)
    }
}
