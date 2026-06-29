"use client";

import React from "react";
import { usePathname } from "next/navigation";
import { Bell, ChevronRight, Home } from "lucide-react";
import Link from "next/link";
import { MobileMenuButton } from "./Sidebar";
import { cn } from "@/lib/utils";

interface TopBarProps {
  partnerName: string;
  onMobileMenuOpen: () => void;
  className?: string;
}

const segmentLabels: Record<string, string> = {
  partner: "Console",
  dashboard: "Dashboard",
  venue: "Manage Venue",
  bookings: "Bookings",
  "blocked-dates": "Blocked Dates",
};

function getBreadcrumbs(pathname: string) {
  const segments = pathname.split("/").filter(Boolean);
  const crumbs: { label: string; href: string }[] = [];
  let path = "";
  for (const seg of segments) {
    path += `/${seg}`;
    const label =
      segmentLabels[seg] ??
      (seg.charAt(0).toUpperCase() + seg.slice(1));
    crumbs.push({ label, href: path });
  }
  return crumbs;
}

export function PartnerTopBar({ partnerName, onMobileMenuOpen, className }: TopBarProps) {
  const pathname = usePathname();
  const crumbs = getBreadcrumbs(pathname);

  return (
    <header
      className={cn(
        "h-16 bg-white border-b border-[#E2E2DE] flex items-center px-4 md:px-6 gap-3 sticky top-0 z-20 shadow-xs",
        className
      )}
    >
      {/* Mobile hamburger */}
      <MobileMenuButton onClick={onMobileMenuOpen} />

      {/* Breadcrumbs */}
      <nav className="flex items-center gap-1 min-w-0 flex-1">
        {crumbs.map((crumb, i) => (
          <React.Fragment key={crumb.href}>
            {i > 0 && (
              <ChevronRight className="h-3.5 w-3.5 text-[#70706e] shrink-0" />
            )}
            <span
              className={cn(
                "text-sm truncate",
                i === crumbs.length - 1
                  ? "font-semibold text-[#1A1A19]"
                  : "text-[#70706e] font-medium"
              )}
            >
              {crumb.label}
            </span>
          </React.Fragment>
        ))}
      </nav>

      {/* Right section */}
      <div className="flex items-center gap-3 shrink-0">
        <Link href="/" className="hidden sm:flex items-center gap-1 text-xs font-semibold text-[#0D7377] hover:underline px-3 py-1.5 rounded-lg bg-[#E6F1F1] transition-all">
          <Home className="h-3.5 w-3.5" />
          <span>View Public Site</span>
        </Link>

        <button
          className="h-9 w-9 rounded-xl bg-[#F0F0EC] flex items-center justify-center text-[#70706e] hover:bg-[#E2E2DE] transition-colors relative"
          aria-label="Notifications"
        >
          <Bell className="h-4.5 w-4.5" />
          {/* Notification dot */}
          <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-[#F4A261] border-2 border-white" />
        </button>

        <div className="h-6 w-px bg-[#E2E2DE]" />

        <div className="flex items-center gap-2.5">
          <div className="h-8 w-8 rounded-xl bg-[#0D7377] flex items-center justify-center text-white text-xs font-bold shrink-0">
            {partnerName
              .split(" ")
              .map((n) => n[0])
              .join("")
              .toUpperCase()
              .slice(0, 2)}
          </div>
          <div className="text-right hidden sm:block">
            <span className="text-xs font-bold text-[#1A1A19] block leading-none">
              {partnerName}
            </span>
            <span className="text-[10px] text-[#70706e] block mt-0.5">
              Venue Partner
            </span>
          </div>
        </div>
      </div>
    </header>
  );
}
