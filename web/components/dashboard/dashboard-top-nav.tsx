"use client";

import { Bell, ChevronDown, Search } from "lucide-react";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="h-10 gap-2 px-2 hover:bg-surface-container-low"
            >
              <Avatar className="size-8">
                <AvatarFallback className="bg-surface-tint text-xs font-medium text-on-primary">
                  {dashboardUser.initials}
                </AvatarFallback>
              </Avatar>
              <span className="hidden text-sm font-medium text-on-surface sm:inline">
                {dashboardUser.name}
              </span>
              <ChevronDown className="size-4 text-muted-foreground" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuLabel>{dashboardUser.name}</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Profile</DropdownMenuItem>
            <DropdownMenuItem>Settings</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Log out</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
