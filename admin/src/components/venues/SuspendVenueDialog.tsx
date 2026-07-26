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
import { MIN_REASON_LENGTH } from "@/constants/validation";

export function SuspendVenueDialog({
  open,
  setOpen,
  suspensionReason,
  setSuspensionReason,
  handleSuspend,
  isPending,
}: {
  open: boolean;
  setOpen: (open: boolean) => void;
  suspensionReason: string;
  setSuspensionReason: (reason: string) => void;
  handleSuspend: () => void;
  isPending: boolean;
}) {
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Suspend Venue</DialogTitle>
          <DialogDescription>
            This venue will be immediately hidden from users. The reason will be
            emailed to the owner.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4 space-y-2">
          <Label htmlFor="suspend-reason">Suspension Reason *</Label>
          <Input
            id="suspend-reason"
            value={suspensionReason}
            onChange={(e) => setSuspensionReason(e.target.value)}
            placeholder="e.g. Repeated user complaints, safety hazard…"
          />
        </div>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => {
              setOpen(false);
              setSuspensionReason("");
            }}
          >
            Cancel
          </Button>
          <Button
            variant="destructive"
            disabled={
              suspensionReason.trim().length < MIN_REASON_LENGTH || isPending
            }
            onClick={handleSuspend}
          >
            {isPending ? "Suspending…" : "Confirm Suspension"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
