import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Prisma, VenueModerationStatus } from '@prisma/client';
import { PrismaService } from '../../shared/prisma/prisma.service';
import { CreateVenueDto } from './dto/create-venue.dto';
import { RejectVenueDto } from './dto/reject-venue.dto';
import { UpdateVenueDto } from './dto/update-venue.dto';

@Injectable()
export class VenueService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateVenueDto, ownerId: string) {
    await this.ensureListedCategory(dto.categoryId);

    return this.prisma.venue.create({
      data: {
        name: dto.name.trim(),
        description: dto.description?.trim() || null,
        location: dto.location.trim(),
        address: dto.address?.trim() || null,
        pricePerHour: dto.pricePerHour,
        capacity: dto.capacity,
        imageUrls: dto.imageUrls?.map((url) => url.trim()) ?? [],
        ownerId,
        categoryId: dto.categoryId,
        isListed: false,
        moderationStatus: VenueModerationStatus.PENDING,
        rejectionReason: null,
      },
      include: this.venueInclude,
    });
  }

  async findPublic() {
    return this.prisma.venue.findMany({
      where: {
        isListed: true,
        moderationStatus: VenueModerationStatus.APPROVED,
        category: { isListed: true },
      },
      include: this.venueInclude,
      orderBy: { createdAt: 'desc' },
    });
  }

  async findPublicById(id: string) {
    const venue = await this.prisma.venue.findFirst({
      where: {
        id,
        isListed: true,
        moderationStatus: VenueModerationStatus.APPROVED,
        category: { isListed: true },
      },
      include: this.venueInclude,
    });

    if (!venue) {
      throw new NotFoundException('Venue not found.');
    }

    return venue;
  }

  async findOwnerVenues(ownerId: string) {
    return this.prisma.venue.findMany({
      where: { ownerId },
      include: this.venueInclude,
      orderBy: { createdAt: 'desc' },
    });
  }

  async updateOwnerVenue(id: string, ownerId: string, dto: UpdateVenueDto) {
    await this.ensureOwnedVenue(id, ownerId);

    if (dto.categoryId) {
      await this.ensureListedCategory(dto.categoryId);
    }

    const data: Prisma.VenueUpdateInput = {
      moderationStatus: VenueModerationStatus.PENDING,
      isListed: false,
      rejectionReason: null,
    };

    if (dto.name !== undefined) data.name = dto.name.trim();
    if (dto.description !== undefined) data.description = dto.description.trim() || null;
    if (dto.location !== undefined) data.location = dto.location.trim();
    if (dto.address !== undefined) data.address = dto.address.trim() || null;
    if (dto.pricePerHour !== undefined) data.pricePerHour = dto.pricePerHour;
    if (dto.capacity !== undefined) data.capacity = dto.capacity;
    if (dto.imageUrls !== undefined) {
      data.imageUrls = { set: dto.imageUrls.map((url) => url.trim()) };
    }
    if (dto.categoryId !== undefined) {
      data.category = { connect: { id: dto.categoryId } };
    }

    return this.prisma.venue.update({
      where: { id },
      data,
      include: this.venueInclude,
    });
  }

  async listOwnerVenue(id: string, ownerId: string) {
    const venue = await this.ensureOwnedVenue(id, ownerId);

    if (venue.moderationStatus !== VenueModerationStatus.APPROVED) {
      throw new BadRequestException('Only approved venues can be listed.');
    }

    return this.prisma.venue.update({
      where: { id },
      data: { isListed: true },
      include: this.venueInclude,
    });
  }

  async unlistOwnerVenue(id: string, ownerId: string) {
    await this.ensureOwnedVenue(id, ownerId);

    return this.prisma.venue.update({
      where: { id },
      data: { isListed: false },
      include: this.venueInclude,
    });
  }

  async findPendingForAdmin() {
    return this.prisma.venue.findMany({
      where: { moderationStatus: VenueModerationStatus.PENDING },
      include: this.venueInclude,
      orderBy: { createdAt: 'asc' },
    });
  }

  async findAllForAdmin() {
    return this.prisma.venue.findMany({
      include: this.venueInclude,
      orderBy: { createdAt: 'desc' },
    });
  }

  async approveVenue(id: string) {
    await this.ensureVenueExists(id);

    return this.prisma.venue.update({
      where: { id },
      data: {
        moderationStatus: VenueModerationStatus.APPROVED,
        rejectionReason: null,
      },
      include: this.venueInclude,
    });
  }

  async rejectVenue(id: string, dto: RejectVenueDto) {
    await this.ensureVenueExists(id);

    return this.prisma.venue.update({
      where: { id },
      data: {
        moderationStatus: VenueModerationStatus.REJECTED,
        rejectionReason: dto.reason.trim(),
        isListed: false,
      },
      include: this.venueInclude,
    });
  }

  private async ensureListedCategory(categoryId: string) {
    const category = await this.prisma.category.findFirst({
      where: { id: categoryId, isListed: true },
    });

    if (!category) {
      throw new BadRequestException('Selected category is not available.');
    }
  }

  private async ensureOwnedVenue(id: string, ownerId: string) {
    const venue = await this.prisma.venue.findUnique({
      where: { id },
    });

    if (!venue) {
      throw new NotFoundException('Venue not found.');
    }

    if (venue.ownerId !== ownerId) {
      throw new ForbiddenException(
        'You do not have permission to manage this venue.',
      );
    }

    return venue;
  }

  private async ensureVenueExists(id: string) {
    const venue = await this.prisma.venue.findUnique({
      where: { id },
    });

    if (!venue) {
      throw new NotFoundException('Venue not found.');
    }

    return venue;
  }

  private readonly venueInclude = {
    owner: {
      select: {
        id: true,
        name: true,
        email: true,
      },
    },
    category: {
      select: {
        id: true,
        name: true,
        slug: true,
        isListed: true,
      },
    },
  } as const;
}