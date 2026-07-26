import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router';
import { getSafeRedirectUrl } from '@/utils/redirect';
import { useAuth } from '@/hooks/useAuth';

const GuestGuard: React.FC = () => {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-[#1c1c1c] text-[#f2f2f2]">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-white"></div>
      </div>
    );
  }

  if (isAuthenticated) {
    const searchParams = new URLSearchParams(location.search);
    const redirectParam = searchParams.get('redirect');
    const safeRedirect = getSafeRedirectUrl(redirectParam);
    return <Navigate to={safeRedirect} replace />;
  }

  return <Outlet />;
};

export default GuestGuard;
