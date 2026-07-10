import { apiClient } from '@/services/apiClient';
import type { Venue, VenueListResponse, ApiResponse } from '@/features/venues/types/venues.types';
import type { CategoryQuery, Category } from '@/features/categories/types';

export interface PublicVenueQuery {
  page?: number;
  limit?: number;
  search?: string;
  category?: string;
  minCapacity?: number;
  maxCapacity?: number;
  minPrice?: number;
  maxPrice?: number;
  sort?: 'newest' | 'oldest' | 'price_asc' | 'price_desc' | 'capacity_asc' | 'capacity_desc';
}

export const publicVenuesApi = {
  getAll: async (query: PublicVenueQuery): Promise<ApiResponse<VenueListResponse>> => {
    const params = new URLSearchParams();
    if (query.page) params.set('page', String(query.page));
    if (query.limit) params.set('limit', String(query.limit));
    if (query.search) params.set('search', query.search);
    if (query.category) params.set('category', query.category);
    if (query.minCapacity) params.set('minCapacity', String(query.minCapacity));
    if (query.maxCapacity) params.set('maxCapacity', String(query.maxCapacity));
    if (query.minPrice) params.set('minPrice', String(query.minPrice));
    if (query.maxPrice) params.set('maxPrice', String(query.maxPrice));
    if (query.sort) params.set('sort', query.sort);

    const res = await apiClient.get(`/venues?${params.toString()}`);
    return res.data;
  },

  getById: async (id: string): Promise<ApiResponse<Venue>> => {
    const res = await apiClient.get(`/venues/${id}`);
    return res.data;
  },

  getCategoreis: async (
    _query?: CategoryQuery
  ): Promise<{
    success: boolean;
    message: string;
    data: {
      categories: Category[];
      totalCategories: number;
      totalActive: number;
      totalInactive: number;
    };
  }> => {
    const res = await apiClient.get('/venues/categories');
    return res.data;
  },
};
