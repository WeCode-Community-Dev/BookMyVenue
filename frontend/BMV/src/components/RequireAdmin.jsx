import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { fetchMeAsync } from "../modules/auth/authSlice";
import { isAuthenticated } from "../core/auth/tokenStorage";

// only admin users can open admin pages
function RequireAdmin() {
  const dispatch = useDispatch();
  const location = useLocation();
  const { user } = useSelector((state) => state.auth);
  const hasToken = isAuthenticated();

  useEffect(() => {
    if (hasToken && !user) {
      dispatch(fetchMeAsync());
    }
  }, [dispatch, hasToken, user]);

  if (!hasToken) {
    return <Navigate to="/admin/login" replace state={{ from: location }} />;
  }

  if (user && user.role !== "admin") {
    return <Navigate to="/admin/login" replace />;
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center h-screen text-gray-500">
        Loading admin session...
      </div>
    );
  }

  return <Outlet />;
}

export default RequireAdmin;
