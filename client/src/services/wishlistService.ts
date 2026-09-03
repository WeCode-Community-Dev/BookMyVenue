import { axiosInstance } from '@/config/axios';
import { API_ENDPOINTS } from '@/constants';

export interface WishlistResponse {
  wishlisted: boolean;
}

export interface WishlistStatusResponse {
  [venueId: string]: boolean;
}

export async function toggleWishlist(venueId: string): Promise<WishlistResponse> {
  const { data } = await axiosInstance.post<{ data: WishlistResponse }>(
    API_ENDPOINTS.WISHLIST_TOGGLE(venueId)
  );
  return data.data;
}

export async function getMyWishlist(page: number = 1, limit: number = 20) {
  const { data } = await axiosInstance.get(API_ENDPOINTS.WISHLIST, {
    params: { page, limit },
  });
  return data;
}

export async function getWishlistStatus(venueIds: string[]): Promise<WishlistStatusResponse> {
  if (!venueIds.length) return {};

  const { data } = await axiosInstance.get<{ data: WishlistStatusResponse }>(
    API_ENDPOINTS.WISHLIST_STATUS,
    {
      params: {
        venueIds: venueIds.join(','),
      },
    }
  );
  return data.data;
}

export async function syncWishlist(venueIds: string[]): Promise<WishlistStatusResponse> {
  if (!venueIds.length) return {};

  const { data } = await axiosInstance.post<{ data: WishlistStatusResponse }>(
    API_ENDPOINTS.WISHLIST_SYNC,
    {
      venueIds,
    }
  );
  return data.data;
}
