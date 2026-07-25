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

  private formatBookingResponse(booking: any) {
    const capturedPayment = booking.payments && booking.payments.length > 0 ? booking.payments[0] : null;
    return {
      id: booking.id,
      userId: booking.userId,
      venueId: booking.venueId,
      slotId: booking.slotId,
      status: booking.status,
      totalPrice: booking.totalPrice,
      bookedStartTime: booking.bookedStartTime,
      bookedEndTime: booking.bookedEndTime,
      createdAt: booking.createdAt,
      expiresAt: booking.expiresAt,
      cancelledAt: booking.cancelledAt,
      cancellationReason: booking.cancellationReason,
      user: booking.user ? { id: booking.user.id, name: booking.user.name, email: booking.user.email } : null,
      venue: booking.venue ? { id: booking.venue.id, name: booking.venue.name, location: booking.venue.location, ownerId: booking.venue.ownerId } : null,
      slot: booking.slot ? { id: booking.slot.id, startTime: booking.slot.startTime, endTime: booking.slot.endTime, price: booking.slot.price, isActive: booking.slot.isActive } : null,
      payment: capturedPayment ? {
        paymentId: capturedPayment.razorpayPaymentId ?? null,
        razorpayOrderId: capturedPayment.razorpayOrderId ?? null,
        method: capturedPayment.method ?? 'ONLINE',
        status: capturedPayment.status ?? 'PAID',
      } : null,
    };
  }

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
          if (
            existingBooking.status === BookingStatus.PENDING_PAYMENT &&
            existingBooking.expiresAt &&
            existingBooking.expiresAt < new Date()
          ) {
            await tx.booking.update({
              where: { id: existingBooking.id },
              data: { status: BookingStatus.EXPIRED },
            });
          } else {
            throw new BadRequestException('This slot has already been booked.');
          }
        }

        const holdMinutes = Number(process.env.BOOKING_HOLD_MINUTES ?? 10);

        const calculatedTotalPrice = slot.price;

        const booking = await tx.booking.create({
          data: {
            userId,
            venueId: slot.venueId,
            slotId: slot.id,
            status: BookingStatus.PENDING_PAYMENT,
            totalPrice: calculatedTotalPrice,
            bookedStartTime: slot.startTime,
            bookedEndTime: slot.endTime,
            expiresAt: new Date(Date.now() + holdMinutes * 60 * 1000),
          },
          include: this.bookingInclude,
        });

        return this.formatBookingResponse(booking);
      },
      {
        isolationLevel: Prisma.TransactionIsolationLevel.Serializable,
      },
    );
  }

  async findMyBookings(userId: string) {
    const bookings = await this.prisma.booking.findMany({
      where: { userId },
      include: this.bookingInclude,
      orderBy: { createdAt: 'desc' },
    });

    return bookings.map((b) => this.formatBookingResponse(b));
  }

  async findMyBookingById(id: string, userId: string) {
    const booking = await this.prisma.booking.findFirst({
      where: { id, userId },
      include: this.bookingInclude,
    });

    if (!booking) {
      throw new NotFoundException('Booking not found.');
    }

    return this.formatBookingResponse(booking);
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

    const updatedBooking = await this.prisma.booking.update({
      where: { id: booking.id },
      data: {
        status: BookingStatus.CANCELLED,
        cancelledAt: new Date(),
        cancellationReason: 'Cancelled by user',
      },
      include: this.bookingInclude,
    });

    return this.formatBookingResponse(updatedBooking);
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

    const bookings = await this.prisma.booking.findMany({
      where: { venueId },
      include: this.bookingInclude,
      orderBy: { createdAt: 'desc' },
    });

    return bookings.map((b) => this.formatBookingResponse(b));
  }

  async getOwnerOverview(ownerId: string) {
    const bookings = await this.prisma.booking.findMany({
      where: {
        venue: { ownerId },
      },
      include: this.bookingInclude,
      orderBy: { bookedStartTime: 'desc' },
    });

    const formattedBookings = bookings.map((b) => this.formatBookingResponse(b));
    const confirmedBookings = formattedBookings.filter((b) => b.status === BookingStatus.CONFIRMED);
    const totalEarnings = confirmedBookings.reduce((sum, b) => sum + b.totalPrice, 0);

    const now = new Date();

    const upcomingBookings = confirmedBookings.filter((b) => new Date(b.bookedEndTime) > now);

    const completedBookings = confirmedBookings.filter((b) => new Date(b.bookedEndTime) <= now);

    return {
      totalEarnings,
      totalBookingsCount: confirmedBookings.length,
      upcomingBookings,
      completedBookings,
      allBookings: formattedBookings,
    };
  }

  async findAllForAdmin() {
    const bookings = await this.prisma.booking.findMany({
      include: this.bookingInclude,
      orderBy: { createdAt: 'desc' },
    });

    return bookings.map((b) => this.formatBookingResponse(b));
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
    payments: {
      where: {
        status: 'CAPTURED',
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: 1,
    },
  } as const;
}