import { createClient } from '../client'

export type ExternalReservationStatus =
  | 'new' | 'contacted' | 'owner_interested' | 'owner_invited' | 'owner_onboarded'
  | 'venue_draft_created' | 'venue_pending_approval' | 'venue_approved'
  | 'booking_created' | 'closed' | 'cancelled' | 'rejected'

export type ExternalReservationSummary = {
  id: string
  status: ExternalReservationStatus
  lead_name: string
  lead_city: string | null
  lead_formatted_address: string | null
  customer_name: string | null
  customer_email: string | null
  category_id: string | null
  category_label: string | null
  guest_count: number | null
  event_date: string | null
  owner_id: string | null
  venue_id: string | null
  booking_id: string | null
  contact_method: string | null
  follow_up_date: string | null
  created_at: string
}

export type ExternalReservationListResponse = {
  items: ExternalReservationSummary[]
  total: number
  page: number
  page_size: number
  total_pages: number
}

export type ListExternalReservationsParams = {
  page?: number
  page_size?: number
  status?: ExternalReservationStatus
}

export type ContactOwnerBody = {
  contact_method: string
  notes?: string
  follow_up_date?: string
}

export type InviteOwnerBody = {
  venue_name: string
  owner_name?: string
  email: string
  phone?: string
}

function buildQS(params: ListExternalReservationsParams = {}): string {
  const qs = new URLSearchParams()
  if (params.page) qs.set('page', String(params.page))
  if (params.page_size) qs.set('page_size', String(params.page_size))
  if (params.status) qs.set('status', params.status)
  const str = qs.toString()
  return str ? `?${str}` : ''
}

export const adminExternalReservationEndpoints = (client: ReturnType<typeof createClient>) => ({
  listReservations: (params: ListExternalReservationsParams = {}): Promise<ExternalReservationListResponse> =>
    client.get<ExternalReservationListResponse>(`/api/admin/external-reservations${buildQS(params)}`),

  contactOwner: (reservationId: string, body: ContactOwnerBody): Promise<void> =>
    client.patch<void>(`/api/admin/external-reservations/${reservationId}/contact`, body),

  markInterested: (reservationId: string, body: { reason?: string } = {}): Promise<void> =>
    client.patch<void>(`/api/admin/external-reservations/${reservationId}/mark-interested`, body),

  inviteOwner: (reservationId: string, body: InviteOwnerBody): Promise<void> =>
    client.post<void>(`/api/admin/external-reservations/${reservationId}/invite-owner`, body),

  createBooking: (reservationId: string): Promise<void> =>
    client.post<void>(`/api/admin/external-reservations/${reservationId}/create-booking`, {}),
})
