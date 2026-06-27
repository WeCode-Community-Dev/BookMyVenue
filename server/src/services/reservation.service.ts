import ReservationModel from "../models/reservation.model";
import BookingModel from "../models/booking.model";
import { getVenueByIdService } from "./venue.service";
import { BadRequestException, HttpException } from "../utils/appError";
import { HTTP_STATUS } from "../config/http.config";
import { ReservationStatusEnum } from "../enums/reservation-enum";
import { BookingStatusEnum } from "../enums/booking-enum";
import { CreateReservationInput } from "../validator/reservation.validator";

const RESERVATION_TTL_MS = 10 * 60 * 1000;

// Cleaning gap required between two bookings of the same venue.
const CLEANING_BUFFER_MS = 60 * 60 * 1000;

type CreateReservationParams = CreateReservationInput & {
  customer: string;
};

const IST_OFFSET_MINUTES = 330;

const toIst = (date: Date): Date => new Date(date.getTime() + IST_OFFSET_MINUTES * 60 * 1000);

const getMinutesOfDay = (date: Date): number => {
  const ist = toIst(date);
  return ist.getUTCHours() * 60 + ist.getUTCMinutes();
};

const isSameDay = (a: Date, b: Date): boolean =>
  toIst(a).toISOString().slice(0, 10) === toIst(b).toISOString().slice(0, 10);

export const createReservationService = async ({
  venueId,
  startTime,
  endTime,
  customer,
}: CreateReservationParams) => {
  const venue = await getVenueByIdService(venueId);

  if (!isSameDay(startTime, endTime)) {
    throw new BadRequestException("Booking must start and end on the same day");
  }

  const startMinutes = getMinutesOfDay(startTime);
  const endMinutes = getMinutesOfDay(endTime);
  if (startMinutes < venue.openingTime || endMinutes > venue.closingTime) {
    throw new BadRequestException("Requested time is outside the venue's operating hours");
  }

  // A venue needs a cleaning gap between bookings, so the requested slot is
  // padded by the buffer on both sides when checking for conflicts.
  const paddedStart = new Date(startTime.getTime() - CLEANING_BUFFER_MS);
  const paddedEnd = new Date(endTime.getTime() + CLEANING_BUFFER_MS);

  const overlapFilter = {
    venue: venueId,
    startTime: { $lt: paddedEnd },
    endTime: { $gt: paddedStart },
  };

  const activeHold = await ReservationModel.findOne({
    ...overlapFilter,
    status: ReservationStatusEnum.PENDING,
    expiresAt: { $gt: new Date() },
  });

  const confirmedBooking = await BookingModel.findOne({
    ...overlapFilter,
    bookingStatus: BookingStatusEnum.CONFIRMED,
  });

  if (activeHold || confirmedBooking) {
    throw new HttpException("This time slot is already booked", HTTP_STATUS.CONFLICT);
  }

  try {
    const reservation = await ReservationModel.create({
      venue: venueId,
      customer,
      startTime,
      endTime,
      status: ReservationStatusEnum.PENDING,
      expiresAt: new Date(Date.now() + RESERVATION_TTL_MS),
    });

    return reservation;
  } catch (error: any) {
    if (error?.code === 11000) {
      throw new HttpException("This time slot is already booked", HTTP_STATUS.CONFLICT);
    }
    throw error;
  }
};
