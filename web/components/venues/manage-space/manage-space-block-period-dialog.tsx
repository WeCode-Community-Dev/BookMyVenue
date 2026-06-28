"use client";

import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
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
import { Switch } from "@/components/ui/switch";
import {
  buildBlockPeriodIsoStrings,
  isAllDayBlock,
  toDateInputValue,
  toTimeInputValue,
} from "@/lib/data/space-manage";
import {
  createSpaceBlockedPeriod,
  type SpaceBlockedPeriodResponse,
  updateSpaceBlockedPeriod,
} from "@/services/venueServices";

type ManageSpaceBlockPeriodDialogProps = {
  spaceId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  block: SpaceBlockedPeriodResponse | null;
  onSaved: (block: SpaceBlockedPeriodResponse) => void;
};

export function ManageSpaceBlockPeriodDialog({
  spaceId,
  open,
  onOpenChange,
  block,
  onSaved,
}: ManageSpaceBlockPeriodDialogProps) {
  const isEditing = block !== null;
  const [date, setDate] = useState("");
  const [startTime, setStartTime] = useState("09:00");
  const [endTime, setEndTime] = useState("17:00");
  const [allDay, setAllDay] = useState(false);
  const [reason, setReason] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!open) return;
    if (block) {
      const allDayBlock = isAllDayBlock(block.startAt, block.endAt);
      setDate(toDateInputValue(block.startAt));
      setStartTime(toTimeInputValue(block.startAt));
      setEndTime(toTimeInputValue(block.endAt));
      setAllDay(allDayBlock);
      setReason(block.reason ?? "");
    } else {
      setDate("");
      setStartTime("09:00");
      setEndTime("17:00");
      setAllDay(false);
      setReason("");
    }
  }, [open, block]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!date) {
      toast.error("Please select a date.");
      return;
    }
    if (!allDay && startTime >= endTime) {
      toast.error("End time must be after start time.");
      return;
    }

    const { startAt, endAt } = buildBlockPeriodIsoStrings(
      date,
      startTime,
      endTime,
      allDay,
    );

    try {
      setIsSubmitting(true);
      const payload = {
        startAt,
        endAt,
        reason: reason.trim() || undefined,
      };

      const saved = isEditing
        ? await updateSpaceBlockedPeriod(spaceId, block.id, payload)
        : await createSpaceBlockedPeriod(spaceId, payload);

      onSaved({
        id: saved.id,
        startAt: saved.startAt,
        endAt: saved.endAt,
        reason: saved.reason,
      });
      toast.success(isEditing ? "Block updated." : "Block created.");
      onOpenChange(false);
    } catch (error) {
      toast.error((error as Error)?.message ?? "Failed to save block.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-full sm:max-w-4xl">
        <DialogHeader>
          <DialogTitle>{isEditing ? "Edit Block" : "Create Block"}</DialogTitle>
          <DialogDescription>
            Block a date or time range when this space is unavailable for
            bookings.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <Label htmlFor="block-date">Date</Label>
            <Input
              id="block-date"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
            />
          </div>

          <div className="flex items-center justify-between gap-4">
            <Label htmlFor="block-all-day">All day</Label>
            <Switch
              id="block-all-day"
              checked={allDay}
              onCheckedChange={setAllDay}
            />
          </div>

          {!allDay && (
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-2">
                <Label htmlFor="block-start">Start time</Label>
                <Input
                  id="block-start"
                  type="time"
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                  required
                />
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="block-end">End time</Label>
                <Input
                  id="block-end"
                  type="time"
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                  required
                />
              </div>
            </div>
          )}

          <div className="flex flex-col gap-2">
            <Label htmlFor="block-reason">Reason (optional)</Label>
            <Input
              id="block-reason"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="e.g. Maintenance, Holiday"
              maxLength={255}
            />
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="bg-surface-tint text-on-primary hover:bg-surface-tint/90"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="size-4 animate-spin" />
                  Saving...
                </>
              ) : isEditing ? (
                "Save Changes"
              ) : (
                "Create Block"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
