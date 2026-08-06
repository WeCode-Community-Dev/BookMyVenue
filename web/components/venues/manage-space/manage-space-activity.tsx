import {
  Bell,
  MessageSquare,
  RefreshCw,
  Upload,
  type LucideIcon,
} from "lucide-react";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  spaceManageActivity,
  type SpaceManageActivityIcon,
} from "@/lib/data/space-manage";
import { cn } from "@/lib/utils";

const activityIcons: Record<SpaceManageActivityIcon, LucideIcon> = {
  bell: Bell,
  "refresh-cw": RefreshCw,
  upload: Upload,
  "message-square": MessageSquare,
};

export function ManageSpaceActivity() {
  return (
    <Card className="gap-0 rounded-lg border-0 bg-surface-container-lowest py-0 shadow-elevation-1 ring-0">
      <CardHeader className="px-6 pt-6 pb-0">
        <CardTitle className="text-base font-semibold text-on-surface">
          Recent Activity
        </CardTitle>
      </CardHeader>
      <CardContent className="px-6 pt-4 pb-6">
        <ul className="flex flex-col">
          {spaceManageActivity.map((item, index) => {
            const Icon = activityIcons[item.icon];
            const isLast = index === spaceManageActivity.length - 1;

            return (
              <li key={`${item.title}-${item.timeAgo}`} className="relative flex gap-4 pb-6 last:pb-0">
                {!isLast && (
                  <span
                    className="absolute top-10 left-5 h-[calc(100%-16px)] w-px bg-outline-variant/60"
                    aria-hidden="true"
                  />
                )}
                <div
                  className={cn(
                    "relative z-10 flex size-10 shrink-0 items-center justify-center rounded-full",
                    item.iconClassName,
                  )}
                >
                  <Icon className="size-4" />
                </div>
                <div className="flex min-w-0 flex-col gap-0.5 pt-1.5">
                  <p className="text-sm text-on-surface">
                    <span className="font-medium">{item.title}</span>{" "}
                    <span className="text-on-surface-variant">{item.detail}</span>
                  </p>
                  <p className="text-xs text-on-surface-variant">{item.timeAgo}</p>
                </div>
              </li>
            );
          })}
        </ul>
      </CardContent>
    </Card>
  );
}
