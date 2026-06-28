import { CheckCircle2 } from "lucide-react";

import { ListVenueProTip } from "@/components/venues/create/list-venue-pro-tip";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  availabilityProTip,
  computeWeeklyCapacityHours,
  formatNextBlockedDate,
  type OperatingHourRow,
} from "@/lib/data/space-manage";
import type { SpaceBlockedPeriodResponse } from "@/services/venueServices";
import { cn } from "@/lib/utils";

type ManageSpaceAvailabilitySidebarProps = {
  operatingHours: OperatingHourRow[];
  blocks: SpaceBlockedPeriodResponse[];
};

function SummaryRow({
  label,
  value,
  valueClassName,
}: {
  label: string;
  value: string;
  valueClassName?: string;
}) {
  return (
    <div className="flex items-center justify-between gap-2 text-sm">
      <span className="text-on-surface-variant">{label}</span>
      <span className={cn("font-medium text-on-surface", valueClassName)}>
        {value}
      </span>
    </div>
  );
}

export function ManageSpaceAvailabilitySidebar({
  operatingHours,
  blocks,
}: ManageSpaceAvailabilitySidebarProps) {
  const weeklyHours = computeWeeklyCapacityHours(operatingHours);
  const nextBlock = blocks[0];
  const nextBlockedLabel = nextBlock
    ? formatNextBlockedDate(nextBlock.startAt)
    : "—";

  return (
    <div className="flex flex-col gap-4">
      <Card className="gap-0 rounded-lg border-0 bg-surface-container-lowest py-0 shadow-elevation-1 ring-0">
        <CardHeader className="px-5 pt-5 pb-0">
          <CardTitle className="text-base font-semibold text-on-surface">
            Summary
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-3 px-5 pt-4 pb-5">
          <SummaryRow
            label="Weekly Capacity"
            value={`${weeklyHours} Hours`}
          />
          <SummaryRow
            label="Next Blocked Date"
            value={nextBlockedLabel}
            valueClassName={nextBlock ? "text-destructive" : undefined}
          />
          {/* <SummaryRow label="Lead Time Requirement" value="24 Hours" /> */}

          {/* <div className="mt-2 flex flex-col gap-1 rounded-lg border border-outline-variant/30 bg-surface-container-low px-3 py-3">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="size-4 text-emerald-600" />
              <span className="text-sm font-medium text-on-surface">
                Syncing with Google Calendar
              </span>
            </div>
            <p className="text-[10px] font-semibold tracking-wider text-on-surface-variant uppercase">
              Last synced 2m ago
            </p>
          </div> */}
        </CardContent>
      </Card>

      <ListVenueProTip
        title={availabilityProTip.title}
        body={availabilityProTip.body}
      />
    </div>
  );
}
