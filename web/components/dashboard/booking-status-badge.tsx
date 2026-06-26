import { Badge } from "@/components/ui/badge";
import type { BookingStatus } from "@/lib/data/dashboard";
import { cn } from "@/lib/utils";

const statusConfig: Record<
  BookingStatus,
  { label: string; className: string }
> = {
  confirmed: {
    label: "Confirmed",
    className: "bg-primary-container text-on-primary-container border-transparent",
  },
  pending: {
    label: "Pending",
    className: "bg-tertiary-fixed text-tertiary-container border-transparent",
  },
  draft: {
    label: "Draft",
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
