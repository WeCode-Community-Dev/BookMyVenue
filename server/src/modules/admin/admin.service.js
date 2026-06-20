import prisma from "../../shared/config/db.js";

import { STATUS_CODES } from "../../shared/constants/statusCodes.js";
import {
  ERROR_MESSAGES,
} from "../../shared/constants/messages.js";

import ApiError from "../../shared/utils/apiError.js";

const ALLOWED_STATUSES = [
  "APPROVED",
  "REJECTED",
];

export const updateVenueStatusService = async (
  venueId,
  status
) => {

  if (!ALLOWED_STATUSES.includes(status)) {
    throw new ApiError(
      STATUS_CODES.BAD_REQUEST,
      "Invalid venue status"
    );
  }

  const venue = await prisma.venue.findUnique({
    where: {
      id: venueId,
    },
    select: {
      id: true,
      status: true,
      name: true,
    },
  });

  if (!venue) {
    throw new ApiError(
      STATUS_CODES.NOT_FOUND,
      ERROR_MESSAGES.VENUE_NOT_FOUND
    );
  }

  if (venue.status === status) {
    throw new ApiError(
      STATUS_CODES.BAD_REQUEST,
      `Venue already ${status.toLowerCase()}`
    );
  }

  const updatedVenue = await prisma.venue.update({
    where: {
      id: venueId,
    },
    data: {
      status,
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

  return updatedVenue;
};