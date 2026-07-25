import { Navigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { ROLES } from "@/constants/Roles";

const PublicRoute = ({ children }) => {
  const { user, isAuthenticated, loading } = useAuth();

  console.log("PublicRoute:", { loading, isAuthenticated, user });

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
         <p className="text-lg font-semibold">Loading...</p>
      </div>
    );
  }

  // If user is already logged in, redirect based on role
  if (isAuthenticated && user) {
    if (user.role === ROLES.ADMIN) {
      return <Navigate to="/admin/dashboard" replace />;
    }

    if (user.role === ROLES.VENDOR) {
      return <Navigate to="/vendor/dashboard" replace />;
    }

    if (user.role === ROLES.USER) {
      return <Navigate to="/" replace />;
      
    }
  }

  return <>{children}</>;
};

export default PublicRoute;