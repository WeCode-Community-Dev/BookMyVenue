import { useState } from "react";
import { AlertTriangle, Clock, Trash2, Play, Pause } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  useRequestInactivity,
  useWithdrawInactivity,
  useBlockBookings,
  useUnblockBookings,
  useActivateVenue,
  useRequestDeleteVenue,
} from "@/services/api/useVenueSettings";
import type { Venue } from "@/types";

interface DangerZoneProps {
  venue: Venue;
}

interface ExtendedVenue extends Venue {
  inactivity?: {
    requestedAt?: string;
    approvedAt?: string;
    blockedAfterDate?: string;
    inactiveAt?: string;
    lastInactiveAt?: string;
    withdrawalRequestedAt?: string;
  };
  temporaryBlockAfterDate?: string;
  pendingReview?: {
    intent: string;
    requestedAt: string;
  };
}

export function DangerZone({ venue }: DangerZoneProps) {
  const data = venue as unknown as ExtendedVenue;
  const { mutateAsync: requestInactivity, isPending: isRequestingInactivity } =
    useRequestInactivity();
  const {
    mutateAsync: withdrawInactivity,
    isPending: isWithdrawingInactivity,
  } = useWithdrawInactivity();
  const { mutateAsync: blockBookings, isPending: isBlocking } =
    useBlockBookings();
  const { mutateAsync: unblockBookings, isPending: isUnblocking } =
    useUnblockBookings();
  const { mutateAsync: activateVenue, isPending: isActivating } =
    useActivateVenue();
  const { mutateAsync: requestDeleteVenue, isPending: isDeleting } =
    useRequestDeleteVenue();

  const [inactivityReason, setInactivityReason] = useState("");
  const [deleteReason, setDeleteReason] = useState("");
  const [dialog, setDialog] = useState<{
    title: string;
    description: string;
    action: () => Promise<void>;
    confirmText: string;
  } | null>(null);

  const isPendingReview =
    data.pendingReview?.intent &&
    data.pendingReview.intent !== "DELETION_REQUEST";
  const isDeletePending = data.pendingReview?.intent === "DELETION_REQUEST";
  const isInactive = !!data.inactivity?.inactiveAt;
  const isInactivityPending =
    !!data.inactivity?.requestedAt &&
    !data.inactivity?.approvedAt &&
    !data.inactivity?.inactiveAt;
  const isWithdrawalRequested = !!data.inactivity?.withdrawalRequestedAt;
  const isBlocked = !!data.temporaryBlockAfterDate;
  const isActive = data.status === "Approved";

  const openDialog = (
    title: string,
    description: string,
    action: () => Promise<void>,
    confirmText = "Confirm",
  ) => {
    setDialog({ title, description, action, confirmText });
  };

  const handleConfirm = async () => {
    if (!dialog) return;
    await dialog.action();
    setDialog(null);
  };

  if (isPendingReview) {
    return (
      <Card className="p-5 shadow-sm border-amber-500/30 bg-amber-50/50">
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-amber-600" />
          <h3 className="font-semibold text-amber-800">Review Pending</h3>
        </div>
        <p className="text-sm text-amber-700">
          A review request is currently pending approval. No danger zone actions
          are available until the review is resolved.
        </p>
      </Card>
    );
  }

  return (
    <>
      <Card className="p-5 shadow-sm border-destructive/20 bg-destructive/5">
        <div className="flex items-center gap-2 border-b border-destructive/20 pb-2">
          <AlertTriangle className="w-4 h-4 text-destructive" />
          <h3 className="font-semibold text-destructive">Danger Zone</h3>
        </div>
        <div className="space-y-4 pt-2">
          {/* Temporary Booking Block */}
          <div className="border border-amber-500/30 bg-amber-50/50 rounded-lg p-4 space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium text-sm flex items-center gap-2">
                  <Clock className="w-4 h-4 text-amber-600" />
                  Temporary Booking Block
                </h4>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {isBlocked
                    ? "Bookings are currently blocked for this venue."
                    : "Temporarily block all new bookings for this venue."}
                </p>
              </div>
              <Button
                variant={isBlocked ? "outline" : "secondary"}
                className="bg-amber-100 border-1 border-amber-500/30 cursor-pointer hover:bg-amber-500/20"
                size="sm"
                disabled={isBlocking || isUnblocking}
                onClick={() => {
                  if (isBlocked) {
                    openDialog(
                      "Unblock Bookings",
                      "Allow new bookings for this venue again.",
                      async () => {
                        await unblockBookings({ venueId: venue._id });
                      },
                      "Unblock",
                    );
                  } else {
                    openDialog(
                      "Block All Bookings",
                      "Temporarily block all new bookings. Existing bookings will not be affected.",
                      async () => {
                        await blockBookings({ venueId: venue._id });
                      },
                      "Block Bookings",
                    );
                  }
                }}
              >
                {isBlocked ? "Unblock Bookings" : "Block All Bookings"}
              </Button>
            </div>
            {isBlocked && (
              <p className="text-xs text-amber-700">
                Blocked until{" "}
                {data.temporaryBlockAfterDate
                  ? new Date(data.temporaryBlockAfterDate).toLocaleDateString()
                  : "further notice"}
              </p>
            )}
          </div>

          {/* Inactivity Management */}
          {isActive && (
            <div className="border border-destructive/20 rounded-lg p-4 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium text-sm flex items-center gap-2">
                    <Pause className="w-4 h-4 text-destructive" />
                    Inactivity Management
                  </h4>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Temporarily pause bookings and mark venue as inactive
                  </p>
                </div>
                <div className="flex gap-2">
                  {isInactivityPending ? (
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={
                        isWithdrawingInactivity || isWithdrawalRequested
                      }
                      onClick={() =>
                        openDialog(
                          "Withdraw Inactivity Request",
                          "Are you sure you want to withdraw the inactivity request? The venue will remain active.",
                          async () => {
                            await withdrawInactivity({ venueId: venue._id });
                          },
                          "Withdraw Request",
                        )
                      }
                    >
                      Withdraw Request
                    </Button>
                  ) : !isWithdrawalRequested ? (
                    <Button
                      variant="destructive"
                      className="cursor-pointer"
                      size="sm"
                      disabled={isRequestingInactivity}
                      onClick={() =>
                        openDialog(
                          "Request Inactivity",
                          "This will mark your venue as inactive and block new bookings. Existing bookings will be fulfilled. You can reactivate later.",
                          async () => {
                            await requestInactivity({
                              venueId: venue._id,
                              reason: inactivityReason || undefined,
                            });
                            setInactivityReason("");
                          },
                          "Request Inactivity",
                        )
                      }
                    >
                      Request Inactivity
                    </Button>
                  ) : null}
                </div>
              </div>
              {isInactivityPending && (
                <p className="text-xs text-amber-600">
                  Inactivity request pending approval.
                </p>
              )}
              {isWithdrawalRequested && (
                <p className="text-xs text-amber-600">
                  Withdrawal of inactivity is pending admin approval.
                </p>
              )}
            </div>
          )}

          {isInactive && (
            <div className="border border-destructive/20 rounded-lg p-4 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium text-sm flex items-center gap-2">
                    <Play className="w-4 h-4 text-green-600" />
                    Reactivation
                  </h4>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {data.inactivity?.lastInactiveAt
                      ? `Inactive since ${new Date(data.inactivity.lastInactiveAt).toLocaleDateString()}`
                      : "Venue is currently inactive"}
                  </p>
                </div>
                <Button
                  variant="default"
                  size="sm"
                  disabled={isActivating}
                  onClick={() =>
                    openDialog(
                      "Reactivate Venue",
                      "Reactivate this venue to start accepting bookings again.",
                      async () => {
                        await activateVenue({ venueId: venue._id });
                      },
                      "Reactivate",
                    )
                  }
                >
                  Reactivate Venue
                </Button>
              </div>
            </div>
          )}

          {/* Deletion */}
          <div className="border border-destructive/20 rounded-lg p-4 space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium text-sm flex items-center gap-2">
                  <Trash2 className="w-4 h-4 text-destructive" />
                  Delete Venue
                </h4>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {isDeletePending
                    ? "Deletion is pending admin approval."
                    : "Permanently delete this venue and all associated data."}
                </p>
              </div>
              {!isDeletePending && (
                <Button
                  variant="destructive"
                  className="cursor-pointer"
                  size="sm"
                  disabled={isDeleting}
                  onClick={() =>
                    openDialog(
                      "Delete Venue",
                      "This action is irreversible. All future bookings will be cancelled. Are you sure you want to proceed?",
                      async () => {
                        await requestDeleteVenue({
                          venueId: venue._id,
                          reason: deleteReason || "No reason provided",
                        });
                        setDeleteReason("");
                      },
                      "Request Deletion",
                    )
                  }
                >
                  Delete Venue
                </Button>
              )}
            </div>
            {isDeletePending && (
              <p className="text-xs text-amber-600">
                Deletion requested, awaiting admin approval.
              </p>
            )}
          </div>
        </div>
      </Card>

      <Dialog open={!!dialog} onOpenChange={(open) => !open && setDialog(null)}>
        {dialog && (
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{dialog.title}</DialogTitle>
              <DialogDescription>{dialog.description}</DialogDescription>
            </DialogHeader>
            {dialog.title === "Delete Venue" && (
              <div className="space-y-2 py-2">
                <Label htmlFor="dialogDeleteReason">Reason for deletion</Label>
                <Input
                  id="dialogDeleteReason"
                  value={deleteReason}
                  onChange={(e) => setDeleteReason(e.target.value)}
                  placeholder="Explain why..."
                />
              </div>
            )}
            {dialog.title === "Request Inactivity" && (
              <div className="space-y-2 py-2">
                <Label htmlFor="dialogInactivityReason">
                  Reason (optional)
                </Label>
                <Input
                  id="dialogInactivityReason"
                  value={inactivityReason}
                  onChange={(e) => setInactivityReason(e.target.value)}
                  placeholder="Why are you requesting inactivity?"
                />
              </div>
            )}
            <DialogFooter>
              <Button variant="outline" onClick={() => setDialog(null)}>
                Cancel
              </Button>
              <Button variant="destructive" onClick={handleConfirm}>
                {dialog.confirmText}
              </Button>
            </DialogFooter>
          </DialogContent>
        )}
      </Dialog>
    </>
  );
}
