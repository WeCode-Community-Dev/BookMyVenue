import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import Loader from "../common/Loader";

const AdminRoute = () => {
  const { user, loading, authReady, isAdmin } = useAuth();
  const location = useLocation();

  if (loading || !authReady) {
    return (
      <main className="min-h-[60vh]">
        <Loader label="Checking access..." />
      </main>
    );
  }

  if (!user) {
    return (
      <Navigate
        to="/login"
        state={{ from: location.pathname }}
        replace
      />
    );
  }

  if (!isAdmin) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

export default AdminRoute;
