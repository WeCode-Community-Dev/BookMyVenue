// Friendly type aliases over the auto-generated OpenAPI schema.
// Import from here instead of types.ts directly.
import type { components } from './types'

export type Booking = components['schemas']['BookingOut']
export type BookingMode = 'MANUAL' | 'INSTANT'

export type Venue = components['schemas']['VenueResponse'] & {
  rejection_reason?: string | null
  // Hand-added until `pnpm generate` is run (mirrors VenueResponse in venue/schemas.py).
  // Decimal fields serialize as strings, matching platform_commission_pct/advance_pct above.
  min_price_pct: string
  max_price_pct: string
  display_price_min_paise?: number | null
  display_price_max_paise?: number | null
  booking_mode?: BookingMode
  is_liked?: boolean
}
export type VenueCategory = components['schemas']['VenueCategoryResponse']
export type Amenity = components['schemas']['AmenityResponse']
export type VenuePhoto = components['schemas']['VenuePhotoResponse']
export type VenueAvailability = components['schemas']['VenueAvailabilityResponse']
export type BlockedDate = components['schemas']['VenueBlockedDateResponse']
export type CancellationPolicy = components['schemas']['CancellationPolicyResponse']
export type CalendarResponse = components['schemas']['CalendarResponse']
export type AvailabilityResponse = components['schemas']['AvailabilityResponse']
export type PricingQuote = components['schemas']['PricingQuote'] & {
  // Hand-added until `pnpm generate` is run (mirrors PricingQuote in venue/schemas.py)
  breakdown?: PricingBreakdownItem[]
  clamped?: boolean
}
export type ValidationResponse = components['schemas']['ValidationResponse']
export type SearchResult = components['schemas']['SearchResult'] & {
  // Hand-added until `pnpm generate` is run (mirrors SearchResult in
  // search/schemas.py) — match diagnostics, only populated by /search/hybrid.
  match_source?: 'hybrid' | 'semantic' | 'keyword' | null
  fts_score?: number | null
  vector_score?: number | null
  category_boost?: number | null
  match_score?: number | null
  is_liked?: boolean
}
// Page_SearchResult_'s generated `items` type points at the raw (unpatched)
// components['schemas']['SearchResult'], not the SearchResult alias above —
// override it here so callers reading match diagnostics off paginated
// results get the patched fields too.
export type SearchPage = Omit<components['schemas']['Page_SearchResult_'], 'items'> & {
  items: SearchResult[]
}
// Hand-written until `pnpm generate` is run — mirrors SearchResultPage in
// search/schemas.py. /search/hybrid and /search/fts now return this
// keyset-paginated shape (next_cursor/has_more) instead of Page_SearchResult_
// (page/page_size), which /search/ and Deep Research's internal_results
// still use.
export type SearchResultPage = {
  items: SearchResult[]
  total: number
  next_cursor?: string | null
  has_more: boolean
}

// Hand-written until `pnpm generate` is run against a live API (mirrors
// app/modules/venue/schemas.py — VenuePricingRuleResponse / PricingBreakdownItem).
export type PricingRuleAdjustmentType = 'multiplier' | 'fixed_delta' | 'override'
export type PricingRuleAppliesTo = 'full_day' | 'time_slot' | 'both'

export interface PricingBreakdownItem {
  period_date: string
  start_time?: string | null
  end_time?: string | null
  base_paise: number
  applied_rule_id?: string | null
  applied_rule_name?: string | null
  clamped: boolean
  final_paise: number
}

export interface PricingRule {
  id: string
  venue_id: string
  name: string
  days_of_week?: number[] | null
  start_date?: string | null
  end_date?: string | null
  start_time?: string | null
  end_time?: string | null
  adjustment_type: PricingRuleAdjustmentType
  multiplier?: number | null
  amount_paise?: number | null
  applies_to: PricingRuleAppliesTo
  priority: number
  source: 'owner' | 'system'
  is_active: boolean
  created_at: string
  updated_at: string
  exceeds_bounds: boolean
}

export interface PricingPreview {
  pricing_mode: string
  quoted_price_paise: number
  platform_commission_pct: number
  platform_fee_paise: number
  owner_payout_paise: number
  advance_pct: number
  advance_due_paise: number
  balance_due_paise: number
  display: {
    quoted_price: string
    advance_due: string
    balance_due: string
    platform_fee: string
    owner_payout: string
  }
  breakdown: PricingBreakdownItem[]
  clamped: boolean
}

export type VenueListResponse = {
  id: string
  name: string
  slug: string | null
  city: string
  max_capacity: number
  status: string
  is_active: boolean
  category_name: string
  cover_photo_url: string | null
  last_completed_step: number | null
  rejection_reason?: string | null
}

export type VenueStatsResponse = {
  active_bookings: number
  revenue_this_month_paise: number
}
