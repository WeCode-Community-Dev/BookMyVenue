import { Navigate, useLocation } from "react-router-dom";
import { ROLES } from "@/constants/Roles";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import { ROUTES } from "@/constants/routes";

const RoleRoute = ({ children, allowedRoles = [] }) => {
  const { user, isAuthenticated, loading } = useSelector((state) => state.auth)
  const location = useLocation();

  console.log('from role route: ', loading, isAuthenticated, user);

  // 1. Loading state
  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-t-2 border-amber-600"></div>
      </div>
    );
  }

  // 2. Unauthenticated check
  if (!isAuthenticated) {
    return <Navigate to={ROUTES.PUBLIC.LOGIN} replace />;
  }

  // 3. Role authorization check
  if (!user || !allowedRoles.includes(user.role)) {
    console.log('user from role route: ', user);
    console.log('moving to home page');
    return <Navigate to="/" replace />;
  }

  if (user.role === ROLES.VENDOR) {
    if (user.approvalStatus !== "ACTIVE" && location.pathname !== '/vendor/profile') {
      toast.error('Please update your profile or wait for admin approval');
      return <Navigate to="/vendor/profile" replace />;
    }
  }

  // Admin and standard User bypass the profile verification checks
  return <>{children}</>;
};

export default RoleRoute;