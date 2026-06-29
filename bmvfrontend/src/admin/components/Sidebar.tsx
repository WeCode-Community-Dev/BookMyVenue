"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  ShieldCheck,
  Building2,
  Users,
  BarChart2,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Menu,
  Building,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { clearSession } from "@/src/lib/authStore";
import { LogoIcon, LogoTicket } from "@/components/Logo";

const navItems = [
  {
    href: "/admin/dashboard",
    label: "Dashboard",
    icon: LayoutDashboard,
  },
  {
    href: "/admin/verification",
    label: "Venue Verification",
    icon: ShieldCheck,
  },
  {
    href: "/admin/venues",
    label: "Manage Venues",
    icon: Building2,
  },
  {
    href: "/admin/users",
    label: "Manage Users",
    icon: Users,
  },
  {
    href: "/admin/analytics",
    label: "Analytics",
    icon: BarChart2,
  },
];

interface SidebarContentProps {
  collapsed: boolean;
  onClose?: () => void;
}

function SidebarContent({ collapsed, onClose }: SidebarContentProps) {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = () => {
    clearSession();
    onClose?.();
    router.push("/login");
  };

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Logo / Brand */}
      <div
        className={cn(
          "flex items-center gap-2.5 h-16 border-b border-[#E2E2DE] px-4 shrink-0",
          collapsed && "justify-center px-2"
        )}
      >
        {collapsed ? (
          <LogoIcon className="w-8 h-8 shrink-0" />
        ) : (
          <div className="min-w-0 flex flex-col">
            <LogoTicket iconClassName="w-8 h-8" textClassName="[&_span]:text-sm" />
            <span className="text-[9px] uppercase font-bold tracking-wider text-[#70706e] block mt-0.5 pl-0.5">
              Admin Console
            </span>
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-3 px-2 space-y-0.5">
        {navItems.map((item) => {
          const isActive =
            pathname === item.href || pathname.startsWith(item.href + "/");
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onClose}
              title={collapsed ? item.label : undefined}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 group relative",
                isActive
                  ? "bg-[#E6F1F1] text-[#0D7377] font-semibold"
                  : "text-[#70706e] hover:bg-[#F0F0EC] hover:text-[#1A1A19]",
                collapsed && "justify-center px-2.5"
              )}
            >
              <Icon
                className={cn(
                  "h-5 w-5 shrink-0 transition-colors",
                  isActive
                    ? "text-[#0D7377]"
                    : "text-[#70706e] group-hover:text-[#1A1A19]"
                )}
              />
              {!collapsed && <span className="flex-1">{item.label}</span>}
              {!collapsed && isActive && (
                <span className="h-1.5 w-1.5 rounded-full bg-[#0D7377] shrink-0" />
              )}
              {/* Tooltip when collapsed */}
              {collapsed && (
                <span className="absolute left-full ml-3 px-2 py-1 text-xs bg-[#1A1A19] text-white rounded-lg opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap z-50 transition-opacity">
                  {item.label}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Logout footer */}
      <div
        className={cn(
          "px-2 py-3 border-t border-[#E2E2DE] shrink-0",
        )}
      >
        <button
          onClick={handleLogout}
          title={collapsed ? "Logout" : undefined}
          className={cn(
            "w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-[#70706e] hover:bg-red-50 hover:text-red-600 transition-all duration-150 group",
            collapsed && "justify-center px-2.5"
          )}
        >
          <LogOut className="h-5 w-5 shrink-0 text-[#70706e] group-hover:text-red-500 transition-colors" />
          {!collapsed && <span>Logout</span>}
        </button>
      </div>
    </div>
  );
}

interface AdminSidebarProps {
  mobileOpen: boolean;
  onMobileClose: () => void;
}

export function AdminSidebar({ mobileOpen, onMobileClose }: AdminSidebarProps) {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <>
      {/* ── Desktop sidebar ── */}
      <aside
        className={cn(
          "hidden lg:flex flex-col shrink-0 fixed top-0 left-0 h-full z-30 border-r border-[#E2E2DE] transition-all duration-300",
          collapsed ? "w-[68px]" : "w-60"
        )}
      >
        <SidebarContent collapsed={collapsed} />

        {/* Collapse toggle button */}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="absolute -right-3 top-[72px] h-6 w-6 rounded-full bg-white border border-[#E2E2DE] shadow-sm flex items-center justify-center hover:bg-[#F0F0EC] transition-colors z-10"
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {collapsed ? (
            <ChevronRight className="h-3 w-3 text-[#70706e]" />
          ) : (
            <ChevronLeft className="h-3 w-3 text-[#70706e]" />
          )}
        </button>
      </aside>

      {/* ── Mobile drawer ── */}
      <Sheet open={mobileOpen} onOpenChange={onMobileClose}>
        <SheetContent side="left" className="p-0 w-64 border-r border-[#E2E2DE]">
          <SidebarContent collapsed={false} onClose={onMobileClose} />
        </SheetContent>
      </Sheet>
    </>
  );
}

/** Exported so layout can reference the sidebar widths for offsetting main content */
export const SIDEBAR_COLLAPSED_W = "68px";
export const SIDEBAR_EXPANDED_W = "240px";

/** A floating menu button for mobile — renders outside the sidebar */
export function MobileMenuButton({
  onClick,
}: {
  onClick: () => void;
}) {
  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={onClick}
      className="lg:hidden h-9 w-9 p-0 rounded-xl"
      aria-label="Open navigation menu"
    >
      <Menu className="h-5 w-5" />
    </Button>
  );
}
