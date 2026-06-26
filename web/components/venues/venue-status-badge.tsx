import { Badge } from "@/components/ui/badge";
import type { VenueStatus } from "@/lib/data/venues";
import { cn } from "@/lib/utils";

const statusConfig: Record<
  VenueStatus,
  { label: string; dotClassName: string; className: string }
> = {
  active: {
    label: "Active",
    dotClassName: "bg-emerald-500",
    className: "bg-surface-container-lowest/95 text-on-surface backdrop-blur-sm",
  },
  inactive: {
    label: "Inactive",
    dotClassName: "bg-muted-foreground",
    className: "bg-surface-container-lowest/95 text-on-surface-variant backdrop-blur-sm",
  },
};

export function VenueStatusBadge({ status }: { status: VenueStatus }) {
  const config = statusConfig[status];

  return (
    <Badge
      variant="outline"
      className={cn("gap-1.5 border-transparent font-medium", config.className)}
    >
      <span
        className={cn("size-1.5 rounded-full", config.dotClassName)}
        aria-hidden="true"
      />
      {config.label}
    </Badge>
  );
}
