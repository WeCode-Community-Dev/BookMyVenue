import { createClient } from '../client'
import type { SearchPage } from '../model'

export type QueryUnderstanding = {
  intent: string
  city: string | null
  venue_type: string | null
  capacity: number | null
  budget_hint: string | null
  date_hint: string | null
  required_amenities: string[]
  special_requirements: string[]
}

export type DeepResearchSearchResponse = {
  query_id: string
  understanding: QueryUnderstanding
  internal_results: SearchPage
}

export type ExternalLeadPublic = {
  id: string
  name: string
  city: string | null
  formatted_address: string | null
  cover_photo_url: string | null
  category_guess: string | null
  source: string
  disclaimer: string
}

export type ExternalDiscoveryJobResponse = {
  job_id: string
  status: 'pending' | 'processing' | 'completed' | 'failed'
}

export type ExternalDiscoveryJobResult = {
  job_id: string
  status: string
  leads: ExternalLeadPublic[]
  error_message: string | null
}

export type ReserveLeadResponse = {
  reservation_id: string
  status: string
}

export type UserReservationResponse = {
  id: string
  lead: ExternalLeadPublic
  status: string
  event_date: string | null
  guest_count: number | null
  phone: string | null
  notes: string | null
  created_at: string
}

export const deepResearchEndpoints = (client: ReturnType<typeof createClient>) => ({
  search: (query: string, page = 1, page_size = 20) =>
    client.post<DeepResearchSearchResponse>('/api/deep-research/search', {
      query,
      page,
      page_size,
    }),
  triggerExternal: (query_id: string, latitude: number, longitude: number) =>
    client.post<ExternalDiscoveryJobResponse>('/api/deep-research/external', {
      query_id,
      latitude,
      longitude,
    }),
  getExternalJob: (job_id: string) =>
    client.get<ExternalDiscoveryJobResult>(`/api/deep-research/external/${job_id}`),
  reserveLead: (lead_id: string, event_date?: string, guest_count?: number, phone?: string, notes?: string) =>
    client.post<ReserveLeadResponse>(`/api/deep-research/leads/${lead_id}/reserve`, {
      event_date,
      guest_count,
      phone,
      notes,
    }),
  getMyReservations: () =>
    client.get<UserReservationResponse[]>('/api/deep-research/reservations'),
})
