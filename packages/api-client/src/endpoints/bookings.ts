import { createClient } from '../client'
import type { Booking, BookingListResponse } from '../model'

export const bookingEndpoints = (client: ReturnType<typeof createClient>) => ({
  getBooking: (id: string) => client.get<Booking>(`/api/bookings/${id}`),
  createBooking: (body: unknown) => client.post<Booking>('/api/bookings/', body),
  listBookings: () => client.get<Booking[]>('/api/bookings/'),
  getOwnerBookings: (params?: { tab?: string, venue_id?: string, search?: string, page?: number, per_page?: number }) => {
    const qs = new URLSearchParams()
    if (params?.tab) qs.append('tab', params.tab)
    if (params?.venue_id) qs.append('venue_id', params.venue_id)
    if (params?.search) qs.append('search', params.search)
    if (params?.page) qs.append('page', params.page.toString())
    if (params?.per_page) qs.append('per_page', params.per_page.toString())
    const qsStr = qs.toString()
    return client.get<BookingListResponse>(`/api/bookings/owner${qsStr ? `?${qsStr}` : ''}`)
  },
  getCancellationPreview: (bookingId: string) =>
    client.get<unknown>(`/api/bookings/${bookingId}/cancellation-preview`),
  cancelBooking: (bookingId: string) =>
    client.post<Booking>(`/api/bookings/${bookingId}/cancel`, {}),
  acceptBooking: (bookingId: string) =>
    client.post<Booking>(`/api/bookings/${bookingId}/accept`, {}),
  rejectBooking: (bookingId: string, reason: string) =>
    client.post<Booking>(`/api/bookings/${bookingId}/reject`, { reason }),
  extendBalanceDeadline: (bookingId: string, new_due_date: string) =>
    client.post<Booking>(`/api/bookings/${bookingId}/extend-balance-deadline`, { new_due_date }),
  cancelForfeit: (bookingId: string) =>
    client.post<Booking>(`/api/bookings/${bookingId}/cancel-forfeit`, {}),
  cancelGoodwill: (bookingId: string) =>
    client.post<Booking>(`/api/bookings/${bookingId}/cancel-goodwill`, {}),
  updateOwnerNotes: (bookingId: string, notes: string | null) =>
    client.patch<Booking>(`/api/bookings/${bookingId}/owner-notes`, { notes }),
})
