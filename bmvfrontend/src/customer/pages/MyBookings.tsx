"use client";

import React, { useState, useEffect } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { apiFetch } from "@/src/lib/api";
import { getSession, UserSession } from "@/src/lib/authStore";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Calendar,
  MapPin,
  Clock,
  CheckCircle2,
  XCircle,
  Building,
  CreditCard,
  Loader2,
  ShieldAlert,
  ArrowRight,
  ChevronRight,
  AlertCircle
} from "lucide-react";

interface BookingItem {
  bookingId: string;
  bookingReference: string;
  customerId: string;
  venueId: string;
  bookingDate: string;
  bookingStatus: "PENDING_PAYMENT" | "CONFIRMED" | "CANCELLED" | "COMPLETED";
  paymentStatus: "NOT_PAID" | "PENDING" | "PAID" | "FAILED" | "REFUNDED";
  baseAmount: number;
  totalAmount: number;
  refundAmount: number;
  cancellationReason: string | null;
  cancelledAt: string | null;
  cancelledBy: string | null;
  createdAt: string;
  venue: {
    id: string;
    venueName: string;
    city: string;
    state: string;
    address: string;
    images?: Array<{ id: string; imageUrl: string }>;
  };
}

export default function MyBookings() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const tab = searchParams.get("tab") || "all";

  const [session, setSession] = useState<UserSession | null>(null);
  const [bookings, setBookings] = useState<BookingItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const filteredBookings = bookings.filter((booking) => {
    if (tab === "current") {
      return (
        booking.bookingStatus === "CONFIRMED" ||
        booking.bookingStatus === "PENDING_PAYMENT"
      );
    }
    if (tab === "previous") {
      return (
        booking.bookingStatus === "COMPLETED" ||
        booking.bookingStatus === "CANCELLED"
      );
    }
    return true;
  });

  // Cancellation Modal State
  const [selectedBooking, setSelectedBooking] = useState<BookingItem | null>(null);
  const [cancelReason, setCancelReason] = useState("");
  const [cancelError, setCancelError] = useState("");
  const [isCancelling, setIsCancelling] = useState(false);

  useEffect(() => {
    const activeSession = getSession();
    if (!activeSession) {
      router.push("/login?returnUrl=/customer/bookings");
      return;
    }
    setSession(activeSession);
    loadBookings();
  }, [router]);

  const loadBookings = async () => {
    setLoading(true);
    setError("");
    try {
      const data = await apiFetch<BookingItem[]>("/booking/my");
      setBookings(data);
    } catch (err: any) {
      setError(err.message || "Failed to load your bookings. Please try again.");
    } finally {
      setLoading(false);
    }
  };

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
    if (cancelReason.length > 500) {
      setCancelError("Reason cannot exceed 500 characters");
      return;
    }

    setIsCancelling(true);
    setCancelError("");

    try {
      await apiFetch(`/booking/${selectedBooking.bookingId}/cancel`, {
        method: "PATCH",
        body: { cancellationReason: cancelReason.trim() }
      });

      // Reload bookings to reflect changes
      await loadBookings();
      setSelectedBooking(null);
    } catch (err: any) {
      setCancelError(err.message || "Failed to cancel booking. Please try again.");
    } finally {
      setIsCancelling(false);
    }
  };

  const getStatusBadge = (status: BookingItem["bookingStatus"]) => {
    switch (status) {
      case "CONFIRMED":
        return (
          <span className="inline-flex items-center gap-1 py-1 px-3 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
            <CheckCircle2 className="h-3.5 w-3.5" /> Confirmed
          </span>
        );
      case "CANCELLED":
        return (
          <span className="inline-flex items-center gap-1 py-1 px-3 rounded-full text-xs font-bold bg-red-50 text-red-700 border border-red-200">
            <XCircle className="h-3.5 w-3.5" /> Cancelled
          </span>
        );
      case "COMPLETED":
        return (
          <span className="inline-flex items-center gap-1 py-1 px-3 rounded-full text-xs font-bold bg-blue-50 text-blue-700 border border-blue-200">
            <CheckCircle2 className="h-3.5 w-3.5" /> Completed
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 py-1 px-3 rounded-full text-xs font-bold bg-amber-50 text-amber-700 border border-amber-200">
            <Clock className="h-3.5 w-3.5" /> Pending Payment
          </span>
        );
    }
  };

  const getPaymentStatusBadge = (status: BookingItem["paymentStatus"]) => {
    switch (status) {
      case "PAID":
        return (
          <span className="text-emerald-600 font-bold bg-emerald-50 border border-emerald-100 rounded-lg px-2 py-0.5 text-[10px]">
            Paid
          </span>
        );
      case "REFUNDED":
        return (
          <span className="text-blue-600 font-bold bg-blue-50 border border-blue-100 rounded-lg px-2 py-0.5 text-[10px]">
            Refunded
          </span>
        );
      case "FAILED":
        return (
          <span className="text-red-600 font-bold bg-red-50 border border-red-100 rounded-lg px-2 py-0.5 text-[10px]">
            Failed
          </span>
        );
      default:
        return (
          <span className="text-amber-600 font-bold bg-amber-50 border border-amber-100 rounded-lg px-2 py-0.5 text-[10px]">
            Pending
          </span>
        );
    }
  };

  const getThumbnail = (booking: BookingItem) => {
    if (booking.venue.images && booking.venue.images.length > 0) {
      return booking.venue.images[0].imageUrl;
    }
    return "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&q=80&w=600";
  };

  const isDashboardView = pathname.startsWith("/customer");

  return (
    <div className={isDashboardView ? "w-full font-sans" : "flex flex-col min-h-screen bg-[#FAFAF8] font-sans"}>
      {!isDashboardView && <Header />}

      <main className={isDashboardView ? "py-2 relative w-full" : "flex-grow max-w-5xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-10 relative"}>
        <div className="mb-8">
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-neutral-dark">My Bookings</h1>
          <p className="text-sm text-neutral-muted mt-2">
            View your event reservations, check statuses, and manage cancellations.
          </p>
        </div>

        {/* Tab Selection */}
        <div className="flex border-b border-neutral-light mb-6">
          {(["all", "current", "previous"] as const).map((t) => (
            <button
              key={t}
              onClick={() => {
                const params = new URLSearchParams(searchParams.toString());
                if (t === "all") {
                  params.delete("tab");
                } else {
                  params.set("tab", t);
                }
                router.push(`${pathname}?${params.toString()}`);
              }}
              className={`py-3 px-4 text-xs font-bold uppercase tracking-wider border-b-2 -mb-px transition-all ${
                tab === t
                  ? "border-teal-primary text-teal-primary font-bold"
                  : "border-transparent text-neutral-muted hover:text-neutral-dark"
              }`}
            >
              {t === "all" ? "All Bookings" : t === "current" ? "Current Bookings" : "Previous Bookings"}
            </button>
          ))}
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 rounded-2xl p-4 text-sm flex gap-3 items-start mb-6 animate-fade-in shadow-sm">
            <ShieldAlert className="h-5 w-5 shrink-0 mt-0.5" />
            <div className="flex-grow">
              <span className="font-bold block mb-1">Failed to Load Bookings</span>
              <span>{error}</span>
            </div>
            <Button size="sm" onClick={loadBookings} className="bg-red-600 text-white hover:bg-red-700 rounded-xl h-8 px-4 font-bold shrink-0">
              Retry
            </Button>
          </div>
        )}

        {loading ? (
          // SKELETON LOADING STATE
          <div className="space-y-4">
            {Array.from({ length: 3 }).map((_, idx) => (
              <Card key={idx} className="border border-neutral-light bg-white rounded-2xl overflow-hidden shadow-xs">
                <CardContent className="p-0 flex flex-col md:flex-row h-auto md:h-44">
                  <div className="w-full md:w-56 h-40 md:h-auto bg-neutral-light animate-pulse" />
                  <div className="flex-grow p-6 space-y-4">
                    <div className="flex justify-between items-start gap-4">
                      <div className="space-y-2 flex-grow">
                        <div className="h-6 w-1/3 bg-neutral-light rounded-md animate-pulse" />
                        <div className="h-4 w-1/4 bg-neutral-light rounded-md animate-pulse" />
                      </div>
                      <div className="h-8 w-24 bg-neutral-light rounded-full animate-pulse" />
                    </div>
                    <hr className="border-neutral-light" />
                    <div className="flex justify-between items-center">
                      <div className="h-4 w-20 bg-neutral-light rounded-md animate-pulse" />
                      <div className="h-10 w-28 bg-neutral-light rounded-xl animate-pulse" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : filteredBookings.length === 0 ? (
          // EMPTY STATE
          <div className="bg-white border border-neutral-light rounded-3xl p-12 text-center flex flex-col items-center max-w-xl mx-auto shadow-sm my-8">
            <div className="h-16 w-16 rounded-full bg-teal-light text-teal-primary flex items-center justify-center mb-6">
              <Building className="h-8 w-8" />
            </div>
            <h3 className="font-serif text-2xl font-bold text-neutral-dark mb-2">No Bookings Yet</h3>
            <p className="text-sm text-neutral-muted mb-8 max-w-sm">
              You haven't made any reservations. Find the perfect venue and secure your date today!
            </p>
            <Link href="/venues" className="w-full">
              <Button className="w-full bg-[#0D7377] text-white hover:bg-[#0a5b5e] py-3 h-auto font-bold rounded-xl shadow-md shadow-teal-primary/20 flex items-center justify-center gap-1.5">
                Browse Live Venues <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        ) : (
          // BOOKINGS LIST
          <div className="space-y-5">
            {filteredBookings.map((booking) => (
              <Card
                key={booking.bookingId}
                className="border border-neutral-light bg-white rounded-2xl overflow-hidden shadow-xs hover:shadow-md transition-shadow"
              >
                <CardContent className="p-0 flex flex-col md:flex-row">
                  {/* Image/Thumbnail */}
                  <div className="relative w-full md:w-56 h-40 md:h-auto bg-neutral-light shrink-0">
                    <Image
                      src={getThumbnail(booking)}
                      alt={booking.venue.venueName}
                      fill
                      className="object-cover"
                    />
                  </div>

                  {/* Body Content */}
                  <div className="flex-grow p-5 md:p-6 flex flex-col justify-between">
                    <div>
                      {/* Top Row: Title, Badge, Ref */}
                      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3 mb-3">
                        <div>
                          <h3 className="font-serif text-xl font-bold text-neutral-dark line-clamp-1">
                            {booking.venue.venueName}
                          </h3>
                          <p className="text-xs text-neutral-muted flex items-center gap-1 mt-1 font-semibold">
                            <MapPin className="h-3.5 w-3.5 text-teal-primary" /> {booking.venue.city}, {booking.venue.state}
                          </p>
                        </div>
                        <div className="shrink-0 flex items-center gap-2">
                          {getStatusBadge(booking.bookingStatus)}
                        </div>
                      </div>

                      {/* Details row */}
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 py-4 border-t border-neutral-light text-xs font-semibold text-neutral-dark">
                        <div>
                          <span className="text-[10px] text-neutral-muted uppercase font-bold block mb-1">Booking Ref</span>
                          <span className="font-mono">{booking.bookingReference}</span>
                        </div>
                        <div>
                          <span className="text-[10px] text-neutral-muted uppercase font-bold block mb-1">Event Date</span>
                          <span className="flex items-center gap-1"><Calendar className="h-3.5 w-3.5 text-teal-primary" /> {booking.bookingDate}</span>
                        </div>
                        <div className="col-span-2 sm:col-span-1">
                          <span className="text-[10px] text-neutral-muted uppercase font-bold block mb-1">Paid Amount</span>
                          <span className="flex items-center gap-1.5 text-teal-primary text-sm font-bold">
                            ₹{booking.totalAmount.toLocaleString("en-IN")}
                            {getPaymentStatusBadge(booking.paymentStatus)}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Footer Cancel Reason / Actions */}
                    <div className="pt-4 border-t border-neutral-light flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                      {booking.bookingStatus === "CANCELLED" ? (
                        <div className="bg-red-50/50 border border-red-100 rounded-xl p-3 w-full text-xs text-red-800 flex items-start gap-2 leading-relaxed">
                          <AlertCircle className="h-4.5 w-4.5 shrink-0 text-red-500 mt-0.5" />
                          <div>
                            <span className="font-bold block mb-0.5">Cancellation Reason:</span>
                            <span>{booking.cancellationReason || "No reason specified."}</span>
                            {booking.refundAmount > 0 && (
                              <span className="block mt-1 font-bold text-blue-700">Refund status: ₹{booking.refundAmount.toLocaleString("en-IN")} returned.</span>
                            )}
                          </div>
                        </div>
                      ) : (
                        <>
                          <span className="text-xs text-neutral-muted flex items-center gap-1">
                            <Clock className="h-4 w-4 text-teal-primary" /> Booked on {new Date(booking.createdAt).toLocaleDateString("en-IN")}
                          </span>
                          <Button
                            onClick={() => handleOpenCancelModal(booking)}
                            variant="destructive"
                            className="bg-transparent border border-red-200 text-red-600 hover:bg-red-50 rounded-xl px-4 py-2 font-bold h-9 text-xs shadow-none cursor-pointer self-end sm:self-auto"
                          >
                            Cancel Reservation
                          </Button>
                        </>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>

      {/* CANCELLATION DIALOG MODAL (State Driven overlay) */}
      {selectedBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in">
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white border border-neutral-light rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden animate-scale-in"
          >
            <div className="p-6 border-b border-neutral-light flex justify-between items-center">
              <h3 className="font-serif font-bold text-xl text-neutral-dark">Cancel Reservation</h3>
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
                <div className="bg-amber-light/40 border border-amber-cta/20 p-4 rounded-2xl flex gap-3 text-xs text-[#a76532] leading-relaxed">
                  <AlertCircle className="h-5 w-5 text-amber-cta shrink-0 mt-0.5 animate-pulse" />
                  <div>
                    <span className="font-bold block mb-0.5">Cancellation Policy Reminder</span>
                    Are you sure you want to cancel booking <strong className="font-mono font-bold">{selectedBooking.bookingReference}</strong> for <strong>{selectedBooking.venue.venueName}</strong>? 
                    This reservation will be immediately freed, and a full refund of <strong>₹{selectedBooking.totalAmount.toLocaleString("en-IN")}</strong> will be processed.
                  </div>
                </div>

                {cancelError && (
                  <div className="bg-red-50 border border-red-200 text-red-600 rounded-xl p-3 text-xs flex gap-2 items-start animate-fade-in">
                    <ShieldAlert className="h-4.5 w-4.5 shrink-0 mt-0.5" />
                    <span>{cancelError}</span>
                  </div>
                )}

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-neutral-muted uppercase">Reason for Cancellation <span className="text-red-500">*</span></label>
                  <textarea
                    required
                    rows={4}
                    maxLength={500}
                    value={cancelReason}
                    onChange={(e) => setCancelReason(e.target.value)}
                    placeholder="Please provide the reason for cancelling this reservation (maximum 500 characters)..."
                    className="w-full border border-input rounded-2xl bg-white p-4 text-sm outline-none focus:ring-2 focus:ring-teal-primary/40 focus:border-teal-primary transition-all resize-none placeholder:text-neutral-muted/70"
                  />
                  <div className="text-[10px] text-neutral-muted text-right font-semibold">
                    {cancelReason.length}/500 characters
                  </div>
                </div>
              </div>

              <div className="p-6 border-t border-neutral-light bg-[#FAFAF8] flex justify-end gap-3">
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

      {!isDashboardView && <Footer />}
    </div>
  );
}
