import { Card, CardContent } from "@/components/ui/card";
import type { VenueDisplayStats } from "@/lib/data/venue-detail";

export function VenueSpacesStats({ stats }: { stats: VenueDisplayStats }) {
  return (
    <Card className="gap-0 rounded-lg border-0 bg-surface-container-lowest py-0 shadow-elevation-1 ring-0">
      <CardContent className="flex flex-col gap-4 p-5">
        <p className="text-xs font-semibold tracking-wider text-on-surface-variant uppercase">
          Quick Stats
        </p>
        <div className="flex flex-col gap-3">
          <StatRow label="Total Spaces" value={stats.totalSpaces} />
          <StatRow
            label="Active Bookings"
            value={stats.activeBookings}
            valueClassName="text-surface-tint"
          />
          <StatRow label="Avg. Capacity" value={stats.avgCapacity} />
        </div>
      </CardContent>
    </Card>
  );
}

function StatRow({
  label,
  value,
  valueClassName,
}: {
  label: string;
  value: number;
  valueClassName?: string;
}) {
  return (
    <div className="flex items-center justify-between gap-2">
      <span className="text-sm text-on-surface-variant">{label}</span>
      <span
        className={`text-sm font-semibold text-on-surface ${valueClassName ?? ""}`}
      >
        {value}
      </span>
    </div>
  );
}
