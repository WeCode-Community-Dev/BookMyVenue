import React, { type ReactNode } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAppStore } from '@/store/app.store';

interface PublicRouteProps {
  children?: ReactNode;
}

const getRoleRedirect = (role?: string) => {
  if (role === 'admin') return '/admin/dashboard';
  if (role === 'owner') return '/owner/dashboard';
  return '/'; // default for users
};

const PublicRoute: React.FC<PublicRouteProps> = ({ children }) => {
  const { isAuthenticated, user } = useAppStore();

  if (isAuthenticated) {
    return <Navigate to={getRoleRedirect(user?.role)} replace />;
  }

  return children ? <>{children}</> : <Outlet />;
};

export default PublicRoute;
