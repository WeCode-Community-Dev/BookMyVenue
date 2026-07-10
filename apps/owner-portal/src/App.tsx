import { Suspense } from 'react'
import { RouterProvider } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { LoadingScreen } from '@venue404/ui'
import { router } from './routes'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
      staleTime: 30 * 1000,
    },
  },
})

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Toaster 
        position="top-center" 
        toastOptions={{
          className: '!bg-white dark:!bg-ink-900 !text-zinc-900 dark:!text-zinc-100 !border !border-zinc-200 dark:!border-ink-800',
        }} 
      />
      <Suspense fallback={<LoadingScreen />}>
        <RouterProvider router={router} />
      </Suspense>
    </QueryClientProvider>
  )
}
