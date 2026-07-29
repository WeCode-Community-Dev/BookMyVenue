import { Navigate } from "react-router-dom";
// import { useAuth } from "@/hooks/useAuth";
import { ROLES } from "@/constants/Roles";
import { useSelector } from "react-redux";

const PublicRoute = ({ children }) => {
  const { user, isAuthenticated, loading } = useSelector((state) => state.auth)

  console.log("PublicRoute:", { loading, isAuthenticated, user });

  if (loading) {
    return (
        <div className='flex h-screen items-center justify-content'>
          <div className='h-12 w-12 animate-spin rounded-full border-b-2 border-t-2 border-amber-600'></div>
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

    if(user.role === "customer")
       return <Navigate to="/" replace />;
      
  }

  return <>{children}</>;
};

export default PublicRoute;