"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Calendar,
  CalendarDays,
  LayoutDashboard,
  MapPin,
  Settings,
  Star,
  type LucideIcon,
} from "lucide-react";

// import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  // dashboardUser,
  navItems,
  // settingsNavItem,
  type NavIcon,
} from "@/lib/data/dashboard";
import { cn } from "@/lib/utils";

const navIcons: Record<NavIcon, LucideIcon> = {
  "layout-dashboard": LayoutDashboard,
  "map-pin": MapPin,
  "calendar-days": CalendarDays,
  calendar: Calendar,
  star: Star,
  settings: Settings,
};

export function DashboardSidebar() {
  const pathname = usePathname();
  console.log(pathname);

  return (
    <aside className="flex w-[280px] shrink-0 flex-col border-r border-outline-variant/40 bg-surface-container-lowest">
      <div className="border-b border-outline-variant/40 px-6 py-6">
        <p className="text-lg font-bold text-on-surface">BookMyVenue</p>
        <p className="text-sm text-on-surface-variant">Venue Management</p>
      </div>

      <nav className="flex flex-1 flex-col gap-1 px-4 py-4">
        {navItems.map((item) => {
          const Icon = navIcons[item.icon];
          const isActive = pathname === item.href;

          return (
            <Link
              key={item.label}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                isActive
                  ? "bg-surface-tint text-on-primary"
                  : "text-on-surface-variant hover:bg-surface-container-low hover:text-on-surface"
              )}
            >
              <Icon className="size-4 shrink-0" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* <div className="flex flex-col gap-4 px-4 pb-6">
        <Link
          href={settingsNavItem.href}
          className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-on-surface-variant transition-colors hover:bg-surface-container-low hover:text-on-surface"
        >
          <Settings className="size-4 shrink-0" />
          {settingsNavItem.label}
        </Link>

        <div className="flex items-center gap-3 rounded-lg bg-primary-container/30 p-3">
          <Avatar className="size-10">
            <AvatarFallback className="bg-surface-tint text-sm font-medium text-on-primary">
              {dashboardUser.initials}
            </AvatarFallback>
          </Avatar>
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-on-surface">
              {dashboardUser.name}
            </p>
            <p className="truncate text-xs text-on-surface-variant">
              {dashboardUser.role}
            </p>
          </div>
        </div>
      </div> */}
    </aside>
  );
}
