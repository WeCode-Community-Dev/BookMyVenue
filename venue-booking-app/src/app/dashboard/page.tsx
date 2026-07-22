"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useApp } from "@/context/AppContext";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { 
  LayoutDashboard, Calendar, Search, CreditCard, Clock, CheckCircle2, 
  AlertCircle, ChevronRight, Settings, ArrowUpRight, Building2, User 
} from "lucide-react";
import { format, parseISO, isAfter } from "date-fns";

const statusStyles = {
  pending: "bg-amber-500/10 text-amber-500 border-amber-500/20",
  confirmed: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
  cancelled: "bg-rose-500/10 text-rose-500 border-rose-500/20",
};

export default function CustomerDashboard() {
  const router = useRouter();
  const { bookings, user, isLoading } = useApp();
  
  // Guard client authentication
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.replace("/login");
    }
  }, [router]);

  if (isLoading) {
    return (
      <div className="flex-grow flex items-center justify-center p-12 bg-background min-h-[400px]">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-primary"></div>
      </div>
    );
  }

  // Calculate Metrics
  const activeBookings = bookings.filter(b => b.status === "confirmed" || b.status === "pending");
  const upcomingBookings = activeBookings.filter(b => isAfter(parseISO(b.date), new Date()));
  const totalSpent = bookings
    .filter(b => b.status === "confirmed")
    .reduce((sum, b) => sum + b.totalCost, 0);

  // Take recent 3 bookings
  const recentBookings = [...bookings]
    .sort((a, b) => new Date(b.createdAt || b.date).getTime() - new Date(a.createdAt || a.date).getTime())
    .slice(0, 3);

  return (
    <div className="flex-grow bg-background py-8">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Header Hero Banner Card */}
        <div className="relative overflow-hidden rounded-3xl bg-linear-to-r from-blue-600 via-indigo-600 to-purple-600 p-8 text-white shadow-xl border border-white/10 select-none">
          <div className="absolute inset-0 opacity-10 bg-[linear-gradient(to_right,#fff_1px,transparent_1px),linear-gradient(to_bottom,#fff_1px,transparent_1px)] bg-[size:30px_30px]" />
          <div className="relative z-10 space-y-4 max-w-xl">
            <span className="text-xxs font-extrabold tracking-widest uppercase bg-white/20 text-white px-3 py-1 rounded-full border border-white/10">
              Customer Hub
            </span>
            <h1 className="text-3xl sm:text-4xl font-black tracking-tight leading-none mt-2">
              Welcome Back, {user?.name || "Member"}!
            </h1>
            <p className="text-sm text-white/80 leading-relaxed font-medium">
              Book spaces for meetings, conferences, photoshoots, or events in seconds. Manage your approved reservations and invoices directly from here.
            </p>
            <div className="pt-2 flex flex-wrap gap-3">
              <Button
                onClick={() => router.push("/venues")}
                className="bg-white text-blue-600 hover:bg-white/95 font-bold rounded-xl px-5 py-5 flex items-center shadow-md cursor-pointer"
              >
                Discover Spaces
                <Search className="ml-1.5 h-4 w-4" />
              </Button>
              <Button
                onClick={() => router.push("/bookings")}
                variant="outline"
                className="text-white border-white/30 hover:bg-white/10 hover:border-white font-bold rounded-xl px-5 py-5 cursor-pointer"
              >
                My Reservations
              </Button>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {/* Card 1 */}
          <div className="bg-card border border-border p-6 rounded-2xl shadow-sm flex items-center space-x-4">
            <div className="h-12 w-12 rounded-xl bg-blue-500/10 text-blue-500 flex items-center justify-center shrink-0">
              <Calendar className="h-6 w-6" />
            </div>
            <div>
              <span className="text-xxs font-bold text-muted-foreground uppercase tracking-wide">Total Bookings</span>
              <div className="text-2xl font-black text-foreground mt-0.5">{bookings.length}</div>
            </div>
          </div>

          {/* Card 2 */}
          <div className="bg-card border border-border p-6 rounded-2xl shadow-sm flex items-center space-x-4">
            <div className="h-12 w-12 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center shrink-0">
              <Clock className="h-6 w-6" />
            </div>
            <div>
              <span className="text-xxs font-bold text-muted-foreground uppercase tracking-wide">Upcoming Events</span>
              <div className="text-2xl font-black text-foreground mt-0.5">{upcomingBookings.length}</div>
            </div>
          </div>

          {/* Card 3 */}
          <div className="bg-card border border-border p-6 rounded-2xl shadow-sm flex items-center space-x-4">
            <div className="h-12 w-12 rounded-xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center shrink-0">
              <CreditCard className="h-6 w-6" />
            </div>
            <div>
              <span className="text-xxs font-bold text-muted-foreground uppercase tracking-wide">Total Investment</span>
              <div className="text-2xl font-black text-foreground mt-0.5">${totalSpent}</div>
            </div>
          </div>
        </div>

        {/* Bottom Section Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Recent Reservations (Left 2 Columns) */}
          <div className="lg:col-span-2 space-y-6">
            <div className="flex items-center justify-between border-b border-border pb-4">
              <h2 className="text-xl font-extrabold text-foreground flex items-center">
                <CheckCircle2 className="h-5 w-5 mr-2 text-primary" />
                Recent Reservations
              </h2>
              <Link href="/bookings" className="text-xs font-semibold text-primary hover:underline flex items-center">
                View All
                <ChevronRight className="ml-0.5 h-3.5 w-3.5" />
              </Link>
            </div>

            {recentBookings.length === 0 ? (
              <div className="text-center py-12 border border-dashed border-border rounded-2xl bg-card">
                <Calendar className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
                <p className="text-sm text-muted-foreground">You haven't booked any venues yet.</p>
                <Button 
                  onClick={() => router.push("/venues")}
                  className="mt-4 rounded-xl"
                  size="sm"
                >
                  Find Venues
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {recentBookings.map((b) => (
                  <div 
                    key={b.id} 
                    className="p-5 border border-border bg-card rounded-2xl shadow-sm hover:shadow-md transition-all flex items-center justify-between gap-4"
                  >
                    <div className="flex items-center space-x-4">
                      <div className="h-12 w-12 rounded-xl overflow-hidden shrink-0 bg-muted">
                        <img src={b.venueImage} alt={b.venueName} className="h-full w-full object-cover" />
                      </div>
                      <div>
                        <h4 className="font-extrabold text-sm text-foreground line-clamp-1">{b.venueName}</h4>
                        <div className="flex flex-wrap gap-x-3 gap-y-1 text-xxs text-muted-foreground mt-1">
                          <span className="flex items-center">
                            <Calendar className="h-3.5 w-3.5 mr-1" />
                            {format(parseISO(b.date), "PP")}
                          </span>
                          <span className="flex items-center">
                            <Clock className="h-3.5 w-3.5 mr-1" />
                            {b.startTime} - {b.endTime}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-md border tracking-wide block text-center ${statusStyles[b.status]}`}>
                        {b.status}
                      </span>
                      <span className="text-xs font-extrabold text-foreground mt-1.5 block">
                        ${b.totalCost}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Quick Actions Panel (Right 1 Column) */}
          <div className="space-y-6">
            <div className="border-b border-border pb-4">
              <h2 className="text-xl font-extrabold text-foreground flex items-center">
                <Settings className="h-5 w-5 mr-2 text-primary" />
                Quick Actions
              </h2>
            </div>

            <div className="grid grid-cols-1 gap-4">
              <Link 
                href="/venues" 
                className="group p-5 border border-border bg-card hover:bg-secondary/40 rounded-2xl shadow-sm flex items-center justify-between transition-all"
              >
                <div className="flex items-center space-x-3">
                  <div className="h-10 w-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary shrink-0 group-hover:scale-110 transition-transform">
                    <Building2 className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-foreground">Find Venues</h4>
                    <p className="text-xxs text-muted-foreground mt-0.5">Browse and filter spaces</p>
                  </div>
                </div>
                <ArrowUpRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
              </Link>

              <Link 
                href="/bookings" 
                className="group p-5 border border-border bg-card hover:bg-secondary/40 rounded-2xl shadow-sm flex items-center justify-between transition-all"
              >
                <div className="flex items-center space-x-3">
                  <div className="h-10 w-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary shrink-0 group-hover:scale-110 transition-transform">
                    <Calendar className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-foreground">My Bookings</h4>
                    <p className="text-xxs text-muted-foreground mt-0.5">Manage existing requests</p>
                  </div>
                </div>
                <ArrowUpRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
              </Link>

              <Link 
                href="/settings" 
                className="group p-5 border border-border bg-card hover:bg-secondary/40 rounded-2xl shadow-sm flex items-center justify-between transition-all"
              >
                <div className="flex items-center space-x-3">
                  <div className="h-10 w-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary shrink-0 group-hover:scale-110 transition-transform">
                    <User className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-foreground">Edit Profile</h4>
                    <p className="text-xxs text-muted-foreground mt-0.5">Manage credentials & settings</p>
                  </div>
                </div>
                <ArrowUpRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
              </Link>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
