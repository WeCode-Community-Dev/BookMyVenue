import { apiClient } from '@/services/apiClient';
import type { Venue } from '@/features/venues/types/venues.types';
import type { Category } from '@/features/categories/types';

type Districts = {
  id: string;
  name: string;
  coordinates: [number, number];
  venueCount: number;
  featuredVenues: Venue[];
};
export interface HomeDataResponse {
  venues: Venue[];
  categories: Category[];
  districts: Districts[];
}

export const getHomeData = async (): Promise<HomeDataResponse> => {
  const res = await apiClient.get('/users/home');
  return res.data.data;
};
