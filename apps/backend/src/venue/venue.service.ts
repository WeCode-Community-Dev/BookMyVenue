import { BadRequestException, Injectable } from '@nestjs/common';

import { CloudinaryService } from 'src/providers/cloudinary/cloudinary.service';
import { CreateVenueDto } from './dto/create-venue.dto';
import { PrismaService } from 'src/providers/prisma/prisma.service';

interface UploadedFile {
  buffer: Buffer;
}

@Injectable()
export class VenueService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly cloudinaryService: CloudinaryService,
  ) {}
  async createVenue(
    dto: CreateVenueDto,
    files: UploadedFile[],
    ownerId: string,
  ) {
    if (!files.length) {
      throw new BadRequestException('At least one venue image is required.');
    }

    if (!dto.slotTemplates.length) {
      throw new BadRequestException('At least one slot template is required.');
    }

    if (dto.capacityMin > dto.capacityMax) {
      throw new BadRequestException(
        'Minimum capacity cannot be greater than maximum capacity.',
      );
    }

    if (!dto.categories.length) {
      throw new BadRequestException('At least one event category is required.');
    }

    if (!dto.amenities.length) {
      throw new BadRequestException('At least one amenity is required.');
    }
    // Upload images to Cloudinary
    const uploadedImages = await Promise.all(
      files.map((file, index) =>
        this.cloudinaryService.uploadImage(file, {
          folder: 'venues',
          publicId: `${ownerId}-${Date.now()}-${index}`,
        }),
      ),
    );

    // Prepare image data for DB
    const venueImages = uploadedImages.map((image, index) => ({
      url: image.secure_url,
      isPrimary: index === 0,
      sortOrder: index,
    }));

    console.log('DTO:', dto);
    console.log('Slot Templates:', dto.slotTemplates);

    return await this.prismaService.$transaction(
      async (tx) => {
        // Create Venue
        const venue = await tx.venue.create({
          data: {
            ownerId,
            name: dto.name,
            description: dto.description,
            venueType: dto.venueType,
            capacityMin: dto.capacityMin,
            capacityMax: dto.capacityMax,
            addressLine: dto.addressLine,
            city: dto.city,
            latitude: dto.latitude,
            longitude: dto.longitude,
          },
        });

        await tx.venueCategory.createMany({
          data: dto.categories.map((category) => ({
            venueId: venue.id,
            category,
          })),
        });

        for (const amenityName of dto.amenities) {
          const name = amenityName.trim();

          let amenity = await tx.amenity.findUnique({
            where: {
              name,
            },
          });

          if (!amenity) {
            amenity = await tx.amenity.create({
              data: {
                name,
              },
            });
          }

          await tx.venueAmenity.create({
            data: {
              venueId: venue.id,
              amenityId: amenity.id,
            },
          });
        }

        await tx.venueImage.createMany({
          data: venueImages.map((image) => ({
            venueId: venue.id,
            url: image.url,
            isPrimary: image.isPrimary,
            sortOrder: image.sortOrder,
          })),
        });

        for (const slot of dto.slotTemplates) {
          console.log('DTO:', dto);
          console.log('Slot Templates:', dto.slotTemplates);
          const createdSlot = await tx.venueSlotTemplate.create({
            data: {
              venueId: venue.id,
              label: slot.label,
              startDayOffset: slot.startDayOffset,
              startTime: slot.startTime,
              endDayOffset: slot.endDayOffset,
              endTime: slot.endTime,
              isCustom: slot.isCustom,
              customRatePerGuestPerHour: slot.customRatePerGuestPerHour,
            },
          });

          await tx.venueSlotPricing.createMany({
            data: slot.pricingTiers.map((tier) => ({
              slotTemplateId: createdSlot.id,
              minGuests: tier.minGuests,
              maxGuests: tier.maxGuests,
              price: tier.price,
            })),
          });
        }
        const createdVenue = await tx.venue.findUnique({
          where: {
            id: venue.id,
          },
          include: {
            categories: true,
            amenities: {
              include: {
                amenity: true,
              },
            },
            images: true,
            slotTemplates: {
              include: {
                pricingTiers: true,
              },
            },
          },
        });

        return createdVenue;
      },
      {
        maxWait: 5000,
        timeout: 12000,
      },
    );
  }

  async getAllVenues() {
    return await this.prismaService.venue.findMany({
      include: {
        categories: true,
        amenities: {
          include: {
            amenity: true,
          },
        },
        images: true,
        slotTemplates: {
          include: {
            pricingTiers: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async getVenueById(id: string) {
    const venue = await this.prismaService.venue.findUnique({
      where: {
        id,
      },
      include: {
        categories: true,
        amenities: {
          include: {
            amenity: true,
          },
        },
        images: true,
        slotTemplates: {
          include: {
            pricingTiers: true,
          },
        },
      },
    });

    if (!venue) {
      throw new BadRequestException('Venue not found.');
    }

    return venue;
  }
}
