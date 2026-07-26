import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { format } from "date-fns";

interface RejectionEntry {
  reason: string;
  rejectedAt: string;
  rejectedBy?: string;
  submissionNumber: number;
  editDeadline: string;
  extendedAt?: string;
  extendedBy?: string;
  originalDeadline?: string;
}

export function RejectionHistoryDialog({
  open,
  onOpenChange,
  rejectionHistory,
  rejectionCount,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  rejectionHistory: RejectionEntry[];
  rejectionCount: number;
}) {
  if (!rejectionHistory?.length) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Rejection History ({rejectionCount}/10)</DialogTitle>
        </DialogHeader>

        <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-1">
          {rejectionHistory
            .slice()
            .reverse()
            .map((entry, idx) => (
              <div key={idx} className="p-4 rounded-lg bg-accent/50 border">
                <div className="flex items-center justify-between text-xs text-muted-foreground mb-2">
                  <span className="font-semibold">
                    Attempt #{entry.submissionNumber}
                  </span>
                  <span>
                    Deadline: {format(new Date(entry.editDeadline), "PPp")}
                  </span>
                </div>
                {entry.extendedAt && (
                  <p className="text-xs text-muted-foreground mb-2">
                    Extended on {format(new Date(entry.extendedAt), "PPp")}
                  </p>
                )}
                <p className="text-sm whitespace-pre-wrap">{entry.reason}</p>
              </div>
            ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}
