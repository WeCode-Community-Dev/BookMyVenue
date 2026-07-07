import { createClient } from '../client'
import type { Venue, VenuePhoto, Amenity, VenueAvailability, BlockedDate, VenueCategory, CalendarResponse, AvailabilityResponse, PricingQuote, ValidationResponse, SearchPage, PricingRule, PricingPreview, VenueListResponse, VenueStatsResponse } from '../model'

export const venueEndpoints = (client: ReturnType<typeof createClient>) => ({
  getVenueCategories: () => client.get<VenueCategory[]>('/api/venues/categories'),
  getVenue: (id: string) => client.get<Venue>(`/api/venues/${id}`),
  toggleVenueLike: (id: string) => client.post<{ is_liked: boolean }>(`/api/venues/${id}/like`, {}),
  getLikedVenueIds: () => client.get<string[]>('/api/venues/likes'),
  createVenue: (body: unknown) => client.post<Venue>('/api/venues/', body),
  updateVenue: (id: string, body: unknown) => client.patch<Venue>(`/api/venues/${id}`, body),
  addVenuePhoto: (id: string, body: FormData) =>
    client.post<VenuePhoto>(`/api/venues/${id}/photos`, body),
  deleteVenuePhoto: (venueId: string, photoId: string) =>
    client.delete<void>(`/api/venues/${venueId}/photos/${photoId}`),
  bulkUpdateVenuePhotos: (id: string, body: unknown) =>
    client.put<void>(`/api/venues/${id}/photos/bulk-update`, body),
  getMyVenues: () => client.get<VenueListResponse[]>('/api/venues/my/venues'),
  getMyVenue: (id: string) => client.get<Venue>(`/api/venues/my/venues/${id}`),
  getVenueStats: (id: string) => client.get<VenueStatsResponse>(`/api/venues/my/venues/${id}/stats`),
  getVenueBookings: (id: string) => client.get<unknown[]>(`/api/venues/${id}/bookings`),
  getPendingVenueBookings: (id: string) =>
    client.get<unknown[]>(`/api/venues/${id}/bookings/pending`),
  updateCancellationPolicy: (id: string, body: unknown) =>
    client.put<void>(`/api/venues/${id}/cancellation-policy`, body),
  getPlatformAmenities: () => client.get<Amenity[]>('/api/venues/amenities'),
  updateVenueAmenities: (id: string, body: unknown) =>
    client.put<void>(`/api/venues/${id}/amenities`, body),
  getVenueAvailability: (id: string) =>
    client.get<VenueAvailability[]>(`/api/venues/${id}/availability`),
  bulkUpdateVenueAvailability: (id: string, body: unknown) =>
    client.put<VenueAvailability[]>(`/api/venues/${id}/availability`, body),
  getBlockedDates: (id: string) => client.get<BlockedDate[]>(`/api/venues/${id}/blocked-dates`),
  createBlockedDate: (id: string, body: unknown) =>
    client.post<BlockedDate>(`/api/venues/${id}/blocked-dates`, body),
  deleteBlockedDate: (venueId: string, blockedId: string) =>
    client.delete<void>(`/api/venues/${venueId}/blocked-dates/${blockedId}`),
  submitVenue: (id: string) => client.post<Venue>(`/api/venues/${id}/submit`, {}),
  search: (params: Record<string, string | number>) => {
    const qs = new URLSearchParams(
      Object.fromEntries(Object.entries(params).map(([k, v]) => [k, String(v)]))
    ).toString()
    return client.get<SearchPage>(`/api/search/?${qs}`)
  },
  hybrid_search: (params: Record<string, string | number>) => {
    const qs = new URLSearchParams(
      Object.fromEntries(Object.entries(params).map(([k, v]) => [k, String(v)]))
    ).toString()
    return client.get<SearchPage>(`/api/search/hybrid?${qs}`)
  },
  getCancellationPolicy: (id: string) =>
    client.get<unknown>(`/api/venues/${id}/cancellation-policy`),
  getPricingPreview: (id: string, params: { starts_at: string; ends_at: string; booking_type: string }) => {
    const qs = new URLSearchParams(params).toString()
    return client.get<PricingPreview>(`/api/venues/${id}/pricing?${qs}`)
  },
  getPricingRules: (id: string) => client.get<PricingRule[]>(`/api/venues/${id}/pricing-rules`),
  createPricingRule: (id: string, body: unknown) => client.post<PricingRule>(`/api/venues/${id}/pricing-rules`, body),
  updatePricingRule: (venueId: string, ruleId: string, body: unknown) =>
    client.patch<PricingRule>(`/api/venues/${venueId}/pricing-rules/${ruleId}`, body),
  deletePricingRule: (venueId: string, ruleId: string) =>
    client.delete<void>(`/api/venues/${venueId}/pricing-rules/${ruleId}`),
  getOwnerPricingPreview: (id: string, params: { starts_at: string; ends_at: string; booking_type: string }) => {
    const qs = new URLSearchParams(params).toString()
    return client.get<PricingPreview>(`/api/venues/${id}/pricing-preview?${qs}`)
  },
  getCalendar: (id: string, params: { start_date: string; end_date: string }) => {
    const qs = new URLSearchParams(params).toString()
    return client.get<CalendarResponse>(`/api/availability/venues/${id}/calendar?${qs}`)
  },
  getDateAvailability: (id: string, booking_date: string) =>
    client.get<AvailabilityResponse>(`/api/availability/venues/${id}/date/${booking_date}`),
  getQuote: (id: string, params: { starts_at: string; ends_at: string; booking_type: string }) => {
    const qs = new URLSearchParams(params).toString()
    return client.get<PricingQuote>(`/api/availability/venues/${id}/quote?${qs}`)
  },
  validateSlot: (
    id: string,
    params: {
      booking_type: string
      starts_at?: string | null
      ends_at?: string | null
      booking_date?: string | null
      guest_count?: number
    }
  ) => {
    const query: Record<string, string> = {}
    if (params.starts_at) query.starts_at = params.starts_at
    if (params.ends_at) query.ends_at = params.ends_at
    if (params.booking_date) query.booking_date = params.booking_date
    if (params.guest_count) query.guest_count = String(params.guest_count)
    const qs = new URLSearchParams(query).toString()
    return client.post<ValidationResponse>(
      `/api/availability/venues/${id}/validate?booking_type=${params.booking_type}&${qs}`,
      {}
    )
  },
})
