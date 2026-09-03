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
import { useState } from "react";
import { format, addDays } from "date-fns";
import { VENUE_CONSTANTS } from "@/constants/venueConstants";

interface ExtendDeadlineDialogProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  venueId: string | null;
  currentDeadline: string | null;
  onExtend: (venueId: string, newDeadline: Date) => void;
  isPending: boolean;
}

export function ExtendDeadlineDialog({
  open,
  setOpen,
  venueId,
  currentDeadline,
  onExtend,
  isPending,
}: ExtendDeadlineDialogProps) {
  const [newDeadline, setNewDeadline] = useState<Date>(() => {
    if (currentDeadline) return new Date(currentDeadline);
    return addDays(new Date(), 45);
  });

  const minDate = addDays(new Date(), 1);
  const maxDate = addDays(new Date(), VENUE_CONSTANTS.MAX_EXTENDED_DAYS);

  if (!venueId) return null;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Extend Edit Deadline</DialogTitle>
          <DialogDescription>
            Current deadline:{" "}
            {currentDeadline
              ? format(new Date(currentDeadline), "PPP")
              : "None"}
            . Set a new deadline (max 120 days from today).
          </DialogDescription>
        </DialogHeader>
        <div className="py-4 space-y-4">
          <div className="space-y-2">
            <Label htmlFor="new-deadline">New Deadline *</Label>
            <div className="flex items-center gap-2">
              <Calendar className="text-[var(--text-secondary)]" size={18} />
              <Input
                id="new-deadline"
                type="date"
                value={format(newDeadline, "yyyy-MM-dd")}
                onChange={(e) =>
                  setNewDeadline(
                    e.target.value ? new Date(e.target.value) : newDeadline,
                  )
                }
                min={format(minDate, "yyyy-MM-dd")}
                max={format(maxDate, "yyyy-MM-dd")}
                className="w-48"
              />
              <span className="text-xs text-[var(--text-secondary)]">
                (Max {VENUE_CONSTANTS.MAX_EXTENDED_DAYS} days)
              </span>
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button
            onClick={() => {
              onExtend(venueId, newDeadline);
              setOpen(false);
            }}
            disabled={isPending}
          >
            {isPending ? "Extending…" : "Extend Deadline"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
