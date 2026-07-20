import { type ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

type ProtectedRouteProps = {
  children: ReactNode;
  allowedRoles: string[];
};

function ProtectedRoute({
  children,
  allowedRoles,
}: ProtectedRouteProps) {
  const { user, token } = useAuth();

  // User is not logged in
  if (!token || !user) {
    return <Navigate to="/login" replace />;
  }

  // User is logged in but doesn't have permission
  if (!allowedRoles.includes(user.role)) {
    switch (user.role) {
      case "customer":
        return <Navigate to="/customer/dashboard" replace />;

      case "owner":
        return <Navigate to="/owner/dashboard" replace />;

      case "root_admin":
        return <Navigate to="/admin/dashboard" replace />;

      default:
        return <Navigate to="/login" replace />;
    }
  }

  // User is authorized
  return children;
}

export default ProtectedRoute;