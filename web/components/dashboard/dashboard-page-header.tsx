"use client";
import { getDashboardUser } from "@/lib/data/dashboard";

export function DashboardPageHeader() {
  const dashboardUser = getDashboardUser(); 
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
    </div>
  );
}
