import { createClient } from '../client'

export type AdminUserStatus = 'active' | 'suspended' | 'pending' | 'rejected'
export type AdminUserRole = 'customer' | 'venue_owner' | 'super_admin'

export type AdminUserSummary = {
  id: string
  full_name: string | null
  email: string | null
  phone: string | null
  status: AdminUserStatus
  roles: AdminUserRole[]
  created_at: string
  is_super_admin: boolean
}

export type AdminUserStats = {
  total: number
  active: number
  suspended: number
  pending: number
  rejected: number
}

export type OwnerApprovalBody = {
  reason?: string
}

export type OwnerStats = {
  total: number
  pending: number
  active: number
  rejected: number
  suspended: number
}

export type AdminUserListResponse = {
  items: AdminUserSummary[]
  total: number
  page: number
  page_size: number
  total_pages: number
  stats: AdminUserStats
}

export type ListUsersParams = {
  page?: number
  page_size?: number
  search?: string
  status?: AdminUserStatus
  role?: AdminUserRole
}

export type SuspendUserBody = {
  reason: string
}

export type ReactivateUserBody = {
  reason?: string
}

function buildQS(params: ListUsersParams = {}): string {
  const qs = new URLSearchParams()
  if (params.page)      qs.set('page',      String(params.page))
  if (params.page_size) qs.set('page_size', String(params.page_size))
  if (params.search)    qs.set('search',    params.search)
  if (params.status)    qs.set('status',    params.status)
  if (params.role)      qs.set('role',      params.role)
  const str = qs.toString()
  return str ? `?${str}` : ''
}

export type AdminAction = {
  id: string
  admin_id: string
  admin_name: string | null
  action_type: string
  target_type: string
  target_id: string
  target_name: string | null
  reason: string | null
  created_at: string
}

export type AdminActionListResponse = {
  items: AdminAction[]
  total: number
  page: number
  page_size: number
  total_pages: number
}

export type ListActionsParams = {
  page?: number
  page_size?: number
  target_type?: string
  action_type?: string
  /** Legacy — returns at most N items on page 1 (used by dashboard) */
  limit?: number
}

export type GrowthStats = {
  labels: string[]
  users: number[]
  owners: number[]
  venues: number[]
  bookings: number[]
  totals: { users: number; owners: number; venues: number; bookings: number }
}

export const adminActionEndpoints = (client: ReturnType<typeof createClient>) => ({
  listActions: (params: ListActionsParams = {}): Promise<AdminActionListResponse> => {
    const qs = new URLSearchParams()
    if (params.page)        qs.set('page',        String(params.page))
    if (params.page_size)   qs.set('page_size',   String(params.page_size))
    if (params.limit)       qs.set('limit',       String(params.limit))
    if (params.target_type) qs.set('target_type', params.target_type)
    if (params.action_type) qs.set('action_type', params.action_type)
    const q = qs.toString()
    return client.get<AdminActionListResponse>(`/api/admin/actions${q ? `?${q}` : ''}`)
  },
})

export type GrowthPeriod = '7d' | '30d' | '3m' | '6m' | '12m'

export const adminGrowthEndpoints = (client: ReturnType<typeof createClient>) => ({
  getGrowthStats: (period: GrowthPeriod = '6m'): Promise<GrowthStats> =>
    client.get<GrowthStats>(`/api/admin/growth-stats?period=${period}`),
})

export const adminUserEndpoints = (client: ReturnType<typeof createClient>) => ({
  listUsers: (params: ListUsersParams = {}): Promise<AdminUserListResponse> =>
    client.get<AdminUserListResponse>(`/api/admin/users${buildQS(params)}`),

  getUser: (userId: string): Promise<AdminUserSummary> =>
    client.get<AdminUserSummary>(`/api/admin/users/${userId}`),

  suspendUser: (userId: string, body: SuspendUserBody): Promise<void> =>
    client.patch<void>(`/api/admin/users/${userId}/suspend`, body),

  reactivateUser: (userId: string, body: ReactivateUserBody = {}): Promise<void> =>
    client.patch<void>(`/api/admin/users/${userId}/reactivate`, body),

  getOwnerStats: (): Promise<OwnerStats> =>
    client.get<OwnerStats>('/api/admin/venue-owners/stats'),

  approveOwner: (userId: string, body: OwnerApprovalBody = {}): Promise<void> =>
    client.patch<void>(`/api/admin/venue-owners/${userId}/approve`, body),

  rejectOwner: (userId: string, body: OwnerApprovalBody = {}): Promise<void> =>
    client.patch<void>(`/api/admin/venue-owners/${userId}/reject`, body),
})
