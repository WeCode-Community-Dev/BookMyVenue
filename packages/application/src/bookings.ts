// Application layer — Bookings use-cases & schemas

import { z } from "zod";
import {
  computePrice,
  hoursBetween,
  isBlocking,
  newHoldExpiry,
  type Booking,
  type BookingQuote,
} from "@repo/domain/bookings";
import { pricingUnitLabel } from "@repo/domain/venues";
import { computeDiscount, isRedeemable, type Coupon } from "@repo/domain/coupons";
import type { BookingsRepo, CacheStore, CouponsRepo, PaymentsRepo } from "@repo/contracts";

/** Check if an error is a BookingOverlapError from the infrastructure layer.
 *  Matched by name to avoid coupling the application layer to infrastructure. */
function isBookingOverlapError(err: unknown): boolean {
  return err instanceof Error && err.name === "BookingOverlapError";
}

async function invalidateVenuesCache(cache: CacheStore) {
  try {
    await cache.invalidateNamespace("venues");
  } catch {
    /* cache failures must never break a write */
  }
}

export const QuoteSchema = z.object({
  venue_id: z.string().uuid(),
  start_time: z.string().datetime(),
  end_time: z.string().datetime(),
  guest_count: z.number().int().min(1).max(100000).optional(),
  coupon_code: z.string().max(40).optional(),
});
export type QuoteInput = z.infer<typeof QuoteSchema>;

export const BookingIdSchema = z.object({ booking_id: z.string().uuid() });

async function resolveCoupon(
  coupons: CouponsRepo,
  code: string | undefined,
  venueId: string,
): Promise<Coupon | null> {
  if (!code) return null;
  const c = await coupons.findActiveByCode(code);
  if (!c || !isRedeemable(c, venueId)) throw new Error("Invalid or expired coupon");
  return c;
}

export const quoteBookingUseCase =
  (bookings: BookingsRepo, coupons: CouponsRepo) =>
  async (input: QuoteInput): Promise<BookingQuote> => {
    const venue = await bookings.findVenuePricing(input.venue_id);
    if (!venue) throw new Error("Venue not found");

    const hours = hoursBetween(input.start_time, input.end_time);
    if (hours <= 0) throw new Error("End time must be after start time");

    const price = computePrice({
      base_price_cents: venue.base_price_cents,
      pricing_mode: venue.pricing_mode,
      hours,
      guest_count: input.guest_count ?? null,
    });
    const coupon = await resolveCoupon(coupons, input.coupon_code, venue.id);
    const discount = coupon ? computeDiscount(price.subtotal_cents, coupon) : 0;

    return {
      subtotal_cents: price.subtotal_cents,
      discount_amount_cents: discount,
      total_cents: price.subtotal_cents - discount,
      currency: venue.currency,
      hours,
      units: price.units,
      unit_label: pricingUnitLabel(venue.pricing_mode),
      pricing_mode: venue.pricing_mode,
      coupon: coupon ? { id: coupon.id, code: coupon.code } : null,
    };
  };

export const createBookingHoldUseCase =
  (bookings: BookingsRepo, coupons: CouponsRepo, cache: CacheStore) =>
  async (input: QuoteInput, userId: string): Promise<Booking> => {
    const conflicts = await bookings.findConflicts({
      venue_id: input.venue_id,
      start_time: input.start_time,
      end_time: input.end_time,
    });
    if (conflicts.some((c) => isBlocking(c))) {
      throw new Error("This time slot is no longer available");
    }

    const venue = await bookings.findVenuePricing(input.venue_id);
    if (!venue) throw new Error("Venue not found");

    const hours = hoursBetween(input.start_time, input.end_time);
    if (hours <= 0) throw new Error("End time must be after start time");
    const price = computePrice({
      base_price_cents: venue.base_price_cents,
      pricing_mode: venue.pricing_mode,
      hours,
      guest_count: input.guest_count ?? null,
    });
    const subtotal = price.subtotal_cents;

    const coupon = await resolveCoupon(coupons, input.coupon_code, venue.id);
    const discount = coupon ? computeDiscount(subtotal, coupon) : 0;
    const total = subtotal - discount;

    let created: Booking;
    try {
      created = await bookings.create({
        venue_id: input.venue_id,
        customer_id: userId,
        coupon_id: coupon?.id ?? null,
        start_time: input.start_time,
        end_time: input.end_time,
        guest_count: input.guest_count ?? null,
        subtotal_cents: subtotal,
        discount_amount_cents: discount,
        total_cents: total,
        currency: venue.currency,
        status: "pending",
        expires_at: newHoldExpiry(),
        source: "online",
        guest_name: null,
        guest_email: null,
        guest_phone: null,
        payment_method: null,
        amount_paid_cents: 0,
        notes: null,
      });
    } catch (err) {
      if (isBookingOverlapError(err)) {
        throw new Error("This time slot is no longer available");
      }
      throw err;
    }
    await invalidateVenuesCache(cache);
    return created;
  };

// ---------- Offline bookings (host-created) ----------

export const OfflineBookingSchema = z.object({
  venue_id: z.string().uuid(),
  start_time: z.string().datetime(),
  end_time: z.string().datetime(),
  guest_name: z.string().min(1).max(120),
  guest_email: z
    .string()
    .email()
    .optional()
    .or(z.literal(""))
    .transform((v) => (v ? v : undefined)),
  guest_phone: z
    .string()
    .max(40)
    .optional()
    .or(z.literal(""))
    .transform((v) => (v ? v : undefined)),
  guest_count: z.number().int().min(1).max(100000).optional(),
  total_cents: z.number().int().min(0),
  payment_method: z.enum(["cash", "bank_transfer", "card_offline", "online", "other"]),
  amount_paid_cents: z.number().int().min(0).default(0),
  notes: z.string().max(2000).optional(),
});
export type OfflineBookingInput = z.infer<typeof OfflineBookingSchema>;

export const createOfflineBookingUseCase =
  (bookings: BookingsRepo) =>
  async (input: OfflineBookingInput): Promise<Booking> => {
    if (hoursBetween(input.start_time, input.end_time) <= 0) {
      throw new Error("End time must be after start time");
    }
    const conflicts = await bookings.findConflicts({
      venue_id: input.venue_id,
      start_time: input.start_time,
      end_time: input.end_time,
    });
    if (conflicts.some((c) => isBlocking(c))) {
      throw new Error("This time slot conflicts with an existing booking");
    }
    const venue = await bookings.findVenuePricing(input.venue_id);
    if (!venue) throw new Error("Venue not found");

    try {
      return await bookings.create({
        venue_id: input.venue_id,
        customer_id: null,
        coupon_id: null,
        start_time: input.start_time,
        end_time: input.end_time,
        guest_count: input.guest_count ?? null,
        subtotal_cents: input.total_cents,
        discount_amount_cents: 0,
        total_cents: input.total_cents,
        currency: venue.currency,
        status: "confirmed",
        expires_at: null,
        source: "offline",
        guest_name: input.guest_name,
        guest_email: input.guest_email ?? null,
        guest_phone: input.guest_phone ?? null,
        payment_method: input.payment_method,
        amount_paid_cents: input.amount_paid_cents,
        notes: input.notes ?? null,
      });
    } catch (err) {
      if (isBookingOverlapError(err)) {
        throw new Error("This time slot conflicts with an existing booking");
      }
      throw err;
    }
  };

// ---------- Block-off (host blocks a slot, no customer) ----------

export const BlockOffSchema = z.object({
  venue_id: z.string().uuid(),
  start_time: z.string().datetime(),
  end_time: z.string().datetime(),
  notes: z.string().max(2000).optional(),
});
export type BlockOffInput = z.infer<typeof BlockOffSchema>;

export const createBlockOffUseCase =
  (bookings: BookingsRepo) =>
  async (input: BlockOffInput): Promise<Booking> => {
    if (hoursBetween(input.start_time, input.end_time) <= 0) {
      throw new Error("End time must be after start time");
    }
    const conflicts = await bookings.findConflicts({
      venue_id: input.venue_id,
      start_time: input.start_time,
      end_time: input.end_time,
    });
    if (conflicts.some((c) => isBlocking(c))) {
      throw new Error("This time slot conflicts with an existing booking");
    }
    const venue = await bookings.findVenuePricing(input.venue_id);
    if (!venue) throw new Error("Venue not found");

    try {
      return await bookings.create({
        venue_id: input.venue_id,
        customer_id: null,
        coupon_id: null,
        start_time: input.start_time,
        end_time: input.end_time,
        guest_count: null,
        subtotal_cents: 0,
        discount_amount_cents: 0,
        total_cents: 0,
        currency: venue.currency,
        status: "confirmed",
        expires_at: null,
        source: "block_off",
        guest_name: null,
        guest_email: null,
        guest_phone: null,
        payment_method: null,
        amount_paid_cents: 0,
        notes: input.notes ?? null,
      });
    } catch (err) {
      if (isBookingOverlapError(err)) {
        throw new Error("This time slot conflicts with an existing booking");
      }
      throw err;
    }
  };

export interface ConfirmBookingSideEffects {
  /** Called after the booking is confirmed and payment is recorded. Best-effort. */
  onConfirmed?: (booking: Booking) => Promise<void>;
}

export const confirmBookingUseCase =
  (
    bookings: BookingsRepo,
    payments: PaymentsRepo,
    coupons: CouponsRepo,
    cache: CacheStore,
    sideEffects: ConfirmBookingSideEffects = {},
  ) =>
  async (bookingId: string, userId: string): Promise<Booking> => {
    const booking = await bookings.findById(bookingId);
    if (!booking) throw new Error("Booking not found");
    if (booking.customer_id !== userId) throw new Error("Not your booking");
    if (booking.status === "confirmed") return booking;
    if (booking.status !== "pending") {
      throw new Error(`Cannot confirm booking in ${booking.status} state`);
    }

    // Re-check for conflicts before confirming — another booking may have been
    // confirmed for this slot since the hold was created.
    const conflicts = await bookings.findConflicts({
      venue_id: booking.venue_id,
      start_time: booking.start_time,
      end_time: booking.end_time,
    });
    // Exclude this booking itself from the conflict list
    const otherConflicts = conflicts.filter((c) => c.id !== booking.id);
    if (otherConflicts.some((c) => isBlocking(c))) {
      throw new Error("This time slot is no longer available. Please create a new booking.");
    }

    const updated = await bookings.updateStatus({
      id: booking.id,
      version: booking.version,
      status: "confirmed",
      expires_at: null,
    });

    await payments.recordSuccess({
      booking_id: booking.id,
      amount_cents: booking.total_cents,
      currency: booking.currency,
      transaction_id: `sim_${booking.id}`,
    });

    if (booking.coupon_id) {
      await coupons.incrementUsage(booking.coupon_id);
    }

    await invalidateVenuesCache(cache);

    if (sideEffects.onConfirmed) {
      try {
        await sideEffects.onConfirmed(updated);
      } catch (err) {
        console.error("[confirmBooking] side-effect failed", err);
      }
    }

    return updated;
  };

export const cancelBookingUseCase =
  (bookings: BookingsRepo) =>
  async (bookingId: string, userId: string): Promise<{ ok: true }> => {
    const booking = await bookings.findById(bookingId);
    if (!booking) throw new Error("Booking not found");
    if (booking.customer_id !== userId) throw new Error("Not your booking");
    await bookings.setStatus(bookingId, "cancelled");
    return { ok: true };
  };

export const listMyBookingsUseCase = (repo: BookingsRepo) => (userId: string) =>
  repo.listForCustomer(userId);

export const listHostBookingsUseCase = (repo: BookingsRepo) => (hostId: string) =>
  repo.listForHost(hostId);

export const getBookingUseCase = (repo: BookingsRepo) => async (id: string) => {
  const b = await repo.findWithVenue(id);
  if (!b) throw new Error("Booking not found");
  return b;
};
