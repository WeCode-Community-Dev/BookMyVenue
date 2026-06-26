import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { recentActivity } from "@/lib/data/dashboard";

export function RecentActivity() {
  return (
    <Card className="gap-0 rounded-lg border-0 bg-surface-container-lowest py-0 shadow-elevation-1 ring-0">
      <CardHeader className="px-6 pt-6 pb-0">
        <CardTitle className="text-base font-semibold text-on-surface">
          Recent Activity
        </CardTitle>
      </CardHeader>
      <CardContent className="px-6 pt-4 pb-6">
        <ul className="flex flex-col gap-4">
          {recentActivity.map((item, index) => (
            <li key={item.message} className="relative flex gap-3 pl-4">
              <span
                className="absolute top-1.5 left-0 size-2 rounded-full bg-surface-tint"
                aria-hidden="true"
              />
              {index < recentActivity.length - 1 && (
                <span
                  className="absolute top-4 left-[3px] h-[calc(100%+8px)] w-px bg-outline-variant/60"
                  aria-hidden="true"
                />
              )}
              <div className="flex flex-col gap-0.5 pb-1">
                <p className="text-sm text-on-surface">{item.message}</p>
                <p className="text-xs text-on-surface-variant">{item.timeAgo}</p>
              </div>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}
