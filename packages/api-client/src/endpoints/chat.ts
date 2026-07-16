import { getAccessToken } from '../auth'

const BASE_URL = (typeof import.meta !== 'undefined' && (import.meta as any).env?.VITE_API_BASE_URL) ?? 'http://localhost:8000'

export interface Conversation {
  booking_id: string
  venue_name: string
  venue_city: string | null
  booking_status: string
  booking_date: string | null
  other_party_name: string | null
  last_message: string | null
  last_message_at: string | null
  last_sender_id: string | null
  unread_count: number
}

export const chatEndpoints = (client: { get: <T>(path: string) => Promise<T>, post: <T>(path: string, body: unknown) => Promise<T>, patch: <T>(path: string, body: unknown) => Promise<T> }) => ({
  listConversations: () => client.get<Conversation[]>('/api/chat/conversations'),
  listMessages: (bookingId: string, params?: { cursor?: string, limit?: number }) => {
    const qs = new URLSearchParams()
    if (params?.cursor) qs.append('cursor', params.cursor)
    if (params?.limit) qs.append('limit', params.limit.toString())
    const qsStr = qs.toString()
    return client.get(`/api/chat/bookings/${bookingId}/messages${qsStr ? `?${qsStr}` : ''}`)
  },
  sendMessage: (bookingId: string, message: string) =>
    client.post(`/api/chat/bookings/${bookingId}/messages`, { message }),
  markRead: (bookingId: string) =>
    client.patch(`/api/chat/bookings/${bookingId}/read`, {}),
  
  // WebSocket connection helper
  connectWebSocket: async (bookingId: string) => {
    const token = await getAccessToken()
    const wsUrl = `${BASE_URL.replace(/^http/, 'ws')}/api/chat/bookings/${bookingId}/ws?token=${token}`
    return new WebSocket(wsUrl)
  },
})