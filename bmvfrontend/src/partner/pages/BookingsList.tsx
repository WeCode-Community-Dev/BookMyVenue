"use client";

import React, { useState, useEffect } from "react";
import { 
  Calendar, 
  MapPin, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  User, 
  Phone, 
  Mail, 
  AlertCircle, 
  Loader2, 
  ShieldAlert,
  Search
} from "lucide-react";
import { apiFetch } from "@/src/lib/api";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

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
  specialRequest: string | null;
  customer: {
    id: string;
    name: string;
    email: string;
    phone: string;
  };
}

export default function PartnerBookings() {
  const [bookings, setBookings] = useState<BookingItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");

  // Cancellation Modal State
  const [selectedBooking, setSelectedBooking] = useState<BookingItem | null>(null);
  const [cancelReason, setCancelReason] = useState("");
  const [cancelError, setCancelError] = useState("");
  const [isCancelling, setIsCancelling] = useState(false);

  useEffect(() => {
    loadBookings();
  }, []);

  const loadBookings = async () => {
    setLoading(true);
    setError("");
    try {
      const data = await apiFetch<BookingItem[]>("/booking/venue/owner");
      setBookings(data);
    } catch (err: any) {
      setError(err.message || "Failed to load bookings.");
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

    setIsCancelling(true);
    setCancelError("");

    try {
      await apiFetch(`/booking/${selectedBooking.bookingId}/cancel`, {
        method: "PATCH",
        body: { cancellationReason: cancelReason.trim() }
      });
      await loadBookings();
      setSelectedBooking(null);
    } catch (err: any) {
      setCancelError(err.message || "Failed to cancel booking.");
    } finally {
      setIsCancelling(false);
    }
  };

  // Filter & Search
  const filteredBookings = bookings.filter((bk) => {
    const matchesSearch =
      bk.bookingReference.toLowerCase().includes(searchTerm.toLowerCase()) ||
      bk.customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      bk.customer.email.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === "ALL" ||
      (statusFilter === "CONFIRMED" && bk.bookingStatus === "CONFIRMED") ||
      (statusFilter === "PENDING" && bk.bookingStatus === "PENDING_PAYMENT") ||
      (statusFilter === "CANCELLED" && bk.bookingStatus === "CANCELLED") ||
      (statusFilter === "COMPLETED" && bk.bookingStatus === "COMPLETED");

    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: BookingItem["bookingStatus"]) => {
    switch (status) {
      case "CONFIRMED":
        return (
          <span className="inline-flex items-center gap-1 py-1 px-2.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
            <CheckCircle2 className="h-3 w-3" /> Confirmed
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
            <CheckCircle2 className="h-3 w-3" /> Completed
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

  return (
    <div className="space-y-6 max-w-6xl mx-auto font-sans">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="font-serif text-2xl md:text-3xl font-bold text-neutral-dark">Venue Bookings</h1>
          <p className="text-xs text-neutral-muted mt-1">Audit customer bookings, monitor payments, and manage cancellations.</p>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 rounded-xl p-4 text-xs flex gap-2 items-center">
          <ShieldAlert className="h-5 w-5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Filters Strip */}
      <div className="bg-white border border-[#E2E2DE] p-4 rounded-2xl flex flex-col md:flex-row justify-between items-center gap-4 shadow-xs">
        {/* Search */}
        <div className="relative w-full md:w-80">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-muted">
            <Search className="h-4 w-4" />
          </span>
          <Input
            placeholder="Search by Ref or Customer Name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9 h-10 border-input rounded-xl bg-[#FAFAF8]"
          />
        </div>

        {/* Tab Filters */}
        <div className="flex border-b border-transparent space-x-1 w-full md:w-auto justify-start md:justify-end overflow-x-auto">
          {["ALL", "CONFIRMED", "PENDING", "COMPLETED", "CANCELLED"].map((status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`py-2 px-4 text-xs font-bold rounded-lg transition-colors whitespace-nowrap ${
                statusFilter === status
                  ? "bg-[#E6F1F1] text-[#0D7377]"
                  : "text-[#70706e] hover:bg-[#F0F0EC] hover:text-[#1A1A19]"
              }`}
            >
              {status === "ALL" ? "All" : status.charAt(0) + status.slice(1).toLowerCase()}
            </button>
          ))}
        </div>
      </div>

      {/* Bookings Table */}
      <Card className="border border-[#E2E2DE] shadow-xs bg-white rounded-2xl overflow-hidden">
        <CardContent className="p-0">
          {loading ? (
            <div className="py-20 flex justify-center items-center">
              <Loader2 className="h-6 w-6 animate-spin text-[#0D7377]" />
              <span className="text-xs text-neutral-muted ml-2">Loading bookings...</span>
            </div>
          ) : filteredBookings.length === 0 ? (
            <div className="py-16 text-center space-y-3">
              <Calendar className="h-10 w-10 text-neutral-muted mx-auto" />
              <p className="text-sm font-semibold text-[#1A1A19]">No bookings match your filter.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-neutral-light/50 border-b border-[#E2E2DE] text-neutral-muted font-bold uppercase">
                    <th className="px-6 py-4">Ref / Created At</th>
                    <th className="px-6 py-4">Customer</th>
                    <th className="px-6 py-4">Event Date</th>
                    <th className="px-6 py-4 text-right">Earning Amount</th>
                    <th className="px-6 py-4 text-center">Status</th>
                    <th className="px-6 py-4 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E2E2DE]">
                  {filteredBookings.map((bk) => (
                    <tr key={bk.bookingId} className="hover:bg-neutral-light/20 transition-colors">
                      <td className="px-6 py-4 font-sans">
                        <span className="font-mono font-bold text-neutral-dark block">{bk.bookingReference}</span>
                        <span className="text-[10px] text-neutral-muted mt-0.5">
                          Created {new Date(bk.createdAt).toLocaleDateString("en-IN")}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="font-bold text-neutral-dark block">{bk.customer.name}</span>
                        <span className="text-[10px] text-neutral-muted flex items-center gap-1 mt-0.5">
                          <Mail className="h-3 w-3 text-[#0D7377]" /> {bk.customer.email}
                        </span>
                        <span className="text-[10px] text-neutral-muted flex items-center gap-1 mt-0.5">
                          <Phone className="h-3 w-3 text-[#0D7377]" /> {bk.customer.phone}
                        </span>
                      </td>
                      <td className="px-6 py-4 font-semibold text-neutral-dark">
                        <span className="flex items-center gap-1"><Calendar className="h-3.5 w-3.5 text-[#0D7377]" /> {bk.bookingDate}</span>
                      </td>
                      <td className="px-6 py-4 text-right font-bold text-[#0D7377]">
                        <span className="block">₹{bk.totalAmount.toLocaleString("en-IN")}</span>
                        <div className="mt-1">{getPaymentStatusBadge(bk.paymentStatus)}</div>
                      </td>
                      <td className="px-6 py-4 text-center">
                        {getStatusBadge(bk.bookingStatus)}
                      </td>
                      <td className="px-6 py-4 text-center">
                        {bk.bookingStatus !== "CANCELLED" && bk.bookingStatus !== "COMPLETED" ? (
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => handleOpenCancelModal(bk)}
                            className="bg-transparent border border-red-200 text-red-600 hover:bg-red-50 rounded-lg h-8 text-[10px] font-semibold"
                          >
                            Cancel
                          </Button>
                        ) : bk.bookingStatus === "CANCELLED" ? (
                          <div className="max-w-[150px] mx-auto text-left text-[10px] bg-red-50 text-red-700 p-1.5 rounded-lg border border-red-100">
                            <span className="font-bold">Reason:</span> {bk.cancellationReason || "No details."}
                          </div>
                        ) : (
                          <span className="text-neutral-muted">-</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

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
