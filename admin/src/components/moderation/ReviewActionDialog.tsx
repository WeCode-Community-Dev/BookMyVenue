import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import type { ReviewActionDialogState } from "@/types/ui";
import { MIN_REASON_LENGTH } from "@/constants/validation";
import type { UseMutationResult } from "@tanstack/react-query";

export function ReviewActionDialog({
  reviewDialog,
  setReviewDialog,
  reviewReason,
  setReviewReason,
  moderateReviewMutation,
}: {
  reviewDialog: ReviewActionDialogState;

  setReviewDialog: (state: ReviewActionDialogState) => void;
  reviewReason: string;
  setReviewReason: (val: string) => void;

  moderateReviewMutation: UseMutationResult<
    unknown,
    unknown,
    {
      reviewId: string;
      action: "remove" | "reject_hide" | "restore" | "approve_hide";
      reason?: string;
    },
    unknown
  >;
}) {
  return (
    <Dialog
      open={reviewDialog.open}
      onOpenChange={(open) => setReviewDialog({ ...reviewDialog, open })}
    >
      <DialogContent className="rounded-2xl border border-[var(--bg-grey)] bg-[var(--bg-tertiary)]">
        <DialogHeader>
          <DialogTitle>
            {reviewDialog.action === "remove"
              ? "Remove Review"
              : reviewDialog.action === "approve_hide"
                ? "Approve Hide Request"
                : "Restore Review"}
          </DialogTitle>
          <DialogDescription>
            {reviewDialog.action === "remove"
              ? "Are you sure you want to remove this review? This action cannot be undone."
              : reviewDialog.action === "approve_hide"
                ? "Approving this hide request will remove the review. Please provide a reason (minimum 10 characters)."
                : "Restore this review to be visible again?"}
          </DialogDescription>
        </DialogHeader>

        {(reviewDialog.action === "remove" ||
          reviewDialog.action === "approve_hide") && (
          <div className="space-y-4">
            <div>
              <Label htmlFor="removal-reason">
                Reason for removal (required)
              </Label>
              <Input
                id="removal-reason"
                placeholder="e.g., Contains inappropriate content"
                value={reviewReason}
                onChange={(e) => setReviewReason(e.target.value)}
                className="rounded-lg border border-[var(--bg-grey)] bg-[var(--bg-primary)]"
              />
              {reviewReason.trim().length > 0 &&
                reviewReason.trim().length < MIN_REASON_LENGTH && (
                  <p className="text-xs text-red-500 mt-1">
                    Reason must be at least 10 characters.
                  </p>
                )}
            </div>
          </div>
        )}

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() =>
              setReviewDialog({ open: false, action: "remove", reviewId: null })
            }
          >
            Cancel
          </Button>
          <Button
            onClick={() => {
              if (reviewDialog.reviewId) {
                moderateReviewMutation.mutate({
                  reviewId: reviewDialog.reviewId,
                  action: reviewDialog.action as
                    | "remove"
                    | "reject_hide"
                    | "restore"
                    | "approve_hide",
                  reason:
                    reviewDialog.action === "remove" ||
                    reviewDialog.action === "approve_hide"
                      ? reviewReason
                      : undefined,
                });
              }
            }}
            disabled={
              moderateReviewMutation.isPending ||
              ((reviewDialog.action === "remove" ||
                reviewDialog.action === "approve_hide") &&
                reviewReason.trim().length < MIN_REASON_LENGTH)
            }
            className={`${
              reviewDialog.action === "remove" ||
              reviewDialog.action === "approve_hide"
                ? "bg-red-600 text-white hover:bg-red-700"
                : ""
            }`}
          >
            {moderateReviewMutation.isPending ? "Processing..." : "Confirm"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
