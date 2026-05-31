"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Building2,
  Calendar,
  BarChart3,
  Wallet,
  Settings,
  LogOut,
  Menu,
  X,
  Sparkles,
} from "lucide-react";
import { cn } from "@/lib/utils";

// Active menu items list matching the dashboard/owner sidebar
const navigationItems = [
  { name: "Overview", href: "/dashboard/owner/overview", icon: LayoutDashboard },
  { name: "My Venues", href: "/dashboard/owner/venues", icon: Building2 },
  { name: "Calendar", href: "/dashboard/owner/calendar", icon: Calendar },
  { name: "Analytics", href: "/dashboard/owner/analytics", icon: BarChart3 },
  { name: "Payouts", href: "/dashboard/owner/payouts", icon: Wallet },
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-background font-sans text-text-primary antialiased">
      {/* ─── DESKTOP SIDEBAR ────────────────────────────────────────────────── */}
      <aside className="fixed inset-y-0 left-0 z-20 hidden w-[280px] flex-col justify-between border-r border-border-subtle bg-surface p-6 lg:flex">
        <div className="flex flex-col space-y-8">
          {/* Logo */}
          <Link href="/dashboard/owner/overview" className="flex items-center gap-2">
            <span className="font-display text-2xl font-bold text-on-surface">
              BookMy<span className="text-primary-container">Venue</span>
            </span>
          </Link>

          {/* Profile Card */}
          <div className="flex items-center gap-3 rounded-2xl bg-surface-container-low p-3.5 border border-border-subtle/50">
            <div className="relative h-10 w-10 overflow-hidden rounded-full border border-primary-container/20">
              <img
                src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80"
                alt="Sarah - Profile"
                className="h-full w-full object-cover"
              />
            </div>
            <div className="flex flex-col">
              <span className="text-label-md text-on-surface">Sarah</span>
              <span className="text-label-sm text-text-muted mt-0.5">Owner Portal</span>
              <span className="mt-1 w-max rounded-full bg-primary-fixed px-2 py-0.5 text-[10px] font-semibold text-on-primary-fixed">
                Premium Partner
              </span>
            </div>
          </div>

          {/* Main Navigation */}
          <nav className="flex flex-col gap-1.5">
            {navigationItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3.5 rounded-xl px-4 py-3.5 text-label-md transition-all duration-200",
                    isActive
                      ? "bg-primary-container text-white shadow-lg shadow-primary-container/20 hover:-translate-y-0.5"
                      : "text-text-muted hover:bg-surface-container-low hover:text-on-surface hover:translate-x-0.5"
                  )}
                >
                  <item.icon className="h-5 w-5 shrink-0" />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Bottom Sidebar Widgets */}
        <div className="flex flex-col gap-5">
          {/* Upgrade Plan Widget */}
          <div className="relative overflow-hidden rounded-2xl bg-surface-container-low p-4 border border-border-subtle">
            <div className="flex items-center justify-between">
              <span className="text-label-sm text-text-muted">Current Plan</span>
              <span className="rounded bg-[#fce3d9] px-1.5 py-0.5 text-[10px] font-bold text-primary-container">
                PREMIUM
              </span>
            </div>
            <p className="mt-2 text-label-md font-bold text-on-surface">Upgrade your plan to unlock elite perks</p>
            <button className="mt-3.5 w-full rounded-xl bg-[#582200] py-3 text-label-sm font-bold text-white shadow-md transition-all duration-200 hover:bg-[#3c2d26] hover:-translate-y-0.5 active:scale-[0.98]">
              Upgrade Plan
            </button>
            <div className="absolute -right-4 -bottom-4 opacity-5">
              <Sparkles className="h-24 w-24 text-primary-container" />
            </div>
          </div>

          {/* Settings & Logout */}
          <div className="flex flex-col gap-1 border-t border-border-subtle pt-4">
            <Link
              href="/dashboard/owner/settings"
              className={cn(
                "flex items-center gap-3.5 rounded-xl px-4 py-3 text-label-md transition-all duration-200 text-text-muted hover:bg-surface-container-low hover:text-on-surface",
                pathname === "/dashboard/owner/settings" && "bg-surface-container text-on-surface"
              )}
            >
              <Settings className="h-5 w-5 shrink-0" />
              <span>Settings</span>
            </Link>
            <Link
              href="/login"
              className="flex items-center gap-3.5 rounded-xl px-4 py-3 text-label-md transition-all duration-200 text-text-muted hover:bg-red-50 hover:text-red-600"
            >
              <LogOut className="h-5 w-5 shrink-0" />
              <span>Logout</span>
            </Link>
          </div>
        </div>
      </aside>

      {/* ─── MOBILE HEADER & NAVIGATION ───────────────────────────────────────── */}
      <div className="flex w-full flex-col lg:pl-[280px]">
        {/* Mobile Header Bar */}
        <header className="flex h-16 items-center justify-between border-b border-border-subtle bg-white px-4 lg:hidden">
          <Link href="/dashboard/owner/overview" className="flex items-center gap-2">
            <span className="font-display text-xl font-bold text-on-surface">
              BookMy<span className="text-primary-container">Venue</span>
            </span>
          </Link>
          <button
            onClick={() => setIsMobileMenuOpen(true)}
            className="rounded-lg p-1.5 text-text-primary hover:bg-surface-container-low"
            aria-label="Open Navigation Menu"
          >
            <Menu className="h-6 w-6" />
          </button>
        </header>

        {/* Mobile Menu Backdrop */}
        {isMobileMenuOpen && (
          <div
            className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm lg:hidden animate-fade-in"
            onClick={() => setIsMobileMenuOpen(false)}
          />
        )}

        {/* Mobile Sidebar Slider */}
        <div
          className={cn(
            "fixed inset-y-0 right-0 z-50 flex w-[280px] flex-col justify-between bg-surface p-6 shadow-2xl transition-transform duration-300 ease-out lg:hidden",
            isMobileMenuOpen ? "translate-x-0" : "translate-x-full"
          )}
        >
          <div className="flex flex-col space-y-6">
            <div className="flex items-center justify-between">
              <span className="font-display text-xl font-bold text-on-surface">
                BookMy<span className="text-primary-container">Venue</span>
              </span>
              <button
                onClick={() => setIsMobileMenuOpen(false)}
                className="rounded-lg p-1.5 text-text-muted hover:bg-surface-container-low"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Profile */}
            <div className="flex items-center gap-3 rounded-2xl bg-surface-container-low p-3.5 border border-border-subtle/50">
              <img
                src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80"
                alt="Sarah - Profile"
                className="h-9 w-9 rounded-full border border-primary-container/20 object-cover"
              />
              <div className="flex flex-col">
                <span className="text-label-md text-on-surface font-semibold">Sarah</span>
                <span className="text-label-sm text-text-muted">Owner Portal</span>
              </div>
            </div>

            {/* Navigation */}
            <nav className="flex flex-col gap-1">
              {navigationItems.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={cn(
                      "flex items-center gap-3.5 rounded-xl px-4 py-3 text-label-md transition-all duration-200",
                      isActive
                        ? "bg-primary-container text-white shadow-lg shadow-primary-container/20"
                        : "text-text-muted hover:bg-surface-container-low hover:text-on-surface"
                    )}
                  >
                    <item.icon className="h-5 w-5 shrink-0" />
                    <span>{item.name}</span>
                  </Link>
                );
              })}
            </nav>
          </div>

          <div className="flex flex-col gap-4 border-t border-border-subtle pt-4">
            <Link
              href="/dashboard/owner/settings"
              onClick={() => setIsMobileMenuOpen(false)}
              className="flex items-center gap-3.5 rounded-xl px-4 py-3 text-label-md text-text-muted hover:bg-surface-container-low hover:text-on-surface"
            >
              <Settings className="h-5 w-5 shrink-0" />
              <span>Settings</span>
            </Link>
            <Link
              href="/login"
              onClick={() => setIsMobileMenuOpen(false)}
              className="flex items-center gap-3.5 rounded-xl px-4 py-3 text-label-md text-text-muted hover:bg-red-50 hover:text-red-600"
            >
              <LogOut className="h-5 w-5 shrink-0" />
              <span>Logout</span>
            </Link>
          </div>
        </div>

        {/* ─── MAIN DASHBOARD CONTENT AREA ────────────────────────────────────── */}
        <main className="flex-1 overflow-x-hidden px-4 py-6 md:px-8 md:py-8 lg:px-10 lg:py-10">
          {children}
        </main>
      </div>
    </div>
  );
}
