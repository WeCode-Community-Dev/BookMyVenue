import { apiClient } from '@/services/apiClient';

export const adminTransactionsApi = {
  getTransactions: async (params: {
    page?: number;
    limit?: number;
    search?: string;
    type?: string;
    status?: string;
    sort?: string;
  }): Promise<any> => {
    const query = new URLSearchParams();
    if (params.page) query.append('page', params.page.toString());
    if (params.limit) query.append('limit', params.limit.toString());
    if (params.search) query.append('search', params.search);
    if (params.type) query.append('type', params.type);
    if (params.status) query.append('status', params.status);
    if (params.sort) query.append('sort', params.sort);

    const res = await apiClient.get(`/admin/transactions?${query.toString()}`);
    return res.data;
  },

  getTransactionStats: async (): Promise<any> => {
    const res = await apiClient.get('/admin/transactions/stats');
    return res.data;
  },
};
