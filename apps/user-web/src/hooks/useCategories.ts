import { useQuery } from '@tanstack/react-query'
import { createClient, venueEndpoints } from '@venue404/api-client'

export function useCategories(options?: { enabled?: boolean }) {
  const client = createClient()
  return useQuery({
    queryKey: ['venue-categories'],
    queryFn: () => venueEndpoints(client).getVenueCategories(),
    staleTime: 1000 * 60 * 60, // 1 hour
    ...options,
  })
}
