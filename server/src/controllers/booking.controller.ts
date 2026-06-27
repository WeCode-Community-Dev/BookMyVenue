import { Request, Response } from "express";
import { isValidObjectId } from "mongoose";
import { asyncHandler } from "../middlewares/asyncHandler.middleware";
import { HTTP_STATUS } from "../config/http.config";
import { BadRequestException, UnauthorizedException } from "../utils/appError";
import { RoleEnumType } from "../enums/user-enum";
import {
  getMyBookingsService,
  getVenueBookingsService,
  cancelBookingService,
} from "../services/booking.service";

export const getMyBookingsController = asyncHandler(async (req: Request, res: Response) => {
  const customer = req.user?.userId;
  if (!customer) {
    throw new UnauthorizedException("Unauthorized. Please log in");
  }

  const bookings = await getMyBookingsService(customer);

  return res.status(HTTP_STATUS.OK).json({
    message: "Bookings fetched successfully",
    bookings,
  });
});

export const getVenueBookingsController = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user?.userId;
  const role = req.user?.role;
  if (!userId || !role) {
    throw new UnauthorizedException("Unauthorized. Please log in");
  }

  const venueId = req.params.venueId;
  if (typeof venueId !== "string" || !isValidObjectId(venueId)) {
    throw new BadRequestException("Invalid venue id");
  }

  const bookings = await getVenueBookingsService({
    venueId,
    userId,
    role: role as RoleEnumType,
  });

  return res.status(HTTP_STATUS.OK).json({
    message: "Venue bookings fetched successfully",
    bookings,
  });
});

export const cancelBookingController = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user?.userId;
  const role = req.user?.role;
  if (!userId || !role) {
    throw new UnauthorizedException("Unauthorized. Please log in");
  }

  const bookingId = req.params.bookingId;
  if (typeof bookingId !== "string" || !isValidObjectId(bookingId)) {
    throw new BadRequestException("Invalid booking id");
  }

  const booking = await cancelBookingService({
    bookingId,
    userId,
    role: role as RoleEnumType,
  });

  return res.status(HTTP_STATUS.OK).json({
    message: "Booking canceled successfully",
    booking,
  });
});
