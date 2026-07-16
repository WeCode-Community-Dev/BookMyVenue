import { createClient } from '../client'

export type PlatformLedgerStats = {
  gross_volume_paise: number
  platform_fees_paise: number
  refunds_issued_paise: number
  payouts_completed_paise: number
}

export type PlatformLedgerEntry = {
  id: string
  booking_id: string
  venue_id: string
  venue_name: string | null
  owner_id: string
  owner_name: string | null
  user_full_name: string | null
  entry_type: string
  amount_paise: number
  direction: string
  stripe_pi_ref: string | null
  created_at: string
}

export type PlatformLedgerListResponse = {
  items: PlatformLedgerEntry[]
  total: number
  page: number
  page_size: number
  total_pages: number
}

export type ListFinancialsLedgerParams = {
  page?: number
  page_size?: number
  entry_type?: string
  search?: string
}

export const adminFinancialsEndpoints = (client: ReturnType<typeof createClient>) => ({
  getStats: (): Promise<PlatformLedgerStats> =>
    client.get<PlatformLedgerStats>('/api/admin/financials/stats'),

  listLedger: (params: ListFinancialsLedgerParams = {}): Promise<PlatformLedgerListResponse> => {
    const qs = new URLSearchParams()
    if (params.page)       qs.set('page',       String(params.page))
    if (params.page_size)  qs.set('page_size',  String(params.page_size))
    if (params.entry_type) qs.set('entry_type', params.entry_type)
    if (params.search)     qs.set('search',     params.search)
    const q = qs.toString()
    return client.get<PlatformLedgerListResponse>(`/api/admin/financials/ledger${q ? `?${q}` : ''}`)
  },
})
