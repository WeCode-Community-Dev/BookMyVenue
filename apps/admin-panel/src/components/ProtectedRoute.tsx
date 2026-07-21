import { Navigate } from 'react-router-dom'
import { useAuth } from '../lib/AuthContext'
import { LoadingScreen } from '@venue404/ui'

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth()

  if (loading) return <LoadingScreen message="Verifying session…" />

  if (!user) return <Navigate to="/login" replace />

  if (!user.roles.includes('super_admin')) {
    return <Navigate to="/403" replace />
  }

  return <>{children}</>
}
