"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useApp, VenueResponse } from "@/context/AppContext";
import { Button } from "@/components/ui/button";
import {
  LayoutDashboard, Building, Calendar, MessageSquare, BarChart3, Settings,
  Menu, ShieldAlert,
} from "lucide-react";
import { AddVenueDialog } from "./AddVenueDialog";
import DashboardTab from "./components/host/DashboardTab";
import VenuesTab from "./components/host/VenuesTab";
import BookingsTab from "./components/host/BookingsTab";
import ReviewsTab from "./components/host/ReviewsTab";
import AnalyticsTab from "./components/host/AnalyticsTab";
import SettingsTab from "./components/host/SettingsTab";

export default function HostDashboard() {
  const router = useRouter();

  const { role, setRole, isLoading } = useApp();

  // Navigation Sidebar states
  const [activeTab, setActiveTab] = useState<"dashboard" | "venues" | "bookings" | "reviews" | "analytics" | "settings">("dashboard");
  const [sidebarOpenMobile, setSidebarOpenMobile] = useState(false);

  // Create Venue Dialog state
  const [isAddOpen, setIsAddOpen] = useState(false);

  const [authorized, setAuthorized] = useState(false);
  const [hostVenues, setHostVenues] = useState<VenueResponse[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("userRole");

    if (!token || role !== "OWNER") {
      router.replace("/login");
    } else {
      setAuthorized(true);
    }
  }, [router]);

  const fetchVenues = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const response = await fetch(
        "http://localhost:8080/api/owner/venue",
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        const errorBody = await response.text();
        console.error("Fetch venues failed:", response.status, errorBody);
        throw new Error(`Failed to fetch venues (${response.status})`);
      }

      const data = await response.json();
      setHostVenues(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch once on mount (so newly created venues appear even on the dashboard tab / stat cards),
  // and again whenever the Venues tab is opened.
  useEffect(() => {
    fetchVenues();
  }, []);

  useEffect(() => {
    if (activeTab === "venues") {
      fetchVenues();
    }
  }, [activeTab]);

  if (!authorized) {
    return null;
  }

  if (isLoading) {
    return (
      <div className="flex-grow flex items-center justify-center p-12 bg-background">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-primary"></div>
      </div>
    );
  }

  // Ensure role guard
  if (role !== "host") {
    return (
      <div className="flex-grow flex flex-col items-center justify-center p-12 text-center bg-background">
        <div className="h-16 w-16 bg-rose-50 dark:bg-rose-950/20 text-rose-500 rounded-full flex items-center justify-center mb-6">
          <ShieldAlert className="h-8 w-8" />
        </div>
        <h3 className="font-extrabold text-xl text-foreground">Access Restricted</h3>
        <p className="text-muted-foreground mt-2 max-w-sm text-sm">
          Please enable Host Portal mode in the navigation header to manage space listings and guest bookings.
        </p>
        <Button
          onClick={() => setRole("host")}
          className="mt-6 rounded-xl bg-primary text-primary-foreground font-semibold px-6"
        >
          Enable Host Portal
        </Button>
      </div>
    );
  }

  // Sidebar navigation options list
  const sidebarItems = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "venues", label: "Venues", icon: Building },
    { id: "bookings", label: "Bookings", icon: Calendar },
    { id: "reviews", label: "Reviews", icon: MessageSquare },
    { id: "analytics", label: "Analytics", icon: BarChart3 },
    { id: "settings", label: "Settings", icon: Settings },
  ] as const;

  return (
    <div className="flex-grow flex bg-muted/20 dark:bg-muted/5">
      {/* 1. Desktop Sidebar Column (Sticky Left) */}
      <aside className="hidden md:flex flex-col w-64 border-r border-border bg-card shrink-0 select-none">
        <div className="p-6 border-b border-border">
          <span className="text-xxs font-extrabold uppercase tracking-wider text-muted-foreground block">
            Management Panel
          </span>
          <div className="flex items-center space-x-2 mt-2">
            <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
              <Building className="h-4.5 w-4.5" />
            </div>
            <span className="text-sm font-extrabold text-foreground truncate">
              Premium Host
            </span>
          </div>
        </div>

        {/* Navigation links stack */}
        <nav className="flex-1 p-4 space-y-1">
          {sidebarItems.map((item) => {
            const isActive = activeTab === item.id;
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center px-4 py-3 rounded-xl text-sm font-bold transition-all cursor-pointer ${isActive
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                  }`}
              >
                <Icon className="mr-3 h-4.5 w-4.5" />
                {item.label}
              </button>
            );
          })}
        </nav>
      </aside>

      {/* 2. Mobile Header navigation bar */}
      <div className="flex-grow flex flex-col">
        <div className="md:hidden border-b border-border bg-card px-4 py-3 flex items-center justify-between sticky top-16 z-30">
          <div className="flex items-center space-x-2">
            <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
              <Building className="h-4.5 w-4.5" />
            </div>
            <span className="text-sm font-extrabold text-foreground capitalize">
              {activeTab}
            </span>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setSidebarOpenMobile(!sidebarOpenMobile)}
            className="rounded-xl"
            aria-label="Toggle Dashboard Menu"
          >
            <Menu className="h-5 w-5" />
          </Button>
        </div>

        {/* Mobile menu drawer dropdown */}
        {sidebarOpenMobile && (
          <div className="md:hidden bg-card border-b border-border p-4 space-y-1 animate-in fade-in slide-in-from-top-3 z-30 relative select-none">
            {sidebarItems.map((item) => {
              const isActive = activeTab === item.id;
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id);
                    setSidebarOpenMobile(false);
                  }}
                  className={`w-full flex items-center px-4 py-3 rounded-xl text-sm font-bold transition-all cursor-pointer ${isActive
                      ? "bg-primary/10 text-primary"
                      : "text-muted-foreground hover:bg-accent hover:text-foreground"
                    }`}
                >
                  <Icon className="mr-3 h-4.5 w-4.5" />
                  {item.label}
                </button>
              );
            })}
          </div>
        )}

        {/* 3. Main Dashboard Viewport */}
        <main className="flex-1 p-6 md:p-8 space-y-8 max-w-5xl w-full mx-auto">

          {/* TAB 1: DASHBOARD VIEW */}
          {activeTab === "dashboard" && (
            <DashboardTab
              hostVenues={hostVenues}
              onAddSpace={() => setIsAddOpen(true)}
              onViewBookings={() => setActiveTab("bookings")}
            />
          )}

          {/* TAB 2: VENUES VIEW */}
          {activeTab === "venues" && (
            <VenuesTab
              hostVenues={hostVenues}
              loading={loading}
              onAddSpace={() => setIsAddOpen(true)}
            />
          )}

          {/* TAB 3: BOOKINGS LEDGER VIEW */}
          {activeTab === "bookings" && <BookingsTab />}

          {/* TAB 4: REVIEWS TAB */}
          {activeTab === "reviews" && <ReviewsTab />}

          {/* TAB 5: ANALYTICS TAB */}
          {activeTab === "analytics" && <AnalyticsTab />}

          {/* TAB 6: SETTINGS TAB */}
          {activeTab === "settings" && <SettingsTab />}

        </main>
      </div>

      {/* Add Venue Dialog */}
      <AddVenueDialog
        open={isAddOpen}
        onOpenChange={setIsAddOpen}
        onCreated={fetchVenues}
      />
    </div>
  );
}
