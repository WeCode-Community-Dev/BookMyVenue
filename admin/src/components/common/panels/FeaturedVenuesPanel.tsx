import { useApiQuery, useApiMutation } from "@/hooks/useApi";
import { API_ENDPOINTS } from "@/constants";
import { QUERY_KEYS } from "@/config/queryKeys";
import { useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/useToast";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Loader2, AlertCircle, XCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { differenceInDays, differenceInHours } from "date-fns";

interface Venue {
  _id: string;
  name: string;
  city: string;
  venueType: string;
  status: string;
  featuredExpiresAt?: string | null;
}

const getTimeLeft = (expiresAt?: string | null) => {
  if (!expiresAt) return "Indefinite";
  const now = new Date();
  const expiryDate = new Date(expiresAt);
  if (expiryDate < now) return "Expired";

  const daysLeft = differenceInDays(expiryDate, now);
  if (daysLeft > 0) return `${daysLeft} days left`;

  const hoursLeft = differenceInHours(expiryDate, now);
  return `${hoursLeft} hours left`;
};

export const FeaturedVenuesPanel = () => {
  const queryClient = useQueryClient();
  const { success, error } = useToast();

  const {
    data: venues,
    isLoading,
    isError,
  } = useApiQuery<Venue[]>([...QUERY_KEYS.ADMIN_VENUES, "featured"], {
    method: "GET",
    url: API_ENDPOINTS.FEATURED_VENUES,
  });

  const unfeatureMutation = useApiMutation<unknown, { id: string }>(
    (vars) => ({
      method: "DELETE",
      url: `${API_ENDPOINTS.VENUES}/${vars.id}/feature`,
    }),
    {
      onSuccess: () => {
        success("Venue removed from featured list");
        queryClient.invalidateQueries({
          queryKey: [...QUERY_KEYS.ADMIN_VENUES, "featured"],
        });
        queryClient.invalidateQueries({ queryKey: QUERY_KEYS.ADMIN_VENUES });
      },
      onError: (e: Error) => {
        const err = e as import("axios").AxiosError<{ message: string }>;
        error(err.response?.data?.message ?? "Failed to un-feature venue");
      },
    },
  );

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center p-8 space-y-4">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
        <p className="text-muted-foreground">Loading featured venues...</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="p-4">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>
            {error instanceof Error
              ? error.message
              : "Failed to load featured venues"}
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  if (!venues || venues.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-center border rounded-xl border-dashed bg-muted/20">
        <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center mb-4">
          <AlertCircle className="w-6 h-6 text-muted-foreground" />
        </div>
        <h3 className="text-lg font-semibold mb-1">No Featured Venues</h3>
        <p className="text-sm text-muted-foreground">
          You haven't featured any venues yet. You can feature venues from the
          main venues table.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4 p-2">
      <div className="grid gap-3">
        {venues.map((venue) => {
          const timeLeft = getTimeLeft(venue.featuredExpiresAt);
          const isExpired = timeLeft === "Expired";

          return (
            <div
              key={venue._id}
              className="flex items-center justify-between p-4 border rounded-xl bg-card shadow-sm hover:shadow-md transition-shadow"
            >
              <div>
                <h4 className="font-semibold text-base">{venue.name}</h4>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-sm text-muted-foreground">
                    {venue.city}
                  </span>
                  <span className="text-muted-foreground text-xs">•</span>
                  <span className="text-sm capitalize text-muted-foreground">
                    {venue.venueType}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <Badge
                    variant="secondary"
                    className="bg-amber-500 dark:text-white"
                  >
                    Featured
                  </Badge>
                  <Badge
                    variant="outline"
                    className={
                      isExpired
                        ? "text-destructive border-destructive"
                        : "text-muted-foreground"
                    }
                  >
                    {timeLeft}
                  </Badge>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => unfeatureMutation.mutate({ id: venue._id })}
                  disabled={unfeatureMutation.isPending}
                  className="text-destructive hover:text-destructive hover:bg-destructive/10"
                >
                  <XCircle className="w-4 h-4 mr-1.5" />
                  Remove
                </Button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
