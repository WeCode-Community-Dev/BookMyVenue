import { Suspense } from 'react'
import { RouterProvider } from 'react-router-dom'
import { LoadingScreen } from '@venue404/ui'
import { router } from './routes'

export default function App() {
  return (
    <Suspense fallback={<LoadingScreen />}>
      <RouterProvider router={router} />
    </Suspense>
  )
}
