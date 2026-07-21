import { Navigate } from 'react-router-dom'
import { useAuth } from '../lib/AuthContext'

type Props = {
  children: React.ReactNode
  requiredRoles?: string[]
}

export function ProtectedRoute({ children, requiredRoles }: Props) {
  const { user, loading } = useAuth()

  if (loading) return null

  if (!user) return <Navigate to="/login" replace />

  if (requiredRoles && !requiredRoles.some(r => user.roles.includes(r))) {
    return <Navigate to="/403" replace />
  }

  return <>{children}</>
}
