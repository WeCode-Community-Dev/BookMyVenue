import { Badge } from "@/components/ui/badge";
import type { BookingStatus } from "@/services/bookingServices";
import { cn } from "@/lib/utils";

const statusConfig: Record<
  BookingStatus,
  { label: string; className: string }
> = {
  CONFIRMED: {
    label: "Confirmed",
    className:
      "bg-primary-container text-on-primary-container border-transparent",
  },
  PENDING: {
    label: "Pending",
    className: "bg-tertiary-fixed text-tertiary-container border-transparent",
  },
  REJECTED: {
    label: "Rejected",
    className: "bg-muted text-muted-foreground border-transparent",
  },
  CANCELLED: {
    label: "Cancelled",
    className: "bg-muted text-muted-foreground border-transparent",
  },
  COMPLETED: {
    label: "Completed",
    className: "bg-muted text-muted-foreground border-transparent",
  },
};

export function BookingStatusBadge({ status }: { status: BookingStatus }) {
  const config = statusConfig[status];

  return (
    <Badge variant="outline" className={cn("font-medium", config.className)}>
      {config.label}
    </Badge>
  );
}
