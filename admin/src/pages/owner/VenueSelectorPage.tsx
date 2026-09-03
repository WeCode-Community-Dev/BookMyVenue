import { useEffect, useMemo } from "react";
import { useNavigate } from "react-router";
import {
  Loader2,
  Store,
  PlusCircle,
  AlertCircle,
  Info,
  Lock,
  MapPin,
} from "lucide-react";
import { useApiQuery } from "@/hooks/useApi";
import { QUERY_KEYS } from "@/config/queryKeys";
import { API_ENDPOINTS, CLIENT_APP_URL } from "@/constants";
import { VENUE_STATUS } from "@/constants/venueStatus";
import { useAppStore } from "@/store/useAppStore";
import { useToast } from "@/hooks/useToast";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

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
  suspensionReason?: string;
  isFeatured?: boolean;
}

interface MyVenuesResponse {
  count: number;
  venues: MyVenue[];
}

const getStatusBadge = (status: MyVenue["status"]) => {
  switch (status) {
    case "Draft":
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-slate-100/90 text-slate-700 border border-slate-200/80 backdrop-blur-md shadow-xs">
          <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
          Draft
        </span>
      );
    case "PendingReview":
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-50/95 text-amber-800 border border-amber-200/80 backdrop-blur-md shadow-xs">
          <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
          Under Review
        </span>
      );
    case "Approved":
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50/95 text-emerald-800 border border-emerald-200/80 backdrop-blur-md shadow-xs">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
          Approved
        </span>
      );
    case "Rejected":
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-rose-50/95 text-rose-800 border border-rose-200/80 backdrop-blur-md shadow-xs">
          <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
          Rejected
        </span>
      );
    case "Suspended":
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-red-50/95 text-red-800 border border-red-200/80 backdrop-blur-md shadow-xs">
          <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
          Suspended
        </span>
      );
    case "Inactive":
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-purple-50/95 text-purple-800 border border-purple-200/80 backdrop-blur-md shadow-xs">
          <span className="w-1.5 h-1.5 rounded-full bg-purple-500" />
          Inactive
        </span>
      );
    default:
      return null;
  }
};

const VenueCardItem = ({
  venue,
  onClick,
}: {
  venue: MyVenue;
  onClick: () => void;
}) => {
  const isAccessible =
    venue.status === VENUE_STATUS.APPROVED ||
    venue.status === VENUE_STATUS.INACTIVE;

  return (
    <div
      onClick={onClick}
      className={cn(
        "bg-card rounded-2xl border border-border overflow-hidden shadow-sm transition-all duration-200 flex flex-col h-full group",
        isAccessible
          ? "cursor-pointer hover:border-primary/30 hover:shadow-md hover:-translate-y-1"
          : "cursor-not-allowed",
      )}
    >
      <div className="relative h-48 w-full bg-muted/30 overflow-hidden">
        {venue.coverImage ? (
          <img
            src={venue.coverImage}
            alt={venue.name}
            className={cn(
              "w-full h-full object-cover transition-transform duration-700",
              isAccessible ? "group-hover:scale-105" : "",
            )}
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-muted-foreground">
            No Image
          </div>
        )}
        <div className="absolute top-3 right-3">
          {getStatusBadge(venue.status)}
        </div>
        <div className="absolute top-3 left-3">
          <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-slate-900/70 text-white backdrop-blur-md border border-white/20 capitalize shadow-xs">
            {venue.venueType || "Venue"}
          </span>
        </div>
      </div>

      <div className="p-5 flex-1 flex flex-col">
        <h3 className="text-xl font-bold text-foreground mb-1 truncate flex items-center gap-1.5">
          {venue.name}
          {venue.isFeatured && (
            <span className="text-amber-500 shrink-0" title="Featured venue">
              &#9733;
            </span>
          )}
        </h3>

        <div className="flex items-center text-muted-foreground text-sm mb-4">
          <MapPin className="mr-1 shrink-0" size={16} />
          <span className="truncate">{venue.city}</span>
        </div>

        {!isAccessible && (
          <div className="mt-auto space-y-2 pt-2">
            {venue.status === VENUE_STATUS.REJECTED &&
              venue.rejectionReason && (
                <div className="flex gap-2.5 items-start bg-rose-50 text-rose-800 p-3 rounded-xl text-xs leading-relaxed border border-rose-200/80 shadow-2xs">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-600" />
                  <span>
                    <strong className="font-semibold block mb-0.5 text-rose-900">
                      Rejected
                    </strong>{" "}
                    {venue.rejectionReason}
                  </span>
                </div>
              )}
            {venue.status === VENUE_STATUS.SUSPENDED &&
              venue.suspensionReason && (
                <div className="flex gap-2.5 items-start bg-red-50 text-red-800 p-3 rounded-xl text-xs leading-relaxed border border-red-200/80 shadow-2xs">
                  <Lock className="w-4 h-4 shrink-0 mt-0.5 text-red-600" />
                  <span>
                    <strong className="font-semibold block mb-0.5 text-red-900">
                      Suspended
                    </strong>{" "}
                    {venue.suspensionReason}
                  </span>
                </div>
              )}
            {venue.status === VENUE_STATUS.PENDING_REVIEW && (
              <div className="flex gap-2.5 items-start bg-amber-50 text-amber-800 p-3 rounded-xl text-xs leading-relaxed border border-amber-200/80 shadow-2xs">
                <Info className="w-4 h-4 shrink-0 mt-0.5 text-amber-600" />
                <span>
                  Our team is currently reviewing your venue. We'll notify you
                  once it's approved.
                </span>
              </div>
            )}
          </div>
        )}
        {venue.status === VENUE_STATUS.INACTIVE && (
          <div className="mt-auto pt-2">
            <div className="flex gap-2.5 items-start bg-purple-50 text-purple-800 p-3 rounded-xl text-xs leading-relaxed border border-purple-200/80 shadow-2xs">
              <Info className="w-4 h-4 shrink-0 mt-0.5 text-purple-600" />
              <span>
                This venue is inactive. You can manage settings and reactivate
                from the dashboard.
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default function VenueSelectorPage() {
  const navigate = useNavigate();
  const { setActiveVenue } = useAppStore();
  const { info } = useToast();

  const { data, isLoading } = useApiQuery<MyVenuesResponse>(
    QUERY_KEYS.MY_VENUES,
    { method: "GET", url: API_ENDPOINTS.MY_VENUES },
    { staleTime: 0 },
  );

  const venues = useMemo(() => data?.venues || [], [data?.venues]);

  const approvedVenues = useMemo(
    () =>
      venues.filter(
        (v) =>
          v.status === VENUE_STATUS.APPROVED ||
          v.status === VENUE_STATUS.INACTIVE,
      ),
    [venues],
  );

  const flaggedVenues = useMemo(
    () =>
      venues.filter(
        (v) =>
          v.status !== VENUE_STATUS.APPROVED &&
          v.status !== VENUE_STATUS.INACTIVE,
      ),
    [venues],
  );

  useEffect(() => {
    if (venues.length === 1 && approvedVenues.length === 1) {
      const v = approvedVenues[0];
      setActiveVenue(v._id, v.name, v.status);
      navigate(`/dashboard/venue/${v._id}/bookings`, { replace: true });
    }
  }, [venues, approvedVenues, navigate, setActiveVenue]);

  const handleCardClick = (venue: MyVenue) => {
    if (
      venue.status === VENUE_STATUS.APPROVED ||
      venue.status === VENUE_STATUS.INACTIVE
    ) {
      setActiveVenue(venue._id, venue.name, venue.status);
      navigate(`/dashboard/venue/${venue._id}/bookings`);
    } else {
      info(
        `This venue is currently ${venue.status === VENUE_STATUS.PENDING_REVIEW ? "under review" : venue.status.toLowerCase()}. You can only manage approved venues.`,
      );
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6 p-8 max-w-7xl mx-auto w-full">
        <div className="mb-8">
          <div className="h-10 w-48 bg-muted rounded-lg animate-pulse mb-2"></div>
          <div className="h-5 w-96 bg-muted rounded-lg animate-pulse"></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="rounded-2xl border bg-card overflow-hidden shadow-sm"
            >
              <div className="h-48 w-full bg-muted animate-pulse"></div>
              <div className="p-5 space-y-4">
                <div className="h-6 w-3/4 bg-muted animate-pulse rounded"></div>
                <div className="flex gap-2">
                  <div className="h-4 w-20 bg-muted animate-pulse rounded"></div>
                  <div className="h-4 w-20 bg-muted animate-pulse rounded"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (venues.length === 0) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center p-6">
        <div className="max-w-md text-center space-y-8 p-10 border rounded-3xl bg-card shadow-sm">
          <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-primary/10 ring-8 ring-primary/5">
            <Store className="h-12 w-12 text-primary" />
          </div>
          <div className="space-y-3">
            <h2 className="text-3xl font-bold tracking-tight">No Venues Yet</h2>
            <p className="text-muted-foreground leading-relaxed">
              You haven't registered any venues. Please use the BookMyVenue
              client application to list your first venue and start managing
              bookings.
            </p>
          </div>
          <Button
            size="lg"
            className="w-full sm:w-auto group rounded-xl"
            onClick={() => window.open(CLIENT_APP_URL, "_blank")}
          >
            <PlusCircle className="mr-2 h-5 w-5 group-hover:scale-110 transition-transform" />
            Go to Client App
          </Button>
        </div>
      </div>
    );
  }

  if (venues.length === 1 && approvedVenues.length === 1) {
    return (
      <div className="flex h-[80vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-zinc-500" />
      </div>
    );
  }

  return (
    <div className="space-y-8 p-8 max-w-7xl mx-auto w-full">
      <div className="flex items-center gap-3">
        <div className="p-2.5 bg-primary/10 rounded-xl">
          <Store className="w-7 h-7 text-primary" />
        </div>
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight">
            Select Venue
          </h1>
          <p className="text-muted-foreground mt-1 text-sm md:text-base">
            Choose a venue to manage its bookings, calendar, and reports.
          </p>
        </div>
      </div>

      <div className="space-y-8">
        {flaggedVenues.length > 0 && (
          <section>
            <div className="flex items-center gap-2 mb-4">
              <h2 className="text-xl font-bold text-foreground">
                Needs Attention
              </h2>
              <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-amber-200/80">
                {flaggedVenues.length}
              </span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {flaggedVenues.map((venue) => (
                <VenueCardItem
                  key={venue._id}
                  venue={venue}
                  onClick={() => handleCardClick(venue)}
                />
              ))}
            </div>
          </section>
        )}

        {approvedVenues.length > 0 && (
          <section>
            <div className="flex items-center gap-2 mb-4">
              <h2 className="text-xl font-bold text-foreground">
                Active Venues
              </h2>
              <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200/80">
                {approvedVenues.length}
              </span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {approvedVenues.map((venue) => (
                <VenueCardItem
                  key={venue._id}
                  venue={venue}
                  onClick={() => handleCardClick(venue)}
                />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
