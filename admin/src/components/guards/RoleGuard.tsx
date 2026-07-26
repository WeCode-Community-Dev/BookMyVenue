import { Navigate, Outlet } from "react-router";
import { useApiQuery } from "@/hooks/useApi";
import { QUERY_KEYS } from "@/config/queryKeys";
import { API_ENDPOINTS } from "@/constants";
import { PROFILE_STALE_TIME } from "@/constants/queryConfig";
import type { UserProfile } from "./AuthGuard";

interface RoleGuardProps {
  allowedRoles: UserProfile["role"][];
}

export function RoleGuard({ allowedRoles }: RoleGuardProps) {
  const { data: profile, isLoading } = useApiQuery<UserProfile>(
    QUERY_KEYS.PROFILE,
    { method: "GET", url: API_ENDPOINTS.PROFILE },
    { staleTime: PROFILE_STALE_TIME },
  );

  if (isLoading) {
    return null;
  }

  if (!profile || !allowedRoles.includes(profile.role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <Outlet />;
}
