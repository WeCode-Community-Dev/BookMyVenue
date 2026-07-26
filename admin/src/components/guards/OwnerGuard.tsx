import { Navigate, Outlet, useLocation } from "react-router";
import { useApiQuery } from "@/hooks/useApi";
import { QUERY_KEYS } from "@/config/queryKeys";
import { API_ENDPOINTS } from "@/constants";
import { ROLES } from "@/constants/roles";
import { PROFILE_STALE_TIME } from "@/constants/queryConfig";
import { ROUTES } from "@/constants/routes";
import type { UserProfile } from "./AuthGuard";

export function OwnerGuard() {
  const location = useLocation();
  const { data: profile } = useApiQuery<UserProfile>(
    QUERY_KEYS.PROFILE,
    { method: "GET", url: API_ENDPOINTS.PROFILE },
    { staleTime: PROFILE_STALE_TIME },
  );

  if (profile?.role === ROLES.OWNER && location.pathname === ROUTES.DASHBOARD) {
    return <Navigate to="/dashboard/select-venue" replace />;
  }

  return <Outlet />;
}
