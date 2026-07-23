import { Navigate, useLocation } from 'react-router-dom';

import { paths } from '@/config/paths';
import { useAuth } from '@/features/auth/hooks/use-auth';

function homeForRole(role) {
  return role === 'OWNER' ? paths.owner.dashboard.path : paths.home.path;
}

export function ProtectedRoute({ children, roles }) {
  const location = useLocation();
  const { token, user, isAuthenticated } = useAuth();

  if (!isAuthenticated || !token) {
    return <Navigate to={paths.auth.login.path} state={{ from: location }} replace />;
  }

  if (roles?.length && (!user || !roles.includes(user.role))) {
    return <Navigate to={homeForRole(user?.role)} replace />;
  }

  return children;
}
