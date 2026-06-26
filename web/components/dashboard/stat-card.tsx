import {
  Building2,
  DoorOpen,
  Ticket,
  Wallet,
  type LucideIcon,
} from "lucide-react";

import {
  Card,
  CardContent,
} from "@/components/ui/card";
import type { StatChangeType } from "@/lib/data/dashboard";
import { cn } from "@/lib/utils";

const statIcons: Record<string, LucideIcon> = {
  "building-2": Building2,
  "door-open": DoorOpen,
  ticket: Ticket,
  wallet: Wallet,
};

type StatCardProps = {
  title: string;
  value: string;
  change: string;
  changeType: StatChangeType;
  icon: keyof typeof statIcons;
};

const changeStyles: Record<StatChangeType, string> = {
  positive: "text-surface-tint",
  negative: "text-error",
  neutral: "text-on-surface-variant",
};

export function StatCard({
  title,
  value,
  change,
  changeType,
  icon,
}: StatCardProps) {
  const Icon = statIcons[icon];

  return (
    <Card className="gap-0 rounded-lg border-0 bg-surface-container-lowest py-0 shadow-elevation-1 ring-0">
      <CardContent className="flex flex-col gap-3 p-5">
        <div className="flex items-start justify-between">
          <div className="flex size-10 items-center justify-center rounded-lg bg-primary-container/50">
            <Icon className="size-5 text-surface-tint" />
          </div>
        </div>
        <div className="flex flex-col gap-1">
          <p className="text-sm text-on-surface-variant">{title}</p>
          <p className="text-2xl font-bold tracking-tight text-on-surface">
            {value}
          </p>
          <p className={cn("text-xs font-medium", changeStyles[changeType])}>
            {change}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
