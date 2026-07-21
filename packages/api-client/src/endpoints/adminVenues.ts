import { createClient } from '../client'

export type AdminVenueOwner = {
  id: string
  full_name: string | null
  email: string | null
}

export type AdminVenueItem = {
  id: string
  name: string
  slug: string | null
  description: string | null
  venue_type: string
  address_line1: string
  city: string
  state: string
  country: string
  min_capacity: number | null
  max_capacity: number
  open_time: string
  close_time: string
  pricing_mode: 'flat' | 'hourly' | 'mixed'
  starting_price_paise: number | null
  hourly_rate_paise: number | null
  advance_pct: number
  platform_commission_pct: number
  status: 'draft' | 'pending_approval' | 'approved' | 'rejected' | 'suspended'
  is_active: boolean
  cover_photo_url: string | null
  amenities: string[]
  owner: AdminVenueOwner
  created_at: string
  updated_at: string
}

export type AdminVenueStats = {
  total: number
  pending_approval: number
  approved: number
  rejected: number
  suspended: number
  draft: number
}

export type AdminVenueListResponse = {
  items: AdminVenueItem[]
  total: number
  page: number
  page_size: number
  total_pages: number
  stats: AdminVenueStats
}

export type VenueActionBody = {
  reason?: string
}

export type ListVenuesParams = {
  page?: number
  page_size?: number
  status?: AdminVenueItem['status']
  search?: string
}

function buildQS(params: ListVenuesParams = {}): string {
  const qs = new URLSearchParams()
  if (params.page)      qs.set('page',      String(params.page))
  if (params.page_size) qs.set('page_size', String(params.page_size))
  if (params.status)    qs.set('status',    params.status)
  if (params.search)    qs.set('search',    params.search)
  const str = qs.toString()
  return str ? `?${str}` : ''
}

export const adminVenueEndpoints = (client: ReturnType<typeof createClient>) => ({
  getVenueStats: (): Promise<AdminVenueStats> =>
    client.get<AdminVenueStats>('/api/admin/venues/stats'),

  listVenues: (params: ListVenuesParams = {}): Promise<AdminVenueListResponse> =>
    client.get<AdminVenueListResponse>(`/api/admin/venues${buildQS(params)}`),

  approveVenue: (venueId: string, body: VenueActionBody = {}): Promise<void> =>
    client.patch<void>(`/api/admin/venues/${venueId}/approve`, body),

  rejectVenue: (venueId: string, body: VenueActionBody = {}): Promise<void> =>
    client.patch<void>(`/api/admin/venues/${venueId}/reject`, body),

  suspendVenue: (venueId: string, body: VenueActionBody): Promise<void> =>
    client.patch<void>(`/api/admin/venues/${venueId}/suspend`, body),

  reactivateVenue: (venueId: string, body: VenueActionBody = {}): Promise<void> =>
    client.patch<void>(`/api/admin/venues/${venueId}/reactivate`, body),
})
