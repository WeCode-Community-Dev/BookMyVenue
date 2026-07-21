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

export interface ChatMessageDto {
  id: string
  booking_id: string
  sender_id: string
  message: string
  created_at: string
  read_at: string | null
}

export const chatEndpoints = (client: {
  get: <T>(path: string) => Promise<T>
  post: <T>(path: string, body: unknown) => Promise<T>
  patch: <T>(path: string, body: unknown) => Promise<T>
}) => ({
  listConversations: () => client.get<Conversation[]>('/api/chat/conversations'),
  listMessages: (bookingId: string, params?: { cursor?: string; limit?: number }) => {
    const qs = new URLSearchParams()
    if (params?.cursor) qs.append('cursor', params.cursor)
    if (params?.limit) qs.append('limit', params.limit.toString())
    const qsStr = qs.toString()
    return client.get<ChatMessageDto[]>(
      `/api/chat/bookings/${bookingId}/messages${qsStr ? `?${qsStr}` : ''}`,
    )
  },
  sendMessage: (bookingId: string, message: string) =>
    client.post<ChatMessageDto>(`/api/chat/bookings/${bookingId}/messages`, { message }),
  markRead: (bookingId: string) =>
    client.patch<{ success: boolean }>(`/api/chat/bookings/${bookingId}/read`, {}),

  /** Open an authenticated WebSocket for real-time chat on a booking */
  connectWebSocket: async (bookingId: string) => {
    const token = await getAccessToken()
    if (!token) {
      throw new Error('Not authenticated')
    }
    const wsUrl = `${BASE_URL.replace(/^http/, 'ws')}/api/chat/bookings/${bookingId}/ws?token=${encodeURIComponent(token)}`
    return new WebSocket(wsUrl)
  },
})