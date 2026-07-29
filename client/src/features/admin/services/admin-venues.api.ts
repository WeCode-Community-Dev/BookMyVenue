import { apiClient } from '@/services/apiClient';
import type { Venue, VenueListResponse, ApiResponse } from '@/features/venues/types/venues.types';

export interface AdminVenueQuery {
  page?: number;
  limit?: number;
  search?: string;
  status?: 'pending' | 'approved' | 'rejected' | 'all';
  category?: string;
  sort?: 'asc' | 'desc';
}

export const adminVenuesApi = {
  getAll: async (query: AdminVenueQuery): Promise<ApiResponse<VenueListResponse>> => {
    const params = new URLSearchParams();
    if (query.page) params.set('page', String(query.page));
    if (query.limit) params.set('limit', String(query.limit));
    if (query.search) params.set('search', query.search);
    if (query.status && query.status !== 'all') params.set('status', query.status);
    if (query.category) params.set('category', query.category);
    if (query.sort) params.set('sort', query.sort);

    const res = await apiClient.get(`/admin/venues?${params.toString()}`);
    return res.data;
  },

  getById: async (id: string): Promise<ApiResponse<Venue>> => {
    const res = await apiClient.get(`/admin/venues/${id}`);
    return res.data;
  },

  approve: async (id: string): Promise<ApiResponse<Venue>> => {
    const res = await apiClient.patch(`/admin/venues/${id}/approve`);
    return res.data;
  },

  reject: async (id: string, rejectionReason: string): Promise<ApiResponse<Venue>> => {
    const res = await apiClient.patch(`/admin/venues/${id}/reject`, { rejectionReason });
    return res.data;
  },
};
