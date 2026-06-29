import prisma from '../config/prisma.js';

const venueInclude = { amenities: true };

export const venueRepository = {
  findAll({ city } = {}) {
    return prisma.venue.findMany({
      where: city ? { city } : undefined,
      include: venueInclude,
      orderBy: { createdAt: 'desc' },
    });
  },

  findById(id) {
    return prisma.venue.findUnique({
      where: { id },
      include: venueInclude,
    });
  },

  create(ownerId, venueData, amenitiesData) {
    return prisma.venue.create({
      data: {
        ...venueData,
        ownerId,
        amenities: {
          create: amenitiesData,
        },
      },
      include: venueInclude,
    });
  },

  update(id, venueData, amenitiesData) {
    return prisma.$transaction(async (tx) => {
      if (Object.keys(venueData).length > 0) {
        await tx.venue.update({
          where: { id },
          data: venueData,
        });
      }

      if (amenitiesData && Object.keys(amenitiesData).length > 0) {
        await tx.venueAmenities.update({
          where: { venueId: id },
          data: amenitiesData,
        });
      }

      return tx.venue.findUnique({
        where: { id },
        include: venueInclude,
      });
    });
  },

  delete(id) {
    return prisma.venue.delete({
      where: { id },
    });
  },
};
