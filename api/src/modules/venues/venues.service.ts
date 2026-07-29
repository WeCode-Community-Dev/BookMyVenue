import {
  HttpException,
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
import { CapacityType, PricingType } from '../../../generated/prisma/client';
import { CreateSpaceOperatingHoursDto } from './dto/create-space-op-hours.dto';
import { CreateSpaceBlockedPeriodDto } from './dto/create-space-block-period.dto';
import { UpdateSpaceBlockedPeriodDto } from './dto/update-space-block-period.dto';
import { UpsertSpacePricingDto } from './dto/upsert-space-pricing.dto';

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

const browseVenuesInclude = {
  images: {
    where: {isCover: true},
    select: {
      image: true,
    },
  },
  spaces: {
    select: {
      categoryId: true,
      spacePricing: {
        select: {
          pricingType: true,
          amount: true,
          currency: true,
        },
      },
      capacityType: true,
      capacityValue: true,
    },
  },
  amenities: {
    select: {
      amenity: {
        select: {
          id: true,
          name: true,
        },
      },
    },
  },
} satisfies Prisma.VenueInclude;

type BrowseVenueDetails = Prisma.VenueGetPayload<{
  include: typeof browseVenuesInclude;
}>;

type BrowseVenueListItem = Omit<BrowseVenueDetails, 'images' | 'amenities'> & {
  images: BrowseVenueDetails['images'][number]['image'][];
  amenities: BrowseVenueDetails['amenities'][number]['amenity'][];
};

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

type SpacePricingDetails = {
  id: string;
  spaceId: string;
  pricingType: PricingType;
  amount: Prisma.Decimal;
  currency: string;
  minBooking: number | null;
  maxBooking: number | null;
  createdAt: Date;
};

const spacePricingSelect = {
  id: true,
  spaceId: true,
  pricingType: true,
  amount: true,
  currency: true,
  minBooking: true,
  maxBooking: true,
  createdAt: true,
} satisfies Prisma.SpacePricingSelect;

type SuccessResponse<T> = {
  success: true;
  message: string;
  data?: T;
  meta?: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    hasNext: boolean;
    hasPrevious: boolean;
  };
};


@Injectable()
export class VenuesService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly jwtService: JwtService,
  ) { }


  async createVenue(dto: CreateVenueDto, authorization: string): Promise<SuccessResponse<{ id: string }>> {
    try {
      const payload = verifyAccessToken(this.jwtService, authorization);
      if (payload.role !== UserRole.VENUE_OWNER) {
        throw new UnauthorizedException('You are not authorized to create a venue');
      }
      const ownerId = payload.sub;
      const venueAmenityIds = this.normalizeIds(dto.venueAmenityIds);
      const venueImageIds = this.normalizeIds(dto.venueImageIds);


      return this.prismaService.$transaction(async (tx) => {
        await this.ensureIdsExist(tx.amenity, venueAmenityIds, 'Amenity');
        await this.ensureIdsExist(tx.image, venueImageIds, 'Image');

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
              isCover: dto.coverImageId ? imageId === dto.coverImageId : index === 0,
            })),
          });
        }

        return {
          success: true,
          message: 'Venue created successfully',
          data: { id: venue.id },
        };
      });
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new InternalServerErrorException('Failed to create venue');
    }
  }

  async getOwnedVenues(authorization: string, page: number = 1, limit: number = 10): Promise<SuccessResponse<OwnedVenueDetails[]>> {
    try {
      const payload = verifyAccessToken(this.jwtService, authorization);
      if (payload.role !== UserRole.VENUE_OWNER) {
        throw new UnauthorizedException('You are not authorized to get owned venues');
      }
      const ownerId = payload.sub;
      
      const [venues, totalVenues] = await Promise.all(
        [
          this.prismaService.venue.findMany({
            where: { ownerId },
            orderBy: {
              createdAt: 'desc',
            },
            skip: (page - 1) * limit,
            take: limit,
            select: {
              id: true,
              name: true,
              address: true,
              images: {
                where: { isCover: true },
                select: {
                  image: {
                    select: {
                      id: true,
                      url: true,
                      altText: true,
                    }
                  }
                }
              },
              _count: {
                select: {
                  spaces: true,
                  bookings: true,
                },
              },
            }
          }),
          this.prismaService.venue.count({
            where: { ownerId },
          })
        ]
        
      )
      
      return {
        success: true,
        message: 'Owned venues fetched successfully',
        data: venues,
        meta: {
          total: totalVenues,
          page,
          limit,
          totalPages: Math.ceil(totalVenues / limit),
          hasNext: page < Math.ceil(totalVenues / limit),
          hasPrevious: page > 1,
        },
      };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new InternalServerErrorException('Failed to get owned venues');
    }
  }


  async findAllVenues(page: number = 1, limit: number = 10, amenityIds?: string, categoryId?: string, search?: string): Promise<SuccessResponse<BrowseVenueListItem[]>> {
    const parsedAmenityIds = amenityIds ? amenityIds.split(',') : [];
    const existingAmenityIds = await this.filterExistingIds(this.prismaService.amenity, parsedAmenityIds);
    const existingCategoryId = await this.filterExistingIds(this.prismaService.spaceCategory, [categoryId ?? '']);

    try {
      const where = {
        AND: [
          ...existingAmenityIds.map(id => ({
            amenities: {
              some: {
                amenityId: id,
              },
            },
          })),
          (existingCategoryId.length ? { spaces:{
            some:{
              categoryId:existingCategoryId[0]
            }
          }}:{}),
          {OR:[
            { name: { contains: search, mode: 'insensitive' } },
            { address: { contains: search, mode: 'insensitive' } },
            { city: { contains: search, mode: 'insensitive' } },
            { state: { contains: search, mode: 'insensitive' } },
            { country: { contains: search, mode: 'insensitive' } },
            { description: { contains: search, mode: 'insensitive' } },
          ]},
        ]
      } satisfies Prisma.VenueWhereInput;
      
      const [venues, totalVenues] = await this.prismaService.$transaction([
        
        this.prismaService.venue.findMany({
          where,
          orderBy: {
            createdAt: 'desc',
          },
          include: browseVenuesInclude,
          skip: (page - 1) * limit,
          take: limit,
        }),
        this.prismaService.venue.count({ where }),
      ]);

      const flattedVenues: BrowseVenueListItem[] = venues.map((venue) => ({
        ...venue,
        images: venue.images.map((image) => image.image),
        amenities: venue.amenities.map((amenity) => amenity.amenity),
      }));

      return {
        success: true,
        message: 'Venues fetched successfully',
        data: flattedVenues,
        meta: {
          total: totalVenues,
          page,
          limit,
          totalPages: Math.ceil(totalVenues / limit),
          hasNext: page < Math.ceil(totalVenues / limit),
          hasPrevious: page > 1,
        },
      };

    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw error;
    }
  }

  async findOneVenue(id: string): Promise<VenueDetails> {
    try {
      const venue = await this.prismaService.venue.findUnique({
        where: { id },
        include: venueDetailsInclude,
      });

      if (!venue) {
        throw new NotFoundException('Venue not found');
      }

      return venue;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw error;
    }
  }

  async updateVenue(id: string, dto: UpdateVenueDto): Promise<VenueDetails> {
    try {
      const venueAmenityIds = dto.venueAmenityIds
        ? this.normalizeIds(dto.venueAmenityIds)
        : undefined;
      const venueImageIds = dto.venueImageIds
        ? this.normalizeIds(dto.venueImageIds)
        : undefined;


      return this.prismaService.$transaction(async (tx) => {
        const existingVenue = await tx.venue.findUnique({
          where: { id },
          select: { id: true },
        });

        if (!existingVenue) {
          throw new NotFoundException('Venue not found');
        }

        if (venueAmenityIds) {
          await this.ensureIdsExist(tx.amenity, venueAmenityIds, 'Amenity');
        }
        if (venueImageIds) {
          await this.ensureIdsExist(tx.image, venueImageIds, 'Image');
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
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw error;
    }
  }

  async removeVenue(id: string): Promise<void> {
    try {
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
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw error;
    }
  }

  async createSpace(venueId: string, dto: CreateSpaceDto): Promise<SpaceDetails> {
    try {
      const spaceAmenityIds = this.normalizeIds(dto.spaceAmenityIds);
      const spaceImageIds = this.normalizeIds(dto.spaceImageIds);

      return this.prismaService.$transaction(async (tx) => {
        await this.ensureIdExits(tx.venue, venueId, 'Venue');
        await this.ensureIdExits(tx.spaceCategory, dto.categoryId, 'Space category');
        await this.ensureIdsExist(tx.amenity, spaceAmenityIds, 'Amenity');
        await this.ensureIdsExist(tx.image, spaceImageIds, 'Image');

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
              isCover: dto.coverImageId ? imageId === dto.coverImageId : index === 0,
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
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw error;
    }
  }

  async findSpacesByVenue(venueId: string): Promise<SpaceDetails[]> {
    try {
      await this.ensureIdExits(this.prismaService.venue, venueId, 'Venue');

      return this.prismaService.space.findMany({
        where: { venueId },
        orderBy: {
          createdAt: 'desc',
        },
        include: spaceDetailsInclude,
      });
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw error;
    }
  }

  async findOneSpace(id: string): Promise<SpaceDetails> {
    try {
      const space = await this.prismaService.space.findUnique({
        where: { id },
        include: spaceDetailsInclude,
      });

      if (!space) {
        throw new NotFoundException('Space not found');
      }

      return space;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw error;
    }
  }

  async updateSpace(id: string, dto: UpdateSpaceDto): Promise<SpaceDetails> {
    try {
      const spaceAmenityIds = dto.spaceAmenityIds
        ? this.normalizeIds(dto.spaceAmenityIds)
        : undefined;
      const spaceImageIds = dto.spaceImageIds
        ? this.normalizeIds(dto.spaceImageIds)
        : undefined;


      return this.prismaService.$transaction(async (tx) => {
        const existingSpace = await tx.space.findUnique({
          where: { id },
          select: { id: true },
        });

        if (!existingSpace) {
          throw new NotFoundException('Space not found');
        }

        if (dto.categoryId !== undefined) {
          await this.ensureIdExits(tx.spaceCategory, dto.categoryId, 'Space category');
        }
        if (spaceAmenityIds) {
          await this.ensureIdsExist(tx.amenity, spaceAmenityIds, 'Amenity');
        }
        if (spaceImageIds) {
          await this.ensureIdsExist(tx.image, spaceImageIds, 'Image');
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
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw error;
    }
  }

  async removeSpace(id: string): Promise<void> {
    try {
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
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw error;
    }
  }

  async findAllAmenities(): Promise<AmenityDetails[]> {
    try {
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
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw error;
    }
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
              url: true,
            },
          }),
        ),
      );
      return images;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
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
      if (error instanceof HttpException) {
        throw error;
      }
      throw new InternalServerErrorException('Failed to get all space categories');
    }
  }

  async getCapacityTypes(): Promise<CapacityType[]> {
    try {
      return Object.values(CapacityType);
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new InternalServerErrorException('Failed to get capacity types');
    }
  }

  async getPricingTypes(): Promise<PricingType[]> {
    try {
      return Object.values(PricingType);
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new InternalServerErrorException('Failed to get pricing types');
    }
  }

  async upsertSpacePricing(
    spaceId: string,
    dto: UpsertSpacePricingDto,
  ): Promise<SpacePricingDetails> {
    try {
      await this.ensureIdExits(this.prismaService.space, spaceId, 'Space');

      const data = {
        amount: dto.amount,
        currency: dto.currency,
        minBooking: dto.minBooking,
        maxBooking: dto.maxBooking,
      };

      const existing = await this.prismaService.spacePricing.findFirst({
        where: {
          spaceId,
          pricingType: dto.pricingType,
        },
        select: { id: true },
      });

      if (existing) {
        return this.prismaService.spacePricing.update({
          where: { id: existing.id },
          data,
          select: spacePricingSelect,
        });
      }

      return this.prismaService.spacePricing.create({
        data: {
          spaceId,
          pricingType: dto.pricingType,
          ...data,
        },
        select: spacePricingSelect,
      });
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw error;
    }
  }

  async getSpacePricing(spaceId: string): Promise<SpacePricingDetails[]> {
    try {
      return this.prismaService.spacePricing.findMany({
        where: { spaceId },
        select: spacePricingSelect,
      });
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      console.error(error);
      throw error;
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
      if (error instanceof HttpException) {
        throw error;
      }
      console.error(error);
      throw error;
    }
  }

  async getSpaceOperatingHours(spaceId: string): Promise<SpaceOperatingHourDetails[]> {
    try {
      return this.prismaService.spaceOperatingHour.findMany({
        where: { spaceId },
        orderBy: {
          weekday: 'asc',
        },
        select: {
          weekday: true,
          openTime: true,
          closeTime: true,
          isClosed: true,
        },
      });
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw error;
    }
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
      if (error instanceof HttpException) {
        throw error;
      }
      throw error;
    }
  }

  async updateSpaceBlockedPeriods(spaceId: string, id: string, dto: UpdateSpaceBlockedPeriodDto) {
    try {
      return this.prismaService.spaceBlockedPeriod.update({
        where: { spaceId: spaceId, id: id },
        data: {
          startAt: dto.startAt,
          endAt: dto.endAt,
          reason: dto.reason,
        }
      });
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
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
      if (error instanceof HttpException) {
        throw error;
      }
      console.error(error);
      throw error;
    }
  }

  async removeSpaceBlockedPeriod(spaceId: string, id: string) {
    try {
      return await this.prismaService.spaceBlockedPeriod.delete({
        where: { spaceId: spaceId, id: id },
        select: { id: true }
      });
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      console.error(error);
      throw error;
    }
  }

  async getOwnerStats( authorization: string): Promise<{
    totalVenues: number;
    totalSpaces: number;
    totalBookings: number;
  }> {
    try {
      const payload = verifyAccessToken(this.jwtService, authorization);

      if (payload.role !== UserRole.VENUE_OWNER) {
        throw new UnauthorizedException(
          'You are not authorized to access this resource',
        );
      }
      
      const ownerId = payload.sub;
      
      const venueIds = (
        await this.prismaService.venue.findMany({
          where: { ownerId },
          select: { id: true },
        })
      ).map((v) => v.id);
      
      const [totalVenues, totalSpaces, totalBookings] = await Promise.all([
        this.prismaService.venue.count({
          where: { ownerId },
        }),
        this.prismaService.space.count({
          where: {
            venueId: { in: venueIds },
          },
        }),
        this.prismaService.booking.count({
          where: {
            venueId: { in: venueIds },
          },
        }),
      ]);
      
      return {
        totalVenues,
        totalSpaces,
        totalBookings,
      };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      console.error(error);
      throw error;
    }
  }

  async getVenueStats(
    id: string,
    authorization: string,
  ): Promise<{
    totalSpaces: number;
    totalBookings: number;
  }> {
    try {
      const payload = verifyAccessToken(this.jwtService, authorization);

      if (payload.role !== UserRole.VENUE_OWNER) {
        throw new UnauthorizedException(
          'You are not authorized to access this resource',
        );
      }

      const stats = await this.prismaService.venue.findUnique({
        where: { id, ownerId: payload.sub },
        select: {
          _count: {
            select: {
              spaces: true,
              bookings: true,
            },
          },
        },
      });

      if (!stats) {
        throw new NotFoundException('Venue not found');
      }

      return {
        totalSpaces: stats._count.spaces,
        totalBookings: stats._count.bookings,
      };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      console.error(error);
      throw error;
    }
  }
  
  



  private normalizeIds(ids: readonly string[]): string[] {
    try {
      return [...new Set(ids)];
    } catch (error) {
      throw error;
    }
  }


  private async ensureIdExits<
    T extends {
      findUnique(args: {
        where: { id: string };
        select: { id: true };
      }): Promise<{ id: string } | null>;
    }>(
      model: T,
      id: string,
      modalName: string,
    ) {
    try {
      const existing = await model.findUnique({
        where: { id },
        select: { id: true },
      });
      if (!existing) {
        throw new NotFoundException(`${modalName} not found: ${id}`);
      }
    } catch (error) {
      throw error;
    }
  }


  private async ensureIdsExist<
    T extends {
      findMany(args: {
        where: { id: { in: string[] } };
        select: { id: true };
      }): Promise<{ id: string }[]>;
    },
  >(
    model: T,
    ids: string[],
    modalName: string,
  ) {
    try {
      if (ids.length === 0) {
        return;
      }
      const existingIds = await model.findMany({
        where: {
          id: {
            in: ids,
          },
        },
        select: { id: true },
      });

      const existingIdsSet = new Set(existingIds.map((id) => id.id));
      const missingIds = ids.filter((id) => !existingIdsSet.has(id));
      if (missingIds.length > 0) {
        throw new NotFoundException(`${modalName} not found: ${missingIds.join(', ')}`);
      }
    } catch (error) {
      throw error;
    }
  }

  private async filterExistingIds<
    T extends {
      findMany(args: {
        where: { id: { in: string[] } };
        select: { id: true };
      }): Promise<{ id: string }[]>;
    },
  >(
    model: T,
    ids: string[],
  ): Promise<string[]> {
    try {
      const existingIds = await model.findMany({
        where: { id: { in: ids } },
        select: { id: true },
      });
      return existingIds.map((id) => id.id);
    }
    catch (error) {
      throw error;
    }
  }
}
