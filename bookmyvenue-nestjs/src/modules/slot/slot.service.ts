import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { BookingStatus, VenueModerationStatus } from '@prisma/client';
import { PrismaService } from '../../shared/prisma/prisma.service';
import { CreateSlotDto } from './dto/create-slot.dto';
import { UpdateSlotDto } from './dto/update-slot.dto';
import { RepeatType } from './enums/repeat-type.enum';

@Injectable()
export class SlotService {
  constructor(private readonly prisma: PrismaService) { }

  async create(venueId: string, ownerId: string, dto: CreateSlotDto) {
    const venue = await this.ensureOwnerVenueCanManageSlots(venueId, ownerId);

    const start = new Date(dto.startTime);
    const end = new Date(dto.endTime);
    const repeatType = dto.repeatType ?? RepeatType.NONE;
    const repeatUntil = dto.repeatUntil ? new Date(dto.repeatUntil) : undefined;

    this.validateSlotTimes(start, end);

    if (repeatType !== RepeatType.NONE) {
      if (!repeatUntil) {
        throw new BadRequestException(
          'repeatUntil is required for recurring slots.',
        );
      }

      if (Number.isNaN(repeatUntil.getTime())) {
        throw new BadRequestException('Invalid repeatUntil date-time value.');
      }

      if (repeatUntil < end) {
        throw new BadRequestException(
          'repeatUntil must be after the first slot end time.',
        );
      }
    }

    const occurrences = this.generateOccurrences(
      start,
      end,
      repeatType,
      repeatUntil,
    );

    const createdSlots = [];
    const skippedSlots: Array<{
      startTime: Date;
      endTime: Date;
      reason: string;
    }> = [];

    const durationInHours = Math.max(
      1,
      (end.getTime() - start.getTime()) / (1000 * 60 * 60)
    );
    const calculatedSlotPrice = dto.price * durationInHours;

    for (const occurrence of occurrences) {
      const hasOverlap = await this.hasOverlap(
        venue.id,
        occurrence.startTime,
        occurrence.endTime,
      );

      if (hasOverlap) {
        skippedSlots.push({
          startTime: occurrence.startTime,
          endTime: occurrence.endTime,
          reason: 'Overlaps with an existing active slot.',
        });
        continue;
      }

      const slot = await this.prisma.venueSlot.create({
        data: {
          venueId: venue.id,
          startTime: occurrence.startTime,
          endTime: occurrence.endTime,
          price: calculatedSlotPrice,
          isActive: true,
        },
        include: this.slotInclude,
      });

      createdSlots.push(slot);
    }

    if (createdSlots.length === 0 && skippedSlots.length > 0) {
      throw new BadRequestException(
        `Failed to generate slots. Reason: Time block overlaps with an existing active slot.`,
      );
    }

    return {
      createdCount: createdSlots.length,
      skippedCount: skippedSlots.length,
      createdSlots,
      skippedSlots,
    };
  }

  async findPublicVenueSlots(venueId: string) {
    await this.ensurePublicVenue(venueId);
    const now = new Date();

    return this.prisma.venueSlot.findMany({
      where: {
        venueId,
        isActive: true,
        endTime: {
          gt: now,
        },
      },
      include: {
        bookings: {
          where: {
            OR: [
              { status: BookingStatus.CONFIRMED },
              {
                AND: [
                  { status: BookingStatus.PENDING_PAYMENT },
                  { expiresAt: { gte: now } }
                ]
              }
            ]
          },
          select: {
            status: true
          }
        }
      },
      orderBy: {
        startTime: 'asc',
      },
    });
  }

  async findOwnerVenueSlots(venueId: string, ownerId: string) {
    await this.ensureOwnerVenueExists(venueId, ownerId);

    return this.prisma.venueSlot.findMany({
      where: { venueId },
      include: this.slotInclude,
      orderBy: {
        startTime: 'asc',
      },
    });
  }

  async update(slotId: string, ownerId: string, dto: UpdateSlotDto) {
    const slot = await this.prisma.venueSlot.findUnique({
      where: { id: slotId },
      include: {
        venue: true,
        bookings: {
          where: {
            status: {
              in: [BookingStatus.PENDING_PAYMENT, BookingStatus.CONFIRMED],
            },
          },
          select: { id: true },
        },
      },
    });

    if (!slot) {
      throw new NotFoundException('Slot not found.');
    }

    if (slot.bookings.length > 0) {
      throw new BadRequestException(
        'Booked slots cannot be edited.',
      );
    }

    if (slot.venue.ownerId !== ownerId) {
      throw new ForbiddenException(
        'You do not have permission to manage this slot.',
      );
    }

    if (slot.venue.moderationStatus !== VenueModerationStatus.APPROVED) {
      throw new BadRequestException(
        'Slots can only be updated for approved venues.',
      );
    }

    const nextStart = dto.startTime ? new Date(dto.startTime) : slot.startTime;
    const nextEnd = dto.endTime ? new Date(dto.endTime) : slot.endTime;

    this.validateSlotTimes(nextStart, nextEnd);
    await this.ensureNoOverlap(slot.venueId, nextStart, nextEnd, slot.id);

    const durationInHours = Math.max(
      1,
      (nextEnd.getTime() - nextStart.getTime()) / (1000 * 60 * 60)
    );
    const updatedPrice = dto.price !== undefined ? dto.price * durationInHours : slot.price;

    return this.prisma.venueSlot.update({
      where: { id: slot.id },
      data: {
        startTime: nextStart,
        endTime: nextEnd,
        price: updatedPrice,
      },
      include: this.slotInclude,
    });
  }

  async deactivate(slotId: string, ownerId: string) {
    const slot = await this.prisma.venueSlot.findUnique({
      where: { id: slotId },
      include: {
        venue: true,
        bookings: {
          where: {
            status: {
              in: [BookingStatus.PENDING_PAYMENT, BookingStatus.CONFIRMED],
            },
          },
          select: { id: true },
        },
      },
    });

    if (!slot) {
      throw new NotFoundException('Slot not found.');
    }

    if (slot.bookings.length > 0) {
      throw new BadRequestException(
        'Booked slots cannot be deactivated.',
      );
    }

    if (slot.venue.ownerId !== ownerId) {
      throw new ForbiddenException(
        'You do not have permission to manage this slot.',
      );
    }

    return this.prisma.venueSlot.update({
      where: { id: slot.id },
      data: {
        isActive: false,
      },
      include: this.slotInclude,
    });
  }

  private generateOccurrences(
    start: Date,
    end: Date,
    repeatType: RepeatType,
    repeatUntil?: Date,
  ) {
    if (!repeatType || repeatType === RepeatType.NONE) {
      return [{ startTime: start, endTime: end }];
    }

    if (!repeatUntil) {
      throw new BadRequestException(
        'repeatUntil is required for recurring slots.',
      );
    }

    const occurrences: Array<{ startTime: Date; endTime: Date }> = [];
    let currentStart = new Date(start);
    let currentEnd = new Date(end);

    while (currentEnd <= repeatUntil) {
      occurrences.push({
        startTime: new Date(currentStart),
        endTime: new Date(currentEnd),
      });

      if (repeatType === RepeatType.DAILY) {
        currentStart.setDate(currentStart.getDate() + 1);
        currentEnd.setDate(currentEnd.getDate() + 1);
      } else if (repeatType === RepeatType.WEEKLY) {
        currentStart.setDate(currentStart.getDate() + 7);
        currentEnd.setDate(currentEnd.getDate() + 7);
      }
    }

    return occurrences;
  }

  private validateSlotTimes(start: Date, end: Date) {
    const now = new Date();

    if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) {
      throw new BadRequestException('Invalid slot date-time value.');
    }

    if (start <= now) {
      throw new BadRequestException('Slot start time must be in the future.');
    }

    if (end <= start) {
      throw new BadRequestException(
        'Slot end time must be after start time.',
      );
    }
  }

  private async hasOverlap(venueId: string, start: Date, end: Date) {
    const overlappingSlot = await this.prisma.venueSlot.findFirst({
      where: {
        venueId,
        isActive: true,
        startTime: {
          lt: end,
        },
        endTime: {
          gt: start,
        },
      },
    });

    return Boolean(overlappingSlot);
  }

  private async ensureNoOverlap(
    venueId: string,
    start: Date,
    end: Date,
    excludeSlotId?: string,
  ) {
    const overlappingSlot = await this.prisma.venueSlot.findFirst({
      where: {
        venueId,
        isActive: true,
        id: excludeSlotId
          ? {
            not: excludeSlotId,
          }
          : undefined,
        startTime: {
          lt: end,
        },
        endTime: {
          gt: start,
        },
      },
    });

    if (overlappingSlot) {
      throw new BadRequestException(
        'This slot overlaps with an existing active slot for the venue.',
      );
    }
  }

  private async ensurePublicVenue(venueId: string) {
    const venue = await this.prisma.venue.findFirst({
      where: {
        id: venueId,
        isListed: true,
        moderationStatus: VenueModerationStatus.APPROVED,
        category: {
          isListed: true,
        },
      },
    });

    if (!venue) {
      throw new NotFoundException('Venue not found.');
    }

    return venue;
  }

  private async ensureOwnerVenueExists(venueId: string, ownerId: string) {
    const venue = await this.prisma.venue.findUnique({
      where: { id: venueId },
    });

    if (!venue) {
      throw new NotFoundException('Venue not found.');
    }

    if (venue.ownerId !== ownerId) {
      throw new ForbiddenException(
        'You do not have permission to manage slots for this venue.',
      );
    }

    return venue;
  }

  private async ensureOwnerVenueCanManageSlots(
    venueId: string,
    ownerId: string,
  ) {
    const venue = await this.ensureOwnerVenueExists(venueId, ownerId);

    if (venue.moderationStatus !== VenueModerationStatus.APPROVED) {
      throw new BadRequestException(
        'Slots can only be added to approved venues.',
      );
    }

    return venue;
  }

  private readonly slotInclude = {
    venue: {
      select: {
        id: true,
        name: true,
        ownerId: true,
        isListed: true,
        moderationStatus: true,
      },
    },
  } as const;
}