import { Navigate, Outlet, useLocation } from "react-router";
import { Loader2 } from "lucide-react";
import { useApiQuery } from "@/hooks/useApi";
import { QUERY_KEYS } from "@/config/queryKeys";
import { API_ENDPOINTS } from "@/constants";
import { ROLES } from "@/constants/roles";
import { PROFILE_STALE_TIME } from "@/constants/queryConfig";

export interface UserProfile {
  _id: string;
  name: string;
  email: string;
  role: "owner" | "admin" | "superAdmin";
  avatar?: string;
  phone?: string;
}

export function AuthGuard() {
  const location = useLocation();
  const {
    data: profile,
    isLoading,
    isError,
  } = useApiQuery<UserProfile>(
    QUERY_KEYS.PROFILE,
    { method: "GET", url: API_ENDPOINTS.PROFILE },
    { staleTime: PROFILE_STALE_TIME },
  );

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-[var(--bg-primary)]">
        <Loader2 className="h-8 w-8 animate-spin text-zinc-500" />
      </div>
    );
  }

  if (isError || !profile) {
    const redirectUrl = `${location.pathname}${location.search}`;
    try {
      localStorage.setItem("redirectUrl", redirectUrl);
    } catch {
      // Ignore localStorage errors
    }
    return (
      <Navigate
        to={`/login?redirect=${encodeURIComponent(redirectUrl)}`}
        replace
      />
    );
  }

  if (
    profile.role !== ROLES.OWNER &&
    profile.role !== ROLES.ADMIN &&
    profile.role !== ROLES.SUPER_ADMIN
  ) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <Outlet />;
}
