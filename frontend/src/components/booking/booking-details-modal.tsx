import React, { useState, useEffect } from "react";
import { api } from "@/lib/axios";

export interface BookingDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  booking: any; // Can be Booking document with populated venue/user details
  onBookingUpdated?: (updatedBooking: any) => void;
}

export function BookingDetailsModal({ isOpen, onClose, booking, onBookingUpdated }: BookingDetailsModalProps) {
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [adjustedPrice, setAdjustedPrice] = useState<number>(0);
  const [submitting, setSubmitting] = useState(false);
  const [actionError, setActionError] = useState("");

  useEffect(() => {
    if (typeof window !== "undefined") {
      const userStr = localStorage.getItem("user");
      if (userStr) {
        try {
          setCurrentUser(JSON.parse(userStr));
        } catch (e) {
          console.error("Failed to parse user", e);
        }
      }
    }
  }, [isOpen]);

  useEffect(() => {
    if (booking) {
      setAdjustedPrice(booking.totalPrice || 0);
      setActionError("");
    }
  }, [booking, isOpen]);

  if (!isOpen || !booking) return null;

  const venue = booking.venueId || {};
  const customer = booking.userId || {};
  const bookingId = booking.id || booking._id;

  const isOwner = currentUser && 
                  currentUser.role === 'Venue owner' && 
                  (venue.ownerId === currentUser.id || 
                   venue.ownerId === currentUser._id ||
                   venue.ownerId?.toString() === currentUser.id);

  const getStatusBadgeClass = (status: string) => {
    const s = (status || "").toUpperCase();
    switch (s) {
      case "CONFIRMED":
        return "bg-emerald-50 border-emerald-200 text-emerald-700";
      case "COMPLETED":
        return "bg-blue-50 border-blue-200 text-blue-700";
      case "NO_SHOW":
        return "bg-orange-50 border-orange-200 text-orange-700";
      case "REQUESTED":
      case "PAYMENT_PENDING":
      case "LOCKED":
      case "PENDING":
        return "bg-amber-50 border-amber-200 text-amber-700 animate-pulse";
      case "REJECTED":
      case "EXPIRED":
      case "CANCELLED":
      case "CANCELLED_BY_OWNER":
      case "CANCELLED_BY_CUSTOMER":
      default:
        return "bg-rose-50 border-rose-200 text-rose-700";
    }
  };

  const getPaymentBadgeClass = (status: string) => {
    const s = (status || "").toUpperCase();
    switch (s) {
      case "PAID":
        return "bg-emerald-50 border-emerald-200 text-emerald-700";
      case "FAILED":
        return "bg-rose-50 border-rose-200 text-rose-700";
      case "PENDING":
      default:
        return "bg-amber-50 border-amber-200 text-amber-700";
    }
  };

  const getRefundBadgeClass = (status: string) => {
    const s = (status || "").toUpperCase();
    switch (s) {
      case "REFUNDED":
        return "bg-blue-50 border-blue-200 text-blue-700";
      case "PENDING":
      case "PROCESSING":
        return "bg-amber-50 border-amber-200 text-amber-700";
      case "REJECTED":
        return "bg-rose-50 border-rose-200 text-rose-700";
      case "NOT_APPLICABLE":
      default:
        return "bg-slate-100 border-slate-200 text-slate-500";
    }
  };

  const formatDateTime = (dateStr: string) => {
    try {
      const date = new Date(dateStr);
      if (isNaN(date.getTime())) return dateStr;
      return date.toLocaleString();
    } catch {
      return dateStr;
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(bookingId);
    alert("Booking ID copied to clipboard!");
  };

  const handleUpdateStatus = async (newStatus: string, priceToSet?: number) => {
    setSubmitting(true);
    setActionError("");
    try {
      const payload: any = { status: newStatus };
      if (priceToSet !== undefined) {
        payload.totalPrice = priceToSet;
      }
      const response = await api.patch(`/bookings/${bookingId}/status`, payload);
      if (onBookingUpdated) {
        onBookingUpdated(response.data);
      }
      onClose();
    } catch (err: any) {
      console.error("Failed to update status from modal:", err);
      setActionError(err.response?.data?.message || "Failed to update booking status.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="relative bg-white w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden border border-slate-100 animate-in fade-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="bg-slate-900 text-white p-6 relative shrink-0">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-slate-400 hover:text-white p-1.5 bg-white/10 rounded-full hover:bg-white/20 transition-all cursor-pointer"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          <span className="text-[10px] uppercase font-extrabold tracking-widest text-indigo-400">Booking Audit Details</span>
          <h3 className="text-xl font-bold mt-1 leading-snug">{venue.name || "Unknown Venue"}</h3>
          <div className="flex items-center gap-2 mt-2 text-xs text-slate-400">
            <span className="truncate max-w-[250px]">{venue.location || "No address listed"}</span>
            {/* <span>&bull;</span> */}
            {/* <button
              onClick={copyToClipboard}
              className="hover:text-indigo-300 font-mono flex items-center gap-1 bg-white/5 px-2 py-0.5 rounded cursor-pointer transition-colors"
              title="Click to copy ID"
            >
              ID: {bookingId ? `${bookingId.substring(0, 8)}...` : "N/A"}
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3" />
              </svg>
            </button> */}
          </div>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-slate-800 text-xs">
          {/* Status Badges Section */}
          <div className="grid grid-cols-3 gap-3">
            <div className="flex flex-col gap-1">
              <span className="text-[9px] uppercase font-bold text-slate-400">Booking Status</span>
              <span className={`px-2 py-1 text-[10px] font-bold rounded-lg border text-center uppercase tracking-wide truncate ${getStatusBadgeClass(booking.status)}`}>
                {booking.status || "UNKNOWN"}
              </span>
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-[9px] uppercase font-bold text-slate-400">Payment Status</span>
              <span className={`px-2 py-1 text-[10px] font-bold rounded-lg border text-center uppercase tracking-wide truncate ${getPaymentBadgeClass(booking.paymentStatus)}`}>
                {booking.paymentStatus || "PENDING"}
              </span>
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-[9px] uppercase font-bold text-slate-400">Refund Status</span>
              <span className={`px-2 py-1 text-[10px] font-bold rounded-lg border text-center uppercase tracking-wide truncate ${getRefundBadgeClass(booking.refundStatus)}`}>
                {booking.refundStatus || "NOT_APPLICABLE"}
              </span>
            </div>
          </div>

          {/* Schedule Info */}
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-150 space-y-2.5">
            <h4 className="font-extrabold uppercase text-[9px] tracking-wider text-slate-400 mb-1">Schedule Details</h4>
            <div className="flex justify-between">
              <span className="text-slate-500">Date & Start Time:</span>
              <span className="font-bold text-slate-800">{booking.date}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Duration:</span>
              <span className="font-bold text-slate-800">{booking.hours} hour(s)</span>
            </div>
            <div className="flex justify-between border-t border-slate-200/60 pt-2 text-sm">
              <span className="font-bold text-slate-705">Total Price:</span>
              <span className="font-black text-indigo-600">RS {booking.totalPrice}</span>
            </div>
            {booking.refundAmount !== undefined && booking.refundAmount > 0 && (
              <div className="flex justify-between border-t border-slate-200/60 pt-2 text-sm text-indigo-700 font-bold">
                <span>Refund Amount:</span>
                <span>RS {booking.refundAmount}</span>
              </div>
            )}
          </div>

          {/* Owner Approval & Custom Pricing Section */}
          {booking.status === "REQUESTED" && isOwner && (
            <div className="bg-indigo-50/45 p-4 rounded-2xl border border-indigo-105 space-y-4">
              <h4 className="font-extrabold uppercase text-[9px] tracking-wider text-indigo-850">Owner Custom Approval Panel</h4>
              
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold text-slate-500 uppercase">Adjust Custom Slot Price (RS)</label>
                <input
                  type="number"
                  value={adjustedPrice}
                  onChange={(e) => setAdjustedPrice(Math.max(0, Number(e.target.value)))}
                  className="w-full px-3 py-2 border border-slate-250 rounded-xl text-xs bg-white text-slate-800 focus:outline-none focus:ring-1 focus:ring-indigo-500 font-bold"
                />
              </div>

              {actionError && (
                <p className="text-[11px] font-semibold text-rose-600">
                  {actionError}
                </p>
              )}

              <div className="flex gap-2">
                <button
                  type="button"
                  disabled={submitting}
                  onClick={() => handleUpdateStatus("REJECTED")}
                  className="w-1/2 py-2 px-3 border border-rose-200 text-rose-605 hover:bg-rose-50 bg-white font-bold text-xs rounded-xl transition-all cursor-pointer disabled:opacity-50 text-center"
                >
                  Decline Request
                </button>
                <button
                  type="button"
                  disabled={submitting}
                  onClick={() => handleUpdateStatus("PAYMENT_PENDING", adjustedPrice)}
                  className="w-1/2 py-2 px-3 bg-indigo-600 hover:bg-indigo-550 text-white font-bold text-xs rounded-xl transition-all shadow-md shadow-indigo-100 cursor-pointer disabled:opacity-50 text-center"
                >
                  {submitting ? "Processing..." : "Approve Custom Range"}
                </button>
              </div>
            </div>
          )}

          {/* Customer / User Info */}
          {customer.name && (
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-150 space-y-2.5">
              <h4 className="font-extrabold uppercase text-[9px] tracking-wider text-slate-400 mb-1">Customer Information</h4>
              <div className="flex justify-between">
                <span className="text-slate-500">Name:</span>
                <span className="font-bold text-slate-800">{customer.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Email:</span>
                <span className="font-semibold text-slate-700">{customer.email}</span>
              </div>
            </div>
          )}

          {/* Cancellation section */}
          {(booking.cancelledAt || booking.cancellationReason) && (
            <div className="bg-rose-50 border border-rose-150 p-4 rounded-2xl space-y-2.5 text-rose-900">
              <h4 className="font-extrabold uppercase text-[9px] tracking-wider text-rose-500 mb-1">Cancellation Summary</h4>
              {booking.cancelledAt && (
                <div className="flex justify-between">
                  <span className="text-rose-600/80">Cancelled At:</span>
                  <span className="font-bold">{formatDateTime(booking.cancelledAt)}</span>
                </div>
              )}
              {booking.cancelledBy && (
                <div className="flex justify-between">
                  <span className="text-rose-600/80">Cancelled By:</span>
                  <span className="font-bold uppercase tracking-wider">{booking.cancelledBy === customer.id || booking.cancelledBy === customer._id ? "Customer" : "Owner/Admin"}</span>
                </div>
              )}
              {booking.cancellationReason && (
                <div className="pt-2 border-t border-rose-200/50">
                  <span className="font-extrabold text-[8px] uppercase text-rose-500 block mb-0.5">Reason</span>
                  <p className="leading-relaxed">{booking.cancellationReason}</p>
                </div>
              )}
            </div>
          )}

          {/* System Timeline Timestamps */}
          <div className="border-t border-slate-100 pt-4 space-y-2 text-[10px] text-slate-400">
            <div className="flex justify-between">
              <span>Created At:</span>
              <span>{formatDateTime(booking.createdAt)}</span>
            </div>
            {booking.refundRequestedAt && (
              <div className="flex justify-between">
                <span>Refund Requested At:</span>
                <span>{formatDateTime(booking.refundRequestedAt)}</span>
              </div>
            )}
            {booking.refundedAt && (
              <div className="flex justify-between">
                <span>Refund Disbursed At:</span>
                <span>{formatDateTime(booking.refundedAt)}</span>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="bg-slate-50 border-t border-slate-100 p-4 flex justify-end shrink-0">
          <button
            onClick={onClose}
            className="py-2 px-5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl cursor-pointer transition-colors"
          >
            Close Details
          </button>
        </div>
      </div>
    </div>
  );
}
