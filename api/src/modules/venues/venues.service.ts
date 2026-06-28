import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { Prisma, UserRole } from '../../../generated/prisma/client.js';
import { CreateSpaceDto } from './dto/create-space.dto';
import { CreateVenueDto } from './dto/create-venue.dto';
import { UpdateSpaceDto } from './dto/update-space.dto';
import { UpdateVenueDto } from './dto/update-venue.dto';
import { JwtService } from '@nestjs/jwt';
import { verifyAccessToken } from '../auth/helpers/token';
import { CreateImagesDto } from './dto/create-images.dto';
import { CapacityType } from '../../../generated/prisma/client';
import { CreateSpaceOperatingHoursDto } from './dto/create-space-op-hours.dto';
import { CreateSpaceBlockedPeriodDto } from './dto/create-space-block-period.dto';
import { UpdateSpaceBlockedPeriodDto } from './dto/update-space-block-period.dto';

const venueDetailsInclude = {
  amenities: {
    include: {
      amenity: true,
    },
  },
  images: {
    include: {
      image: true,
    },
  },
  spaces: {
    include: {
      category: true,
      amenities: {
        include: {
          amenity: true,
        },
      },
      images: {
        include: {
          image: true,
        },
      },
    },
  },
} satisfies Prisma.VenueInclude;

const spaceDetailsInclude = {
  category: true,
  amenities: {
    include: {
      amenity: true,
    },
  },
  images: {
    include: {
      image: true,
    },
  },
  venue: true,
} satisfies Prisma.SpaceInclude;

type VenueDetails = Prisma.VenueGetPayload<{
  include: typeof venueDetailsInclude;
}>;

type SpaceDetails = Prisma.SpaceGetPayload<{
  include: typeof spaceDetailsInclude;
}>;

type AmenityDetails = Prisma.AmenityGetPayload<{
  select: {
    id: true;
    name: true;
    description: true;
  };
}>;

type ImageDetails = Prisma.ImageGetPayload<{
  select: {
    id: true;
  };
}>;

type OwnedVenueDetails = {
  name: string
  id: string
  address: string
  images:
  {
    image:
    {
      id: string
      url: string
      altText: string | null;
    };
  }[];
};

type SpaceCategoryDetails = {
  id: string;
  name: string;
  description: string | null;
};

type SpaceOperatingHourDetails = {
  weekday: number;
  openTime: string;
  closeTime: string;
  isClosed: boolean;
};

type SpaceBlockedPeriodDetails = {
  id: string;
  startAt: Date;
  endAt: Date;
  reason: string | null;
};

@Injectable()
export class VenuesService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly jwtService: JwtService,
  ) { }


  async createVenue(dto: CreateVenueDto, authorization: string): Promise<VenueDetails> {
    const payload = verifyAccessToken(this.jwtService, authorization);
    if (payload.role !== UserRole.VENUE_OWNER) {
      throw new UnauthorizedException('You are not authorized to create a venue');
    }
    const ownerId = payload.sub;
    const venueAmenityIds = this.normalizeIds(dto.venueAmenityIds);
    const venueImageIds = this.normalizeIds(dto.venueImageIds);

    this.assertNoDuplicateIds(venueAmenityIds, 'Venue amenity ids');
    this.assertNoDuplicateIds(venueImageIds, 'Venue image ids');

    return this.prismaService.$transaction(async (tx) => {
      await this.ensureAmenitiesExist(tx, venueAmenityIds);
      await this.ensureImagesExist(tx, venueImageIds);

      const venue = await tx.venue.create({
        data: {
          ownerId: ownerId,
          name: dto.name,
          description: dto.description,
          address: dto.address,
          city: dto.city,
          state: dto.state,
          country: dto.country,
          postalCode: dto.postalCode,
          latitude: dto.latitude,
          longitude: dto.longitude,
          timezone: dto.timezone,
        },
      });

      if (venueAmenityIds.length > 0) {
        await tx.venueAmenity.createMany({
          data: venueAmenityIds.map((amenityId) => ({
            venueId: venue.id,
            amenityId,
          })),
        });
      }

      if (venueImageIds.length > 0) {
        await tx.venueImage.createMany({
          data: venueImageIds.map((imageId, index) => ({
            venueId: venue.id,
            imageId,
            sortOrder: index,
            isCover: index === 0,
          })),
        });
      }

      const createdVenue = await tx.venue.findUnique({
        where: { id: venue.id },
        include: venueDetailsInclude,
      });

      if (!createdVenue) {
        throw new NotFoundException('Venue not found');
      }

      return createdVenue;
    });
  }

  async getOwnedVenues(authorization: string): Promise<OwnedVenueDetails[]> {
    try {
      const payload = verifyAccessToken(this.jwtService, authorization);
      if (payload.role !== UserRole.VENUE_OWNER) {
        throw new UnauthorizedException('You are not authorized to get owned venues');
      }
      const ownerId = payload.sub;
      return this.prismaService.venue.findMany({
        where: { ownerId },
        select: {
          id: true,
          name: true,
          address: true,
          images: {
            take: 1,
            select: {
              image: {
                select: {
                  id: true,
                  url: true,
                  altText: true,
                }
              }
            }
          }
        }
      });
    } catch (error) {
      throw new InternalServerErrorException('Failed to get owned venues');
    }
  }

  async findAllVenues(): Promise<VenueDetails[]> {
    return this.prismaService.venue.findMany({
      orderBy: {
        createdAt: 'desc',
      },
      include: venueDetailsInclude,
    });
  }

  async findOneVenue(id: string): Promise<VenueDetails> {
    const venue = await this.prismaService.venue.findUnique({
      where: { id },
      include: venueDetailsInclude,
    });

    if (!venue) {
      throw new NotFoundException('Venue not found');
    }

    return venue;
  }

  async updateVenue(id: string, dto: UpdateVenueDto): Promise<VenueDetails> {
    const venueAmenityIds = dto.venueAmenityIds
      ? this.normalizeIds(dto.venueAmenityIds)
      : undefined;
    const venueImageIds = dto.venueImageIds
      ? this.normalizeIds(dto.venueImageIds)
      : undefined;

    if (venueAmenityIds) {
      this.assertNoDuplicateIds(venueAmenityIds, 'Venue amenity ids');
    }
    if (venueImageIds) {
      this.assertNoDuplicateIds(venueImageIds, 'Venue image ids');
    }

    return this.prismaService.$transaction(async (tx) => {
      const existingVenue = await tx.venue.findUnique({
        where: { id },
        select: { id: true },
      });

      if (!existingVenue) {
        throw new NotFoundException('Venue not found');
      }

      if (venueAmenityIds) {
        await this.ensureAmenitiesExist(tx, venueAmenityIds);
      }
      if (venueImageIds) {
        await this.ensureImagesExist(tx, venueImageIds);
      }

      const data: Prisma.VenueUpdateInput = {};

      if (dto.ownerId !== undefined) data.ownerId = dto.ownerId;
      if (dto.name !== undefined) data.name = dto.name;
      if (dto.description !== undefined) data.description = dto.description;
      if (dto.address !== undefined) data.address = dto.address;
      if (dto.city !== undefined) data.city = dto.city;
      if (dto.state !== undefined) data.state = dto.state;
      if (dto.country !== undefined) data.country = dto.country;
      if (dto.postalCode !== undefined) data.postalCode = dto.postalCode;
      if (dto.latitude !== undefined) data.latitude = dto.latitude;
      if (dto.longitude !== undefined) data.longitude = dto.longitude;
      if (dto.timezone !== undefined) data.timezone = dto.timezone;

      if (Object.keys(data).length > 0) {
        await tx.venue.update({
          where: { id },
          data,
        });
      }

      if (venueAmenityIds) {
        await tx.venueAmenity.deleteMany({
          where: { venueId: id },
        });

        if (venueAmenityIds.length > 0) {
          await tx.venueAmenity.createMany({
            data: venueAmenityIds.map((amenityId) => ({
              venueId: id,
              amenityId,
            })),
          });
        }
      }

      if (venueImageIds) {
        await tx.venueImage.deleteMany({
          where: { venueId: id },
        });

        if (venueImageIds.length > 0) {
          await tx.venueImage.createMany({
            data: venueImageIds.map((imageId, index) => ({
              venueId: id,
              imageId,
              sortOrder: index,
              isCover: index === 0,
            })),
          });
        }
      }

      const updatedVenue = await tx.venue.findUnique({
        where: { id },
        include: venueDetailsInclude,
      });

      if (!updatedVenue) {
        throw new NotFoundException('Venue not found');
      }

      return updatedVenue;
    });
  }

  async removeVenue(id: string): Promise<void> {
    const venue = await this.prismaService.venue.findUnique({
      where: { id },
      select: { id: true },
    });

    if (!venue) {
      throw new NotFoundException('Venue not found');
    }

    await this.prismaService.venue.delete({
      where: { id },
    });
  }

  async createSpace(venueId: string, dto: CreateSpaceDto): Promise<SpaceDetails> {
    const spaceAmenityIds = this.normalizeIds(dto.spaceAmenityIds);
    const spaceImageIds = this.normalizeIds(dto.spaceImageIds);

    this.assertNoDuplicateIds(spaceAmenityIds, 'Space amenity ids');
    this.assertNoDuplicateIds(spaceImageIds, 'Space image ids');

    return this.prismaService.$transaction(async (tx) => {
      await this.ensureVenueExists(tx, venueId);
      await this.ensureCategoryExists(tx, dto.categoryId);
      await this.ensureAmenitiesExist(tx, spaceAmenityIds);
      await this.ensureImagesExist(tx, spaceImageIds);

      const space = await tx.space.create({
        data: {
          venueId,
          categoryId: dto.categoryId,
          name: dto.name,
          description: dto.description,
          capacityValue: dto.capacityValue,
          capacityType: dto.capacityType,
          isActive: dto.isActive ?? true,
          rules: dto.rules,
        },
      });

      if (spaceAmenityIds.length > 0) {
        await tx.spaceAmenity.createMany({
          data: spaceAmenityIds.map((amenityId) => ({
            spaceId: space.id,
            amenityId,
          })),
        });
      }

      if (spaceImageIds.length > 0) {
        await tx.spaceImage.createMany({
          data: spaceImageIds.map((imageId, index) => ({
            spaceId: space.id,
            imageId,
            sortOrder: index,
            isCover: index === 0,
          })),
        });
      }

      const createdSpace = await tx.space.findUnique({
        where: { id: space.id },
        include: spaceDetailsInclude,
      });

      if (!createdSpace) {
        throw new NotFoundException('Space not found');
      }

      return createdSpace;
    });
  }

  async findSpacesByVenue(venueId: string): Promise<SpaceDetails[]> {
    await this.ensureVenueExists(this.prismaService, venueId);

    return this.prismaService.space.findMany({
      where: { venueId },
      orderBy: {
        createdAt: 'desc',
      },
      include: spaceDetailsInclude,
    });
  }

  async findOneSpace(id: string): Promise<SpaceDetails> {
    const space = await this.prismaService.space.findUnique({
      where: { id },
      include: spaceDetailsInclude,
    });

    if (!space) {
      throw new NotFoundException('Space not found');
    }

    return space;
  }

  async updateSpace(id: string, dto: UpdateSpaceDto): Promise<SpaceDetails> {
    const spaceAmenityIds = dto.spaceAmenityIds
      ? this.normalizeIds(dto.spaceAmenityIds)
      : undefined;
    const spaceImageIds = dto.spaceImageIds
      ? this.normalizeIds(dto.spaceImageIds)
      : undefined;

    if (spaceAmenityIds) {
      this.assertNoDuplicateIds(spaceAmenityIds, 'Space amenity ids');
    }
    if (spaceImageIds) {
      this.assertNoDuplicateIds(spaceImageIds, 'Space image ids');
    }

    return this.prismaService.$transaction(async (tx) => {
      const existingSpace = await tx.space.findUnique({
        where: { id },
        select: { id: true },
      });

      if (!existingSpace) {
        throw new NotFoundException('Space not found');
      }

      if (dto.categoryId !== undefined) {
        await this.ensureCategoryExists(tx, dto.categoryId);
      }
      if (spaceAmenityIds) {
        await this.ensureAmenitiesExist(tx, spaceAmenityIds);
      }
      if (spaceImageIds) {
        await this.ensureImagesExist(tx, spaceImageIds);
      }

      const data: Prisma.SpaceUpdateInput = {};

      if (dto.categoryId !== undefined) {
        data.category = {
          connect: {
            id: dto.categoryId,
          },
        };
      }
      if (dto.name !== undefined) data.name = dto.name;
      if (dto.description !== undefined) data.description = dto.description;
      if (dto.capacityValue !== undefined) data.capacityValue = dto.capacityValue;
      if (dto.capacityType !== undefined) data.capacityType = dto.capacityType;
      if (dto.isActive !== undefined) data.isActive = dto.isActive;
      if (dto.rules !== undefined) data.rules = dto.rules;

      if (Object.keys(data).length > 0) {
        await tx.space.update({
          where: { id },
          data,
        });
      }

      if (spaceAmenityIds) {
        await tx.spaceAmenity.deleteMany({
          where: { spaceId: id },
        });

        if (spaceAmenityIds.length > 0) {
          await tx.spaceAmenity.createMany({
            data: spaceAmenityIds.map((amenityId) => ({
              spaceId: id,
              amenityId,
            })),
          });
        }
      }

      if (spaceImageIds) {
        await tx.spaceImage.deleteMany({
          where: { spaceId: id },
        });

        if (spaceImageIds.length > 0) {
          await tx.spaceImage.createMany({
            data: spaceImageIds.map((imageId, index) => ({
              spaceId: id,
              imageId,
              sortOrder: index,
              isCover: index === 0,
            })),
          });
        }
      }

      const updatedSpace = await tx.space.findUnique({
        where: { id },
        include: spaceDetailsInclude,
      });

      if (!updatedSpace) {
        throw new NotFoundException('Space not found');
      }

      return updatedSpace;
    });
  }

  async removeSpace(id: string): Promise<void> {
    const space = await this.prismaService.space.findUnique({
      where: { id },
      select: { id: true },
    });

    if (!space) {
      throw new NotFoundException('Space not found');
    }

    await this.prismaService.space.delete({
      where: { id },
    });
  }

  async findAllAmenities(): Promise<AmenityDetails[]> {
    return this.prismaService.amenity.findMany({
      orderBy: {
        createdAt: 'desc',
      },
      select: {
        id: true,
        name: true,
        description: true,
      },
    });
  }

  async createImages(dto: CreateImagesDto): Promise<ImageDetails[]> {
    try {

      if (dto.images.length === 0) {
        return [];
      }

      const images = await this.prismaService.$transaction(
        dto.images.map((image) =>
          this.prismaService.image.create({
            data: {
              url: image.url,
              altText: image.altText,
              width: image.width,
              height: image.height,
            },
            select: {
              id: true,
            },
          }),
        ),
      );
      return images;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async getAllSpaceCategories(): Promise<SpaceCategoryDetails[]> {
    try {
      return this.prismaService.spaceCategory.findMany({
        orderBy: {
          createdAt: 'desc',
        },
        select: { id: true, name: true, description: true },
      });
    } catch (error) {
      throw new InternalServerErrorException('Failed to get all space categories');
    }
  }

  async getCapacityTypes(): Promise<CapacityType[]> {
    try {
      return Object.values(CapacityType);
    } catch (error) {
      throw new InternalServerErrorException('Failed to get capacity types');
    }
  }

  async createSpaceOperatingHours(spaceId: string, dto: CreateSpaceOperatingHoursDto) {
    try {
      return await Promise.all(
        dto.hours.map((hour) =>
          this.prismaService.spaceOperatingHour.upsert({
            where: {
              spaceId_weekday: {
                spaceId,
                weekday: hour.weekday,
              },
            },
            update: {
              openTime: hour.openTime,
              closeTime: hour.closeTime,
              isClosed: hour.isClosed,
            },
            create: {
              spaceId,
              weekday: hour.weekday,
              openTime: hour.openTime,
              closeTime: hour.closeTime,
              isClosed: hour.isClosed,
            },
          }),
        ),
      );
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async getSpaceOperatingHours(spaceId: string): Promise<SpaceOperatingHourDetails[]> {
    return this.prismaService.spaceOperatingHour.findMany({
      where: { spaceId },
      orderBy:{
        weekday: 'asc',
      },
      select: {
        weekday: true,
        openTime: true,
        closeTime: true,
        isClosed: true,
      },
    });
  }


  async createSpaceBlockedPeriods(spaceId: string, dto: CreateSpaceBlockedPeriodDto) {
    try {
      return this.prismaService.spaceBlockedPeriod.create({
        data: {
          spaceId,
          startAt: dto.startAt,
          endAt: dto.endAt,
          reason: dto.reason,
        }
      });
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async updateSpaceBlockedPeriods(spaceId: string, id: string, dto: UpdateSpaceBlockedPeriodDto) {
    try {
      return this.prismaService.spaceBlockedPeriod.update({
        where: { spaceId:spaceId, id:id },
        data: {
          startAt: dto.startAt,
          endAt: dto.endAt,
          reason: dto.reason,
        }
      });
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async getSpaceBlockedPeriods(spaceId: string): Promise<SpaceBlockedPeriodDetails[]> {
    try {
      return this.prismaService.spaceBlockedPeriod.findMany({
        where: { spaceId },
        orderBy: {
          startAt: 'asc',
        },
      select: {
        id: true,
        startAt: true,
        endAt: true,
        reason: true,
      },
    });
  } catch (error) {
    console.error(error);
    throw error;
  }
  }

  async removeSpaceBlockedPeriod(spaceId: string, id: string) {
    try {
    return await this.prismaService.spaceBlockedPeriod.delete({
      where: { spaceId:spaceId, id:id },
    select: { id: true }});
  } catch (error) {
    console.error(error);
    throw error;
  }
  }





  private normalizeIds(ids: readonly string[]): string[] {
    return [...new Set(ids)];
  }

  private assertNoDuplicateIds(ids: readonly string[], label: string): void {
    if (new Set(ids).size !== ids.length) {
      throw new ConflictException(`${label} must be unique`);
    }
  }

  private async ensureVenueExists(
    client: Prisma.TransactionClient | PrismaService,
    venueId: string,
  ): Promise<void> {
    const venue = await client.venue.findUnique({
      where: { id: venueId },
      select: { id: true },
    });

    if (!venue) {
      throw new NotFoundException('Venue not found');
    }
  }

  private async ensureCategoryExists(
    client: Prisma.TransactionClient | PrismaService,
    categoryId: string,
  ): Promise<void> {
    const category = await client.spaceCategory.findUnique({
      where: { id: categoryId },
      select: { id: true },
    });

    if (!category) {
      throw new NotFoundException('Category not found');
    }
  }

  private async ensureAmenitiesExist(
    client: Prisma.TransactionClient | PrismaService,
    amenityIds: string[],
  ): Promise<void> {
    if (amenityIds.length === 0) {
      return;
    }

    const amenities = await client.amenity.findMany({
      where: {
        id: {
          in: amenityIds,
        },
      },
      select: {
        id: true,
      },
    });

    const existingIds = new Set(amenities.map((amenity) => amenity.id));
    const missingIds = amenityIds.filter((amenityId) => !existingIds.has(amenityId));

    if (missingIds.length > 0) {
      throw new NotFoundException(`Amenity not found: ${missingIds.join(', ')}`);
    }
  }

  private async ensureImagesExist(
    client: Prisma.TransactionClient | PrismaService,
    imageIds: string[],
  ): Promise<void> {
    if (imageIds.length === 0) {
      return;
    }

    const images = await client.image.findMany({
      where: {
        id: {
          in: imageIds,
        },
      },
      select: {
        id: true,
      },
    });

    const existingIds = new Set(images.map((image) => image.id));
    const missingIds = imageIds.filter((imageId) => !existingIds.has(imageId));

    if (missingIds.length > 0) {
      throw new NotFoundException(`Image not found: ${missingIds.join(', ')}`);
    }
  }
}
