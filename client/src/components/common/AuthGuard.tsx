import React, { useEffect, useState, useRef } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/useToast';

const AuthGuard: React.FC = () => {
  const { isAuthenticated, loading, verifySession } = useAuth();
  const { error: showError } = useToast();
  const [checking, setChecking] = useState(true);
  const location = useLocation();
  const checkedRef = useRef(false);

  useEffect(() => {
    if (loading || checkedRef.current) return;

    const performCheck = async () => {
      if (isAuthenticated) {
        setChecking(false);
        return;
      }

      try {
        await verifySession();
      } catch {
        showError('Session expired. Please log in again.');
      } finally {
        setChecking(false);
        checkedRef.current = true;
      }
    };
    performCheck();
  }, [location.pathname, loading, isAuthenticated, verifySession, showError]);

  if (loading || checking) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-[#1c1c1c] text-[#f2f2f2]">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-white"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    const redirectUrl = `${location.pathname}${location.search}`;
    try {
      localStorage.setItem('redirectUrl', redirectUrl);
    } catch {
      // Ignore localStorage errors
    }
    return <Navigate to={`/login?redirect=${encodeURIComponent(redirectUrl)}`} replace />;
  }

  return <Outlet />;
};

export default AuthGuard;
