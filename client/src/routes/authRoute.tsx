import { Navigate, Outlet } from "react-router-dom";
import { useAuthStore } from "@/store/store";
import { PUBLIC_ROUTES } from "./common/route-path";

const AuthRoute = () => {
  const { user, isAuthLoading } = useAuthStore();

  if (isAuthLoading) return null;

  if (!user) return <Outlet />;

  return <Navigate to={PUBLIC_ROUTES.HOME} replace />;
};

export default AuthRoute;
