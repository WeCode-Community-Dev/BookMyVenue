import { useState } from "react";
import { format } from "date-fns";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useAdminReviews } from "@/services/api/useAdminReviews";
import { ReviewActionDialogs } from "./ReviewActionDialogs";
import type { Venue } from "@/types";

const INTENT_LABELS: Record<string, string> = {
  venue_edit: "Changes Requiring Approval",
  inactivity_request: "Inactivity Requests",
  deletion_request: "Deletion Requests",
};

const INTENT_BADGE_VARIANTS: Record<
  string,
  "default" | "secondary" | "destructive" | "outline"
> = {
  venue_edit: "default",
  inactivity_request: "secondary",
  deletion_request: "destructive",
};

export function ReviewsTabContent() {
  const { data, isLoading, error } = useAdminReviews();
  const [approveTarget, setApproveTarget] = useState<Venue | null>(null);
  const [rejectTarget, setRejectTarget] = useState<Venue | null>(null);

  if (isLoading)
    return (
      <div className="py-8 text-center text-muted-foreground">
        Loading reviews...
      </div>
    );

  if (error)
    return (
      <div className="py-8 text-center text-destructive">
        Failed to load reviews.
      </div>
    );

  const venues = data?.venues ?? [];
  if (venues.length === 0) {
    return (
      <Alert>
        <AlertTitle>No pending reviews</AlertTitle>
        <AlertDescription>All reviews have been processed.</AlertDescription>
      </Alert>
    );
  }

  const groups = venues.reduce<Record<string, Venue[]>>((acc, venue) => {
    const intent = venue.pendingReview?.intent ?? "other";
    if (!acc[intent]) acc[intent] = [];
    acc[intent].push(venue);
    return acc;
  }, {});

  return (
    <div className="space-y-8">
      {Object.entries(groups).map(([intent, groupVenues]) => (
        <section key={intent}>
          <h2 className="text-xl font-semibold mb-4">
            {INTENT_LABELS[intent] ?? intent}
          </h2>
          <div className="space-y-4">
            {groupVenues.map((venue) => (
              <Card key={venue._id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{venue.name}</CardTitle>
                    <Badge variant={INTENT_BADGE_VARIANTS[intent] ?? "default"}>
                      {INTENT_LABELS[intent] ?? intent}
                    </Badge>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Owner: {venue.ownerUserId?.username ?? "N/A"}
                    {venue.pendingReview?.requestedAt && (
                      <>
                        {" "}
                        — Requested:{" "}
                        {format(
                          new Date(venue.pendingReview.requestedAt),
                          "MMM d, yyyy",
                        )}
                      </>
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  {intent === "venue_edit" &&
                    venue.pendingReview?.details?.changedFields && (
                      <div className="mb-4">
                        <p className="text-sm font-medium mb-1.5">
                          Changed fields:
                        </p>
                        <div className="flex flex-wrap gap-1.5">
                          {venue.pendingReview.details.changedFields.map(
                            (field) => (
                              <Badge
                                key={field}
                                variant="outline"
                                className="capitalize"
                              >
                                {field.replace(/([A-Z])/g, " $1").trim()}
                              </Badge>
                            ),
                          )}
                        </div>
                      </div>
                    )}
                  {intent === "inactivity_request" && (
                    <p className="text-sm text-muted-foreground">
                      Requesting to close venue
                    </p>
                  )}
                  {intent === "deletion_request" && (
                    <p className="text-sm text-muted-foreground">
                      Requesting venue deletion
                    </p>
                  )}
                  <div className="flex gap-2 mt-4">
                    <Button onClick={() => setApproveTarget(venue)}>
                      Approve
                    </Button>
                    <Button
                      variant="destructive"
                      onClick={() => setRejectTarget(venue)}
                    >
                      Reject
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      ))}

      <ReviewActionDialogs
        approveTarget={approveTarget}
        setApproveTarget={setApproveTarget}
        rejectTarget={rejectTarget}
        setRejectTarget={setRejectTarget}
      />
    </div>
  );
}
