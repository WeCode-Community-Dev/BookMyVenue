import { z } from "zod";
import { BookingStatus } from "../../domain/enums/Booking.enum.js";
import { PaymentStatus } from "../../domain/enums/Payment.enum.js";

export const adminGetAllBookingsSchema = z.object({

    search: z.string().optional(),

    status: z
        .enum(Object.values(BookingStatus))
        .optional(),

    paymentStatus: z
        .enum(Object.values(PaymentStatus))
        .optional(),

    bookingDate: z.string().optional(),

sortBy: z
    .enum(["asc", "desc"])
    .default("desc"),

    page: z.coerce
        .number()
        .int()
        .min(1)
        .default(1),

    limit: z.coerce
        .number()
        .int()
        .min(1)
        .max(100)
        .default(10)

});

export const adminGetBookingByIdSchema = z.object({

    bookingId: z
        .string()
        .length(24)

});