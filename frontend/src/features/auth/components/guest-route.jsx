import { Navigate } from 'react-router-dom';

import { paths } from '@/config/paths';
import { useAuth } from '@/features/auth/hooks/use-auth';

export function GuestRoute({ children }) {
  const { isAuthenticated, user } = useAuth();

  if (isAuthenticated) {
    const destination = user?.role === 'OWNER' ? paths.owner.dashboard.path : paths.home.path;
    return <Navigate to={destination} replace />;
  }

  return children;
}
