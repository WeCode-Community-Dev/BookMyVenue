import prisma from "../../shared/config/db.js";
import { ERROR_MESSAGES } from "../../shared/constants/messages.js";
import { STATUS_CODES } from "../../shared/constants/statusCodes.js";
import ApiError from "../../shared/utils/apiError.js";

export const createVenueService = async (
  venueData,
  ownerId
) => {
  return prisma.venue.create({
    data: {
      name: venueData.name,
      type: venueData.type,

      ownerId,

      city: venueData.city,
      address: venueData.address,

      description: venueData.description,

      capacity: venueData.capacity,
      price: venueData.price,

      images: venueData.images || [],
    },
  });
};

export const getVenuesService = async () => {
  return prisma.venue.findMany({
    include: {
      owner: {
        select: {
          id: true,
          name: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });
};

export const getMyVenuesService = async (
  ownerId
) => {
  return prisma.venue.findMany({
    where: {
      ownerId,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
};

export const getVenueByIdService = async (
  id
) => {
  return prisma.venue.findUnique({
    where: {
      id,
    },
    include: {
      owner: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
    },
  });
};

export const updateVenueService = async (
  id,
  venueData,
  ownerId
) => {
  const venue = await prisma.venue.findUnique({
    where: {
      id,
    },
  });

  if (!venue) {
    throw new ApiError(
      STATUS_CODES.NOT_FOUND,
      ERROR_MESSAGES.VENUE_NOT_FOUND
    );
  }

  if (venue.ownerId !== ownerId) {
    throw new ApiError(
      STATUS_CODES.FORBIDDEN,
      "You cannot update this venue"
    );
  }

  return prisma.venue.update({
    where: {
      id,
    },
    data: {
      name: venueData.name,
      type: venueData.type,

      city: venueData.city,
      address: venueData.address,

      description: venueData.description,

      capacity: venueData.capacity,
      price: venueData.price,

      images: venueData.images,
    },
  });
};

export const deleteVenueService = async (
  id,
  ownerId
) => {
  const venue = await prisma.venue.findUnique({
    where: {
      id,
    },
  });

  if (!venue) {
    throw new ApiError(
      STATUS_CODES.NOT_FOUND,
      ERROR_MESSAGES.VENUE_NOT_FOUND
    );
  }

  if (venue.ownerId !== ownerId) {
    throw new ApiError(
      STATUS_CODES.FORBIDDEN,
      "You cannot delete this venue"
    );
  }

  await prisma.venue.delete({
    where: {
      id,
    },
  });

  return true;
};