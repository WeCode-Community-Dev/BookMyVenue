export type VenueCategory = {
  id: string
  slug: string
  label: string
  icon?: string | null
  banner_image?: string | null
  is_active: boolean
  sort_order: number
}

export type BookingMode = 'MANUAL' | 'INSTANT'

export type SearchResult = {
  id: string
  name: string
  city: string
  category: VenueCategory
  capacity: number
  booking_mode?: BookingMode
  pricing_mode: string
  starting_price_paise?: number | null
  display_price_min_paise?: number | null
  display_price_max_paise?: number | null
  cover_photo_url?: string | null
  // Match diagnostics — only populated by /search/hybrid (see
  // app/modules/search/schemas.py SearchResult). Deep Research's match
  // citation UI uses these; plain search results just leave them undefined.
  match_source?: 'hybrid' | 'semantic' | 'keyword' | null
  fts_score?: number | null
  vector_score?: number | null
  category_boost?: number | null
  match_score?: number | null
}

// ─── API response shapes (mirrors OpenAPI schema) ────────────────────────────

export type VenuePhoto = {
  id: string
  venue_id: string
  image_url: string
  sort_order: number
  is_cover: boolean
  created_at: string
}

export type Amenity = {
  id: string
  name: string
  icon?: string | null
}

export type CancellationPolicy = {
  tier_1_hours?: number | null
  tier_1_refund_pct?: string | null
  tier_2_hours?: number | null
  tier_2_refund_pct?: string | null
  tier_3_hours?: number | null
  tier_3_refund_pct?: string | null
  no_show_refund_pct: string
  platform_fee_refundable: boolean
  notes?: string | null
}

export type VenueResponse = {
  id: string
  owner_id: string
  name: string
  slug?: string | null
  description?: string | null
  category: VenueCategory
  address_line1: string
  address_line2?: string | null
  city: string
  state: string
  country: string
  postal_code?: string | null
  latitude?: string | null
  longitude?: string | null
  timezone: string
  min_capacity?: number | null
  max_capacity: number
  open_time: string
  close_time: string
  spans_next_day: boolean
  allowed_booking_types: ('full_day' | 'time_slot')[]
  min_booking_duration_minutes: number
  max_booking_duration_minutes: number
  slot_interval_minutes: number
  pre_buffer_minutes: number
  post_buffer_minutes: number
  pricing_mode: 'flat' | 'hourly' | 'mixed'
  starting_price_paise?: number | null
  hourly_rate_paise?: number | null
  min_price_pct?: string
  max_price_pct?: string
  display_price_min_paise?: number | null
  display_price_max_paise?: number | null
  platform_commission_pct: string
  advance_pct: string
  balance_due_days_before_event: number
  booking_mode?: BookingMode
  owner_action_window_hours: number
  overdue_advance_refund_pct: string
  status: string
  is_active: boolean
  created_at: string
  updated_at: string
  photos?: VenuePhoto[]
  amenities?: Amenity[]
  cancellation_policy?: CancellationPolicy | null
}

export type OperatingWindow = {
  is_available: boolean
  opens_at?: string | null
  closes_at?: string | null
  spans_next_day: boolean
}

export type CalendarBlockedRange = {
  starts_at: string
  ends_at: string
  source: 'booking' | 'venue_block'
  reason?: string | null
}

export type CalendarDay = {
  date: string
  operating_window: OperatingWindow
  status: 'available' | 'partially_booked' | 'fully_booked' | 'blocked' | 'closed'
  is_bookable: boolean
  available_for_full_day: boolean
  blocked_ranges?: CalendarBlockedRange[]
}

export type CalendarResponse = {
  venue_id: string
  timezone: string
  start_date: string
  end_date: string
  days: CalendarDay[]
}

export type AvailabilityResponse = {
  date: string
  operating_window: OperatingWindow
  blocked_slots?: { starts_at: string; ends_at: string }[]
}

export type PricingBreakdownItem = {
  period_date: string
  start_time?: string | null
  end_time?: string | null
  base_paise: number
  applied_rule_id?: string | null
  applied_rule_name?: string | null
  clamped: boolean
  final_paise: number
}

export type PricingQuote = {
  quoted_price_paise: number
  platform_commission_pct: number
  platform_fee_paise: number
  owner_payout_paise: number
  advance_pct: number
  advance_due_paise: number
  balance_due_paise: number
  pricing_mode: string
  breakdown?: PricingBreakdownItem[]
  clamped?: boolean
}

export type ValidationResponse = {
  valid: boolean
  effective_starts_at: string
  effective_ends_at: string
}

// ─── Internal booking form state ──────────────────────────────────────────────

export type BookingType = 'full_day' | 'time_slot'

export type SlotSelection = {
  bookingType: BookingType
  date: string // YYYY-MM-DD
  startsAt: string | null // ISO datetime (time_slot only)
  endsAt: string | null // ISO datetime (time_slot only)
}

export type BookingDisplay = {
  quoted_price: string
  advance_due: string
  balance_due: string
  platform_fee: string
  owner_payout: string
}

export type BookingOut = {
  id: string
  venue_id: string
  venue_name: string
  venue_city: string
  venue_cover_photo_url?: string | null
  user_id: string
  booking_type: string
  status: string
  payment_status: string
  starts_at: string
  ends_at: string
  effective_starts_at: string
  effective_ends_at: string
  guest_count: number
  event_type?: string | null
  user_notes?: string | null
  owner_notes?: string | null
  quoted_price_paise: number
  platform_commission_pct: number
  platform_fee_paise: number
  owner_payout_paise: number
  advance_pct: number
  advance_due_paise: number
  balance_due_paise: number
  balance_due_date?: string | null
  hold_expires_at?: string | null
  confirmed_at?: string | null
  cancelled_at?: string | null
  amount_paid_paise: number
  refund_amount_paise: number
  stripe_advance_payment_intent_id?: string | null
  stripe_balance_payment_intent_id?: string | null
  deadline_extension_count: number
  balance_overdue_at?: string | null
  owner_action_deadline?: string | null
  display: BookingDisplay
  payment_required?: boolean
  payment_expires_at?: string | null
  payment_options?: {
    full: {
      label: string
      amount_paise: number
      display_amount: string
    }
    advance: {
      label: string
      amount_paise: number
      display_amount: string
    }
  }
}
export type CancellationPreviewOut = {
  refund_amount_paise: number
  penalty_amount_paise: number
  refund_pct_applied: number
  tier_matched: string | null
  display: { refund_amount: string; penalty_amount: string }
}
export type PaymentIntentResponse = {
  payment_id: string
  booking_id: string
  client_secret: string | null
  amount_paise: number
  currency: string
  status: string
}
export type NotificationResponse = {
  id: string
  user_id: string
  booking_id: string | null
  type: string
  title: string
  body: string
  read_at: string | null
  created_at: string
}