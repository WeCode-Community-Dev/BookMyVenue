import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function ProtectedRoute({ children, allowedRoles }) {
  const { token, currentUser, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!token || !currentUser) {
    return <Navigate to="/login" replace />;
  }

  if (!allowedRoles.includes(currentUser.role)) {
    return <Navigate to="/" replace />;
  }

  return children;
}

export default ProtectedRoute;