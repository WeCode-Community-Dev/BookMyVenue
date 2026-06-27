import { Navigate, Outlet } from "react-router-dom";
import { useAuthStore } from "@/store/store";
import { getRoleLandingPath } from "./common/route-path";

const AuthRoute = () => {
  const { user, isAuthLoading } = useAuthStore();

  if (isAuthLoading) return null;

  if (!user) return <Outlet />;

  return <Navigate to={getRoleLandingPath(user.role)} replace />;
};

export default AuthRoute;
