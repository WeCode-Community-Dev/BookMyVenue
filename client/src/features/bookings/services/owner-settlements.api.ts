import { apiClient } from '@/services/apiClient';

export const ownerSettlementsApi = {
  getSettlements: async (page = 1, limit = 10): Promise<any> => {
    const res = await apiClient.get(`/owners/settlements?page=${page}&limit=${limit}`);
    return res.data;
  },
  getRevenueStats: async (): Promise<any> => {
    const res = await apiClient.get('/owners/settlements/stats');
    return res.data;
  },
};
