import {
  CalendarDays,
  Camera,
  CheckCircle2,
  Sparkles,
  type LucideIcon,
} from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import type { Space } from "@/lib/data/venues";
import { spaceManageDummy } from "@/lib/data/space-manage";
import { cn } from "@/lib/utils";

type StatItem = {
  label: string;
  value: string;
  icon: LucideIcon;
  iconClassName: string;
};

type ManageSpaceStatCardsProps = {
  space: Space;
};

export function ManageSpaceStatCards({ space }: ManageSpaceStatCardsProps) {
  const stats: StatItem[] = [
    {
      label: "Upcoming Bookings",
      value: String(spaceManageDummy.upcomingBookings),
      icon: CalendarDays,
      iconClassName: "bg-blue-100 text-blue-600",
    },
    {
      label: "Total Amenities",
      value: String(space.amenities.length),
      icon: Sparkles,
      iconClassName: "bg-purple-100 text-purple-600",
    },
    {
      label: "Total Photos",
      value: String(space.images.length),
      icon: Camera,
      iconClassName: "bg-orange-100 text-orange-600",
    },
    {
      label: "Status",
      value: space.isActive ? "Active" : "Inactive",
      icon: CheckCircle2,
      iconClassName: "bg-emerald-100 text-emerald-600",
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
      {stats.map((stat) => (
        <Card
          key={stat.label}
          className="gap-0 rounded-lg border-0 bg-surface-container-lowest py-0 shadow-elevation-1 ring-0"
        >
          <CardContent className="flex flex-col items-center gap-3 p-5 text-center">
            <div
              className={cn(
                "flex size-10 items-center justify-center rounded-full",
                stat.iconClassName,
              )}
            >
              <stat.icon className="size-5" />
            </div>
            <div className="flex flex-col gap-1">
              <p className="text-xs text-on-surface-variant">{stat.label}</p>
              <p className="text-2xl font-bold text-on-surface">{stat.value}</p>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
