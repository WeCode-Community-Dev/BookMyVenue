import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from 'react-redux';
import { selectIsAuthenticated, selectUserRole } from '../redux/slices/authSlice';

export default function AuthGuard({ allowedRoles }) {
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const role = useSelector(selectUserRole);
  const isInitialized = useSelector(state => state.auth.isInitialized);

  console.log("AUTHGUARD - isAuthenticated:", isAuthenticated, "role:", role);

  if (!isInitialized) return <div>Loading...</div>;

  if (!isAuthenticated) {
    console.log("AUTHGUARD - redirecting to login");
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(role)) {
    console.log("AUTHGUARD - redirecting to unauthorized, role:", role, "allowedRoles:", allowedRoles);
    return <Navigate to="/unauthorized" replace />;
  }

  return <Outlet />;
}