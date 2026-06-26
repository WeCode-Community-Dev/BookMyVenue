import Link from "next/link";
import { Ban, ChevronRight, LayoutGrid, PlusCircle } from "lucide-react";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { quickActions } from "@/lib/data/dashboard";

const actionIcons = {
  "plus-circle": PlusCircle,
  "layout-grid": LayoutGrid,
  ban: Ban,
} as const;

export function QuickActions() {
  return (
    <Card className="gap-0 rounded-lg border-0 bg-surface-container-lowest py-0 shadow-elevation-1 ring-0">
      <CardHeader className="px-6 pt-6 pb-0">
        <CardTitle className="text-base font-semibold text-on-surface">
          Quick Actions
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-2 px-4 pt-4 pb-4">
        {quickActions.map((action) => {
          const Icon = actionIcons[action.icon];
          return (
            <Link
              key={action.label}
              href={action.href}
              className="flex items-center justify-between rounded-lg border border-outline-variant/40 bg-background px-4 py-3 transition-colors hover:bg-surface-container-low"
            >
              <div className="flex items-center gap-3">
                <Icon className="size-4 text-surface-tint" />
                <span className="text-sm font-medium text-on-surface">
                  {action.label}
                </span>
              </div>
              <ChevronRight className="size-4 text-muted-foreground" />
            </Link>
          );
        })}
      </CardContent>
    </Card>
  );
}
