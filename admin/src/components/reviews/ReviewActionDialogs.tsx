import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  useApproveReview,
  useRejectReview,
} from "@/services/api/useAdminReviews";
import { useToast } from "@/hooks/useToast";
import type { Venue } from "@/types";

const INTENT_DESCRIPTIONS: Record<string, string> = {
  venue_edit:
    "This will apply the venue edits and mark the review as approved.",
  inactivity_request: "This will mark the venue as inactive.",
  inactivity_withdrawal: "This will cancel the inactivity request.",
  deletion_request: "This will permanently delete the venue.",
};

interface ReviewActionDialogsProps {
  approveTarget: Venue | null;
  setApproveTarget: (v: Venue | null) => void;
  rejectTarget: Venue | null;
  setRejectTarget: (v: Venue | null) => void;
}

export function ReviewActionDialogs({
  approveTarget,
  setApproveTarget,
  rejectTarget,
  setRejectTarget,
}: ReviewActionDialogsProps) {
  const [approveNote, setApproveNote] = useState("");
  const [rejectNote, setRejectNote] = useState("");
  const { success, error } = useToast();

  const approveMutation = useApproveReview();
  const rejectMutation = useRejectReview();

  const handleApprove = () => {
    if (!approveTarget) return;
    approveMutation.mutate(
      { id: approveTarget._id, note: approveNote || undefined },
      {
        onSuccess: () => {
          success("Review approved successfully");
          setApproveTarget(null);
          setApproveNote("");
        },
        onError: () => error("Failed to approve review"),
      },
    );
  };

  const handleReject = () => {
    if (!rejectTarget || !rejectNote.trim()) return;
    rejectMutation.mutate(
      { id: rejectTarget._id, note: rejectNote },
      {
        onSuccess: () => {
          success("Review rejected successfully");
          setRejectTarget(null);
          setRejectNote("");
        },
        onError: () => error("Failed to reject review"),
      },
    );
  };

  return (
    <>
      <Dialog
        open={!!approveTarget}
        onOpenChange={(open) => {
          if (!open) {
            setApproveTarget(null);
            setApproveNote("");
          }
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Approve Review — {approveTarget?.name}</DialogTitle>
            <DialogDescription>
              {approveTarget?.pendingReview?.intent
                ? INTENT_DESCRIPTIONS[approveTarget.pendingReview.intent]
                : "Approve this review request."}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="approve-note">Note (optional)</Label>
              <textarea
                id="approve-note"
                className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                value={approveNote}
                onChange={(e) => setApproveNote(e.target.value)}
                placeholder="Optional note..."
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setApproveTarget(null);
                setApproveNote("");
              }}
            >
              Cancel
            </Button>
            <Button
              onClick={handleApprove}
              disabled={approveMutation.isPending}
            >
              {approveMutation.isPending ? "Approving..." : "Approve"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog
        open={!!rejectTarget}
        onOpenChange={(open) => {
          if (!open) {
            setRejectTarget(null);
            setRejectNote("");
          }
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reject Review — {rejectTarget?.name}</DialogTitle>
            <DialogDescription>
              Provide a reason for rejection. This will be communicated to the
              venue owner.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="reject-note">Reason *</Label>
              <textarea
                id="reject-note"
                className="flex min-h-[120px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                value={rejectNote}
                onChange={(e) => setRejectNote(e.target.value)}
                placeholder="Required reason for rejection..."
              />
              <p className="text-xs text-muted-foreground text-right">
                {rejectNote.length} characters
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setRejectTarget(null);
                setRejectNote("");
              }}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleReject}
              disabled={!rejectNote.trim() || rejectMutation.isPending}
            >
              {rejectMutation.isPending ? "Rejecting..." : "Reject"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
