import { Filter } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { venuesSummary } from "@/lib/data/venues";

function SummaryStat({
  label,
  value,
  valueClassName,
}: {
  label: string;
  value: number;
  valueClassName?: string;
}) {
  return (
    <Card className="gap-0 rounded-lg border-0 bg-surface-container-lowest py-0 shadow-elevation-1 ring-0">
      <CardContent className="flex flex-col gap-1 p-5">
        <p className="text-sm text-on-surface-variant">{label}</p>
        <p
          className={`text-2xl font-bold tracking-tight text-on-surface ${valueClassName ?? ""}`}
        >
          {value}
        </p>
      </CardContent>
    </Card>
  );
}

const SummaryStates = [
  {
    label: "Total Venues",
    value: venuesSummary.totalVenues,
  },
  {
    label: "Active Bookings",
    value: venuesSummary.activeBookings,
    valueClassName: "text-surface-tint",
  },
  {
    label: "Total Spaces",
    value: venuesSummary.totalSpaces,
  },
]

export function VenuesSummaryRow() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {SummaryStates.map((state) => (
        <SummaryStat key={state.label} {...state} />
      ))}
      <Card className="gap-0 rounded-lg border-0 bg-surface-container-lowest py-0 shadow-elevation-1 ring-0">
        <CardContent className="flex h-full items-center justify-center p-5">
          <Button variant="outline" className="h-10 w-full gap-2">
            <Filter className="size-4" />
            Filter Venues
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
