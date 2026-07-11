"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useApp, Venue, VenueResponse } from "@/context/AppContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useEffect } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import {
  LayoutDashboard, Building, Calendar, Star, BarChart3, Settings, DollarSign,
  Check, X, Plus, Menu, MapPin, Users, TrendingUp, Clock, ArrowUpRight,
  MessageSquare, Save, Bell, ShieldAlert, Trash, CreditCard, ChevronRight, Sparkles
} from "lucide-react";
import { format, parseISO, isAfter } from "date-fns";
import { AddVenueDialog } from "./AddVenueDialog";

// Mock chart monthly data
const REVENUE_DATA = [
  { month: "Jan", revenue: 1200 },
  { month: "Feb", revenue: 1900 },
  { month: "Mar", revenue: 1500 },
  { month: "Apr", revenue: 2600 },
  { month: "May", revenue: 3100 },
  { month: "Jun", revenue: 4200 },
];

export default function HostDashboard() {
  const router = useRouter();

  const {
    venues, bookings, addVenue, deleteVenue, updateBookingStatus, role, setRole, isLoading
  } = useApp();

  // Navigation Sidebar states
  const [activeTab, setActiveTab] = useState<"dashboard" | "venues" | "bookings" | "reviews" | "analytics" | "settings">("dashboard");
  const [sidebarOpenMobile, setSidebarOpenMobile] = useState(false);

  // Filter Bookings Tab state
  const [bookingFilter, setBookingFilter] = useState<"all" | "pending" | "confirmed" | "cancelled">("all");

  // Create Venue Dialog state
  const [isAddOpen, setIsAddOpen] = useState(false);

  // Reviews replying state
  const [reviewReplyIndex, setReviewReplyIndex] = useState<number | null>(null);
  const [reviewReplyText, setReviewReplyText] = useState("");
  const [reviewsReplies, setReviewsReplies] = useState<Record<number, string>>({
    0: "Thanks Sarah! We look forward to hosting your Acme team again next quarter!"
  });

  // Settings form states
  const [hostFirstName, setHostFirstName] = useState("Premium");
  const [hostLastName, setHostLastName] = useState("Venue Host");
  const [hostPhone, setHostPhone] = useState("+1 (555) 019-2834");
  const [hostRouting, setHostRouting] = useState("121000248");
  const [hostAccount, setHostAccount] = useState("••••••••4829");
  const [notifEmail, setNotifEmail] = useState(true);
  const [notifSms, setNotifSms] = useState(false);
  const [notifPayouts, setNotifPayouts] = useState(true);

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

  const hostVenueIds = hostVenues.map((v) => v.id);

  // Handle pending bookings actions
  const handleBookingAction = (bookingId: string, action: "confirmed" | "cancelled", guestName: string) => {
    updateBookingStatus(bookingId, action);
    if (action === "confirmed") {
      toast.success(`Reservation request from ${guestName} has been approved.`);
    } else {
      toast.error(`Reservation request from ${guestName} has been declined.`);
    }
  };

  const handleReviewReply = (index: number) => {
    if (!reviewReplyText) return;
    setReviewsReplies({ ...reviewsReplies, [index]: reviewReplyText });
    setReviewReplyIndex(null);
    setReviewReplyText("");
    toast.success("Response posted successfully!");
  };

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Profile and payment settings saved successfully!");
  };

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
            <div className="space-y-8">
              {/* Header block */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-black text-foreground">Overview Console</h2>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Real-time transaction activities and booking status highlights.
                  </p>
                </div>
                <Button onClick={() => setIsAddOpen(true)} className="rounded-xl bg-primary text-primary-foreground font-semibold px-5">
                  <Plus className="h-5 w-5 mr-1.5" />
                  Add Space
                </Button>
              </div>

              {/* Statistics Grid */}
              <div className="grid gap-6 grid-cols-2 lg:grid-cols-4">
                {/* Stat 1: Revenue */}
                <div className="bg-card border border-border p-5 rounded-2xl shadow-sm flex items-center space-x-4">
                  <div className="h-10 w-10 rounded-xl bg-blue-50 dark:bg-blue-900/30 text-primary flex items-center justify-center shrink-0">
                    <DollarSign className="h-5 w-5" />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block">Total Revenue</span>
                    <strong className="text-xl font-black text-foreground">100</strong>
                  </div>
                </div>

                {/* Stat 2: Bookings */}
                <div className="bg-card border border-border p-5 rounded-2xl shadow-sm flex items-center space-x-4">
                  <div className="h-10 w-10 rounded-xl bg-blue-50 dark:bg-blue-900/30 text-primary flex items-center justify-center shrink-0">
                    <Calendar className="h-5 w-5" />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block">Total Bookings</span>
                    <strong className="text-xl font-black text-foreground">10</strong>
                  </div>
                </div>

                {/* Stat 3: Listings */}
                <div className="bg-card border border-border p-5 rounded-2xl shadow-sm flex items-center space-x-4">
                  <div className="h-10 w-10 rounded-xl bg-blue-50 dark:bg-blue-900/30 text-primary flex items-center justify-center shrink-0">
                    <Building className="h-5 w-5" />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block">Active Venues</span>
                    <strong className="text-xl font-black text-foreground">{hostVenues.length}</strong>
                  </div>
                </div>

                {/* Stat 4: Rating */}
                <div className="bg-card border border-border p-5 rounded-2xl shadow-sm flex items-center space-x-4">
                  <div className="h-10 w-10 rounded-xl bg-blue-50 dark:bg-blue-900/30 text-primary flex items-center justify-center shrink-0">
                    <Star className="h-5 w-5 fill-amber-400 text-amber-400" />
                  </div>
                </div>
              </div>

              {/* Analytical Charts and Upcoming Events columns */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* SVG Revenue Chart */}
                <div className="lg:col-span-2 bg-card border border-border rounded-2xl p-6 shadow-sm space-y-4">
                  <div className="flex items-center justify-between border-b border-border/60 pb-3">
                    <h3 className="font-extrabold text-sm text-foreground flex items-center">
                      <TrendingUp className="h-4.5 w-4.5 text-primary mr-1.5" />
                      Revenue Trend (Last 6 Months)
                    </h3>
                    <span className="text-xxs text-emerald-600 font-bold bg-emerald-50 dark:bg-emerald-950/20 px-2 py-0.5 rounded-lg">
                      +24% vs Last Year
                    </span>
                  </div>

                  {/* SVG Chart Graphics */}
                  <div className="relative aspect-[16/7] w-full pt-4">
                    <svg viewBox="0 0 500 200" className="w-full h-full">
                      {/* Grid Lines */}
                      <line x1="40" y1="20" x2="480" y2="20" className="stroke-border/60" strokeWidth="1" strokeDasharray="3" />
                      <line x1="40" y1="70" x2="480" y2="70" className="stroke-border/60" strokeWidth="1" strokeDasharray="3" />
                      <line x1="40" y1="120" x2="480" y2="120" className="stroke-border/60" strokeWidth="1" strokeDasharray="3" />
                      <line x1="40" y1="170" x2="480" y2="170" className="stroke-border" strokeWidth="1" />

                      {/* Area Shading Gradient */}
                      <defs>
                        <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="var(--primary)" stopOpacity="0.25" />
                          <stop offset="100%" stopColor="var(--primary)" stopOpacity="0.0" />
                        </linearGradient>
                      </defs>
                      <path d="M 40 170 L 40 135 L 120 110 L 200 125 L 280 80 L 360 65 L 440 30 L 440 170 Z" fill="url(#areaGrad)" />

                      {/* Main Trend Line */}
                      <path
                        d="M 40 135 L 120 110 L 200 125 L 280 80 L 360 65 L 440 30"
                        fill="none"
                        className="stroke-primary"
                        strokeWidth="3.5"
                        strokeLinecap="round"
                      />

                      {/* Month Anchor Nodes */}
                      <circle cx="40" cy="135" r="4.5" className="fill-card stroke-primary" strokeWidth="2.5" />
                      <circle cx="120" cy="110" r="4.5" className="fill-card stroke-primary" strokeWidth="2.5" />
                      <circle cx="200" cy="125" r="4.5" className="fill-card stroke-primary" strokeWidth="2.5" />
                      <circle cx="280" cy="80" r="4.5" className="fill-card stroke-primary" strokeWidth="2.5" />
                      <circle cx="360" cy="65" r="4.5" className="fill-card stroke-primary" strokeWidth="2.5" />
                      <circle cx="440" cy="30" r="4.5" className="fill-card stroke-primary" strokeWidth="2.5" />

                      {/* Y-Axis labels */}
                      <text x="10" y="25" className="fill-muted-foreground text-[8px] font-semibold text-right">$4k</text>
                      <text x="10" y="75" className="fill-muted-foreground text-[8px] font-semibold text-right">$3k</text>
                      <text x="10" y="125" className="fill-muted-foreground text-[8px] font-semibold text-right">$2k</text>
                      <text x="10" y="175" className="fill-muted-foreground text-[8px] font-semibold text-right">$0</text>

                      {/* X-Axis labels */}
                      <text x="40" y="192" className="fill-muted-foreground text-[8.5px] font-bold text-center" textAnchor="middle">Jan</text>
                      <text x="120" y="192" className="fill-muted-foreground text-[8.5px] font-bold text-center" textAnchor="middle">Feb</text>
                      <text x="200" y="192" className="fill-muted-foreground text-[8.5px] font-bold text-center" textAnchor="middle">Mar</text>
                      <text x="280" y="192" className="fill-muted-foreground text-[8.5px] font-bold text-center" textAnchor="middle">Apr</text>
                      <text x="360" y="192" className="fill-muted-foreground text-[8.5px] font-bold text-center" textAnchor="middle">May</text>
                      <text x="440" y="192" className="fill-muted-foreground text-[8.5px] font-bold text-center" textAnchor="middle">Jun</text>
                    </svg>
                  </div>
                </div>
              </div>

              {/* Recent Bookings table card */}
              <div className="bg-card border border-border rounded-2xl shadow-sm overflow-hidden">
                <div className="px-6 py-4 border-b border-border flex items-center justify-between">
                  <h3 className="font-extrabold text-sm text-foreground">
                    Recent Bookings Request
                  </h3>
                  <button onClick={() => setActiveTab("bookings")} className="text-xs font-semibold text-primary hover:underline flex items-center">
                    View Ledger
                    <ArrowUpRight className="ml-1 h-3.5 w-3.5" />
                  </button>
                </div>

                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-border/60 text-xs">
                    <thead className="bg-muted/30 dark:bg-muted/10">
                      <tr>
                        <th className="px-6 py-3.5 text-left font-bold text-muted-foreground uppercase tracking-wider">Space</th>
                        <th className="px-6 py-3.5 text-left font-bold text-muted-foreground uppercase tracking-wider">Client</th>
                        <th className="px-6 py-3.5 text-left font-bold text-muted-foreground uppercase tracking-wider">Date & Time</th>
                        <th className="px-6 py-3.5 text-left font-bold text-muted-foreground uppercase tracking-wider">Payout</th>
                        <th className="px-6 py-3.5 text-left font-bold text-muted-foreground uppercase tracking-wider">Status</th>
                        <th className="px-6 py-3.5 text-right font-bold text-muted-foreground uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: VENUES VIEW */}
          {activeTab === "venues" && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-black text-foreground">Venues Directory</h2>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    View active listing spaces and publish new venues.
                  </p>
                </div>
                <Button onClick={() => setIsAddOpen(true)} className="rounded-xl bg-primary text-primary-foreground font-semibold px-5">
                  <Plus className="h-5 w-5 mr-1.5" />
                  List a Space
                </Button>
              </div>

              {loading && hostVenues.length === 0 ? (
                <div className="flex items-center justify-center py-16">
                  <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-primary"></div>
                </div>
              ) : hostVenues.length === 0 ? (
                <div className="bg-card border border-dashed border-border rounded-2xl py-16 flex flex-col items-center justify-center text-center gap-3">
                  <Building className="h-8 w-8 text-muted-foreground" />
                  <p className="text-sm font-semibold text-foreground">No venues listed yet</p>
                  <p className="text-xs text-muted-foreground max-w-xs">
                    Publish your first space to start receiving booking requests.
                  </p>
                  <Button onClick={() => setIsAddOpen(true)} className="rounded-xl bg-primary text-primary-foreground font-semibold px-5 mt-2">
                    <Plus className="h-4 w-4 mr-1.5" />
                    List a Space
                  </Button>
                </div>
              ) : (
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {hostVenues.map((v) => (
                    <div
                      key={v.id}
                      onClick={() => router.push(`/host/venues/${v.id}`)}
                      className="bg-card border border-border rounded-2xl overflow-hidden shadow-sm flex flex-col justify-between h-full group cursor-pointer hover:shadow-md hover:border-primary/40 transition-all"
                    >
                      <div className="relative aspect-video w-full bg-muted">
                        {v.imageFiles?.[0] ? (
                          <img
                            src={v.imageFiles[0]}
                            alt={v.name}
                            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-103"
                          />
                        ) : (
                          <div className="h-full w-full flex items-center justify-center text-muted-foreground text-xxs">
                            No image
                          </div>
                        )}
                        <span className="absolute top-3 left-3 px-2 py-0.5 rounded-lg text-[10px] font-bold border bg-primary/95 text-primary-foreground">
                          {v.venueType?.toUpperCase()}
                        </span>
                      </div>

                      <div className="p-4 space-y-3">
                        <h4 className="font-extrabold text-sm text-foreground line-clamp-1">{v.name}</h4>
                        <p className="text-xxs text-muted-foreground line-clamp-2 leading-relaxed">{v.description}</p>

                        <div className="flex items-center justify-between text-xxs text-muted-foreground pt-2 border-t border-border/60">
                          <span className="flex items-center">
                            <MapPin className="h-3 w-3 mr-1 text-primary" />
                            {v.address}, {v.city}
                          </span>
                          <span className="flex items-center">
                            <Users className="h-3 w-3 mr-1" />
                            Up to {v.seatingCapacity}
                          </span>
                        </div>

                        <div className="flex items-center gap-2 text-xxs text-muted-foreground pt-1 flex-wrap">
                          {v.parking && (
                            <span className="px-2 py-0.5 rounded-full bg-muted text-foreground/80">
                              Parking
                            </span>
                          )}
                          {v.amenities?.map((a) => (
                            <span key={a} className="px-2 py-0.5 rounded-full bg-muted text-foreground/80">
                              {a.replace(/_/g, " ")}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div
                        className="px-4 pb-4 flex items-center justify-between gap-2 border-t border-border/40 pt-3 bg-muted/10"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <Button onClick={() => router.push(`/venues/${v.id}`)} variant="outline" size="sm" className="rounded-xl text-xxs w-1/2">
                          Public View
                        </Button>
                        <Button onClick={() => router.push(`/host/venues/${v.id}`)} variant="outline" size="sm" className="rounded-xl text-xxs w-1/2">
                          View Venue
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 3: BOOKINGS LEDGER VIEW */}
          {activeTab === "bookings" && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-black text-foreground">Reservations Ledger</h2>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Filter, search, and approve venue scheduling payouts.
                  </p>
                </div>

                {/* Filter pill tabs */}
                <div className="flex items-center space-x-1.5 bg-secondary p-1 rounded-xl border border-border text-xs font-semibold">
                  {(["all", "pending", "confirmed", "cancelled"] as const).map((fil) => (
                    <button
                      key={fil}
                      onClick={() => setBookingFilter(fil)}
                      className={`px-3 py-1.5 rounded-lg capitalize transition-all cursor-pointer ${bookingFilter === fil ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
                        }`}
                    >
                      {fil}
                    </button>
                  ))}
                </div>
              </div>

              {/* Table Ledger */}
              <div className="bg-card border border-border rounded-2xl shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-border/60 text-xs">
                    <thead className="bg-muted/30 dark:bg-muted/10">
                      <tr>
                        <th className="px-6 py-3.5 text-left font-bold text-muted-foreground uppercase tracking-wider">ID</th>
                        <th className="px-6 py-3.5 text-left font-bold text-muted-foreground uppercase tracking-wider">Venue</th>
                        <th className="px-6 py-3.5 text-left font-bold text-muted-foreground uppercase tracking-wider">Client Details</th>
                        <th className="px-6 py-3.5 text-left font-bold text-muted-foreground uppercase tracking-wider">Date & Time</th>
                        <th className="px-6 py-3.5 text-left font-bold text-muted-foreground uppercase tracking-wider">Earnings</th>
                        <th className="px-6 py-3.5 text-left font-bold text-muted-foreground uppercase tracking-wider">Status</th>
                        <th className="px-6 py-3.5 text-right font-bold text-muted-foreground uppercase tracking-wider">Action</th>
                      </tr>
                    </thead>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: REVIEWS TAB */}
          {activeTab === "reviews" && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-black text-foreground">Reviews Feedback</h2>
                <p className="text-xs text-muted-foreground mt-0.5">
                  See what guests are saying about your spaces and publish replies.
                </p>
              </div>

              {/* Review Feed list */}
              <div className="space-y-6">
                {[
                  { id: 0, author: "Sarah Jenkins", space: "Summit Boardroom", date: "June 10, 2026", rating: 5, comment: "This space was absolutely perfect for our quarterly executive board meeting. The Wi-Fi was fast, the tech setup was seamless, and the host went out of their way to provide premium coffee. Highly recommended!" },
                  { id: 1, author: "Marcus Brody", space: "Lumina Production Studio", date: "May 24, 2026", rating: 5, comment: "Amazing natural lighting and beautiful setup. We used this studio for our startup launch shoot and the shots turned out incredible. Host was responsive and helpful during setup." }
                ].map((rev) => (
                  <div key={rev.id} className="bg-card border border-border rounded-2xl p-6 shadow-sm space-y-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-bold text-sm text-foreground">{rev.author}</h4>
                        <span className="text-[10px] text-muted-foreground mt-0.5 block">
                          Reviewed: <strong className="text-foreground">{rev.space}</strong> &bull; {rev.date}
                        </span>
                      </div>
                      <div className="text-amber-400 text-xs font-bold">
                        {"★".repeat(rev.rating)}
                      </div>
                    </div>

                    <p className="text-xs text-muted-foreground leading-relaxed">
                      "{rev.comment}"
                    </p>

                    {/* Owner reply details */}
                    {reviewsReplies[rev.id] ? (
                      <div className="bg-secondary/60 p-4 rounded-xl text-xs space-y-1">
                        <span className="font-extrabold text-foreground text-[10px] uppercase tracking-wide text-primary block">
                          Your response:
                        </span>
                        <p className="text-muted-foreground leading-normal italic">
                          "{reviewsReplies[rev.id]}"
                        </p>
                      </div>
                    ) : (
                      <div className="pt-2">
                        {reviewReplyIndex === rev.id ? (
                          <div className="space-y-2.5">
                            <textarea
                              value={reviewReplyText}
                              onChange={(e) => setReviewReplyText(e.target.value)}
                              placeholder="Write your professional response message..."
                              rows={2}
                              className="w-full text-xs rounded-xl border border-border bg-background p-3 focus:outline-none focus:ring-1 focus:ring-primary"
                            />
                            <div className="flex space-x-2 justify-end">
                              <Button onClick={() => setReviewReplyIndex(null)} variant="outline" size="sm" className="rounded-xl text-xxs px-3">
                                Cancel
                              </Button>
                              <Button onClick={() => handleReviewReply(rev.id)} size="sm" className="rounded-xl text-xxs bg-primary text-primary-foreground font-semibold px-4">
                                Post Response
                              </Button>
                            </div>
                          </div>
                        ) : (
                          <button
                            onClick={() => setReviewReplyIndex(rev.id)}
                            className="text-xs font-semibold text-primary hover:underline flex items-center"
                          >
                            Reply to this review
                            <ArrowUpRight className="ml-1 h-3.5 w-3.5" />
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 5: ANALYTICS TAB */}
          {activeTab === "analytics" && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-black text-foreground">Advanced Analytics</h2>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Detailed diagnostics on space booking velocities and occupancy stats.
                </p>
              </div>

              {/* occupancy rates */}
              <div className="grid gap-6 grid-cols-1 sm:grid-cols-3">
                <div className="bg-card border border-border p-5 rounded-2xl shadow-sm text-center space-y-2">
                  <span className="text-xxs font-extrabold text-muted-foreground uppercase tracking-wider block">Average Occupancy</span>
                  <strong className="text-3xl font-black text-foreground">72.4%</strong>
                  <span className="text-[10px] text-emerald-600 font-bold block">+5% vs last month</span>
                </div>
                <div className="bg-card border border-border p-5 rounded-2xl shadow-sm text-center space-y-2">
                  <span className="text-xxs font-extrabold text-muted-foreground uppercase tracking-wider block">Avg Booking Duration</span>
                  <strong className="text-3xl font-black text-foreground">5.8 hrs</strong>
                  <span className="text-[10px] text-muted-foreground block">typical hourly rental</span>
                </div>
                <div className="bg-card border border-border p-5 rounded-2xl shadow-sm text-center space-y-2">
                  <span className="text-xxs font-extrabold text-muted-foreground uppercase tracking-wider block">Space Type Revenue</span>
                  <strong className="text-3xl font-black text-foreground">Meetings</strong>
                  <span className="text-[10px] text-muted-foreground block">highest earning category</span>
                </div>
              </div>

              {/* Styled CSS Pie Chart placeholder */}
              <div className="bg-card border border-border p-6 rounded-2xl shadow-sm space-y-4">
                <h3 className="font-extrabold text-sm text-foreground border-b border-border/60 pb-3">
                  Revenue Share by Category
                </h3>
                <div className="flex flex-col sm:flex-row items-center justify-around py-4 gap-6">
                  {/* Styled CSS pie donut circle */}
                  <div className="relative h-32 w-32 rounded-full border-8 border-primary flex items-center justify-center shrink-0">
                    <div className="absolute inset-0 rounded-full border-8 border-transparent border-t-indigo-400 rotate-45" />
                    <div className="absolute inset-0 rounded-full border-8 border-transparent border-b-rose-400 rotate-180" />
                    <div className="flex flex-col items-center">
                      <span className="text-lg font-black text-foreground">USD</span>
                      <span className="text-[9px] text-muted-foreground uppercase font-bold">Breakdown</span>
                    </div>
                  </div>

                  <div className="space-y-2.5 text-xs">
                    <div className="flex items-center space-x-2">
                      <div className="h-3 w-3 rounded bg-primary" />
                      <span className="text-muted-foreground">Conference & Meetings: <strong className="text-foreground">55%</strong></span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="h-3 w-3 rounded bg-indigo-400" />
                      <span className="text-muted-foreground">Creative Studios: <strong className="text-foreground">25%</strong></span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="h-3 w-3 rounded bg-rose-400" />
                      <span className="text-muted-foreground">Rooftop Lounges: <strong className="text-foreground">20%</strong></span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 6: SETTINGS TAB */}
          {activeTab === "settings" && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-black text-foreground">Dashboard Settings</h2>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Update host profile details, notification schedules, and banking payout routing.
                </p>
              </div>

              <form onSubmit={handleSaveSettings} className="space-y-6">
                {/* Profile Block */}
                <div className="bg-card border border-border p-6 rounded-2xl shadow-sm space-y-4">
                  <h3 className="font-extrabold text-sm text-foreground flex items-center border-b border-border/60 pb-3">
                    <Users className="h-4.5 w-4.5 text-primary mr-1.5" />
                    Host Profile Specifications
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <Label htmlFor="hostFirst" className="text-[11px] font-bold text-foreground">First Name</Label>
                      <Input id="hostFirst" type="text" value={hostFirstName} onChange={(e) => setHostFirstName(e.target.value)} className="rounded-xl border-border bg-background" />
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="hostLast" className="text-[11px] font-bold text-foreground">Last Name</Label>
                      <Input id="hostLast" type="text" value={hostLastName} onChange={(e) => setHostLastName(e.target.value)} className="rounded-xl border-border bg-background" />
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="hostPhone" className="text-[11px] font-bold text-foreground">Phone number</Label>
                    <Input id="hostPhone" type="text" value={hostPhone} onChange={(e) => setHostPhone(e.target.value)} className="rounded-xl border-border bg-background" />
                  </div>
                </div>

                {/* Bank Routing Block */}
                <div className="bg-card border border-border p-6 rounded-2xl shadow-sm space-y-4">
                  <h3 className="font-extrabold text-sm text-foreground flex items-center border-b border-border/60 pb-3">
                    <CreditCard className="h-4.5 w-4.5 text-primary mr-1.5" />
                    Banking Payout Details
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <Label htmlFor="hostRouting" className="text-[11px] font-bold text-foreground">ABA Routing Number</Label>
                      <Input id="hostRouting" type="text" value={hostRouting} onChange={(e) => setHostRouting(e.target.value)} className="rounded-xl border-border bg-background" />
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="hostAccount" className="text-[11px] font-bold text-foreground">Account Number</Label>
                      <Input id="hostAccount" type="password" value={hostAccount} onChange={(e) => setHostAccount(e.target.value)} className="rounded-xl border-border bg-background" />
                    </div>
                  </div>
                </div>

                {/* Notifications scheduler checkboxes */}
                <div className="bg-card border border-border p-6 rounded-2xl shadow-sm space-y-4">
                  <h3 className="font-extrabold text-sm text-foreground flex items-center border-b border-border/60 pb-3">
                    <Bell className="h-4.5 w-4.5 text-primary mr-1.5" />
                    Notification Toggles
                  </h3>
                  <div className="space-y-3 text-xs font-semibold text-muted-foreground select-none">
                    <label className="flex items-center space-x-2.5 cursor-pointer hover:text-foreground">
                      <Checkbox checked={notifEmail} onCheckedChange={(c) => setNotifEmail(!!c)} className="rounded" />
                      <span>Receive email notifications for pending booking inquiries.</span>
                    </label>
                    <label className="flex items-center space-x-2.5 cursor-pointer hover:text-foreground">
                      <Checkbox checked={notifSms} onCheckedChange={(c) => setNotifSms(!!c)} className="rounded" />
                      <span>Receive text messages for confirmed reservation scheduling.</span>
                    </label>
                    <label className="flex items-center space-x-2.5 cursor-pointer hover:text-foreground">
                      <Checkbox checked={notifPayouts} onCheckedChange={(c) => setNotifPayouts(!!c)} className="rounded" />
                      <span>Send payout reports directly to bank account weekly.</span>
                    </label>
                  </div>
                </div>

                <div className="flex justify-end pt-2">
                  <Button type="submit" className="rounded-xl bg-primary text-primary-foreground font-semibold px-6 flex items-center">
                    <Save className="h-4 w-4 mr-1.5" />
                    Save Settings
                  </Button>
                </div>
              </form>
            </div>
          )}

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
