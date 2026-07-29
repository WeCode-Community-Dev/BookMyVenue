import { apiClient } from '@/services/apiClient';
import type { Category, CategoryQuery } from '../types';

export const categoriesApi = {
  getAll: async (
    query: CategoryQuery
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
    const res = await apiClient.get('/admin/categories', { params: query });
    return res.data;
  },
  getById: async (id: string): Promise<{ success: boolean; message: string; data: Category }> => {
    const res = await apiClient.get(`/admin/categories/${id}`);
    return res.data;
  },
  create: async (
    formData: FormData
  ): Promise<{ success: boolean; message: string; data: Category }> => {
    const res = await apiClient.post('/admin/categories', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return res.data;
  },
  update: async (
    id: string,
    formData: FormData
  ): Promise<{ success: boolean; message: string; data: Category }> => {
    const res = await apiClient.patch(`/admin/categories/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return res.data;
  },
  remove: async (id: string): Promise<{ success: boolean; message: string; data: Category }> => {
    const res = await apiClient.delete(`/admin/categories/${id}`);
    return res.data;
  },
  restore: async (id: string): Promise<{ success: boolean; message: string; data: Category }> => {
    const res = await apiClient.patch(`/admin/categories/${id}/restore`);
    return res.data;
  },
};
