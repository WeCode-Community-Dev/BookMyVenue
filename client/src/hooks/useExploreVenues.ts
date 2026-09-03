import { useInfiniteQuery } from '@tanstack/react-query';
import { getPublicVenues } from '@/services/venueService';
import type { VenueFilters, PaginatedVenuesResponse } from '@/types/venue.types';

export function useExploreVenues(filters: VenueFilters, limit = 12) {
  return useInfiniteQuery<PaginatedVenuesResponse, Error>({
    queryKey: ['venues', 'public', filters],
    queryFn: async ({ pageParam = 1 }) => {
      return getPublicVenues(filters, pageParam as number, limit);
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      if (lastPage.pagination.hasNext) {
        return lastPage.pagination.page + 1;
      }
      return undefined;
    },
  });
}
