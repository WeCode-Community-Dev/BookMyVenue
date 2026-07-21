import { useSelector } from "react-redux";
import { Navigate, useLocation, Outlet } from "react-router-dom";

function RequireVenueOwner() {
  const { isAuthenticated, isLoadingUser, user } = useSelector((state) => state.auth);
  const location = useLocation();

  if(isLoadingUser){
    return null;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  if (!user?.is_venue_owner) {
    // Logged in, but not a venue owner — bounce to customer dashboard
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
}

export default RequireVenueOwner;