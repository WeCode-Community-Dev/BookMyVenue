import React, { useEffect, type ReactNode } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAppStore } from '@/store/app.store';
import { toast } from 'sonner';

interface ProtectedRouteProps {
  allowedRoles?: string[];
  redirectPath?: string;
  children?: ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  allowedRoles,
  redirectPath = '/signin',
  children,
}) => {
  const { isAuthenticated, user } = useAppStore();

  useEffect(() => {
    if (!isAuthenticated) {
      toast.error('Please sign in to access this page.', { id: 'auth-required' });
    } else if (allowedRoles && (!user || !allowedRoles.includes(user.role))) {
      toast.error('Access denied. You do not have the required permissions.', {
        id: 'auth-forbidden',
      });
    }
  }, [isAuthenticated, user, allowedRoles]);

  if (!isAuthenticated) {
    return <Navigate to={redirectPath} replace />;
  }

  if (allowedRoles && (!user || !allowedRoles.includes(user.role))) {
    return <Navigate to="/" replace />;
  }

  return children ? <>{children}</> : <Outlet />;
};

export default ProtectedRoute;
