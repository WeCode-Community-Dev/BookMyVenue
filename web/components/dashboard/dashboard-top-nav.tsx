"use client";

import { Bell, Search } from "lucide-react";

import { UserMenu } from "@/components/auth/user-menu";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { getDashboardUser } from "@/lib/data/dashboard";


export function DashboardTopNav() {
  const dashboardUser = getDashboardUser();
  return (
    <header className="flex h-16 shrink-0 items-center gap-4 border-b border-outline-variant/40 bg-surface-container-lowest px-6">
      <div className="relative mx-auto w-full flex-1">
        <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Search bookings, venues or clients..."
          className="h-10 w-full pl-9"
          />
          </div>

      <div className="flex shrink-0 items-center gap-3">
        <Button
          variant="ghost"
          size="icon"
          className="relative size-10"
          aria-label="Notifications"
        >
          <Bell className="size-5" />
          <span className="absolute top-2 right-2 size-2 rounded-full bg-error" />
        </Button>

        <UserMenu name={dashboardUser.name} initials={dashboardUser.initials} />
      </div>
    </header>
  );
}
