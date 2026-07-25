import { Injectable, NotFoundException, ForbiddenException, BadRequestException } from '@nestjs/common';
import { BlockType, BookingStatus, Prisma, Role, VenueDocumentType, VenueStatus } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateVenueDto } from './dto/create.venue.dto';
import { BlockVenueDatesDto } from './dto/block-venue-dates.dto';
import { UpdateBookingApprovalDto } from './dto/update-booking-approval.dto';

const venueDetailInclude = {
  images: true,
  documents: true,
  owner: {
    include: {
      profile: true,
    },
  },
} satisfies Prisma.VenueInclude;

@Injectable()
export class VenueService {
  constructor(private readonly prisma: PrismaService) {}

  private async ensureUserExists(userId: string) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  private async getOwnedVenueOrThrow(venueId: string, userId: string) {
    const venue = await this.prisma.venue.findUnique({
      where: { id: venueId },
      include: venueDetailInclude,
    });

    if (!venue) {
      throw new NotFoundException('Venue not found.');
    }

    if (venue.ownerId !== userId) {
      throw new ForbiddenException('You are not allowed to manage this venue.');
    }

    return venue;
  }

  private expandDateRange(startDate: Date, endDate: Date) {
    const dates: string[] = [];
    const current = new Date(startDate);
    current.setUTCHours(0, 0, 0, 0);

    const last = new Date(endDate);
    last.setUTCHours(0, 0, 0, 0);

    while (current <= last) {
      dates.push(current.toISOString().split('T')[0]);
      current.setUTCDate(current.getUTCDate() + 1);
    }

    return dates;
  }

  async createVenue(userId: string, createVenueDto: CreateVenueDto) {
    const user = await this.ensureUserExists(userId);

    const imageUrls = (createVenueDto.imageUrls || []).filter(Boolean);
    const documents = (createVenueDto.documents || []).filter((document) => document?.type && document?.documentUrl);

    const hasGovernmentId = documents.some((document) => document.type === VenueDocumentType.GOVERNMENT_ID);
    const hasPropertyDocument = documents.some((document) => document.type === VenueDocumentType.PROPERTY_DOCUMENT);

    const status = hasGovernmentId && hasPropertyDocument ? VenueStatus.PENDING : VenueStatus.PENDING_DOCUMENTS;

    if (user.role === Role.USER) {
      await this.prisma.user.update({
        where: { id: userId },
        data: { role: Role.VENUE_OWNER },
      });
    }

    return this.prisma.venue.create({
      data: {
        name: createVenueDto.name,
        description: createVenueDto.description,
        city: createVenueDto.city,
        address: createVenueDto.address,
        latitude: createVenueDto.latitude,
        longitude: createVenueDto.longitude,
        capacity: createVenueDto.capacity,
        price: createVenueDto.price,
        categories: createVenueDto.categories || [],
        amenities: createVenueDto.amenities || [],
        ownerId: userId,
        status,
        images: imageUrls.length ? { create: imageUrls.map((imageUrl) => ({ imageUrl })) } : undefined,
        documents: documents.length ? { create: documents.map((document) => ({ type: document.type, documentUrl: document.documentUrl })) } : undefined,
      },
      include: venueDetailInclude,
    });
  }

  async getAllVenues(userId: string) {
    await this.ensureUserExists(userId);

    return this.prisma.venue.findMany({
      where: { ownerId: userId },
      include: venueDetailInclude,
      orderBy: { createdAt: 'desc' },
    });
  }

  async getVenueAvailability(venueId: string) {
    const venue = await this.prisma.venue.findUnique({
      where: { id: venueId },
      select: {
        id: true,
        status: true,
        bookingApprovalRequired: true,
        blockedSlots: {
          orderBy: {
            startDate: 'asc',
          },
        },
        bookings: {
          where: {
            status: {
              in: [BookingStatus.PENDING_OWNER_APPROVAL, BookingStatus.PENDING_PAYMENT, BookingStatus.CONFIRMED],
            },
          },
          orderBy: {
            eventStart: 'asc',
          },
          select: {
            id: true,
            eventStart: true,
            eventEnd: true,
            status: true,
          },
        },
      },
    });

    if (!venue) {
      throw new NotFoundException('Venue not found.');
    }

    const unavailableDates = new Set<string>();

    venue.blockedSlots.forEach((slot) => {
      this.expandDateRange(slot.startDate, slot.endDate).forEach((date) => unavailableDates.add(date));
    });

    venue.bookings.forEach((booking) => {
      this.expandDateRange(booking.eventStart, booking.eventEnd).forEach((date) => unavailableDates.add(date));
    });

    return {
      venueId: venue.id,
      bookingApprovalRequired: venue.bookingApprovalRequired,
      unavailableDates: Array.from(unavailableDates).sort(),
      blockedSlots: venue.blockedSlots,
      reservedBookings: venue.bookings,
    };
  }

  async blockVenueDates(venueId: string, userId: string, dto: BlockVenueDatesDto) {
    await this.getOwnedVenueOrThrow(venueId, userId);

    const startDate = new Date(dto.startDate);
    const endDate = new Date(dto.endDate);

    if (startDate >= endDate) {
      throw new BadRequestException('End date must be after start date.');
    }

    const blockedSlot = await this.prisma.venueBlockedSlot.create({
      data: {
        venueId,
        blockType: dto.blockType || BlockType.FULL_DAY,
        startDate,
        endDate,
        reason: dto.reason,
      },
    });

    return {
      message: 'Venue dates blocked successfully.',
      blockedSlot,
    };
  }

  async updateBookingApproval(venueId: string, userId: string, dto: UpdateBookingApprovalDto) {
    const venue = await this.getOwnedVenueOrThrow(venueId, userId);

    const updatedVenue = await this.prisma.venue.update({
      where: { id: venue.id },
      data: {
        bookingApprovalRequired: dto.bookingApprovalRequired,
      },
      include: venueDetailInclude,
    });

    return {
      message: dto.bookingApprovalRequired
        ? 'Venue now requires owner approval before payment.'
        : 'Venue now allows direct booking payments.',
      venue: updatedVenue,
    };
  }
}

