import { z } from "zod";
import { BookingType } from "../../domain/enums/Booking.enum.js";

export const ReserveBookingSchema = z.object({

    venueId: z
        .string()
        .min(1, "Venue ID is required"),

    bookingDate: z
        .string()
        .min(1, "Booking date is required"),

    startTime: z
        .string()
        .min(1, "Start time is required"),

    endTime: z
        .string()
        .min(1, "End time is required"),

    guestCount: z
        .number()
        .int()
        .positive(),

    bookingType: z.enum([
        BookingType.HOURLY,
        BookingType.FULL_DAY
    ]),
    

});
export const CancelBookingSchema = z.object({

    cancellationReason: z
        .string()
        .trim()
        .min(1, "Cancellation reason is required")
        .max(500, "Cancellation reason is too long")

});