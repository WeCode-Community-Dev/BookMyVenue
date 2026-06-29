"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { getSession, UserSession } from "@/src/lib/authStore";
import { apiFetch } from "@/src/lib/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Users,
  Calendar,
  Building,
  TrendingUp,
  Plus,
  Clock,
  CheckCircle,
  XCircle,
  Star,
  Loader2,
  AlertCircle,
  ShieldAlert,
  ArrowRight,
  CalendarDays,
  Sparkles,
  Mail,
  Phone,
  CheckCircle2
} from "lucide-react";
import { MyVenue } from "../route";

interface DashboardStats {
  totalBookings: number;
  confirmedBookings: number;
  cancelledBookings: number;
  grossEarnings: number;
  averageRating: number;
}

interface BookingItem {
  bookingId: string;
  bookingReference: string;
  customerId: string;
  venueId: string;
  bookingDate: string; // 'YYYY-MM-DD'
  bookingStatus: "PENDING_PAYMENT" | "CONFIRMED" | "CANCELLED" | "COMPLETED" | "PAYMENT_FAILED" | "EXPIRED";
  paymentStatus: "PENDING" | "PAID" | "FAILED" | "REFUNDED";
  baseAmount: number;
  totalAmount: number;
  refundAmount: number;
  cancellationReason: string | null;
  cancelledAt: string | null;
  cancelledBy: string | null;
  createdAt: string;
  specialRequest: string | null;
  customer: {
    id: string;
    name: string;
    email: string;
    phone: string;
  };
}

interface BlockedRange {
  id: string;
  venueId: string;
  startDate: string;
  endDate: string;
  reason: string | null;
}

export default function Dashboard() {
  const router = useRouter();
  const [session, setSessionState] = useState<UserSession | null>(null);
  const [venue, setVenue] = useState<any>(null);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [bookings, setBookings] = useState<BookingItem[]>([]);
  const [blockedRanges, setBlockedRanges] = useState<BlockedRange[]>([]);
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Cancellation Modal State
  const [selectedBooking, setSelectedBooking] = useState<BookingItem | null>(null);
  const [cancelReason, setCancelReason] = useState("");
  const [cancelError, setCancelError] = useState("");
  const [isCancelling, setIsCancelling] = useState(false);

  // Calendar Preview State
  const [currentDate, setCurrentDate] = useState(new Date());
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  useEffect(() => {
    const activeSession = getSession();
    if (!activeSession || activeSession.role !== "venue_owner") {
      router.push("/partner/login");
      return;
    }
    setSessionState(activeSession);

    const loadDashboardData = async () => {
      setLoading(true);
      setError("");
      try {
        // Fetch Venue Details
        const venueData = await MyVenue();
        setVenue(venueData);

        if (venueData && venueData.id) {
          // Fetch Stats, Bookings and Blocked Dates in parallel
          const [statsData, bookingsData, blocksData] = await Promise.all([
            apiFetch<DashboardStats>("/venues/my-venue/dashboard-stats"),
            apiFetch<BookingItem[]>("/booking/venue/owner"),
            apiFetch<BlockedRange[]>(`/venues/${venueData.id}/blocked-dates`)
          ]);

          setStats(statsData);
          setBookings(bookingsData);
          setBlockedRanges(blocksData);
        } else {
          setError("No venue associated with this partner account.");
        }
      } catch (err: any) {
        setError(err.message || "Failed to load dashboard data.");
      } finally {
        setLoading(false);
      }
    };

    loadDashboardData();
  }, [router]);

  const handleOpenCancelModal = (booking: BookingItem) => {
    setSelectedBooking(booking);
    setCancelReason("");
    setCancelError("");
  };

  const handleCloseCancelModal = () => {
    if (isCancelling) return;
    setSelectedBooking(null);
  };

  const handleCancelSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedBooking) return;
    if (!cancelReason.trim()) {
      setCancelError("Cancellation reason is required");
      return;
    }

    setIsCancelling(true);
    setCancelError("");

    try {
      await apiFetch(`/booking/${selectedBooking.bookingId}/cancel`, {
        method: "PATCH",
        body: { cancellationReason: cancelReason.trim() }
      });
      
      // Reload bookings and stats
      const [bookingsData, statsData] = await Promise.all([
        apiFetch<BookingItem[]>("/booking/venue/owner"),
        apiFetch<DashboardStats>("/venues/my-venue/dashboard-stats")
      ]);
      setBookings(bookingsData);
      setStats(statsData);
      setSelectedBooking(null);
    } catch (err: any) {
      setCancelError(err.message || "Failed to cancel booking.");
    } finally {
      setIsCancelling(false);
    }
  };

  // Calendar calculations
  const getDaysInMonth = (y: number, m: number) => new Date(y, m + 1, 0).getDate();
  const getFirstDayOfMonth = (y: number, m: number) => new Date(y, m, 1).getDay();

  const daysInMonth = getDaysInMonth(year, month);
  const firstDayIndex = getFirstDayOfMonth(year, month);

  const monthsList = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
  ];

  const formatDateString = (y: number, m: number, d: number) => {
    const pad = (n: number) => (n < 10 ? `0${n}` : n);
    return `${y}-${pad(m + 1)}-${pad(d)}`;
  };

  const getDayStatus = (dateStr: string) => {
    // 1. Check if date is blocked
    const targetTime = new Date(dateStr).getTime();
    for (const range of blockedRanges) {
      const start = new Date(range.startDate).getTime();
      const end = new Date(range.endDate).getTime();
      if (targetTime >= start && targetTime <= end) {
        return "blocked";
      }
    }

    // 2. Check if date is booked (CONFIRMED or PENDING_PAYMENT)
    const hasBooking = bookings.some(
      (b) =>
        b.bookingDate === dateStr &&
        b.bookingStatus !== "CANCELLED" &&
        b.bookingStatus !== "EXPIRED" &&
        b.bookingStatus !== "PAYMENT_FAILED"
    );
    if (hasBooking) {
      return "booked";
    }

    return "available";
  };

  const getStatusBadge = (status: BookingItem["bookingStatus"]) => {
    switch (status) {
      case "CONFIRMED":
        return (
          <span className="inline-flex items-center gap-1 py-1 px-2.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
            <CheckCircle className="h-3 w-3" /> Confirmed
          </span>
        );
      case "CANCELLED":
        return (
          <span className="inline-flex items-center gap-1 py-1 px-2.5 rounded-full text-[10px] font-bold bg-red-50 text-red-700 border border-red-200">
            <XCircle className="h-3 w-3" /> Cancelled
          </span>
        );
      case "COMPLETED":
        return (
          <span className="inline-flex items-center gap-1 py-1 px-2.5 rounded-full text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-200">
            <CheckCircle className="h-3 w-3" /> Completed
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 py-1 px-2.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
            <Clock className="h-3 w-3" /> Pending Payment
          </span>
        );
    }
  };

  const getPaymentStatusBadge = (status: BookingItem["paymentStatus"]) => {
    switch (status) {
      case "PAID":
        return (
          <span className="text-emerald-600 font-bold bg-emerald-50 border border-emerald-100 rounded-lg px-2 py-0.5 text-[9px]">
            Paid
          </span>
        );
      case "REFUNDED":
        return (
          <span className="text-blue-600 font-bold bg-blue-50 border border-blue-100 rounded-lg px-2 py-0.5 text-[9px]">
            Refunded
          </span>
        );
      case "FAILED":
        return (
          <span className="text-red-600 font-bold bg-red-50 border border-red-100 rounded-lg px-2 py-0.5 text-[9px]">
            Failed
          </span>
        );
      default:
        return (
          <span className="text-amber-600 font-bold bg-amber-50 border border-amber-100 rounded-lg px-2 py-0.5 text-[9px]">
            Pending
          </span>
        );
    }
  };

  // Calendar days array
  const calendarDays = [];
  for (let i = 0; i < firstDayIndex; i++) {
    calendarDays.push(null);
  }
  for (let d = 1; d <= daysInMonth; d++) {
    calendarDays.push(d);
  }

  // Filter recent 5 bookings
  const recentBookingRequests = bookings.slice(0, 5);

  if (loading) {
    return (
      <div className="h-[60vh] flex flex-col items-center justify-center font-sans">
        <Loader2 className="h-8 w-8 animate-spin text-[#0D7377] mb-2" />
        <p className="text-neutral-muted text-xs font-semibold">Fetching analytics dashboard...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto font-sans animate-fade-in">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 rounded-xl p-4 text-xs flex gap-2 items-center">
          <ShieldAlert className="h-5 w-5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Welcome banner */}
      <div className="bg-white border border-[#E2E2DE] rounded-3xl p-6 shadow-xs flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-4 opacity-5">
          <Sparkles className="h-32 w-32 text-[#0D7377]" />
        </div>
        <div className="z-10">
          <span className="text-[#0D7377] font-bold text-xs uppercase tracking-wider bg-[#E6F1F1] px-2.5 py-1 rounded-full">
            Active Venue: {venue?.venueName || "My Venue"}
          </span>
          <h2 className="font-serif text-2xl md:text-3xl font-bold text-[#1A1A19] mt-2.5">
            Venue Management Overview
          </h2>
          <p className="text-xs text-[#70706e] mt-1 max-w-xl">
            Track gross earnings, review incoming bookings, audit payment statuses, and configure date blocking lists for {venue?.venueName}.
          </p>
        </div>
        <Link href="/partner/venue" className="z-10">
          <Button className="bg-[#0D7377] text-white hover:bg-[#0a5b5e] rounded-xl flex items-center gap-1.5 h-11 font-bold shadow-md shadow-[#0D7377]/10 transition-all">
            <Building className="h-4.5 w-4.5" /> Edit Venue Details
          </Button>
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Bookings */}
        <Card className="border border-[#E2E2DE] shadow-xs bg-white rounded-2xl hover:shadow-md transition-all">
          <CardContent className="p-5 flex justify-between items-center">
            <div>
              <span className="text-[10px] uppercase font-bold text-[#70706e] block">Total Reservations</span>
              <span className="text-2xl font-bold text-[#1A1A19] block mt-1">{stats?.totalBookings ?? 0}</span>
              <span className="text-[10px] text-[#0D7377] font-semibold flex items-center gap-0.5 mt-1.5">
                <TrendingUp className="h-3.5 w-3.5" /> Live statistics
              </span>
            </div>
            <div className="h-11 w-11 bg-[#E6F1F1] text-[#0D7377] rounded-xl flex items-center justify-center">
              <Users className="h-5 w-5" />
            </div>
          </CardContent>
        </Card>

        {/* Confirmed Bookings */}
        <Card className="border border-[#E2E2DE] shadow-xs bg-white rounded-2xl hover:shadow-md transition-all">
          <CardContent className="p-5 flex justify-between items-center">
            <div>
              <span className="text-[10px] uppercase font-bold text-[#70706e] block">Confirmed Bookings</span>
              <span className="text-2xl font-bold text-[#1A1A19] block mt-1">{stats?.confirmedBookings ?? 0}</span>
              <span className="text-[10px] text-emerald-600 font-semibold flex items-center gap-0.5 mt-1.5">
                Active slots
              </span>
            </div>
            <div className="h-11 w-11 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center">
              <Calendar className="h-5 w-5" />
            </div>
          </CardContent>
        </Card>

        {/* Gross Earnings */}
        <Card className="border border-[#E2E2DE] shadow-xs bg-white rounded-2xl hover:shadow-md transition-all">
          <CardContent className="p-5 flex justify-between items-center">
            <div>
              <span className="text-[10px] uppercase font-bold text-[#70706e] block">Gross Earnings</span>
              <span className="text-2xl font-bold text-[#1a1a19] block mt-1">
                ₹{(stats?.grossEarnings ?? 0).toLocaleString("en-IN")}
              </span>
              <span className="text-[10px] text-[#0D7377] font-semibold flex items-center gap-0.5 mt-1.5">
                From paid bookings
              </span>
            </div>
            <div className="h-11 w-11 bg-amber-50 text-[#F4A261] rounded-xl flex items-center justify-center">
              <Building className="h-5 w-5" />
            </div>
          </CardContent>
        </Card>

        {/* Average Rating */}
        <Card className="border border-[#E2E2DE] shadow-xs bg-white rounded-2xl hover:shadow-md transition-all">
          <CardContent className="p-5 flex justify-between items-center">
            <div>
              <span className="text-[10px] uppercase font-bold text-[#70706e] block">Average Rating</span>
              <span className="text-2xl font-bold text-[#1A1A19] block mt-1">{stats?.averageRating ?? 4.8}</span>
              <div className="flex text-[#F4A261] gap-0.5 mt-1.5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className="h-3 w-3 fill-[#F4A261] text-[#F4A261]" />
                ))}
              </div>
            </div>
            <div className="h-11 w-11 bg-amber-50 text-[#F4A261] rounded-xl flex items-center justify-center">
              <Star className="h-5 w-5 fill-[#F4A261] text-[#F4A261]" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Workspace split */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        
        {/* Recent Bookings (Left, spans 2 cols) */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white border border-[#E2E2DE] rounded-3xl shadow-xs overflow-hidden">
            <div className="px-6 py-5 border-b border-[#E2E2DE] flex justify-between items-center bg-[#FAFAF8]">
              <div>
                <h3 className="font-serif font-bold text-base text-[#1A1A19]">Recent Booking Requests</h3>
                <p className="text-[10px] text-neutral-muted mt-0.5">Showing your last 5 reservation bookings</p>
              </div>
              <Link href="/partner/bookings" className="text-xs font-bold text-[#0D7377] hover:underline flex items-center gap-1">
                <span>View all Bookings</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-neutral-light/30 border-b border-[#E2E2DE] text-[#70706e] font-bold uppercase tracking-wider">
                    <th className="px-6 py-3.5">Ref / Created</th>
                    <th className="px-6 py-3.5">Customer</th>
                    <th className="px-6 py-3.5">Event Date</th>
                    <th className="px-6 py-3.5 text-right">Earning</th>
                    <th className="px-6 py-3.5 text-center">Status</th>
                    <th className="px-6 py-3.5 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E2E2DE]">
                  {recentBookingRequests.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="px-6 py-12 text-center text-[#70706e] font-medium">
                        No bookings recorded on your venue.
                      </td>
                    </tr>
                  ) : (
                    recentBookingRequests.map((bk) => (
                      <tr key={bk.bookingId} className="hover:bg-neutral-light/10 transition-colors">
                        <td className="px-6 py-4">
                          <span className="font-mono font-bold text-[#1A1A19] block">{bk.bookingReference}</span>
                          <span className="text-[10px] text-[#70706e] mt-0.5 block">
                            {new Date(bk.createdAt).toLocaleDateString("en-IN")}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span className="font-bold text-[#1A1A19] block">{bk.customer?.name}</span>
                          <span className="text-[10px] text-[#70706e] flex items-center gap-1 mt-0.5">
                            <Mail className="h-3 w-3 text-[#0D7377]" /> {bk.customer?.email}
                          </span>
                        </td>
                        <td className="px-6 py-4 font-semibold text-[#1A1A19]">
                          <span className="flex items-center gap-1">
                            <CalendarDays className="h-3.5 w-3.5 text-[#0D7377]" />
                            {bk.bookingDate}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right font-bold text-[#0D7377]">
                          <span className="block">₹{bk.totalAmount.toLocaleString("en-IN")}</span>
                          <div className="mt-1">{getPaymentStatusBadge(bk.paymentStatus)}</div>
                        </td>
                        <td className="px-6 py-4 text-center">
                          {getStatusBadge(bk.bookingStatus)}
                        </td>
                        <td className="px-6 py-4 text-center">
                          {bk.bookingStatus !== "CANCELLED" && bk.bookingStatus !== "COMPLETED" && bk.bookingStatus !== "EXPIRED" ? (
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => handleOpenCancelModal(bk)}
                              className="bg-transparent border border-red-200 text-red-600 hover:bg-red-50 rounded-lg h-7 px-2.5 text-[10px] font-semibold"
                            >
                              Cancel
                            </Button>
                          ) : (
                            <span className="text-neutral-muted">-</span>
                          )}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Sidebar panels (Right, spans 1 col) */}
        <aside className="space-y-6">
          {/* Live Month Slot Preview */}
          <Card className="border border-[#E2E2DE] shadow-xs bg-white rounded-3xl overflow-hidden">
            <div className="px-5 py-4 border-b border-[#E2E2DE] bg-[#FAFAF8] flex justify-between items-center">
              <span className="font-serif font-bold text-sm text-[#1A1A19]">Live Slot Calendar</span>
              <span className="text-[10px] font-bold text-[#0D7377] uppercase tracking-wider">
                {monthsList[month]} {year}
              </span>
            </div>
            <CardContent className="p-4">
              <div className="grid grid-cols-7 gap-1 text-center text-[10px] font-bold text-[#70706e] mb-2 uppercase tracking-wide">
                <span>M</span><span>T</span><span>W</span><span>T</span><span>F</span><span>S</span><span>S</span>
              </div>
              <div className="grid grid-cols-7 gap-1 text-center text-xs font-semibold text-neutral-dark">
                {calendarDays.map((dayNum, i) => {
                  if (dayNum === null) {
                    return <div key={`empty-${i}`} className="py-2 text-transparent">-</div>;
                  }

                  const dateStr = formatDateString(year, month, dayNum);
                  const status = getDayStatus(dateStr);

                  return (
                    <div
                      key={i}
                      title={`${dateStr} - ${status.toUpperCase()}`}
                      className={`py-2 rounded-lg text-xs font-bold border transition-colors ${
                        status === "booked"
                          ? "bg-amber-light text-[#F4A261] border-[#F4A261]/20"
                          : status === "blocked"
                          ? "bg-red-50 text-red-500 border-red-200"
                          : "hover:bg-[#F0F0EC] border-transparent text-[#1A1A19]"
                      }`}
                    >
                      {dayNum}
                    </div>
                  );
                })}
              </div>
              
              <div className="flex flex-col gap-1.5 text-[9px] font-bold text-[#70706e] uppercase pt-4 mt-3 border-t border-[#E2E2DE]">
                <div className="flex gap-4 justify-around">
                  <span className="flex items-center gap-1">
                    <span className="h-2 w-2 rounded-full bg-[#F4A261] block" /> Booked
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="h-2 w-2 rounded-full bg-red-500 block" /> Blocked
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="h-2 w-2 rounded-full bg-[#FAFAF8] border border-[#E2E2DE] block" /> Available
                  </span>
                </div>
                <Link href="/partner/blocked-dates" className="text-center text-[#0D7377] hover:underline mt-2 block normal-case font-bold text-xs">
                  Manage availability settings →
                </Link>
              </div>
            </CardContent>
          </Card>

          {/* Quick Action checklist */}
          <Card className="border border-[#E2E2DE] shadow-xs bg-white rounded-3xl p-5 space-y-4">
            <h4 className="font-serif font-bold text-sm text-[#1A1A19] pb-2 border-b border-[#E2E2DE]">
              Partner Checklist
            </h4>
            <div className="space-y-3.5 text-xs">
              <div className="flex gap-2.5 items-center">
                <CheckCircle2 className="h-4.5 w-4.5 text-[#0D7377] shrink-0" />
                <span className="text-[#1A1A19] font-medium line-through decoration-[#70706e]">
                  Register partner profile details
                </span>
              </div>
              <div className="flex gap-2.5 items-center">
                <CheckCircle2 className="h-4.5 w-4.5 text-[#0D7377] shrink-0" />
                <span className="text-[#1A1A19] font-medium line-through decoration-[#70706e]">
                  Submit venue listing for review
                </span>
              </div>
              <div className="flex gap-2.5 items-center">
                <CheckCircle2 className="h-4.5 w-4.5 text-[#0D7377] shrink-0" />
                <span className="text-[#1A1A19] font-medium line-through decoration-[#70706e]">
                  Obtain admin listing approval
                </span>
              </div>
              <div className="flex gap-2.5 items-center">
                {bookings.length > 0 ? (
                  <CheckCircle2 className="h-4.5 w-4.5 text-[#0D7377] shrink-0" />
                ) : (
                  <Clock className="h-4.5 w-4.5 text-[#F4A261] shrink-0" />
                )}
                <span className="text-[#1A1A19] font-medium">
                  Receive your first venue booking
                </span>
              </div>
            </div>
          </Card>
        </aside>

      </div>

      {/* CANCELLATION DIALOG MODAL */}
      {selectedBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in">
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white border border-[#E2E2DE] rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden animate-scale-in"
          >
            <div className="p-6 border-b border-[#E2E2DE] flex justify-between items-center">
              <h3 className="font-serif font-bold text-xl text-neutral-dark">Cancel Customer Booking</h3>
              <button
                onClick={handleCloseCancelModal}
                disabled={isCancelling}
                className="h-8 w-8 text-neutral-muted hover:text-neutral-dark hover:bg-neutral-light rounded-full flex items-center justify-center transition-colors focus:outline-none"
              >
                <XCircle className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleCancelSubmit}>
              <div className="p-6 space-y-4">
                <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-2xl flex gap-3 text-xs leading-relaxed">
                  <AlertCircle className="h-5 w-5 text-red-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold block mb-0.5">Owner Cancellation Policy</span>
                    Are you sure you want to cancel booking <strong className="font-mono">{selectedBooking.bookingReference}</strong>?
                    This will release the venue slot, mark the reservation as cancelled, and issue a full refund of <strong>₹{selectedBooking.totalAmount.toLocaleString("en-IN")}</strong> to the customer.
                  </div>
                </div>

                {cancelError && (
                  <div className="bg-red-50 border border-red-200 text-red-600 rounded-xl p-3 text-xs flex gap-2 items-start">
                    <ShieldAlert className="h-4.5 w-4.5 shrink-0 mt-0.5" />
                    <span>{cancelError}</span>
                  </div>
                )}

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-neutral-muted uppercase">Reason for Cancellation <span className="text-red-500">*</span></label>
                  <textarea
                    required
                    rows={4}
                    value={cancelReason}
                    onChange={(e) => setCancelReason(e.target.value)}
                    placeholder="Provide a cancellation explanation for the customer..."
                    className="w-full border border-input rounded-2xl bg-white p-4 text-sm outline-none focus:ring-2 focus:ring-red-500/40 focus:border-red-500 transition-all resize-none"
                  />
                </div>
              </div>

              <div className="p-6 border-t border-[#E2E2DE] bg-[#FAFAF8] flex justify-end gap-3">
                <Button
                  type="button"
                  onClick={handleCloseCancelModal}
                  disabled={isCancelling}
                  variant="outline"
                  className="border-input hover:bg-neutral-light font-bold rounded-xl px-5 py-2.5 h-auto text-sm"
                >
                  Keep Reservation
                </Button>
                <Button
                  type="submit"
                  disabled={isCancelling}
                  className="bg-red-600 text-white hover:bg-red-700 font-bold rounded-xl px-5 py-2.5 h-auto text-sm flex items-center gap-1.5 shadow-md shadow-red-600/10 cursor-pointer"
                >
                  {isCancelling ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Cancelling...
                    </>
                  ) : (
                    "Confirm Cancellation"
                  )}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
