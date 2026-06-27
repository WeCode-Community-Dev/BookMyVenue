import mongoose from "mongoose";
import BookingModel, { BookingDocument } from "../models/booking.model";
import { getVenueByIdService } from "./venue.service";
import { BadRequestException, ForbiddenException, NotFoundException } from "../utils/appError";
import { RoleEnum, RoleEnumType } from "../enums/user-enum";
import { BookingStatusEnum } from "../enums/booking-enum";

type CreateBookingParams = {
  venue: mongoose.Types.ObjectId;
  customer: mongoose.Types.ObjectId;
  startTime: Date;
  endTime: Date;
  totalAmount: number;
};

type GetVenueBookingsParams = {
  venueId: string;
  userId: string;
  role: RoleEnumType;
};

type CancelBookingParams = {
  bookingId: string;
  userId: string;
  role: RoleEnumType;
};

export const createBookingService = async (
  { venue, customer, startTime, endTime, totalAmount }: CreateBookingParams,
  session?: mongoose.ClientSession,
) => {
  const [booking] = await BookingModel.create(
    [
      {
        venue,
        customer,
        startTime,
        endTime,
        totalAmount,
        bookingStatus: BookingStatusEnum.CONFIRMED,
      },
    ],
    { session },
  );

  return booking as mongoose.HydratedDocument<BookingDocument>;
};

export const getMyBookingsService = async (customer: string) => {
  const bookings = await BookingModel.find({ customer })
    .populate("venue", "name city")
    .sort({ startTime: -1 });

  return bookings;
};

export const getVenueBookingsService = async ({
  venueId,
  userId,
  role,
}: GetVenueBookingsParams) => {
  const venue = await getVenueByIdService(venueId);

  const isOwner = venue.owner.toString() === userId;
  const isAdmin = role === RoleEnum.ADMIN;
  if (!isOwner && !isAdmin) {
    throw new ForbiddenException("You can only view bookings for your own venue");
  }

  const bookings = await BookingModel.find({ venue: venueId })
    .populate("customer", "name")
    .sort({ startTime: -1 });

  return bookings;
};

export const cancelBookingService = async ({ bookingId, userId, role }: CancelBookingParams) => {
  const booking = await BookingModel.findById(bookingId);
  if (!booking) {
    throw new NotFoundException("Booking not found");
  }

  const isOwner = booking.customer.toString() === userId;
  const isAdmin = role === RoleEnum.ADMIN;
  if (!isOwner && !isAdmin) {
    throw new ForbiddenException("You can only cancel your own booking");
  }

  if (booking.bookingStatus === BookingStatusEnum.CANCELED) {
    throw new BadRequestException("Booking is already canceled");
  }

  booking.bookingStatus = BookingStatusEnum.CANCELED;
  await booking.save();

  return booking;
};
