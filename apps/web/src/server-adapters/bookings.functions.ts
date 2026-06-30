// Presentation/server adapter — Bookings

import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireAuth } from "@/lib/auth-middleware";
import {
  BookingIdSchema,
  BlockOffSchema,
  OfflineBookingSchema,
  QuoteSchema,
} from "@repo/application/bookings";
import { buildServices } from "@/infrastructure/services";

export const quoteBooking = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => QuoteSchema.parse(input))
  .handler(({ data }) => buildServices().quoteBooking(data));

export const createBookingHold = createServerFn({ method: "POST" })
  .middleware([requireAuth])
  .inputValidator((input: unknown) => QuoteSchema.parse(input))
  .handler(({ data, context }) =>
    buildServices({ db: context.db, userId: context.userId }).createBookingHold(
      data,
      context.userId,
    ),
  );

export const confirmBooking = createServerFn({ method: "POST" })
  .middleware([requireAuth])
  .inputValidator((input: unknown) => BookingIdSchema.parse(input))
  .handler(({ data, context }) =>
    buildServices({ db: context.db, userId: context.userId }).confirmBooking(
      data.booking_id,
      context.userId,
    ),
  );

export const cancelBooking = createServerFn({ method: "POST" })
  .middleware([requireAuth])
  .inputValidator((input: unknown) => BookingIdSchema.parse(input))
  .handler(({ data, context }) =>
    buildServices({ db: context.db, userId: context.userId }).cancelBooking(
      data.booking_id,
      context.userId,
    ),
  );

export const listMyBookings = createServerFn({ method: "GET" })
  .middleware([requireAuth])
  .handler(({ context }) =>
    buildServices({ db: context.db, userId: context.userId }).listMyBookings(
      context.userId,
    ),
  );

export const listHostBookings = createServerFn({ method: "GET" })
  .middleware([requireAuth])
  .handler(({ context }) =>
    buildServices({ db: context.db, userId: context.userId }).listHostBookings(
      context.userId,
    ),
  );

const GetBookingSchema = z
  .object({ id: z.string().uuid().optional(), booking_id: z.string().uuid().optional() })
  .refine((d) => !!(d.id ?? d.booking_id), { message: "id required" });

export const getBooking = createServerFn({ method: "GET" })
  .middleware([requireAuth])
  .inputValidator((input: unknown) => GetBookingSchema.parse(input))
  .handler(({ data, context }) => {
    const id = (data.id ?? data.booking_id)!;
    return buildServices({ db: context.db, userId: context.userId }).getBooking(id);
  });

export const createOfflineBooking = createServerFn({ method: "POST" })
  .middleware([requireAuth])
  .inputValidator((input: unknown) => OfflineBookingSchema.parse(input))
  .handler(({ data, context }) =>
    buildServices({ db: context.db, userId: context.userId }).createOfflineBooking(
      data,
    ),
  );

export const createBlockOff = createServerFn({ method: "POST" })
  .middleware([requireAuth])
  .inputValidator((input: unknown) => BlockOffSchema.parse(input))
  .handler(({ data, context }) =>
    buildServices({ db: context.db, userId: context.userId }).createBlockOff(data),
  );
