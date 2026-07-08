import { Navigate, useLocation } from 'react-router-dom';

import { paths } from '@/config/paths';
import { useAuth } from '@/features/auth/hooks/use-auth';

export function ProtectedRoute({ children, roles }) {
  const location = useLocation();
  const { token, user, isAuthenticated } = useAuth();

  if (!isAuthenticated || !token) {
    return <Navigate to={paths.auth.login.path} state={{ from: location }} replace />;
  }

  if (roles?.length && (!user || !roles.includes(user.role))) {
    return <Navigate to={paths.home.path} replace />;
  }

  return children;
}
