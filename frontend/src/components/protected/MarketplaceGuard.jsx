import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const MarketplaceGuard = () => {
  const { user, authReady, isAdmin } = useAuth();

  if (authReady && user && isAdmin) {
    return <Navigate to="/admin/dashboard" replace />;
  }

  return <Outlet />;
};

export default MarketplaceGuard;
