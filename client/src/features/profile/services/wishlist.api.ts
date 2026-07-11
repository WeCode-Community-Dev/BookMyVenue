import { apiClient } from '@/services/apiClient';

export interface ToggleWishlistResponse {
  success: boolean;
  message: string;
  data: {
    wishlist: string[];
    isAdded: boolean;
  };
}

export interface GetWishlistResponse {
  success: boolean;
  message: string;
  data: any[]; // Populated venue array
}

export const wishlistApi = {
  getWishlist: async (): Promise<GetWishlistResponse> => {
    const res = await apiClient.get('/users/wishlist');
    return res.data;
  },

  toggleWishlist: async (venueId: string): Promise<ToggleWishlistResponse> => {
    const res = await apiClient.post(`/users/wishlist/toggle/${venueId}`);
    return res.data;
  },
};
