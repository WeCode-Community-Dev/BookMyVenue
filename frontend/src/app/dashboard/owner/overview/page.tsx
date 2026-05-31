"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Search,
  Bell,
  Settings as GearIcon,
  Plus,
  Megaphone,
  TrendingUp,
  Calendar as CalendarIcon,
  Star,
  Mail,
  MoreHorizontal,
  ChevronRight,
  Sparkles,
} from "lucide-react";
import { cn } from "@/lib/utils";

// Mock bookings data
const initialBookings = [
  {
    id: 1,
    venueName: "The Glasshouse",
    guestName: "Michael & Emma",
    date: "Oct 24, 2024",
    status: "Confirmed",
    amount: "$4,500",
    image: "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=150&auto=format&fit=crop&q=80",
  },
  {
    id: 2,
    venueName: "Industrial Loft",
    guestName: "TechCorp Retreat",
    date: "Nov 02, 2024",
    status: "Pending",
    amount: "$2,800",
    image: "https://images.unsplash.com/photo-1505236858219-8359eb29e3a9?w=150&auto=format&fit=crop&q=80",
  },
  {
    id: 3,
    venueName: "The Glasshouse",
    guestName: "Sarah's 30th",
    date: "Nov 15, 2024",
    status: "Confirmed",
    amount: "$1,200",
    image: "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=150&auto=format&fit=crop&q=80",
  },
];

// Mock upcoming events data
const upcomingEvents = [
  {
    id: 1,
    title: "Wedding Reception",
    venue: "The Glasshouse",
    time: "4:00 PM",
    month: "OCT",
    day: "24",
    isPrimary: true,
  },
  {
    id: 2,
    title: "TechCorp Retreat",
    venue: "Industrial Loft",
    time: "9:00 AM",
    month: "NOV",
    day: "02",
    isPrimary: false,
  },
  {
    id: 3,
    title: "Sarah's 30th Birthday",
    venue: "The Glasshouse",
    time: "7:00 PM",
    month: "NOV",
    day: "15",
    isPrimary: false,
  },
];

export default function OverviewPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [bookings, setBookings] = useState(initialBookings);
  const [notificationsCount, setNotificationsCount] = useState(3);
  const [isAddVenueModalOpen, setIsAddVenueModalOpen] = useState(false);
  const [newVenueName, setNewVenueName] = useState("");
  const [showPromoAlert, setShowPromoAlert] = useState(false);

  // Filter bookings based on search query
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    if (query.trim() === "") {
      setBookings(initialBookings);
    } else {
      const filtered = initialBookings.filter(
        (b) =>
          b.venueName.toLowerCase().includes(query.toLowerCase()) ||
          b.guestName.toLowerCase().includes(query.toLowerCase())
      );
      setBookings(filtered);
    }
  };

  // Mock adding a new booking/venue
  const handleAddVenueSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newVenueName.trim()) return;
    setIsAddVenueModalOpen(false);
    alert(`Venue "${newVenueName}" added successfully to your portfolio!`);
    setNewVenueName("");
  };

  return (
    <div className="space-y-8">
      {/* ─── TOP HEADER CONTROLS ────────────────────────────────────────────── */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        {/* Search Bar Widget (mockup-style peach container) */}
        <div className="relative flex-1 max-w-md">
          <div className="pointer-events-none absolute inset-y-0 left-4 flex items-center text-text-muted">
            <Search className="h-5 w-5" />
          </div>
          <input
            type="text"
            placeholder="Search bookings, venues..."
            value={searchQuery}
            onChange={handleSearchChange}
            className="w-full rounded-full border-none bg-surface-container-low py-3.5 pl-12 pr-4 text-body-md text-on-surface placeholder:text-text-muted/60 focus-ring-brand shadow-sm"
          />
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-3.5 self-end sm:self-auto">
          {/* Notification Button */}
          <button
            onClick={() => setNotificationsCount(0)}
            className="relative rounded-full bg-white p-3 border border-border-subtle hover:bg-stone-50 transition-colors shadow-sm"
            aria-label="Notifications"
          >
            <Bell className="h-5 w-5 text-on-surface" />
            {notificationsCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white ring-2 ring-white">
                {notificationsCount}
              </span>
            )}
          </button>

          {/* Settings Icon */}
          <button
            className="rounded-full bg-white p-3 border border-border-subtle hover:bg-stone-50 transition-colors shadow-sm"
            aria-label="Dashboard settings"
          >
            <GearIcon className="h-5 w-5 text-on-surface" />
          </button>

          {/* + Add Venue Button */}
          <button
            onClick={() => setIsAddVenueModalOpen(true)}
            className="flex items-center gap-2 rounded-full bg-[#582200] px-5 py-3 text-label-md font-bold text-white shadow-lg shadow-[#582200]/10 transition-all duration-200 hover:bg-[#3c2d26] hover:-translate-y-0.5 active:scale-95"
          >
            <Plus className="h-4.5 w-4.5" />
            <span>Add Venue</span>
          </button>
        </div>
      </div>

      {/* ─── WELCOME BANNER & ACTION ────────────────────────────────────────── */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between pt-2">
        <div>
          <h1 className="text-4xl font-bold tracking-tight text-on-surface md:text-5xl">
            Welcome back, Sarah
          </h1>
          <p className="mt-2 text-body-md text-text-muted">
            Here&apos;s what&apos;s happening with your venues today.
          </p>
        </div>
        <div>
          <button
            onClick={() => {
              setShowPromoAlert(true);
              setTimeout(() => setShowPromoAlert(false), 5000);
            }}
            className="flex items-center gap-2 rounded-full bg-[#fce3d9] px-6 py-3.5 text-label-md font-bold text-[#9d4300] border border-[#fce3d9] transition-all duration-200 hover:-translate-y-0.5 shadow-sm active:scale-98"
          >
            <Megaphone className="h-4.5 w-4.5" />
            <span>Create Promotion</span>
          </button>
        </div>
      </div>

      {/* ─── LIVE ALERT (PROMOTIONS FEEDBACK) ───────────────────────────────── */}
      {showPromoAlert && (
        <div className="rounded-2xl border border-primary-container/20 bg-primary-fixed p-4 shadow-elevation-floating animate-fade-in flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Sparkles className="h-6 w-6 text-primary-container" />
            <p className="text-body-md font-medium text-on-primary-fixed">
              Promotion widget opened! You can launch flash discounts and deals from here.
            </p>
          </div>
          <button
            onClick={() => setShowPromoAlert(false)}
            className="text-label-sm font-bold text-primary-container hover:underline"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* ─── HIGH-LEVEL STATS GRID (4 COLUMNS) ─────────────────────────────── */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {/* Metric 1: Total Revenue */}
        <div className="rounded-2xl bg-white border border-border-subtle p-6 shadow-elevation-card hover:shadow-elevation-card-hover transition-all duration-200 group hover:-translate-y-0.5">
          <div className="flex items-center justify-between">
            <span className="text-label-md text-text-muted">Total Revenue</span>
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-surface-container-low text-primary-container">
              <TrendingUp className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-4">
            <span className="text-3xl font-bold tracking-tight text-on-surface">$42,500</span>
            <div className="mt-3.5 flex items-center gap-2">
              <span className="inline-flex items-center gap-0.5 rounded-full bg-[#fcf2ed] px-2.5 py-1 text-[11px] font-bold text-primary-container">
                +12.5%
              </span>
              <span className="text-label-sm text-text-muted">vs last month</span>
            </div>
          </div>
        </div>

        {/* Metric 2: Active Bookings */}
        <div className="rounded-2xl bg-white border border-border-subtle p-6 shadow-elevation-card hover:shadow-elevation-card-hover transition-all duration-200 group hover:-translate-y-0.5">
          <div className="flex items-center justify-between">
            <span className="text-label-md text-text-muted">Active Bookings</span>
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-surface-container-low text-primary-container">
              <CalendarIcon className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-4">
            <span className="text-3xl font-bold tracking-tight text-on-surface">24</span>
            <div className="mt-3.5 flex items-center gap-2">
              <span className="inline-flex items-center gap-0.5 rounded-full bg-[#fcf2ed] px-2.5 py-1 text-[11px] font-bold text-primary-container">
                +3
              </span>
              <span className="text-label-sm text-text-muted">this week</span>
            </div>
          </div>
        </div>

        {/* Metric 3: Average Rating */}
        <div className="rounded-2xl bg-white border border-border-subtle p-6 shadow-elevation-card hover:shadow-elevation-card-hover transition-all duration-200 group hover:-translate-y-0.5">
          <div className="flex items-center justify-between">
            <span className="text-label-md text-text-muted">Average Rating</span>
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-surface-container-low text-primary-container">
              <Star className="h-5 w-5 fill-current" />
            </div>
          </div>
          <div className="mt-4">
            <span className="text-3xl font-bold tracking-tight text-on-surface">4.9</span>
            <div className="mt-3.5 flex items-center gap-1.5 text-label-sm text-text-muted">
              <div className="flex gap-0.5 text-primary-container">
                <Star className="h-3.5 w-3.5 fill-current" />
                <Star className="h-3.5 w-3.5 fill-current" />
                <Star className="h-3.5 w-3.5 fill-current" />
                <Star className="h-3.5 w-3.5 fill-current" />
                <Star className="h-3.5 w-3.5 fill-current" />
              </div>
              <span className="font-semibold text-on-surface ml-1">(128 reviews)</span>
            </div>
          </div>
        </div>

        {/* Metric 4: Pending Inquiries */}
        <div className="rounded-2xl bg-white border border-border-subtle p-6 shadow-elevation-card hover:shadow-elevation-card-hover transition-all duration-200 group hover:-translate-y-0.5">
          <div className="flex items-center justify-between">
            <span className="text-label-md text-text-muted">Pending Inquiries</span>
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-surface-container-low text-primary-container">
              <Mail className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-4">
            <span className="text-3xl font-bold tracking-tight text-on-surface">7</span>
            <div className="mt-3.5">
              <Link
                href="/dashboard/owner/venues"
                className="inline-flex items-center gap-1 text-label-sm font-bold text-primary-container group-hover:underline"
              >
                <span>Review now</span>
                <ChevronRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* ─── TWO-COLUMN CONTENT AREA (RECENT BOOKINGS & UPCOMING EVENTS) ─────── */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Left Column: Recent Bookings Table (2/3 width on desktop) */}
        <div className="rounded-2xl bg-white border border-border-subtle p-6 shadow-elevation-card lg:col-span-2">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-on-surface">Recent Bookings</h2>
            <Link
              href="/dashboard/owner/venues"
              className="text-label-sm font-semibold text-primary-container hover:underline"
            >
              View All
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-left text-body-md">
              <thead>
                <tr className="border-b border-border-subtle/60 text-label-sm uppercase tracking-wider text-text-muted/80">
                  <th className="pb-3.5 font-semibold">Venue & Guest</th>
                  <th className="pb-3.5 font-semibold">Date</th>
                  <th className="pb-3.5 font-semibold">Status</th>
                  <th className="pb-3.5 font-semibold text-right">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-subtle/40">
                {bookings.length > 0 ? (
                  bookings.map((booking) => (
                    <tr key={booking.id} className="group/row">
                      <td className="py-4 pr-3">
                        <div className="flex items-center gap-3">
                          <img
                            src={booking.image}
                            alt={booking.venueName}
                            className="h-11 w-11 rounded-lg object-cover border border-border-subtle shadow-sm transition-transform duration-200 group-hover/row:scale-105"
                          />
                          <div className="flex flex-col">
                            <span className="text-label-md font-semibold text-on-surface">
                              {booking.venueName}
                            </span>
                            <span className="text-label-sm text-text-muted mt-0.5">
                              {booking.guestName}
                            </span>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 pr-3 text-text-muted font-medium">
                        {booking.date}
                      </td>
                      <td className="py-4 pr-3">
                        <span
                          className={cn(
                            "inline-flex items-center rounded-full px-3 py-1 text-[11px] font-bold",
                            booking.status === "Confirmed"
                              ? "bg-sky-50 text-sky-700"
                              : "bg-orange-50 text-orange-700"
                          )}
                        >
                          {booking.status}
                        </span>
                      </td>
                      <td className="py-4 text-right font-semibold text-on-surface">
                        {booking.amount}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={4} className="py-8 text-center text-text-muted">
                      No matching bookings found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right Column: Upcoming Events List (1/3 width on desktop) */}
        <div className="rounded-2xl bg-white border border-border-subtle p-6 shadow-elevation-card flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-on-surface">Upcoming Events</h2>
              <button
                className="rounded-lg p-1.5 text-text-muted hover:bg-surface-container-low transition-colors"
                aria-label="Actions"
              >
                <MoreHorizontal className="h-5 w-5" />
              </button>
            </div>

            {/* List of Events */}
            <div className="space-y-5">
              {upcomingEvents.map((event) => (
                <div key={event.id} className="flex items-center gap-4 group/event">
                  {/* Styled Date Block */}
                  <div
                    className={cn(
                      "flex h-[60px] w-[60px] shrink-0 flex-col items-center justify-center rounded-2xl shadow-sm transition-all duration-200 group-hover/event:-translate-y-0.5",
                      event.isPrimary
                        ? "bg-primary-container text-white"
                        : "bg-surface-container-high text-primary-container border border-border-subtle/50"
                    )}
                  >
                    <span className="text-[10px] font-bold tracking-wider uppercase leading-none opacity-90">
                      {event.month}
                    </span>
                    <span className="text-lg font-bold mt-1 leading-none">
                      {event.day}
                    </span>
                  </div>

                  {/* Event details */}
                  <div className="flex flex-col min-w-0">
                    <span className="text-label-md font-bold text-on-surface truncate group-hover/event:text-primary-container transition-colors">
                      {event.title}
                    </span>
                    <span className="text-label-sm text-text-muted mt-1 truncate">
                      {event.venue} &bull; {event.time}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Outline action button */}
          <div className="mt-8">
            <Link
              href="/dashboard/owner/calendar"
              className="flex w-full items-center justify-center rounded-full border border-border-subtle py-3 text-label-md font-bold text-on-surface hover:bg-stone-50 active:scale-[0.98] transition-all duration-200"
            >
              Open Full Calendar
            </Link>
          </div>
        </div>
      </div>

      {/* ─── ADD VENUE MODAL (PORTAL INTERACTION) ─────────────────────────────── */}
      {isAddVenueModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => setIsAddVenueModalOpen(false)}
          />
          <div className="relative w-full max-w-md rounded-2xl bg-white p-6 shadow-elevation-floating border border-border-subtle animate-scale-up">
            <h3 className="text-2xl font-bold text-on-surface mb-2">Add New Venue</h3>
            <p className="text-body-md text-text-muted mb-4">
              Add a gorgeous new listing to your BookMyVenue portfolio.
            </p>

            <form onSubmit={handleAddVenueSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-label-md text-on-surface font-semibold" htmlFor="venue-name">
                  Venue Name
                </label>
                <input
                  id="venue-name"
                  type="text"
                  placeholder="e.g. Skyline Rooftop Terrace"
                  required
                  value={newVenueName}
                  onChange={(e) => setNewVenueName(e.target.value)}
                  className="w-full rounded-xl border border-border-subtle px-4 py-3 text-body-md bg-white focus-ring-brand"
                />
              </div>

              <div className="flex items-center gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setIsAddVenueModalOpen(false)}
                  className="flex-1 rounded-full border border-border-subtle py-3 text-label-md font-bold text-on-surface hover:bg-stone-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 rounded-full bg-primary-container py-3 text-label-md font-bold text-white shadow-lg shadow-primary-container/20 hover:bg-[#e0620f] transition-all"
                >
                  Submit Listing
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
