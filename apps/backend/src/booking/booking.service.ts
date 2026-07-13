import {
  BadRequestException,
  ConflictException,
  Injectable,
} from '@nestjs/common';

import { CreateBookingDto } from './dto/create-booking.dto';
import { IdempotencyService } from './idempotency/idempotency.service';
import { PrismaService } from 'src/providers/prisma/prisma.service';
import { RazorpayService } from 'src/providers/razorpay/razorpay-service';
import { SlotLockService } from './slot-lock/slot-lock.service';
import { VenueStatus } from '@prisma/client';

@Injectable()
export class BookingService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly razorpayService: RazorpayService,
    private readonly idempotencyService: IdempotencyService,
    private readonly slotLockService: SlotLockService,
  ) {}

  async createBooking(
    dto: CreateBookingDto,
    userId: string,
    idempotencyKey: string,
  ) {
    const venue = await this.prismaService.venue.findUnique({
      where: {
        id: dto.venueId,
      },
    });

    if (!venue) {
      throw new BadRequestException('Venue not found.');
    }

    if (venue.status !== VenueStatus.APPROVED) {
      throw new BadRequestException('This venue is not available for booking.');
    }

    if (!venue.isActive) {
      throw new BadRequestException('This venue is currently inactive.');
    }

    const slotPricingIds = dto.slots.map((slot) => slot.slotPricingTierId);

    const pricingTiers = await this.prismaService.venueSlotPricing.findMany({
      where: {
        id: {
          in: slotPricingIds,
        },
      },
      include: {
        slotTemplate: true,
      },
    });

    if (pricingTiers.length !== dto.slots.length) {
      throw new BadRequestException(
        'One or more selected slot pricing tiers are invalid.',
      );
    }

    for (const pricingTier of pricingTiers) {
      if (pricingTier.slotTemplate.venueId !== venue.id) {
        throw new BadRequestException('Invalid slot pricing tier selected.');
      }
    }

    const eventDates = dto.slots.map((slot) => new Date(slot.eventDate));

    const blockedDates = await this.prismaService.venueBlockedDate.findMany({
      where: {
        venueId: venue.id,
      },
    });

    for (const eventDate of eventDates) {
      const isBlocked = blockedDates.some(
        (blockedDate) =>
          eventDate >= blockedDate.fromDate && eventDate <= blockedDate.toDate,
      );

      if (isBlocked) {
        throw new BadRequestException(
          'Selected date is blocked by the venue owner.',
        );
      }
    }

    if (!idempotencyKey) {
      throw new BadRequestException('Missing Idempotency-Key header.');
    }

    const cachedResponse =
      await this.idempotencyService.getCachedResponse(idempotencyKey);

    if (cachedResponse) {
      return cachedResponse;
    }

    const acquiredLocks: {
      slotPricingTierId: string;
      eventDate: string;
    }[] = [];

    for (const slot of dto.slots) {
      const acquired = await this.slotLockService.acquireLock(
        venue.id,
        slot.slotPricingTierId,
        slot.eventDate,
      );

      if (!acquired) {
        for (const lockedSlot of acquiredLocks) {
          await this.slotLockService.releaseLock(
            venue.id,
            lockedSlot.slotPricingTierId,
            lockedSlot.eventDate,
          );
        }

        throw new ConflictException(
          'One or more selected slots are temporarily locked. Please try again.',
        );
      }

      acquiredLocks.push({
        slotPricingTierId: slot.slotPricingTierId,
        eventDate: slot.eventDate,
      });
    }
  }
}
