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
import { Calendar } from "lucide-react";
import { format, addDays } from "date-fns";
import { VENUE_CONSTANTS } from "@/constants/venueConstants";

export function RejectVenueDialog({
  open,
  setOpen,
  rejectReason,
  setRejectReason,
  handleReject,
  isPending,
  extendedDeadline,
  setExtendedDeadline,
}: {
  open: boolean;
  setOpen: (open: boolean) => void;
  rejectReason: string;
  setRejectReason: (reason: string) => void;
  handleReject: () => void;
  isPending: boolean;
  extendedDeadline: Date | null;
  setExtendedDeadline: (deadline: Date | null) => void;
}) {
  const minDate = addDays(new Date(), VENUE_CONSTANTS.EDIT_WINDOW_DAYS);
  const maxDate = addDays(new Date(), VENUE_CONSTANTS.MAX_EXTENDED_DAYS);
  const defaultDate = addDays(new Date(), 45);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Reject Venue</DialogTitle>
          <DialogDescription>
            This reason will be sent to the venue owner. Be specific and
            constructive.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4 space-y-4">
          <div className="space-y-2">
            <Label htmlFor="reject-reason">Rejection Reason *</Label>
            <Input
              id="reject-reason"
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              placeholder="e.g. Incomplete documentation, inappropriate photos…"
            />
          </div>

          <div className="space-y-2">
            <Label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={!!extendedDeadline}
                onChange={(e) => {
                  if (e.target.checked) setExtendedDeadline(defaultDate);
                  else setExtendedDeadline(null);
                }}
                className="rounded border-[var(--bg-grey)] text-[var(--bg-green)] focus:ring-[var(--bg-green)]"
              />
              Extend edit deadline beyond 30 days (max 120 days)
            </Label>
            {extendedDeadline && (
              <div className="flex items-center gap-2">
                <Calendar className="text-[var(--text-secondary)]" size={18} />
                <Input
                  type="date"
                  value={format(extendedDeadline, "yyyy-MM-dd")}
                  onChange={(e) =>
                    setExtendedDeadline(
                      e.target.value ? new Date(e.target.value) : null,
                    )
                  }
                  min={format(minDate, "yyyy-MM-dd")}
                  max={format(maxDate, "yyyy-MM-dd")}
                  className="w-48"
                />
                <span className="text-xs text-[var(--text-secondary)]">
                  (Default: 30 days, Max: 120 days)
                </span>
              </div>
            )}
          </div>
        </div>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => {
              setOpen(false);
              setRejectReason("");
              setExtendedDeadline(null);
            }}
          >
            Cancel
          </Button>
          <Button
            variant="destructive"
            disabled={!rejectReason.trim() || isPending}
            onClick={handleReject}
          >
            {isPending ? "Rejecting…" : "Confirm Rejection"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
