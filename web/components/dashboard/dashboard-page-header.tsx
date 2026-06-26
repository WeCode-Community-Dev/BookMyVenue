import { Download, Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { dashboardUser } from "@/lib/data/dashboard";

export function DashboardPageHeader() {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
      <div className="flex flex-col gap-1">
        <h1 className="text-headline-md font-semibold text-on-surface">
          Dashboard Overview
        </h1>
        <p className="text-body-sm text-on-surface-variant">
          Welcome back, {dashboardUser.name.split(" ")[0]}. Here&apos;s what&apos;s
          happening today.
        </p>
      </div>
      <div className="flex flex-wrap items-center gap-3">
        <Button variant="outline" className="h-10 gap-2">
          <Download className="size-4" />
          Export Reports
        </Button>
        <Button className="h-10 gap-2">
          <Plus className="size-4" />
          New Booking
        </Button>
      </div>
    </div>
  );
}
