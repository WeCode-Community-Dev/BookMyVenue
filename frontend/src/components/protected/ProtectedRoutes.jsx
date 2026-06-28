import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import Loader from "../common/Loader";

const ProtectedRoute = ({ children }) => {
  const { user, loading, authReady } = useAuth();
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

  return children;
};

export default ProtectedRoute;
