import { Badge } from "@/components/ui/badge";
import type { SpaceDisplayStatus } from "@/lib/data/venue-detail";
import { cn } from "@/lib/utils";

const statusConfig: Record<
  SpaceDisplayStatus,
  { label: string; className: string }
> = {
  available: {
    label: "AVAILABLE",
    className: "bg-emerald-500/90 text-white border-transparent",
  },
  booked: {
    label: "BOOKED",
    className: "bg-amber-500/90 text-white border-transparent",
  },
};

export function SpaceStatusBadge({ status }: { status: SpaceDisplayStatus }) {
  const config = statusConfig[status];

  return (
    <Badge
      variant="outline"
      className={cn(
        "rounded px-2 py-0.5 text-[10px] font-semibold tracking-wide uppercase",
        config.className,
      )}
    >
      {config.label}
    </Badge>
  );
}
