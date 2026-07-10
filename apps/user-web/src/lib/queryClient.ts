import { QueryClient } from '@tanstack/react-query'

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // staleTime: 0 (the React Query default) meant every window focus /
      // remount refetched everything, even data fetched a second ago.
      // Individual queries that need tighter freshness (e.g. slot
      // availability during checkout) should override this per-query.
      staleTime: 30 * 1000,
      retry: 1,
    },
  },
})
