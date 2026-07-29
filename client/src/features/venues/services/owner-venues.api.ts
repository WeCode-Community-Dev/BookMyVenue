import { apiClient } from '@/services/apiClient';
import type { Venue, VenueQuery, VenueListResponse, ApiResponse } from '../types/venues.types';

export const ownerVenuesApi = {
  getAll: async (query: VenueQuery): Promise<ApiResponse<VenueListResponse>> => {
    const params = new URLSearchParams();
    if (query.page) params.set('page', String(query.page));
    if (query.limit) params.set('limit', String(query.limit));
    if (query.search) params.set('search', query.search);
    if (query.status && query.status !== 'all') params.set('status', query.status);
    if (query.category) params.set('category', query.category);
    if (query.sort) params.set('sort', query.sort);
    if (query.isDeleted) params.set('isDeleted', query.isDeleted);

    const res = await apiClient.get(`/owners/venues?${params.toString()}`);
    return res.data;
  },

  getById: async (id: string): Promise<ApiResponse<Venue>> => {
    const res = await apiClient.get(`/owners/venues/${id}`);
    return res.data;
  },

  create: async (formData: FormData): Promise<ApiResponse<Venue>> => {
    const res = await apiClient.post('/owners/venues', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return res.data;
  },

  update: async (id: string, formData: FormData): Promise<ApiResponse<Venue>> => {
    const res = await apiClient.patch(`/owners/venues/${id}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return res.data;
  },

  softDelete: async (id: string): Promise<ApiResponse<Venue>> => {
    const res = await apiClient.delete(`/owners/venues/${id}`);
    return res.data;
  },

  restore: async (id: string): Promise<ApiResponse<Venue>> => {
    const res = await apiClient.patch(`/owners/venues/${id}/restore`);
    return res.data;
  },

  getAvailability: async (
    venueId: string
  ): Promise<ApiResponse<import('../types/venues.types').AvailabilityConfig>> => {
    const res = await apiClient.get(`/owners/venues/${venueId}/availability`);
    return res.data;
  },

  createAvailability: async (
    venueId: string,
    data: import('../types/venues.types').AvailabilityConfig
  ): Promise<ApiResponse<import('../types/venues.types').AvailabilityConfig>> => {
    const res = await apiClient.post(`/owners/venues/${venueId}/availability`, data);
    return res.data;
  },

  updateAvailability: async (
    venueId: string,
    data: import('../types/venues.types').AvailabilityConfig
  ): Promise<ApiResponse<import('../types/venues.types').AvailabilityConfig>> => {
    const res = await apiClient.put(`/owners/venues/${venueId}/availability`, data);
    return res.data;
  },
};
