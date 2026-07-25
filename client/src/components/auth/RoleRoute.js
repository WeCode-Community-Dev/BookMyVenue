import { useEffect } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { ROLES } from "@/constants/Roles";
import { ROUTES } from "@/constants/routes";
import toast from "react-hot-toast";

const RoleRoute = ({ children, allowedRoles = [] }) => {
  const { user, isAuthenticated, loading } = useAuth();
  const location = useLocation();

  console.log('from role route: ', loading, isAuthenticated, user);

  // 1. Loading state
  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-t-2 border-primary-600"></div>
      </div>
    );
  }

  // 2. Unauthenticated check
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // 3. Role authorization check
  if (!user || !allowedRoles.includes(user.role)) {
    console.log('user from role route: ', user);
    console.log('moving to home page');
    return <Navigate to="/" replace />;
  }

  // 4. Role-specific checks
  // Vendor specific onboarding checks
  if (user.role === ROLES.VENDOR) {
    if (!user.isProfileUpdated && location.pathname !== '/vendor/settings') {
      toast.error('Please update your profile');
      return <Navigate to="/vendor/settings" replace />;
    }

    if (!user.isAdminVerified && location.pathname !== '/vendor/settings') {
      toast.error('Please wait for admin approval.');
      return <Navigate to="/vendor/settings" replace />;
    }
  }

  // Admin and standard User bypass the profile verification checks
  return <>{children}</>;
};

export default RoleRoute;