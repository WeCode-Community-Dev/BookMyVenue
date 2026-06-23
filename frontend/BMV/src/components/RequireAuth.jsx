import { useSelector } from "react-redux";
import { Navigate, useLocation, Outlet } from "react-router-dom";

function RequireAuth() {
  const { isAuthenticated } = useSelector((state) => state.auth);
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return <Outlet />;
}

export default RequireAuth;