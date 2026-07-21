import { createClient } from '../client'

export type BookingStats = {
  total: number
  requested: number
  confirmed: number
  completed: number
  cancelled: number
}

export type AdminBookingSummary = {
  id: string
  venue_id: string
  venue_name: string
  customer_name: string | null
  customer_email: string | null
  customer_phone: string | null
  owner_id: string
  owner_name: string | null
  owner_email: string | null
  owner_phone: string | null
  status: string
  payment_status: string
  event_date: string
  guest_count: number
  created_at: string
}

export type AdminBookingListResponse = {
  items: AdminBookingSummary[]
  total: number
  page: number
  page_size: number
  total_pages: number
  stats: BookingStats
}

export type ListAdminBookingsParams = {
  page?: number
  page_size?: number
  status?: string
  search?: string
}

export const adminBookingEndpoints = (client: ReturnType<typeof createClient>) => ({
  getStats: (): Promise<BookingStats> =>
    client.get<BookingStats>('/api/admin/bookings/stats'),

  listBookings: (params: ListAdminBookingsParams = {}): Promise<AdminBookingListResponse> => {
    const qs = new URLSearchParams()
    if (params.page)      qs.set('page',      String(params.page))
    if (params.page_size) qs.set('page_size', String(params.page_size))
    if (params.status)    qs.set('status',    params.status)
    if (params.search)    qs.set('search',    params.search)
    const q = qs.toString()
    return client.get<AdminBookingListResponse>(`/api/admin/bookings${q ? `?${q}` : ''}`)
  },
})
