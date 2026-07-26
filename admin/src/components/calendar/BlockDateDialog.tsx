import { Lock } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

export function BlockDateDialog({
  confirmOpen,
  setConfirmOpen,
  selectedDate,
  setSelectedDate,
  isCurrentlyBlocked,
  handleConfirmAction,
  blockPending,
  unblockPending,
}: {
  confirmOpen: boolean;
  setConfirmOpen: (open: boolean) => void;
  selectedDate: Date | null;
  setSelectedDate: (date: Date | null) => void;
  isCurrentlyBlocked: boolean;
  handleConfirmAction: () => void;
  blockPending: boolean;
  unblockPending: boolean;
}) {
  return (
    <Dialog
      open={confirmOpen}
      onOpenChange={(o) => {
        setConfirmOpen(o);
        if (!o) setSelectedDate(null);
      }}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Lock className="h-5 w-5 text-zinc-600" />
            {isCurrentlyBlocked ? "Unblock Date" : "Block Date"}
          </DialogTitle>
          <DialogDescription>
            Are you sure you want to {isCurrentlyBlocked ? "unblock" : "block"}{" "}
            <strong>
              {selectedDate
                ? selectedDate.toLocaleDateString("en-IN", {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })
                : ""}
            </strong>
            ?{" "}
            {isCurrentlyBlocked
              ? "Customers will be able to book on this date again."
              : "Customers will not be able to book on this date."}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => {
              setConfirmOpen(false);
              setSelectedDate(null);
            }}
          >
            Cancel
          </Button>
          <Button
            variant={isCurrentlyBlocked ? "default" : "destructive"}
            disabled={blockPending || unblockPending}
            onClick={handleConfirmAction}
          >
            {isCurrentlyBlocked
              ? unblockPending
                ? "Unblocking…"
                : "Confirm Unblock"
              : blockPending
                ? "Blocking…"
                : "Confirm Block"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
