import { apiClient } from '@/services/apiClient';

export const venuesApi = {
  getAll: async () => {
    const res = await apiClient.get('/users/venues');
    return res.data;
  },
};
