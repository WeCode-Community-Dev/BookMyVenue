// Friendly type aliases over the auto-generated OpenAPI schema.
// Import from here instead of types.ts directly.
import type { components } from './types'

export type Booking = components['schemas']['BookingOut']
export type Venue = components['schemas']['VenueResponse'] & {
  rejection_reason?: string | null
}
export type VenueCategory = components['schemas']['VenueCategoryResponse']
export type Amenity = components['schemas']['AmenityResponse']
export type VenuePhoto = components['schemas']['VenuePhotoResponse']
export type VenueAvailability = components['schemas']['VenueAvailabilityResponse']
export type BlockedDate = components['schemas']['VenueBlockedDateResponse']
export type CancellationPolicy = components['schemas']['CancellationPolicyResponse']
export type CalendarResponse = components['schemas']['CalendarResponse']
export type AvailabilityResponse = components['schemas']['AvailabilityResponse']
export type PricingQuote = components['schemas']['PricingQuote']
export type ValidationResponse = components['schemas']['ValidationResponse']
export type SearchResult = components['schemas']['SearchResult']
export type SearchPage = components['schemas']['Page_SearchResult_']

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
