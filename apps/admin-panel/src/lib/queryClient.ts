import { QueryClient } from '@tanstack/react-query'

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // staleTime: 0 (the React Query default) meant every window focus /
      // remount refetched everything, even data fetched a second ago.
      staleTime: 30 * 1000,
      retry: 1,
    },
  },
})
