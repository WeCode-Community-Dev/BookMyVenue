import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import type { ReportDialogState } from "@/types/ui";
import { MAX_TEXT_LENGTH, MIN_REASON_LENGTH } from "@/constants/validation";

export function ReportDialog({
  reportDialog,
  setReportDialog,
  reportReason,
  setReportReason,
  reportAction,
  setReportAction,
  handleReport,
  isPending,
}: {
  reportDialog: ReportDialogState;
  setReportDialog: (opts: ReportDialogState) => void;
  reportReason: string;
  setReportReason: (reason: string) => void;
  reportAction: "hide" | "flag";
  setReportAction: (action: "hide" | "flag") => void;
  handleReport: () => void;
  isPending: boolean;
}) {
  return (
    <Dialog
      open={reportDialog.open}
      onOpenChange={(open) => setReportDialog({ open })}
    >
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Report Review to Admin</DialogTitle>
          <DialogDescription>
            Explain why this review should be hidden. An admin will review your
            request.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-2">
          <div className="space-y-3">
            <Label>What would you like to do?</Label>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <label
                className={`relative flex cursor-pointer rounded-lg border p-4 shadow-sm focus:outline-none ${
                  reportAction === "hide"
                    ? "border-green-600 ring-1 ring-green-600 bg-green-50 dark:bg-green-950/20"
                    : "border-input hover:bg-accent"
                }`}
              >
                <input
                  type="radio"
                  name="reportAction"
                  value="hide"
                  className="sr-only"
                  checked={reportAction === "hide"}
                  onChange={() => setReportAction("hide")}
                />
                <div className="flex flex-col">
                  <span className="block text-sm font-medium">
                    Hide Request
                  </span>
                  <span className="mt-1 flex items-center text-xs text-muted-foreground">
                    Dispute this review. It stays visible until an admin
                    approves your request.
                  </span>
                </div>
              </label>

              <label
                className={`relative flex cursor-pointer rounded-lg border p-4 shadow-sm focus:outline-none ${
                  reportAction === "flag"
                    ? "border-red-600 ring-1 ring-red-600 bg-red-50 dark:bg-red-950/20"
                    : "border-input hover:bg-accent"
                }`}
              >
                <input
                  type="radio"
                  name="reportAction"
                  value="flag"
                  className="sr-only"
                  checked={reportAction === "flag"}
                  onChange={() => setReportAction("flag")}
                />
                <div className="flex flex-col">
                  <span className="block text-sm font-medium">Flag Review</span>
                  <span className="mt-1 flex items-center text-xs text-muted-foreground">
                    Report abuse or spam. It will be hidden immediately pending
                    admin review.
                  </span>
                </div>
              </label>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="report-reason">
              Reason (minimum 10 characters)
            </Label>
            <textarea
              id="report-reason"
              placeholder="Provide more details..."
              value={reportReason}
              onChange={(e) => setReportReason(e.target.value)}
              maxLength={MAX_TEXT_LENGTH}
              rows={4}
              className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 resize-none"
            />
            <p className="text-xs text-muted-foreground">
              {reportReason.length}/{MAX_TEXT_LENGTH}
            </p>
          </div>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => {
              setReportDialog({ open: false });
              setReportReason("");
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleReport}
            disabled={
              isPending || reportReason.trim().length < MIN_REASON_LENGTH
            }
          >
            {isPending ? "Submitting..." : "Submit Report"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
