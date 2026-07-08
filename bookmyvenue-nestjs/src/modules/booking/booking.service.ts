import {
    BadRequestException,
    ForbiddenException,
    Injectable,
    NotFoundException,
} from '@nestjs/common';
import {
    BookingStatus,
    Prisma,
    VenueModerationStatus,
} from '@prisma/client';
import { PrismaService } from '../../shared/prisma/prisma.service';
import { CreateBookingDto } from './dto/create-booking.dto';

@Injectable()
export class BookingService {
    constructor(private readonly prisma: PrismaService) { }

    async create(dto: CreateBookingDto, userId: string) {
        return this.prisma.$transaction(
            async (tx) => {
                const slot = await tx.venueSlot.findUnique({
                    where: { id: dto.slotId },
                    include: {
                        venue: {
                            include: {
                                category: true,
                            },
                        },
                    },
                });

                if (!slot) {
                    throw new NotFoundException('Slot not found.');
                }

                if (!slot.isActive) {
                    throw new BadRequestException('This slot is not active.');
                }

                if (slot.startTime <= new Date()) {
                    throw new BadRequestException('This slot is no longer available.');
                }

                if (slot.venue.moderationStatus !== VenueModerationStatus.APPROVED) {
                    throw new BadRequestException('Venue is not approved for booking.');
                }

                if (!slot.venue.isListed || !slot.venue.category.isListed) {
                    throw new BadRequestException('Venue is not available for booking.');
                }

                const existingBooking = await tx.booking.findFirst({
                    where: {
                        slotId: slot.id,
                        status: {
                            in: [BookingStatus.PENDING_PAYMENT, BookingStatus.CONFIRMED],
                        },
                    },
                });

                if (existingBooking) {
                    throw new BadRequestException('This slot has already been booked.');
                }

                const holdMinutes = Number(process.env.BOOKING_HOLD_MINUTES ?? 10);

                return tx.booking.create({
                    data: {
                        userId,
                        venueId: slot.venueId,
                        slotId: slot.id,
                        status: BookingStatus.PENDING_PAYMENT,
                        totalPrice: slot.price,
                        bookedStartTime: slot.startTime,
                        bookedEndTime: slot.endTime,
                        expiresAt: new Date(Date.now() + holdMinutes * 60 * 1000),
                    },
                    include: this.bookingInclude,
                });
            },
            {
                isolationLevel: Prisma.TransactionIsolationLevel.Serializable,
            },
        );
    }

    async findMyBookings(userId: string) {
        return this.prisma.booking.findMany({
            where: { userId },
            include: this.bookingInclude,
            orderBy: { createdAt: 'desc' },
        });
    }

    async findMyBookingById(id: string, userId: string) {
        const booking = await this.prisma.booking.findFirst({
            where: { id, userId },
            include: this.bookingInclude,
        });

        if (!booking) {
            throw new NotFoundException('Booking not found.');
        }

        return booking;
    }

    async cancel(id: string, userId: string) {
        const booking = await this.prisma.booking.findFirst({
            where: { id, userId },
            include: { slot: true },
        });

        if (!booking) {
            throw new NotFoundException('Booking not found.');
        }

        const inactiveStatuses: BookingStatus[] = [
            BookingStatus.CANCELLED,
            BookingStatus.EXPIRED,
            BookingStatus.FAILED,
        ];

        if (inactiveStatuses.includes(booking.status)) {
            throw new BadRequestException('This booking is already inactive.');
        }

        if (booking.slot.startTime <= new Date()) {
            throw new BadRequestException('Started or past slots cannot be cancelled.');
        }

        return this.prisma.booking.update({
            where: { id: booking.id },
            data: {
                status: BookingStatus.CANCELLED,
                cancelledAt: new Date(),
                cancellationReason: 'Cancelled by user',
            },
            include: this.bookingInclude,
        });
    }

    async findOwnerVenueBookings(venueId: string, ownerId: string) {
        const venue = await this.prisma.venue.findUnique({
            where: { id: venueId },
        });

        if (!venue) {
            throw new NotFoundException('Venue not found.');
        }

        if (venue.ownerId !== ownerId) {
            throw new ForbiddenException(
                'You do not have permission to view these bookings.',
            );
        }

        return this.prisma.booking.findMany({
            where: { venueId },
            include: this.bookingInclude,
            orderBy: { createdAt: 'desc' },
        });
    }

    async findAllForAdmin() {
        return this.prisma.booking.findMany({
            include: this.bookingInclude,
            orderBy: { createdAt: 'desc' },
        });
    }

    private readonly bookingInclude = {
        user: {
            select: {
                id: true,
                name: true,
                email: true,
            },
        },
        venue: {
            select: {
                id: true,
                name: true,
                location: true,
                ownerId: true,
            },
        },
        slot: {
            select: {
                id: true,
                startTime: true,
                endTime: true,
                price: true,
                isActive: true,
            },
        },
    } as const;
}