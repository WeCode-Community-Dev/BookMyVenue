import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
  ConflictException,
} from '@nestjs/common';
import {
  BookingStatus,
  PaymentStatus,
  Venue,
  VenueStatus,
} from '@prisma/client';

import { PrismaService } from '../prisma/prisma.service';
import { CreateBookingDto } from './booking.dto/create.dto';
@Injectable()
export class BookingService {         
  constructor(private readonly prisma: PrismaService) {}

  async getMyBookings(userId: string) {
    return this.prisma.booking.findMany({
      where: {
        userId,
      },

      include: {
        venue: {
          include: {
            images: {
              take: 1,
            },
          },
        },

        payment: true,
      },

      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async getBookingDetails(bookingId: string, userId: string) {
    const booking = await this.prisma.booking.findUnique({
      where: {
        id: bookingId,
      },

      include: {
        venue: {
          include: {
            images: true,
            owner: {
              include: {
                profile: true,
              },
            },
          },
        },

        payment: true,
      },
    });

    if (!booking) {
      throw new NotFoundException('Booking not found.');
    }

    if (booking.userId !== userId) {
      throw new ForbiddenException('You are not allowed to view this booking.');
    }

    return booking;
  }
  //----------------------------Helper function to check if the booking is valid-------------------------------------

  private async findVenue(
  venueId: string,
): Promise<Venue> {
  const venue =
    await this.prisma.venue.findUnique({
      where: {
        id: venueId,
      },
    });

  if (!venue) {
    throw new NotFoundException(
      'Venue not found.',
    );
  }

  return venue;
}

private validateVenue(
  venue: Venue,
): void {
  if (
    venue.status !== VenueStatus.APPROVED
  ) {
    throw new BadRequestException(
      'This venue is not available for booking.',
    );
  }

  if (!venue.price) {
    throw new BadRequestException(
      'Venue price has not been configured.',
    );
  }

  if (!venue.capacity) {
    throw new BadRequestException(
      'Venue capacity has not been configured.',
    );
  }
}

private validateBookingTime(
  createBookingDto: CreateBookingDto,
): {
  eventStart: Date;
  eventEnd: Date;
} {
  const eventStart = new Date(
    createBookingDto.eventStart,
  );

  const eventEnd = new Date(
    createBookingDto.eventEnd,
  );

  const now = new Date();

  if (eventStart >= eventEnd) {
    throw new BadRequestException(
      'Event end time must be after event start time.',
    );
  }

  if (eventStart <= now) {
    throw new BadRequestException(
      'Booking cannot be created for a past date or time.',
    );
  }

  return {
    eventStart,
    eventEnd,
  };
}
private validateGuestCount(
  guestCount: number,
  venueCapacity: number | null,
): void {
  if (!venueCapacity) {
    throw new BadRequestException(
      'Venue capacity has not been configured.',
    );
  }

  if (guestCount > venueCapacity) {
    throw new BadRequestException(
      `Guest count exceeds venue capacity of ${venueCapacity}.`,
    );
  }
}

private async checkBlockedSlots(
  venueId: string,
  eventStart: Date,
  eventEnd: Date,
): Promise<void> {
  const blockedSlot =
    await this.prisma.venueBlockedSlot.findFirst({
      where: {
        venueId,

        startDate: {
          lt: eventEnd,
        },

        endDate: {
          gt: eventStart,
        },
      },
    });

  if (blockedSlot) {
    throw new BadRequestException(
      'The venue is blocked for the selected date or time.',
    );
  }
}
private async expirePendingBookings(
  venueId: string,
): Promise<void> {
  const now = new Date();

  const expiredBookings =
    await this.prisma.booking.findMany({
      where: {
        venueId,

        status:
          BookingStatus.PENDING_PAYMENT,

        paymentStatus:
          PaymentStatus.PENDING,

        paymentExpiresAt: {
          lt: now,
        },
      },

      select: {
        id: true,
      },
    });

  if (expiredBookings.length === 0) {
    return;
  }

  const bookingIds = expiredBookings.map(
    (booking) => booking.id,
  );

  await this.prisma.$transaction([
    this.prisma.booking.updateMany({
      where: {
        id: {
          in: bookingIds,
        },
      },

      data: {
        status:
          BookingStatus.PAYMENT_EXPIRED,

        paymentStatus:
          PaymentStatus.EXPIRED,
      },
    }),

    this.prisma.payment.updateMany({
      where: {
        bookingId: {
          in: bookingIds,
        },
      },

      data: {
        status: PaymentStatus.EXPIRED,
      },
    }),
  ]);
}
private async checkBookingOverlap(
  venueId: string,
  eventStart: Date,
  eventEnd: Date,
): Promise<void> {
  const existingBooking =
    await this.prisma.booking.findFirst({
      where: {
        venueId,

        status: {
          in: [
            BookingStatus.PENDING_PAYMENT,
            BookingStatus.PENDING_OWNER_APPROVAL,
            BookingStatus.CONFIRMED,
          ],
        },

        eventStart: {
          lt: eventEnd,
        },

        eventEnd: {
          gt: eventStart,
        },
      },
    });

  if (existingBooking) {
    throw new ConflictException(
      'The selected date or time is already reserved.',
    );
  }
}

private determineBookingStatus(
  bookingApprovalRequired: boolean,
): BookingStatus {
  if (bookingApprovalRequired) {
    return BookingStatus.PENDING_OWNER_APPROVAL;
  }

  return BookingStatus.PENDING_PAYMENT;
}
private calculatePaymentExpiry(
  bookingStatus: BookingStatus,
): Date | null {
  if (
    bookingStatus !==
    BookingStatus.PENDING_PAYMENT
  ) {
    return null;
  }

  const paymentExpiresAt = new Date();

  paymentExpiresAt.setMinutes(
    paymentExpiresAt.getMinutes() + 15,
  );

  return paymentExpiresAt;
}
private async createBookingRecord(
  createBookingDto: CreateBookingDto,
  userId: string,
  venueId: string,
  totalAmount: number,
  eventStart: Date,
  eventEnd: Date,
  bookingStatus: BookingStatus,
  paymentExpiresAt: Date | null,
) {
  return this.prisma.booking.create({
    data: {
      venueId,
      userId,

      eventStart,
      eventEnd,

      eventName:
        createBookingDto.eventName,

      guestCount:
        createBookingDto.guestCount,

      specialRequests:
        createBookingDto.specialRequests,

      totalAmount,

      status: bookingStatus,

      paymentStatus:
        PaymentStatus.PENDING,

      paymentExpiresAt,
    },
  });
}

private async createPaymentRecord(
  bookingId: string,
  amount: number,
): Promise<void> {
  await this.prisma.payment.create({
    data: {
      bookingId,
      amount,
      status: PaymentStatus.PENDING,
    },
  });
}
private buildResponse(booking: {
  id: string;
  status: BookingStatus;
  paymentStatus: PaymentStatus;
  totalAmount: number;
  paymentExpiresAt: Date | null;
}) {
  if (
    booking.status ===
    BookingStatus.PENDING_OWNER_APPROVAL
  ) {
    return {
      message:
        'Booking request submitted successfully. Waiting for venue owner approval.',

      bookingId: booking.id,

      bookingStatus: booking.status,

      paymentStatus: booking.paymentStatus,
    };
  }

  return {
    message:
      'Booking created successfully. Proceed to payment.',

    bookingId: booking.id,

    bookingStatus: booking.status,

    paymentStatus: booking.paymentStatus,

    amount: booking.totalAmount,

    paymentExpiresAt:
      booking.paymentExpiresAt,
  };
}
//----------------------------Helper function end-------------------------------------
// Create a new booking Service method 
   async createBooking(
  createBookingDto: CreateBookingDto,
  userId: string,
) {
  const venue = await this.findVenue(
    createBookingDto.venueId,
  );

  this.validateVenue(venue);

  const { eventStart, eventEnd } =
    this.validateBookingTime(createBookingDto);

  this.validateGuestCount(
    createBookingDto.guestCount,
    venue.capacity,
  );

    await this.checkBlockedSlots(
    venue.id,
    eventStart,
    eventEnd,
  );

  await this.expirePendingBookings(
    venue.id,
  );

  await this.checkBookingOverlap(
    venue.id,
    eventStart,
    eventEnd,
  );

  const bookingStatus =
    this.determineBookingStatus(
      venue.bookingApprovalRequired,
    );

  const paymentExpiresAt =
    this.calculatePaymentExpiry(
      bookingStatus,
    );

  const booking =
    await this.createBookingRecord(
      createBookingDto,
      userId,
      venue.id,
      venue.price!,
      eventStart,
      eventEnd,
      bookingStatus,
      paymentExpiresAt,
    );

    if (
    bookingStatus ===
    BookingStatus.PENDING_PAYMENT
  ) {
    await this.createPaymentRecord(
      booking.id,
      booking.totalAmount,
    );
  }

  return this.buildResponse(booking);
}
}
 