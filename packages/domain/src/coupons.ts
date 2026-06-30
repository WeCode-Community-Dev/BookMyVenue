// Domain layer — Coupons

export type DiscountType = "percentage" | "fixed_amount";

export interface Coupon {
  id: string;
  code: string;
  venue_id: string | null;
  discount_type: DiscountType;
  discount_value: number;
  valid_from: string | null;
  valid_until: string | null;
  usage_limit: number | null;
  times_used: number;
  is_active: boolean;
}

/** Money discount (cents) for a given subtotal, never exceeding subtotal. */
export function computeDiscount(
  subtotalCents: number,
  c: Pick<Coupon, "discount_type" | "discount_value">,
): number {
  if (c.discount_type === "percentage") {
    return Math.min(subtotalCents, Math.round(subtotalCents * (Number(c.discount_value) / 100)));
  }
  // fixed_amount is stored in major units → convert to cents
  return Math.min(subtotalCents, Math.round(Number(c.discount_value) * 100));
}

/** Pure validity check: a coupon is redeemable now for the given venue. */
export function isRedeemable(c: Coupon, forVenueId: string, now: Date = new Date()): boolean {
  if (!c.is_active) return false;
  if (c.venue_id && c.venue_id !== forVenueId) return false;
  if (c.valid_from && new Date(c.valid_from) > now) return false;
  if (c.valid_until && new Date(c.valid_until) < now) return false;
  if (c.usage_limit !== null && c.times_used >= c.usage_limit) return false;
  return true;
}
