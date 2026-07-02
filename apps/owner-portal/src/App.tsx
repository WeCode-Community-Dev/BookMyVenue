import { RouterProvider } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { router } from './routes'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
})

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Toaster 
        position="top-center" 
        toastOptions={{
          style: {
            background: '#fff',
            color: '#18181b',
            boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
            borderRadius: '0.5rem',
            border: '1px solid #e4e4e7',
          }
        }} 
      />
      <RouterProvider router={router} />
    </QueryClientProvider>
  )
}
