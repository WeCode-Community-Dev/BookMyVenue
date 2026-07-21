import { createClient } from '../client'

export type AdminAmenity = {
  id: string
  name: string
  icon: string | null
  created_at: string
  deleted_at: string | null
  active_venue_count: number
}

export type AdminAmenityListResponse = {
  items: AdminAmenity[]
  total: number
}

export type CreateAmenityBody = {
  name: string
  icon?: string | null
}

export type UpdateAmenityBody = {
  name?: string
  icon?: string | null
}

export type AmenityDeleteResponse = {
  deleted: boolean
  active_venue_count: number
}

export const adminAmenityEndpoints = (client: ReturnType<typeof createClient>) => ({
  listAmenities: (params: { include_deleted?: boolean } = {}): Promise<AdminAmenityListResponse> => {
    const qs = new URLSearchParams()
    if (params.include_deleted) qs.set('include_deleted', 'true')
    const q = qs.toString()
    return client.get<AdminAmenityListResponse>(`/api/admin/amenities${q ? `?${q}` : ''}`)
  },

  createAmenity: (body: CreateAmenityBody): Promise<AdminAmenity> =>
    client.post<AdminAmenity>('/api/admin/amenities', body),

  updateAmenity: (amenityId: string, body: UpdateAmenityBody): Promise<AdminAmenity> =>
    client.patch<AdminAmenity>(`/api/admin/amenities/${amenityId}`, body),

  deleteAmenity: (amenityId: string): Promise<AmenityDeleteResponse> =>
    client.delete<AmenityDeleteResponse>(`/api/admin/amenities/${amenityId}`),
})
