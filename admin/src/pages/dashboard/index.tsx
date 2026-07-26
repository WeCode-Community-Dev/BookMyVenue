import { Navigate } from "react-router";
import { useApiQuery } from "@/hooks/useApi";
import { QUERY_KEYS } from "@/config/queryKeys";
import { API_ENDPOINTS } from "@/constants";
import { ROLES } from "@/constants/roles";
import { PROFILE_STALE_TIME } from "@/constants/queryConfig";
import type { UserProfile } from "@/components/guards/AuthGuard";

const DashboardPage = () => {
  const { data: profile } = useApiQuery<UserProfile>(
    QUERY_KEYS.PROFILE,
    { method: "GET", url: API_ENDPOINTS.PROFILE },
    { staleTime: PROFILE_STALE_TIME },
  );

  if (profile?.role === ROLES.ADMIN || profile?.role === ROLES.SUPER_ADMIN) {
    return <Navigate to="/dashboard/bookings" replace />;
  }

  return (
    <div>
      <h1>Dashboard</h1>
    </div>
  );
};

export default DashboardPage;
