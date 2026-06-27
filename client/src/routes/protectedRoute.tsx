import { Navigate, Outlet } from "react-router-dom";
import { useAuthStore } from "@/store/store";
import { AUTH_ROUTES, PUBLIC_ROUTES } from "./common/route-path";
import type { UserRole } from "@/types/auth.types";

interface ProtectedRouteProps {
  allow?: UserRole[];
}

const ProtectedRoute = ({ allow }: ProtectedRouteProps) => {
  const { user, isAuthLoading } = useAuthStore();

  if (isAuthLoading) {
    return <div className="min-h-screen grid place-items-center">Loading...</div>;
  }

  if (!user) {
    return <Navigate to={AUTH_ROUTES.SIGN_IN} replace />;
  }

  if (allow && !allow.includes(user.role)) {
    return <Navigate to={PUBLIC_ROUTES.HOME} replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
