import { Request, Response } from "express";
import { isValidObjectId } from "mongoose";
import { asyncHandler } from "../middlewares/asyncHandler.middleware";
import { HTTP_STATUS } from "../config/http.config";
import { BadRequestException, UnauthorizedException } from "../utils/appError";
import { createVenueService, getVenueByIdService } from "../services/venue.service";
import { createVenueSchema } from "../validator/venue.validator";

export const createVenueController = asyncHandler(async (req: Request, res: Response) => {
  const owner = req.user?.userId;
  if (!owner) {
    throw new UnauthorizedException("Unauthorized. Please log in");
  }

  const data = createVenueSchema.parse(req.body);

  const venue = await createVenueService({ owner, ...data });

  return res.status(HTTP_STATUS.CREATED).json({
    message: "Venue created successfully",
    venue,
  });
});

export const getVenueByIdController = asyncHandler(async (req: Request, res: Response) => {
  const venueId = req.params.venueId;
  if (typeof venueId !== "string" || !isValidObjectId(venueId)) {
    throw new BadRequestException("Invalid venue id");
  }

  const venue = await getVenueByIdService(venueId);

  return res.status(HTTP_STATUS.OK).json({
    message: "Venue fetched successfully",
    venue,
  });
});
