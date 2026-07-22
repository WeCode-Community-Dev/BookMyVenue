"use client";

import React, { useEffect, useMemo, useState } from "react";
import { AlertTriangle, Check, Clock3, ShieldCheck, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Venue } from "@/types";
import { BackendBooking } from "@/types/backend";
import * as venueService from "@/services/venue.service";
import * as bookingService from "@/services/booking.service";

interface OwnerVenueControlsProps {
  venue: Venue;
  onAvailabilityChanged?: () => void;
}

function formatDateTime(value: string) {
  return new Date(value).toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

export default function OwnerVenueControls({ venue, onAvailabilityChanged }: OwnerVenueControlsProps) {
  const [bookingApprovalRequired, setBookingApprovalRequired] = useState(Boolean(venue.bookingApprovalRequired));
  const [isSavingRule, setIsSavingRule] = useState(false);
  const [blockStartDate, setBlockStartDate] = useState("");
  const [blockEndDate, setBlockEndDate] = useState("");
  const [blockReason, setBlockReason] = useState("");
  const [isBlockingDates, setIsBlockingDates] = useState(false);
  const [requests, setRequests] = useState<BackendBooking[]>([]);
  const [isLoadingRequests, setIsLoadingRequests] = useState(true);
  const [busyRequestId, setBusyRequestId] = useState<string | null>(null);

  const venueRequests = useMemo(() => requests.filter((request) => request.venueId === venue.id), [requests, venue.id]);

  const loadRequests = async () => {
    setIsLoadingRequests(true);
    try {
      setRequests(await bookingService.getOwnerBookingRequests());
    } catch (error) {
      console.error("Failed to load owner booking requests:", error);
      setRequests([]);
    } finally {
      setIsLoadingRequests(false);
    }
  };

  useEffect(() => {
    setBookingApprovalRequired(Boolean(venue.bookingApprovalRequired));
  }, [venue.bookingApprovalRequired]);

  useEffect(() => {
    loadRequests();
  }, [venue.id]);

  const handleSaveBookingRule = async () => {
    setIsSavingRule(true);
    try {
      const result = await venueService.updateVenueBookingApproval(venue.id, bookingApprovalRequired);
      alert(result.message);
      onAvailabilityChanged?.();
    } catch (error: any) {
      alert(error?.response?.data?.message || error?.message || "Failed to update booking approval rule.");
      setBookingApprovalRequired(Boolean(venue.bookingApprovalRequired));
    } finally {
      setIsSavingRule(false);
    }
  };

  const handleBlockDates = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!blockStartDate || !blockEndDate) return;

    setIsBlockingDates(true);
    try {
      await venueService.blockVenueDates(venue.id, {
        startDate: new Date(`${blockStartDate}T00:00:00`).toISOString(),
        endDate: new Date(`${blockEndDate}T23:59:59`).toISOString(),
        reason: blockReason || undefined,
      });
      alert("Venue dates blocked successfully.");
      setBlockStartDate("");
      setBlockEndDate("");
      setBlockReason("");
      onAvailabilityChanged?.();
    } catch (error: any) {
      alert(error?.response?.data?.message || error?.message || "Failed to block dates.");
    } finally {
      setIsBlockingDates(false);
    }
  };

  const handleApproveRequest = async (bookingId: string) => {
    setBusyRequestId(bookingId);
    try {
      const result = await bookingService.approveOwnerBookingRequest(bookingId);
      alert(result.message);
      await loadRequests();
      onAvailabilityChanged?.();
    } catch (error: any) {
      alert(error?.response?.data?.message || error?.message || "Failed to approve booking request.");
    } finally {
      setBusyRequestId(null);
    }
  };

  const handleRejectRequest = async (bookingId: string) => {
    const reason = prompt("Enter the reason for rejecting this booking request:");
    if (reason === null) return;

    setBusyRequestId(bookingId);
    try {
      const result = await bookingService.rejectOwnerBookingRequest(bookingId, reason.trim() || undefined);
      alert(result.message);
      await loadRequests();
      onAvailabilityChanged?.();
    } catch (error: any) {
      alert(error?.response?.data?.message || error?.message || "Failed to reject booking request.");
    } finally {
      setBusyRequestId(null);
    }
  };

  return (
    <div className="bg-slate-50 border border-slate-205 shadow-lg rounded-3xl p-5 sm:p-6 space-y-6 text-left">
      <div className="space-y-2 border-b border-slate-200/80 pb-4">
        <span className={`inline-flex items-center gap-1.5 text-[10px] font-black px-2.5 py-0.5 rounded-full border uppercase tracking-wider ${venue.verified ? "text-emerald-700 bg-emerald-50 border-emerald-250" : "text-amber-700 bg-amber-50 border-amber-250"}`}>
          {venue.verified ? "Live & Active" : "Pending Verification"}
        </span>
        <h3 className="text-base font-black text-slate-905 leading-tight">Host Control Panel</h3>
        <p className="text-[11px] text-slate-500 font-semibold leading-relaxed">Manage approval rules, blocked dates, and guest booking requests for this venue.</p>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-4 space-y-3">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h4 className="text-xs font-black text-slate-850 uppercase tracking-wider">Owner Approval Mode</h4>
            <p className="text-[11px] text-slate-500 font-semibold mt-1">When enabled, new bookings stay pending until you approve them.</p>
          </div>
          <input type="checkbox" checked={bookingApprovalRequired} onChange={(e) => setBookingApprovalRequired(e.target.checked)} className="mt-1 size-4 cursor-pointer" />
        </div>
        <Button type="button" onClick={handleSaveBookingRule} disabled={isSavingRule} className="w-full bg-slate-900 hover:bg-slate-950 text-white font-extrabold h-10 rounded-xl border-none">
          {isSavingRule ? "Saving..." : "Save Booking Rule"}
        </Button>
      </div>

      <form onSubmit={handleBlockDates} className="rounded-2xl border border-slate-200 bg-white p-4 space-y-3">
        <div>
          <h4 className="text-xs font-black text-slate-850 uppercase tracking-wider">Block Booking Dates</h4>
          <p className="text-[11px] text-slate-500 font-semibold mt-1">Prevent guests from booking this venue for a custom date range.</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <input type="date" value={blockStartDate} min="2026-07-23" onChange={(e) => setBlockStartDate(e.target.value)} className="h-10 rounded-xl border border-slate-200 px-3 text-sm font-semibold text-slate-800" required />
          <input type="date" value={blockEndDate} min={blockStartDate || "2026-07-23"} onChange={(e) => setBlockEndDate(e.target.value)} className="h-10 rounded-xl border border-slate-200 px-3 text-sm font-semibold text-slate-800" required />
        </div>
        <input type="text" value={blockReason} onChange={(e) => setBlockReason(e.target.value)} placeholder="Reason (optional)" className="h-10 w-full rounded-xl border border-slate-200 px-3 text-sm font-semibold text-slate-800" />
        <Button type="submit" disabled={isBlockingDates} className="w-full bg-rose-600 hover:bg-rose-700 text-white font-extrabold h-10 rounded-xl border-none">
          {isBlockingDates ? "Blocking..." : "Block Dates"}
        </Button>
      </form>

      <div className="rounded-2xl border border-slate-200 bg-white p-4 space-y-3">
        <div className="flex items-center justify-between gap-3">
          <div>
            <h4 className="text-xs font-black text-slate-850 uppercase tracking-wider">Pending Booking Requests</h4>
            <p className="text-[11px] text-slate-500 font-semibold mt-1">Requests waiting for your approval before payment.</p>
          </div>
          <span className="text-[10px] font-black uppercase text-slate-400">{venueRequests.length} Pending</span>
        </div>

        {isLoadingRequests ? (
          <div className="text-xs font-semibold text-slate-500">Loading booking requests...</div>
        ) : venueRequests.length === 0 ? (
          <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-3 text-xs font-semibold text-slate-500">
            <Clock3 className="size-4 shrink-0" />
            <span>No booking requests are waiting for approval for this venue.</span>
          </div>
        ) : (
          <div className="space-y-3">
            {venueRequests.map((request) => {
              const requester = request.user?.profile?.name || request.user?.email || "Guest";
              const isBusy = busyRequestId === request.id;
              return (
                <div key={request.id} className="rounded-xl border border-slate-200 p-3 space-y-3">
                  <div className="space-y-1">
                    <div className="flex items-center justify-between gap-3">
                      <span className="text-xs font-black text-slate-900 truncate">{request.eventName || `${venue.name} Booking`}</span>
                      <span className="text-[10px] font-black uppercase text-amber-700 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-full">{request.status}</span>
                    </div>
                    <p className="text-[11px] font-semibold text-slate-500">Guest: {requester}</p>
                    <p className="text-[11px] font-semibold text-slate-500">{formatDateTime(request.eventStart)} to {formatDateTime(request.eventEnd)}</p>
                    <p className="text-[11px] font-semibold text-slate-500">Guests: {request.guestCount} | Amount: {new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(request.totalAmount)}</p>
                    {request.specialRequests && <p className="text-[11px] font-semibold text-slate-500">Note: {request.specialRequests}</p>}
                  </div>
                  <div className="flex items-center gap-2">
                    <Button type="button" onClick={() => handleApproveRequest(request.id)} disabled={isBusy} className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white h-9 rounded-xl border-none text-xs font-extrabold">
                      <Check className="size-3.5 mr-1 stroke-[3]" />
                      {isBusy ? "Working..." : "Approve"}
                    </Button>
                    <Button type="button" onClick={() => handleRejectRequest(request.id)} disabled={isBusy} className="flex-1 bg-transparent hover:bg-red-50 text-red-600 border border-red-200 h-9 rounded-xl text-xs font-extrabold">
                      <X className="size-3.5 mr-1 stroke-[3]" />
                      Reject
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {bookingApprovalRequired && venueRequests.length === 0 && !isLoadingRequests && (
          <div className="flex items-start gap-2 rounded-xl border border-blue-200 bg-blue-50 px-3 py-3 text-xs font-semibold text-blue-700">
            <ShieldCheck className="size-4 shrink-0 mt-0.5" />
            <span>Owner approval mode is enabled. New guest bookings will appear here before payment is allowed.</span>
          </div>
        )}

        {!bookingApprovalRequired && (
          <div className="flex items-start gap-2 rounded-xl border border-rose-200 bg-rose-50 px-3 py-3 text-xs font-semibold text-rose-700">
            <AlertTriangle className="size-4 shrink-0 mt-0.5" />
            <span>Owner approval mode is currently disabled. Guests can move directly to payment when dates are available.</span>
          </div>
        )}
      </div>
    </div>
  );
}
