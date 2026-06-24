import { Request, Response } from "express";
import { asyncHandler } from "../middlewares/asyncHandler.middleware";
import { HTTP_STATUS } from "../config/http.config";
import { BadRequestException, UnauthorizedException } from "../utils/appError";
import { createVenueService } from "../services/venue.service";

export const createVenueController = asyncHandler(async (req: Request, res: Response) => {
  // owner comes from the authenticated user, never from the request body
  const owner = req.user?.userId;
  if (!owner) {
    throw new UnauthorizedException("Unauthorized. Please log in");
  }

  const {
    name,
    description,
    venueType,
    address,
    city,
    capacity,
    pricePerHour,
    openingTime,
    closingTime,
    images,
    amenities,
  } = req.body;

  if (!name || !venueType || pricePerHour == null || openingTime == null || closingTime == null) {
    throw new BadRequestException(
      "name, venueType, pricePerHour, openingTime and closingTime are required",
    );
  }

  if (openingTime >= closingTime) {
    throw new BadRequestException("openingTime must be before closingTime");
  }

  const venue = await createVenueService({
    owner,
    name,
    description,
    venueType,
    address,
    city,
    capacity,
    pricePerHour,
    openingTime,
    closingTime,
    images,
    amenities,
  });

  return res.status(HTTP_STATUS.CREATED).json({
    message: "Venue created successfully",
    venue,
  });
});
