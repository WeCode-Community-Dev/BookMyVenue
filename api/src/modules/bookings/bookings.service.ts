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

    assertSlotAvailable({
      startAt,
      endAt,
      timezone: space.venue.timezone,
      operatingHours: space.spaceOperatingHours,
      blockedPeriods: space.spaceBlockedPeriods,
      existingBookings: overlappingBookings,
    });

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

  findAllForUser() {
    throw new NotImplementedException();
  }

  findOne(_id: string) {
    throw new NotImplementedException();
  }

  cancel(_id: string) {
    throw new NotImplementedException();
  }

  getSpaceOccupancy(_spaceId: string) {
    throw new NotImplementedException();
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
