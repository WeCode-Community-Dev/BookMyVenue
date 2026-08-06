"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { MapPin, LogOut, Home, Building2, Users, CalendarCheck } from "lucide-react";
import { useClerk } from "@clerk/nextjs";

interface SidebarProps {
  setSidebarOpen: (open: boolean) => void;
  mobile?: boolean;
}

type Tab = "overview" | "venues" | "users" | "bookings";


const NAV = [
    { key: "overview" as Tab, label: "Overview", icon: Home, href: "/" },
    { key: "venues" as Tab, label: "Venues", icon: Building2, href: "/venues" },
    { key: "users" as Tab, label: "Users", icon: Users, href: "/users" },
    { key: "bookings" as Tab, label: "Bookings", icon: CalendarCheck, href: "/bookings" },
];

export function Sidebar({ setSidebarOpen, mobile = false }: SidebarProps) {
  const pathname = usePathname();
  const { signOut } = useClerk();

  return (
    <div className={`${mobile ? "flex" : "hidden lg:flex"} flex-col bg-primary text-primary-foreground h-full`}>
      <div className="px-5 py-5 border-b border-primary-foreground/10">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-accent flex items-center justify-center shrink-0">
            <MapPin className="w-4 h-4 text-white" />
          </div>
          <div>
            <p className="font-bold text-sm">BookMyVenues</p>
            <p className="text-primary-foreground/50 text-xs">Admin Console</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-1">
        {NAV.map(({ key, label, icon: Icon, href }) => (
          <Link
            key={key}
            href={href}
            onClick={() => setSidebarOpen(false)}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
              pathname === href
                ? "bg-primary-foreground/15 text-primary-foreground"
                : "text-primary-foreground/60 hover:bg-primary-foreground/10 hover:text-primary-foreground"
            }`}
          >
            <Icon className="w-4 h-4 shrink-0" />
            <span className="flex-1 text-left">{label}</span>
          </Link>
        ))}
      </nav>

      <div className="px-3 py-4 border-t border-primary-foreground/10 space-y-1">
        <button
          onClick={() => {
            setSidebarOpen(false);
            signOut({ redirectUrl: "/sign-in" });
          }}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-primary-foreground/60 hover:bg-primary-foreground/10 hover:text-primary-foreground transition-all"
        >
          <LogOut className="w-4 h-4" /> Logout
        </button>
      </div>
    </div>
  );
}
