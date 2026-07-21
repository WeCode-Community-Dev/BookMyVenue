import { createClient } from '../client'

export type { VenueCategory } from '../model'

export type AdminCategory = {
  id: string
  slug: string
  label: string
  icon: string | null
  banner_image: string | null
  is_active: boolean
  sort_order: number
  created_at: string
  deleted_at: string | null
  venue_count: number
}

export type AdminCategoryListResponse = {
  items: AdminCategory[]
  total: number
}

export type CreateCategoryBody = {
  slug: string
  label: string
  icon?: string | null
  sort_order?: number
}

export type UpdateCategoryBody = {
  label?: string
  icon?: string | null
  sort_order?: number
  is_active?: boolean
}

export type CategoryDeleteResponse = {
  deleted: boolean
  venue_count: number
}

export type CategoryBannerResponse = {
  banner_image: string | null
}

export const adminCategoryEndpoints = (client: ReturnType<typeof createClient>) => ({
  listCategories: (params: { include_deleted?: boolean } = {}): Promise<AdminCategoryListResponse> => {
    const qs = new URLSearchParams()
    if (params.include_deleted) qs.set('include_deleted', 'true')
    const q = qs.toString()
    return client.get<AdminCategoryListResponse>(`/api/admin/categories${q ? `?${q}` : ''}`)
  },

  createCategory: (body: CreateCategoryBody): Promise<AdminCategory> =>
    client.post<AdminCategory>('/api/admin/categories', body),

  updateCategory: (categoryId: string, body: UpdateCategoryBody): Promise<AdminCategory> =>
    client.patch<AdminCategory>(`/api/admin/categories/${categoryId}`, body),

  uploadCategoryBanner: (categoryId: string, formData: FormData): Promise<CategoryBannerResponse> =>
    client.post<CategoryBannerResponse>(`/api/admin/categories/${categoryId}/banner-image`, formData),

  deleteCategoryBanner: (categoryId: string): Promise<CategoryBannerResponse> =>
    client.delete<CategoryBannerResponse>(`/api/admin/categories/${categoryId}/banner-image`),

  deleteCategory: (categoryId: string): Promise<CategoryDeleteResponse> =>
    client.delete<CategoryDeleteResponse>(`/api/admin/categories/${categoryId}`),
})
