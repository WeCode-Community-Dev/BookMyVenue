import { useEffect, useRef } from "react";
import { Outlet, useLocation, useNavigate, useParams } from "react-router";
import { Loader2 } from "lucide-react";
import { useToast } from "@/hooks/useToast";
import { useAppStore } from "@/store/useAppStore";
import { useApiQuery } from "@/hooks/useApi";
import { QUERY_KEYS } from "@/config/queryKeys";
import { API_ENDPOINTS } from "@/constants";
import { VENUE_STATUS } from "@/constants/venueStatus";
import { PROFILE_STALE_TIME } from "@/constants/queryConfig";

interface MyVenue {
  _id: string;
  name: string;
  city: string;
  venueType: string;
  coverImage: string;
  status:
    | "Draft"
    | "PendingReview"
    | "Approved"
    | "Rejected"
    | "Suspended"
    | "Inactive";
  rejectionReason?: string;
}

interface MyVenuesResponse {
  count: number;
  venues: MyVenue[];
}

export function TenantLayout() {
  const { venueId } = useParams<{ venueId: string }>();
  const location = useLocation();
  const navigate = useNavigate();
  const { setActiveVenue, setLastVenueSubRoute } = useAppStore();
  const handledFailRef = useRef<string | null>(null);
  const { error } = useToast();

  const venueSubRoute = location.pathname.split("/").pop() ?? "reports";

  const {
    data: myVenues,
    isLoading,
    isError,
  } = useApiQuery<MyVenuesResponse>(
    QUERY_KEYS.MY_VENUES,
    { method: "GET", url: API_ENDPOINTS.MY_VENUES },
    { staleTime: PROFILE_STALE_TIME },
  );

  const venue =
    venueId && myVenues
      ? myVenues.venues.find((v) => v._id === venueId)
      : undefined;

  const isInactive = venue?.status === VENUE_STATUS.INACTIVE;

  const isAccessDenied =
    !isLoading && !isError && !!myVenues && !!venueId && !venue;
  const isBlockedStatus =
    venue &&
    venue.status !== VENUE_STATUS.APPROVED &&
    venue.status !== VENUE_STATUS.INACTIVE;

  useEffect(() => {
    if (!venueId || isLoading || isError || !myVenues) return;

    if (!venue || isBlockedStatus) {
      if (handledFailRef.current === venueId) return;
      handledFailRef.current = venueId;

      if (!venue) {
        error("Venue not found or you don't have access.");
      } else {
        error("This venue is not available for dashboard access.");
      }
      navigate("/dashboard/select-venue", { replace: true });
      return;
    }

    handledFailRef.current = null;
    setActiveVenue(venueId, venue.name, venue.status);
  }, [
    venueId,
    venue,
    isBlockedStatus,
    myVenues,
    isLoading,
    isError,
    navigate,
    setActiveVenue,
    error,
  ]);

  useEffect(() => {
    if (venue && venueSubRoute) {
      setLastVenueSubRoute(venueSubRoute);
    }
  }, [venueSubRoute, venue, setLastVenueSubRoute]);

  if (isLoading) {
    return (
      <div className="flex h-[80vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-zinc-500" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex h-[80vh] items-center justify-center">
        <p className="text-muted-foreground">
          Failed to load venues. Please try again.
        </p>
      </div>
    );
  }

  if (isAccessDenied) {
    return (
      <div className="flex h-[80vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-zinc-500" />
      </div>
    );
  }

  return (
    <>
      {isInactive && (
        <div className="flex items-center justify-center bg-purple-100 px-4 py-1.5 text-xs text-purple-700 rounded-md mb-4">
          This venue is currently inactive. New bookings are blocked.
        </div>
      )}
      <Outlet />
    </>
  );
}
