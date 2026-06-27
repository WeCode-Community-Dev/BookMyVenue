import ReservationModel from "../models/reservation.model";
import BookingModel from "../models/booking.model";
import { getVenueByIdService } from "./venue.service";
import { BadRequestException, HttpException } from "../utils/appError";
import { HTTP_STATUS } from "../config/http.config";
import { ReservationStatusEnum } from "../enums/reservation-enum";
import { BookingStatusEnum } from "../enums/booking-enum";
import { CreateReservationInput } from "../validator/reservation.validator";

// How long a hold stays alive before the TTL index removes it.
const RESERVATION_TTL_MS = 10 * 60 * 1000; // 10 minutes

type CreateReservationParams = CreateReservationInput & {
  customer: string;
};

// minutes from midnight (UTC) for a given datetime
const getMinutesOfDay = (date: Date): number => date.getUTCHours() * 60 + date.getUTCMinutes();

// same calendar day in UTC
const isSameDay = (a: Date, b: Date): boolean =>
  a.toISOString().slice(0, 10) === b.toISOString().slice(0, 10);

export const createReservationService = async ({
  venueId,
  startTime,
  endTime,
  customer,
}: CreateReservationParams) => {
  const venue = await getVenueByIdService(venueId);

  // a booking must start and end on the same day
  if (!isSameDay(startTime, endTime)) {
    throw new BadRequestException("Booking must start and end on the same day");
  }

  // the slot must fall within the venue's operating hours
  const startMinutes = getMinutesOfDay(startTime);
  const endMinutes = getMinutesOfDay(endTime);
  if (startMinutes < venue.openingTime || endMinutes > venue.closingTime) {
    throw new BadRequestException("Requested time is outside the venue's operating hours");
  }

  // two ranges overlap when: existing.start < new.end AND existing.end > new.start
  const overlapFilter = {
    venue: venueId,
    startTime: { $lt: endTime },
    endTime: { $gt: startTime },
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
    // unique index race guard: a concurrent request grabbed the exact slot first
    if (error?.code === 11000) {
      throw new HttpException("This time slot is already booked", HTTP_STATUS.CONFLICT);
    }
    throw error;
  }
};
