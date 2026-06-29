"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { 
  Calendar, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  Building, 
  ArrowRight, 
  User, 
  MapPin, 
  Search,
  Loader2 
} from "lucide-react";
import { getSession, UserSession } from "@/src/lib/authStore";
import { apiFetch } from "@/src/lib/api";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface BookingItem {
  bookingId: string;
  bookingReference: string;
  bookingDate: string;
  bookingStatus: "PENDING_PAYMENT" | "CONFIRMED" | "CANCELLED" | "COMPLETED";
  paymentStatus: "NOT_PAID" | "PENDING" | "PAID" | "FAILED" | "REFUNDED";
  totalAmount: number;
  venue: {
    venueName: string;
    city: string;
    state: string;
  };
}

export default function CustomerDashboard() {
  const [session, setSession] = useState<UserSession | null>(null);
  const [bookings, setBookings] = useState<BookingItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const s = getSession();
    setSession(s);
    if (s) {
      loadDashboardData();
    }
  }, []);

  const loadDashboardData = async () => {
    setLoading(true);
    try {
      const data = await apiFetch<BookingItem[]>("/booking/my");
      setBookings(data);
    } catch (err: any) {
      setError(err.message || "Failed to load dashboard data.");
    } finally {
      setLoading(false);
    }
  };

  const activeBookings = bookings.filter(
    (b) => b.bookingStatus === "CONFIRMED" || b.bookingStatus === "PENDING_PAYMENT"
  );
  const completedBookings = bookings.filter((b) => b.bookingStatus === "COMPLETED");
  const cancelledBookings = bookings.filter((b) => b.bookingStatus === "CANCELLED");

  // Get nearest upcoming booking
  const upcomingBooking = activeBookings
    .filter((b) => b.bookingStatus === "CONFIRMED")
    .sort((a, b) => new Date(a.bookingDate).getTime() - new Date(b.bookingDate).getTime())[0];

  if (loading) {
    return (
      <div className="h-[60vh] flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-[#0D7377] mr-2" />
        <span className="text-[#70706e] font-semibold text-sm">Loading dashboard data...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Welcome Banner */}
      <div className="bg-white border border-[#E2E2DE] rounded-2xl p-6 md:p-8 shadow-xs flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="space-y-1">
          <h1 className="font-serif text-2xl md:text-3xl font-bold text-[#1A1A19]">
            Welcome back, {session?.name}!
          </h1>
          <p className="text-sm text-[#70706e]">
            Manage your bookings, edit your profile, and search for the perfect venues for your events.
          </p>
        </div>
        <Link href="/venues">
          <Button className="bg-[#0D7377] text-white hover:bg-[#0a5b5e] rounded-xl flex items-center gap-2 px-5 py-3 h-auto font-semibold shadow-md shadow-[#0D7377]/10 transition-all">
            <Search className="h-4 w-4" />
            <span>Search Venues</span>
          </Button>
        </Link>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Bookings */}
        <Card className="border border-[#E2E2DE] shadow-xs bg-white rounded-2xl">
          <CardContent className="p-5 flex justify-between items-center">
            <div>
              <span className="text-[10px] uppercase font-bold text-[#70706e] block">
                Total Bookings
              </span>
              <span className="text-2xl font-bold text-[#1A1A19] block mt-1">
                {bookings.length}
              </span>
            </div>
            <div className="h-10 w-10 bg-[#E6F1F1] text-[#0D7377] rounded-xl flex items-center justify-center">
              <Building className="h-5 w-5" />
            </div>
          </CardContent>
        </Card>

        {/* Active Bookings */}
        <Card className="border border-[#E2E2DE] shadow-xs bg-white rounded-2xl">
          <CardContent className="p-5 flex justify-between items-center">
            <div>
              <span className="text-[10px] uppercase font-bold text-[#70706e] block">
                Active Bookings
              </span>
              <span className="text-2xl font-bold text-[#1A1A19] block mt-1">
                {activeBookings.length}
              </span>
            </div>
            <div className="h-10 w-10 bg-amber-50 text-[#F4A261] rounded-xl flex items-center justify-center">
              <Calendar className="h-5 w-5" />
            </div>
          </CardContent>
        </Card>

        {/* Completed Bookings */}
        <Card className="border border-[#E2E2DE] shadow-xs bg-white rounded-2xl">
          <CardContent className="p-5 flex justify-between items-center">
            <div>
              <span className="text-[10px] uppercase font-bold text-[#70706e] block">
                Completed
              </span>
              <span className="text-2xl font-bold text-[#1A1A19] block mt-1">
                {completedBookings.length}
              </span>
            </div>
            <div className="h-10 w-10 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center">
              <CheckCircle2 className="h-5 w-5" />
            </div>
          </CardContent>
        </Card>

        {/* Cancelled Bookings */}
        <Card className="border border-[#E2E2DE] shadow-xs bg-white rounded-2xl">
          <CardContent className="p-5 flex justify-between items-center">
            <div>
              <span className="text-[10px] uppercase font-bold text-[#70706e] block">
                Cancelled
              </span>
              <span className="text-2xl font-bold text-[#1A1A19] block mt-1">
                {cancelledBookings.length}
              </span>
            </div>
            <div className="h-10 w-10 bg-red-50 text-red-500 rounded-xl flex items-center justify-center">
              <XCircle className="h-5 w-5" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Left Side: Upcoming or Recent bookings */}
        <div className="lg:col-span-2 space-y-6">
          {upcomingBooking ? (
            <Card className="border border-[#E2E2DE] shadow-xs bg-white rounded-2xl overflow-hidden">
              <div className="px-6 py-4 border-b border-[#E2E2DE] bg-[#E6F1F1]/30 flex justify-between items-center">
                <h3 className="font-serif font-bold text-base text-[#0D7377]">
                  Next Upcoming Event
                </h3>
                <span className="text-[10px] uppercase font-bold bg-[#0D7377] text-white px-2 py-0.5 rounded">
                  Confirmed
                </span>
              </div>
              <CardContent className="p-6 space-y-4">
                <div>
                  <h4 className="font-serif text-xl font-bold text-[#1A1A19]">
                    {upcomingBooking.venue.venueName}
                  </h4>
                  <p className="text-xs text-[#70706e] flex items-center gap-1 mt-1 font-semibold">
                    <MapPin className="h-3.5 w-3.5 text-[#0D7377]" />
                    {upcomingBooking.venue.city}, {upcomingBooking.venue.state}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4 py-4 border-t border-b border-[#E2E2DE] text-xs font-semibold text-[#1A1A19]">
                  <div>
                    <span className="text-[10px] text-[#70706e] uppercase font-bold block mb-1">
                      Event Date
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Calendar className="h-4 w-4 text-[#0D7377]" />
                      {upcomingBooking.bookingDate}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] text-[#70706e] uppercase font-bold block mb-1">
                      Booking Reference
                    </span>
                    <span className="font-mono">{upcomingBooking.bookingReference}</span>
                  </div>
                </div>

                <div className="flex justify-between items-center pt-2">
                  <div className="text-xs">
                    <span className="text-[#70706e] block font-semibold">Total Amount</span>
                    <span className="text-base font-bold text-[#0D7377]">
                      ₹{upcomingBooking.totalAmount.toLocaleString("en-IN")}
                    </span>
                  </div>
                  <Link href="/customer/bookings?tab=current">
                    <Button variant="outline" className="border-input hover:bg-[#F0F0EC] text-xs font-bold rounded-xl flex items-center gap-1">
                      <span>View Details</span>
                      <ArrowRight className="h-3.5 w-3.5" />
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card className="border border-[#E2E2DE] shadow-xs bg-white rounded-2xl p-8 text-center space-y-4">
              <div className="h-12 w-12 rounded-full bg-[#E6F1F1] text-[#0D7377] flex items-center justify-center mx-auto">
                <Calendar className="h-6 w-6" />
              </div>
              <div className="space-y-1">
                <h3 className="font-serif font-bold text-lg text-[#1A1A19]">No Upcoming Bookings</h3>
                <p className="text-xs text-[#70706e] max-w-sm mx-auto">
                  You don't have any confirmed future bookings scheduled at the moment. Plan your next event now!
                </p>
              </div>
              <Link href="/venues" className="inline-block pt-2">
                <Button className="bg-[#0D7377] hover:bg-[#0a5b5e] text-white text-xs font-bold px-4 py-2 rounded-xl">
                  Browse Venues
                </Button>
              </Link>
            </Card>
          )}

          {/* Recent Booking History Widget */}
          <Card className="border border-[#E2E2DE] shadow-xs bg-white rounded-2xl overflow-hidden">
            <div className="px-6 py-4 border-b border-[#E2E2DE] flex justify-between items-center">
              <h3 className="font-serif font-bold text-base text-[#1A1A19]">
                Recent Bookings
              </h3>
              <Link href="/customer/bookings" className="text-xs font-bold text-[#0D7377] hover:underline flex items-center gap-0.5">
                <span>View All</span>
                <ArrowRight className="h-3 w-3" />
              </Link>
            </div>
            <CardContent className="p-0">
              {bookings.length > 0 ? (
                <div className="divide-y divide-[#E2E2DE] text-xs font-semibold">
                  {bookings.slice(0, 3).map((bk) => (
                    <div key={bk.bookingId} className="p-4 flex justify-between items-center hover:bg-[#FAFAF8] transition-colors">
                      <div className="space-y-1">
                        <span className="font-serif text-sm font-bold text-[#1A1A19] block">
                          {bk.venue.venueName}
                        </span>
                        <span className="text-[10px] text-[#70706e] block">
                          Ref: <span className="font-mono font-bold">{bk.bookingReference}</span> • Date: {bk.bookingDate}
                        </span>
                      </div>
                      <div className="text-right flex flex-col items-end gap-1.5">
                        <span className="font-bold text-[#0D7377]">
                          ₹{bk.totalAmount.toLocaleString("en-IN")}
                        </span>
                        <span className={`inline-flex items-center gap-0.5 py-0.5 px-2 rounded-full text-[9px] font-bold ${
                          bk.bookingStatus === "CONFIRMED"
                            ? "bg-emerald-50 text-emerald-700"
                            : bk.bookingStatus === "COMPLETED"
                            ? "bg-blue-50 text-blue-700"
                            : bk.bookingStatus === "CANCELLED"
                            ? "bg-red-50 text-red-700"
                            : "bg-amber-50 text-amber-700"
                        }`}>
                          {bk.bookingStatus}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-6 text-center text-xs text-[#70706e]">
                  No bookings found in your history.
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Right Side: Quick Cards (Profile & Details) */}
        <div className="space-y-6">
          {/* Profile Overview Card */}
          <Card className="border border-[#E2E2DE] shadow-xs bg-white rounded-2xl p-5 space-y-4">
            <h4 className="font-serif font-bold text-sm text-[#1A1A19] pb-2 border-b border-[#E2E2DE] flex items-center gap-1.5">
              <User className="h-4.5 w-4.5 text-[#0D7377]" />
              <span>Profile Settings</span>
            </h4>
            <div className="space-y-3.5 text-xs">
              <div className="flex justify-between items-center">
                <span className="text-[#70706e] font-semibold">Name</span>
                <span className="text-[#1A1A19] font-bold">{session?.name}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[#70706e] font-semibold">Email</span>
                <span className="text-[#1A1A19] font-bold truncate max-w-[150px]">{session?.email}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[#70706e] font-semibold">Phone</span>
                <span className="text-[#1A1A19] font-bold">{session?.phone}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[#70706e] font-semibold">Status</span>
                <span className="text-emerald-600 font-bold bg-emerald-50 px-2 py-0.5 rounded">Onboarded</span>
              </div>
              <div className="pt-2 border-t border-[#E2E2DE]">
                <Link href="/customer/profile" className="w-full">
                  <Button variant="outline" className="w-full border-input hover:bg-[#F0F0EC] text-xs font-bold rounded-xl h-9">
                    Manage Profile
                  </Button>
                </Link>
              </div>
            </div>
          </Card>

          {/* Quick FAQ / Tips Card */}
          <Card className="border border-[#E2E2DE] shadow-xs bg-white rounded-2xl p-5 space-y-4">
            <h4 className="font-serif font-bold text-sm text-[#1A1A19] pb-2 border-b border-[#E2E2DE] flex items-center gap-1.5">
              <Clock className="h-4.5 w-4.5 text-[#0D7377]" />
              <span>Booking Guidelines</span>
            </h4>
            <div className="space-y-3 text-xs text-[#70706e] leading-relaxed font-semibold">
              <div className="flex gap-2">
                <span className="text-[#0D7377] font-bold">•</span>
                <p>Ensure payment is secured within 10 minutes of reserving to keep the slot locked.</p>
              </div>
              <div className="flex gap-2">
                <span className="text-[#0D7377] font-bold">•</span>
                <p>Cancellations process refunds immediately back to the original source payment method.</p>
              </div>
              <div className="flex gap-2">
                <span className="text-[#0D7377] font-bold">•</span>
                <p>Keep your phone number and location coordinates accurate to facilitate verification.</p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
