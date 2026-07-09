// Domain layer — Bookings
// Pure entities + business rules (pricing, overlap, hold lifetime).

import type { PricingMode } from "./venues";

export type BookingStatus =
  | "pending"
  | "confirmed"
  | "cancelled"
  | "completed"
  | "refunded"
  | "expired";
export type BookingSource = "online" | "offline" | "block_off";
export type BookingPaymentMethod = "cash" | "bank_transfer" | "card_offline" | "online" | "other";

export interface Booking {
  id: string;
  venue_id: string;
  customer_id: string | null;
  coupon_id: string | null;
  start_time: string;
  end_time: string;
  guest_count: number | null;
  subtotal_cents: number;
  discount_amount_cents: number;
  total_cents: number;
  currency: string;
  status: BookingStatus;
  expires_at: string | null;
  version: number;
  source: BookingSource;
  guest_name: string | null;
  guest_email: string | null;
  guest_phone: string | null;
  payment_method: BookingPaymentMethod | null;
  amount_paid_cents: number;
  notes: string | null;
}

export interface BookingQuote {
  subtotal_cents: number;
  discount_amount_cents: number;
  total_cents: number;
  currency: string;
  hours: number;
  units: number;
  unit_label: string;
  pricing_mode: PricingMode;
  coupon: { id: string; code: string } | null;
}

export const HOLD_DURATION_MS = 15 * 60_000;

/** Hours between two ISO timestamps, never negative. */
export function hoursBetween(start: string, end: string): number {
  const ms = new Date(end).getTime() - new Date(start).getTime();
  return Math.max(0, ms / 3_600_000);
}

export interface PriceComputation {
  subtotal_cents: number;
  units: number;
  unit_label: string;
}

/**
 * Compute booking subtotal based on the venue's pricing mode.
 * - per_hour: price × hours (decimal hours allowed)
 * - per_day: price × ceil(hours / 24) (any started day counts)
 * - flat: price (single charge regardless of duration / guests)
 * - per_person: price × max(guests, 1)
 */
export function computePrice(args: {
  base_price_cents: number;
  pricing_mode: PricingMode;
  hours: number;
  guest_count?: number | null;
}): PriceComputation {
  const { base_price_cents, pricing_mode, hours, guest_count } = args;
  switch (pricing_mode) {
    case "per_hour": {
      const units = hours;
      return {
        subtotal_cents: Math.round(base_price_cents * units),
        units,
        unit_label: units === 1 ? "hour" : "hours",
      };
    }
    case "per_day": {
      const units = Math.max(1, Math.ceil(hours / 24));
      return {
        subtotal_cents: Math.round(base_price_cents * units),
        units,
        unit_label: units === 1 ? "day" : "days",
      };
    }
    case "flat": {
      return {
        subtotal_cents: base_price_cents,
        units: 1,
        unit_label: "flat",
      };
    }
    case "per_person": {
      const units = Math.max(1, guest_count ?? 1);
      return {
        subtotal_cents: Math.round(base_price_cents * units),
        units,
        unit_label: units === 1 ? "guest" : "guests",
      };
    }
  }
}

/** Legacy helper kept for backwards compatibility (per-hour pricing). */
export function calculateSubtotal(basePriceCents: number, hours: number): number {
  return Math.round(basePriceCents * hours);
}

/** A pending booking only blocks new bookings until expires_at passes. */
export function isBlocking(
  b: Pick<Booking, "status" | "expires_at">,
  now: number = Date.now(),
): boolean {
  if (b.status === "confirmed") return true;
  if (b.status === "pending" && b.expires_at && new Date(b.expires_at).getTime() > now) return true;
  return false;
}

export function newHoldExpiry(now: number = Date.now()): string {
  return new Date(now + HOLD_DURATION_MS).toISOString();
}
