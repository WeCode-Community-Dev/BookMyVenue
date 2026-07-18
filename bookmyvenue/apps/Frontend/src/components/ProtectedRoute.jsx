import { Navigate, useLocation } from "react-router-dom";
import { useEffect } from "react";

import Loading from "./common/Loading";
import { useAuth } from "../context/AuthContext";

function ProtectedRoute({ children, allowedRoles }) {

  const { currentUser, loading } = useAuth();
  const location = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  if (loading) {
    return <Loading message="Loading..." />;
  }

  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }

  if (
    allowedRoles &&
    !allowedRoles.includes(currentUser.role)
  ) {
    return <Navigate to="/" replace />;
  }

  return children;
}

export default ProtectedRoute;