import { createClient } from '../client'

export type Notification = {
  id: string
  user_id: string
  booking_id: string | null
  type: string
  title: string
  body: string
  read_at: string | null
  created_at: string
}

export interface NotificationListResponse {
  data: Notification[]
  meta: {
    page: number
    per_page: number
    total: number
    total_pages: number
  }
}

export const notificationEndpoints = (client: ReturnType<typeof createClient>) => ({
  list: (params?: { page?: number; per_page?: number }) => {
    const qs = new URLSearchParams()
    if (params?.page) qs.append('page', params.page.toString())
    if (params?.per_page) qs.append('per_page', params.per_page.toString())
    const qsStr = qs.toString()
    return client.get<NotificationListResponse>(`/api/notifications/${qsStr ? `?${qsStr}` : ''}`)
  },
  markRead: (id: string) => client.patch<void>(`/api/notifications/${id}/read`, {}),
})
