import { Request, Response } from "express";
import { asyncHandler } from "../middlewares/asyncHandler.middleware";
import { HTTP_STATUS } from "../config/http.config";
import { UnauthorizedException } from "../utils/appError";
import { createVenueService } from "../services/venue.service";
import { createVenueSchema } from "../validator/venue.validator";

export const createVenueController = asyncHandler(async (req: Request, res: Response) => {
  // owner comes from the authenticated user, never from the request body
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
