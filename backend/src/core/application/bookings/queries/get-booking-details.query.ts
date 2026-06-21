import { Injectable, Inject } from '@nestjs/common';
import { type IBookingRepository } from '../../../domain/bookings/repositories/booking-repository.interface';
import { NotFoundException } from 'src/core/domain/_shared/exception/notfound.exception';
import { UserRole } from 'src/core/domain/_shared/enum/UserRole';

export interface BookingDetailsResponseDto {
    id: string;
    startDate: Date;
    endDate: Date;
    guestsCount: number;
    totalAmount: number;
    createdAt: Date;
    user: {
        id: string
        firstName: string,
        lastName: string,
        phone: string | null | undefined,
        email: string
    }
    venue: {
        id: string
        title: string,
        address: string,
        images: string[]
    }
}

interface BookingDetailsInputDto {
    bookingId: string,
    userId: string
    role: UserRole
}

@Injectable()
export class GetBookingDetailsQuery {
    constructor(
        @Inject('IBookingRepository')
        private readonly bookingRepository: IBookingRepository,
    ) { }

    async execute({
        bookingId,
        role,
        userId
    }: BookingDetailsInputDto): Promise<BookingDetailsResponseDto> {
        const booking = await this.bookingRepository.findById(bookingId);

        if (!booking) throw new NotFoundException('invalid booking id, booking not found')

        // booking details is only accessible by the venue owner or booking 
        if (role === UserRole.USER && booking.userId !== userId) {
            throw new NotFoundException('invalid booking id')
        }

        if (role === UserRole.VENUE_OWNER && booking.venue!.ownerId !== userId) {
            throw new NotFoundException('invalid booking')
        }


        return {
            id: booking.id,
            startDate: booking.dateRange.startDate,
            endDate: booking.dateRange.endDate,
            guestsCount: booking.guestsCount,
            totalAmount: booking.totalAmount,
            createdAt: booking.createdAt,
            user: {
                id: booking.user!.id,
                firstName: booking.user!.firstName,
                lastName: booking.user!.lastName,
                email: booking.user!.email,
                phone: booking.user!.phone,
            },
            venue: {
                id: booking.venue!.id,
                title: booking.venue!.title,
                address: '',
                images: booking.venue!.images
            }
        }
    }
}
