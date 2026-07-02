import { createClient } from '../client'

type ApiClient = ReturnType<typeof createClient>

export type DashboardStats = {
  active_venues: number
  pending_requests: number
  active_bookings: number
  completed_bookings: number
  cancelled_bookings: number
  gross_volume_paise: number
  net_revenue_paise: number
  available_balance_paise: number
  platform_fees_paise: number
  refunds_issued_paise: number
  payouts_completed_paise: number
}

export type ChartDataPoint = {
  month: string
  enquiries: number
  completed: number
  cancelled: number
}

export type UpcomingEvent = {
  booking_id: string
  event_type: string | null
  venue_name: string
  status: string
  starts_at: string | null
  guest_count: number
}



export const ownerEndpoints = (client: ApiClient) => ({
  getDashboardStats: (): Promise<DashboardStats> => {
    return client.get<DashboardStats>('/api/owner/dashboard/stats')
  },
  getDashboardChart: (time_range?: string): Promise<ChartDataPoint[]> => {
    const qs = time_range ? `?time_range=${time_range}` : ''
    return client.get<ChartDataPoint[]>(`/api/owner/dashboard/chart${qs}`)
  },
  getUpcomingEvents: (): Promise<UpcomingEvent[]> => {
    return client.get<UpcomingEvent[]>('/api/owner/dashboard/upcoming-events')
  }
})
