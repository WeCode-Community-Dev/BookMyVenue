import prisma from "../../shared/config/db.js";
import { ERROR_MESSAGES } from "../../shared/constants/messages.js";
import { STATUS_CODES } from "../../shared/constants/statusCodes.js";
import ApiError from "../../shared/utils/apiError.js";

import bcrypt from "bcryptjs";

export const registerVenueService = async (
  venueData,
  ownerId
) => {
  return prisma.venue.create({
    data: {
      name: venueData.name,
      type: venueData.type,

      ownerId,

      images: venueData.images || [],
      description: venueData.description,

      city: venueData.city,
      address: venueData.address,

      capacity: venueData.capacity,
      price: venueData.price,

      amenities: venueData.amenities || [],
      currency: venueData.currency,
    },
  });
};

export const getVenuesService = async () => {
  try {
    const venues = await prisma.venue.findMany();
    return venues;
  } catch (error) {
    throw new ApiError(
      STATUS_CODES.INTERNAL_SERVER_ERROR,
      ERROR_MESSAGES.VENUES_RETRIEVAL_FAILED,
    );
  }
};

export const getVenueByIdService = async (id) => {
  try {
    const venue = await prisma.venue.findUnique({
      where: { id: parseInt(id) },
    });
    return venue;
  } catch (error) {
    throw new ApiError(
      STATUS_CODES.INTERNAL_SERVER_ERROR,
      ERROR_MESSAGES.VENUE_RETRIEVAL_FAILED,
    );
  }
};

export const updateVenueService = async (id, venueData) => {
  try {
    const updatedVenue = await prisma.venue.update({
      where: { id: parseInt(id) },
      data: venueData,
    });
    return updatedVenue;
  } catch (error) {
    throw new ApiError(
      STATUS_CODES.INTERNAL_SERVER_ERROR,
      ERROR_MESSAGES.VENUE_UPDATE_FAILED,
    );
  }
};

export const deleteVenueService = async (id) => {
  try {
    await prisma.venue.delete({
      where: { id: parseInt(id) },
    });
    return { message: "Venue deleted successfully" };
  } catch (error) {
    throw new ApiError(
      STATUS_CODES.INTERNAL_SERVER_ERROR,
      ERROR_MESSAGES.VENUE_DELETION_FAILED,
    );
  }
};
