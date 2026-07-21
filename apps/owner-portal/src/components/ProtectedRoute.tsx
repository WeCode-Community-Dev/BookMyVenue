import { Navigate } from 'react-router-dom'
import { useAuth } from '../lib/AuthContext'

const ALLOWED_ROLES = ['venue_owner', 'super_admin']

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth()

  if (loading) return null

  if (!user) return <Navigate to="/login" replace />

  // Check status first — pending/rejected users go to their own pages
  // regardless of whether the role assignment completed.
  if (user.profile.status === 'pending') return <Navigate to="/pending-approval" replace />
  if (user.profile.status === 'rejected') return <Navigate to="/rejected" replace />

  if (!ALLOWED_ROLES.some(r => user.roles.includes(r))) {
    return <Navigate to="/403" replace />
  }

  return <>{children}</>
}
