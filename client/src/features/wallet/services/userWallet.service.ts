import apiClient from '@/services/apiClient';

export const walletApi = {
  getUserWallet: async () => {
    const res = await apiClient.get('/users/wallet');
    return res.data;
  },
};
