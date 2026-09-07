"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { VenueResponse } from "@/context/AppContext";
import {
  Building, Calendar, DollarSign, Star, TrendingUp, ArrowUpRight, Plus,
} from "lucide-react";

// Mock chart monthly data
const REVENUE_DATA = [
  { month: "Jan", revenue: 1200 },
  { month: "Feb", revenue: 1900 },
  { month: "Mar", revenue: 1500 },
  { month: "Apr", revenue: 2600 },
  { month: "May", revenue: 3100 },
  { month: "Jun", revenue: 4200 },
];

interface DashboardTabProps {
  hostVenues: VenueResponse[];
  onAddSpace: () => void;
  onViewBookings: () => void;
}

export default function DashboardTab({ hostVenues, onAddSpace, onViewBookings }: DashboardTabProps) {
  return (
    <div className="space-y-8">
      {/* Header block */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-foreground">Overview Console</h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            Real-time transaction activities and booking status highlights.
          </p>
        </div>
        <Button onClick={onAddSpace} className="rounded-xl bg-primary text-primary-foreground font-semibold px-5">
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
          <button onClick={onViewBookings} className="text-xs font-semibold text-primary hover:underline flex items-center">
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
  );
}
