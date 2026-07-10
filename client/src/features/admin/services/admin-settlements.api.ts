import { apiClient } from '@/services/apiClient';

export const adminSettlementsApi = {
  getPending: async (page = 1, limit = 10): Promise<any> => {
    const res = await apiClient.get(`/admin/settlements?page=${page}&limit=${limit}`);
    return res.data;
  },
  release: async (bookingId: string): Promise<any> => {
    const res = await apiClient.post(`/admin/settlements/${bookingId}/release`);
    return res.data;
  },
};
