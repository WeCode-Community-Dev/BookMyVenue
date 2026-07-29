import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
  NotImplementedException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Decimal } from '@prisma/client/runtime/client';
import {
  BookingPolicy,
  BookingStatus,
  CapacityType,
  PricingType,
  UserRole,
} from '../../../generated/prisma/client.js';
import { PrismaService } from '../../prisma/prisma.service';
import { verifyAccessToken } from '../auth/helpers/token';
import { BookingListQueryDto } from './dto/booking-list-query.dto';
import { CreateBookingDto } from './dto/create-booking.dto';
import { assertSlotAvailable } from './helpers/availability';

export type CreateBookingResponse = {
  success: true;
  data: {
    id: string;
    bookingNumber: string;
    status: BookingStatus;
    startAt: Date;
    endAt: Date;
    amount: string;
    currency: string;
    spaceId: string;
    venueId: string;
  };
};

export type BookingListItem = {
  id: string;
  bookingNumber: string;
  startAt: Date;
  endAt: Date;
  status: BookingStatus;
  guests: number | null;
  amount: string;
  currency: string;
  pricingType: PricingType;
  customer: {
    firstName: string;
    lastName: string | null;
  };
  venue: {
    id: string;
    name: string;
  };
  space: {
    id: string;
    name: string;
  };
};

export type SpaceOccupancyPeriod = {
  id: string;
  startAt: Date;
  endAt: Date;
  reason: string | null;
};

const ACTIVE_BOOKING_STATUSES: BookingStatus[] = [
  BookingStatus.PENDING,
  BookingStatus.CONFIRMED,
];

@Injectable()
export class BookingsService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  async create(
    dto: CreateBookingDto,
    authorization: string,
  ): Promise<CreateBookingResponse> {
    try {
    const payload = verifyAccessToken(this.jwtService, authorization);
    if (payload.role !== UserRole.CUSTOMER) {
      throw new UnauthorizedException(
        'You are not authorized to create a booking',
      );
    }

    const startAt = new Date(dto.startAt);
    const endAt = new Date(dto.endAt);

    if (dto.pricingType === PricingType.CUSTOM) {
      throw new BadRequestException(
        'Custom pricing bookings are not supported yet',
      );
    }

    const space = await this.prismaService.space.findFirst({
      where: { id: dto.spaceId, isActive: true },
      include: {
        venue: { select: { id: true, timezone: true } },
        spaceOperatingHours: true,
        spaceBlockedPeriods: true,
        spacePricing: {
          where: { pricingType: dto.pricingType },
          orderBy: { createdAt: 'desc' },
          take: 1,
        },
      },
    });

    if (!space) {
      throw new NotFoundException('Space not found');
    }

    const pricing = space.spacePricing[0];
    if (!pricing) {
      throw new BadRequestException(
        `No pricing configured for pricing type ${dto.pricingType}`,
      );
    }

    const durationHours = (endAt.getTime() - startAt.getTime()) / 3_600_000;

    if (pricing.minBooking !== null && durationHours < pricing.minBooking) {
      throw new BadRequestException(
        `Booking duration must be at least ${pricing.minBooking} hour(s)`,
      );
    }

    if (pricing.maxBooking !== null && durationHours > pricing.maxBooking) {
      throw new BadRequestException(
        `Booking duration must not exceed ${pricing.maxBooking} hour(s)`,
      );
    }

    if (dto.guests !== undefined && space.capacityValue !== null) {
      const capacity = Number(space.capacityValue);
      const isGuestCapacity =
        space.capacityType === CapacityType.PEOPLE ||
        space.capacityType === CapacityType.SEATS ||
        space.capacityType === CapacityType.PLAYERS;

      if (isGuestCapacity && dto.guests > capacity) {
        throw new BadRequestException(
          `Guest count exceeds space capacity of ${capacity}`,
        );
      }
    }

    const amount = this.calculateAmount(
      dto.pricingType,
      pricing.amount,
      durationHours,
    );

    const overlappingBookings = await this.prismaService.booking.findMany({
      where: {
        spaceId: space.id,
        status: { in: ACTIVE_BOOKING_STATUSES },
        startAt: { lt: endAt },
        endAt: { gt: startAt },
      },
      select: { startAt: true, endAt: true },
    });

    // assertSlotAvailable({
    //   startAt,
    //   endAt,
    //   timezone: space.venue.timezone,
    //   operatingHours: space.spaceOperatingHours,
    //   blockedPeriods: space.spaceBlockedPeriods,
    //   existingBookings: overlappingBookings,
    // });

    const status = this.resolveInitialStatus(space.bookingPolicy);

    const booking = await this.prismaService.$transaction(async (tx) => {
      const conflict = await tx.booking.findFirst({
        where: {
          spaceId: space.id,
          status: { in: ACTIVE_BOOKING_STATUSES },
          startAt: { lt: endAt },
          endAt: { gt: startAt },
        },
        select: { id: true },
      });

      if (conflict) {
        throw new ConflictException(
          'Booking time overlaps an existing booking',
        );
      }

      return tx.booking.create({
        data: {
          userId: payload.sub,
          venueId: space.venue.id,
          spaceId: space.id,
          bookingNumber: this.generateBookingNumber(),
          startAt,
          endAt,
          guests: dto.guests,
          pricingType: dto.pricingType,
          amount,
          currency: pricing.currency,
          status,
          specialRequest: dto.specialRequest,
        },
      });
    });

    return {
      success: true,
      data: {
        id: booking.id,
        bookingNumber: booking.bookingNumber,
        status: booking.status,
        startAt: booking.startAt,
        endAt: booking.endAt,
        amount: booking.amount.toString(),
        currency: booking.currency,
        spaceId: booking.spaceId,
        venueId: booking.venueId,
        },
      };
    } catch (error) {
      throw error;
    }
  }

  async findAllForUser(
    authorization: string,
    query: BookingListQueryDto = {},
  ): Promise<BookingListItem[]> {
    const payload = verifyAccessToken(this.jwtService, authorization);
    if (payload.role !== UserRole.VENUE_OWNER) {
      throw new UnauthorizedException(
        'You are not authorized to view these bookings',
      );
    }

    const isUpcoming = query.upcoming === true;
    const sortBy = query.sortBy ?? (isUpcoming ? 'startAt' : 'startAt');
    const sortOrder = query.sortOrder ?? (isUpcoming ? 'asc' : 'desc');

    const where = {
      venue: { ownerId: payload.sub },
      ...(isUpcoming
        ? {
            startAt: { gte: new Date() },
            status: { in: ACTIVE_BOOKING_STATUSES },
          }
        : query.status
          ? { status: query.status }
          : {}),
    };

    const page = query.page ?? 1;
    const limit = isUpcoming ? (query.limit ?? 10) : query.limit;
    const skip = limit ? (page - 1) * limit : undefined;

    const bookings = await this.prismaService.booking.findMany({
      where,
      include: {
        user: { select: { firstName: true, lastName: true } },
        venue: { select: { id: true, name: true } },
        space: { select: { id: true, name: true } },
      },
      orderBy: { [sortBy]: sortOrder },
      ...(limit ? { take: limit, skip } : {}),
    });

    return bookings.map((booking) => this.toBookingListItem(booking));
  }

  private toBookingListItem(booking: {
    id: string;
    bookingNumber: string;
    startAt: Date;
    endAt: Date;
    status: BookingStatus;
    guests: number | null;
    amount: Decimal;
    currency: string;
    pricingType: PricingType;
    user: { firstName: string; lastName: string | null };
    venue: { id: string; name: string };
    space: { id: string; name: string };
  }): BookingListItem {
    return {
      id: booking.id,
      bookingNumber: booking.bookingNumber,
      startAt: booking.startAt,
      endAt: booking.endAt,
      status: booking.status,
      guests: booking.guests,
      amount: booking.amount.toString(),
      currency: booking.currency,
      pricingType: booking.pricingType,
      customer: {
        firstName: booking.user.firstName,
        lastName: booking.user.lastName,
      },
      venue: {
        id: booking.venue.id,
        name: booking.venue.name,
      },
      space: {
        id: booking.space.id,
        name: booking.space.name,
      },
    };
  }

  findOne(_id: string) {
    throw new NotImplementedException();
  }

  cancel(_id: string) {
    throw new NotImplementedException();
  }

  async getSpaceOccupancy(spaceId: string): Promise<SpaceOccupancyPeriod[]> {
    const space = await this.prismaService.space.findUnique({
      where: { id: spaceId },
      select: { id: true },
    });

    if (!space) {
      throw new NotFoundException('Space not found');
    }

    const bookings = await this.prismaService.booking.findMany({
      where: {
        spaceId,
        status: { in: ACTIVE_BOOKING_STATUSES },
      },
      select: {
        id: true,
        startAt: true,
        endAt: true,
        bookingNumber: true,
      },
      orderBy: { startAt: 'asc' },
    });

    return bookings.map((booking) => ({
      id: booking.id,
      startAt: booking.startAt,
      endAt: booking.endAt,
      reason: booking.bookingNumber,
    }));
  }

  private calculateAmount(
    pricingType: PricingType,
    rate: Decimal,
    durationHours: number,
  ): Decimal {
    if (pricingType === PricingType.HOURLY) {
      return rate.mul(durationHours);
    }

    return rate;
  }

  private resolveInitialStatus(policy: BookingPolicy): BookingStatus {
    if (policy === BookingPolicy.INSTANT_ONLY) {
      return BookingStatus.CONFIRMED;
    }

    return BookingStatus.PENDING;
  }

  private generateBookingNumber(): string {
    const suffix = Math.random().toString(36).slice(2, 8).toUpperCase();
    return `BKG-${Date.now()}-${suffix}`;
  }
}
