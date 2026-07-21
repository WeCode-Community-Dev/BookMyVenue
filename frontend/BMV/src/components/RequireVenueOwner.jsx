import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Navigate, useLocation, Outlet } from "react-router-dom";
import { fetchCurrentUserAsync } from "../modules/auth/authSlice";
import { isAuthenticated as hasToken } from "../core/auth/tokenStorage";

function AuthLoading() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#f0f2f5]">
      <div className="w-8 h-8 border-2 border-rose-900 border-t-transparent rounded-full animate-spin" />
    </div>
  );
}

function RequireVenueOwner() {
  const dispatch = useDispatch();
  const location = useLocation();
  const { isAuthenticated, isLoadingUser, user } = useSelector((state) => state.auth);
  const tokenPresent = hasToken();

  useEffect(() => {
    if (tokenPresent && !user && !isLoadingUser) {
      dispatch(fetchCurrentUserAsync());
    }
  }, [dispatch, tokenPresent, user, isLoadingUser]);

  if (!tokenPresent && !isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  if (tokenPresent && !user) {
    return <AuthLoading />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  if (!user?.is_venue_owner) {
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
}

export default RequireVenueOwner;
