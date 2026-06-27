import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useMyVenues } from "@/hooks/use-venue";
import { VENUE_TYPE_LABELS } from "@/types/venue.types";
import { OWNER_ROUTES } from "@/routes/common/route-path";

const OwnerDashboard = () => {
  const { data: venues, isLoading } = useMyVenues();

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between gap-4">
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl font-semibold">Owner Dashboard</h1>
          <p className="text-sm text-muted-foreground">Manage your venues and bookings.</p>
        </div>
        <Button asChild>
          <Link to={OWNER_ROUTES.CREATE_VENUE}>
            {venues && venues.length > 0 ? "Edit venue" : "Create venue"}
          </Link>
        </Button>
      </div>

      {isLoading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-48 w-full rounded-xl" />
          ))}
        </div>
      ) : !venues || venues.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center gap-3 py-12 text-center">
            <p className="text-muted-foreground">You haven't listed a venue yet.</p>
            <Button asChild>
              <Link to={OWNER_ROUTES.CREATE_VENUE}>Create your venue</Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {venues.map((venue) => (
            <Card key={venue._id} className="overflow-hidden pt-0 gap-0">
              {venue.images?.[0] ? (
                <img
                  src={venue.images[0]}
                  alt={venue.name}
                  className="h-40 w-full object-cover"
                />
              ) : (
                <div className="h-40 w-full bg-muted" />
              )}
              <CardHeader className="pt-4">
                <div className="flex items-start justify-between gap-2">
                  <CardTitle className="text-lg">{venue.name}</CardTitle>
                  <span
                    className={
                      venue.isApproved
                        ? "shrink-0 rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-700 dark:bg-green-900/40 dark:text-green-400"
                        : "shrink-0 rounded-full bg-amber-100 px-2 py-0.5 text-xs font-medium text-amber-700 dark:bg-amber-900/40 dark:text-amber-400"
                    }>
                    {venue.isApproved ? "Approved" : "Pending approval"}
                  </span>
                </div>
              </CardHeader>
              <CardContent className="flex flex-col gap-1 pb-4 text-sm text-muted-foreground">
                <span>{VENUE_TYPE_LABELS[venue.venueType]}</span>
                {venue.city && <span>{venue.city}</span>}
                <span className="font-medium text-foreground">₹{venue.pricePerHour}/hour</span>
                <div className="mt-3 flex gap-2">
                  <Button asChild variant="outline" size="sm">
                    <Link to={OWNER_ROUTES.CREATE_VENUE}>Edit</Link>
                  </Button>
                  <Button asChild variant="outline" size="sm">
                    <Link to={OWNER_ROUTES.BOOKINGS}>View bookings</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default OwnerDashboard;
