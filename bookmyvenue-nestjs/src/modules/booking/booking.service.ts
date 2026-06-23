import { Injectable, BadRequestException, ConflictException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../shared/prisma/prisma.service';
import { CreateBookingDto } from './dto/create-booking.dto';
import { BookingStatus } from '@prisma/client';

@Injectable()
export class BookingService {
  constructor(private prisma: PrismaService) {}

  async createBooking(createBookingDto: CreateBookingDto, userId: string) {
    const { venueId, startTime, endTime } = createBookingDto;
    const start = new Date(startTime);
    const end = new Date(endTime);
    const now = new Date();

    if (start < now) {
      throw new BadRequestException('You cannot book a venue in the past!');
    }

    if (start >= end) {
      throw new BadRequestException('End time must be after start time.');
    }

    return this.prisma.$transaction(async (tx) => {
      const venue = await tx.venue.findUnique({ where: { id: venueId } });
      if (!venue) throw new NotFoundException('Venue not found.');

      if (venue.ownerId === userId) {
        throw new BadRequestException('You cannot book your own venue!');
      }

      const overlappingBooking = await tx.booking.findFirst({
        where: {
          venueId,
          status: BookingStatus.CONFIRMED,
          OR: [
            {
              startTime: { lte: start },
              endTime: { gt: start },
            },
            {
              startTime: { lt: end },
              endTime: { gte: end },
            },
            {
              startTime: { gte: start },
              endTime: { lte: end },
            },
          ],
        },
      });

      if (overlappingBooking) {
        throw new ConflictException(
          'This venue has already been booked during this slot.'
        );
      }

      const totalHours = (end.getTime() - start.getTime()) / (1000 * 60 * 60);
      const totalPrice = totalHours * venue.pricePerHour;

      return tx.booking.create({
        data: {
          venueId,
          userId,
          startTime: start,
          endTime: end,
          totalPrice,
          status: BookingStatus.CONFIRMED,
        },
      });
    });
  }

  async cancelBooking(bookingId: string, userId: string) {
    const booking = await this.prisma.booking.findUnique({
      where: { id: bookingId },
      include: { venue: true },
    });

    if (!booking) throw new NotFoundException('Booking record not found.');
    if (booking.userId !== userId) throw new BadRequestException('You do not own this booking.');
    if (booking.status === BookingStatus.CANCELLED) throw new BadRequestException('Booking is already cancelled.');

    const now = new Date();
    const eventStart = new Date(booking.startTime);
    
    const msDiff = eventStart.getTime() - now.getTime();
    const daysUntilEvent = msDiff / (1000 * 60 * 60 * 24);

    if (daysUntilEvent < booking.venue.cancellationWindowDays) {
      throw new BadRequestException(
        `Cancellation window closed. This venue requires at least ${booking.venue.cancellationWindowDays} days notice for full cancellations.`
      );
    }

    return this.prisma.booking.update({
      where: { id: bookingId },
      data: { status: BookingStatus.CANCELLED },
    });
  }

  async getUserBookings(userId: string) {
    return this.prisma.booking.findMany({
      where: { userId },
      include: { venue: true },
      orderBy: { startTime: 'asc' },
    });
  }
}