// Domain layer — Venues
// Pure types and rules. No I/O, no framework, no Supabase imports.

export type VenueType = "wedding" | "conference" | "party" | "celebration" | "other";

export type PricingMode = "per_hour" | "per_day" | "flat" | "per_person";

export const PRICING_MODES: ReadonlyArray<{ value: PricingMode; label: string; unit: string }> = [
  { value: "per_hour", label: "Per hour", unit: "per hour" },
  { value: "per_day", label: "Per day", unit: "per day" },
  { value: "flat", label: "Flat event price", unit: "flat rate" },
  { value: "per_person", label: "Per person", unit: "per person" },
];

export function pricingUnitLabel(mode: PricingMode): string {
  return PRICING_MODES.find((m) => m.value === mode)?.unit ?? "per hour";
}

export interface VenueAddress {
  address_line1: string;
  address_line2: string;
  landmark: string;
  city: string;
  state: string;
  pincode: string;
  country: string;
  gstin: string;
  contact_phone: string;
  contact_email: string;
  rules: string;
  cancellation_policy: string;
  min_booking_hours: number;
  disabled_from?: string;
  disabled_to?: string;
}

export interface Venue {
  id: string;
  host_id: string;
  name: string;
  description: string | null;
  venue_type: VenueType;
  capacity: number;
  base_price_cents: number;
  currency: string;
  pricing_mode: PricingMode;
  address_data: VenueAddress;
  amenities: string[];
  cover_image_url: string | null;
  gallery_urls: string[];
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface VenueListFilter {
  search?: string;
  venue_type?: VenueType;
  min_capacity?: number;
  max_capacity?: number;
  min_price_cents?: number;
  max_price_cents?: number;
  city?: string;
  pricing_mode?: PricingMode;
}
