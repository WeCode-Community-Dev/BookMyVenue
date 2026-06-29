"use client";

import React, { useState, useEffect } from "react";
import { 
  Calendar as CalendarIcon, 
  ChevronLeft, 
  ChevronRight, 
  Plus, 
  X, 
  Trash2, 
  Loader2, 
  ShieldAlert, 
  AlertCircle,
  CheckCircle2
} from "lucide-react";
import { apiFetch } from "@/src/lib/api";
import { MyVenue } from "../route";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface BlockedRange {
  id: string;
  venueId: string;
  startDate: string; // 'YYYY-MM-DD'
  endDate: string; // 'YYYY-MM-DD'
  reason: string | null;
}

export default function BlockedDatesCalendar() {
  const [venueId, setVenueId] = useState<string | null>(null);
  const [blockedRanges, setBlockedRanges] = useState<BlockedRange[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  // Calendar display state
  const [currentDate, setCurrentDate] = useState(new Date());
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  // Create Block Modal
  const [showBlockModal, setShowBlockModal] = useState(false);
  const [startDateStr, setStartDateStr] = useState("");
  const [endDateStr, setEndDateStr] = useState("");
  const [blockReason, setBlockReason] = useState("");
  const [blockLoading, setBlockLoading] = useState(false);
  const [blockError, setBlockError] = useState("");

  // View/Delete Block details
  const [selectedBlock, setSelectedBlock] = useState<BlockedRange | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  useEffect(() => {
    loadVenueAndBlocks();
  }, []);

  const loadVenueAndBlocks = async () => {
    setLoading(true);
    setError("");
    try {
      const venue = await MyVenue();
      if (venue && venue.id) {
        setVenueId(venue.id);
        const blocks = await apiFetch<BlockedRange[]>(`/venues/${venue.id}/blocked-dates`);
        setBlockedRanges(blocks);
      } else {
        setError("Could not retrieve your venue details.");
      }
    } catch (err: any) {
      setError(err.message || "Failed to load date blocking details.");
    } finally {
      setLoading(false);
    }
  };

  const loadBlocksOnly = async (vId: string) => {
    try {
      const blocks = await apiFetch<BlockedRange[]>(`/venues/${vId}/blocked-dates`);
      setBlockedRanges(blocks);
    } catch (err: any) {
      setError("Failed to reload blocked dates.");
    }
  };

  // Calendar grid calculations
  const getDaysInMonth = (y: number, m: number) => new Date(y, m + 1, 0).getDate();
  const getFirstDayOfMonth = (y: number, m: number) => new Date(y, m, 1).getDay();

  const daysInMonth = getDaysInMonth(year, month);
  const firstDayIndex = getFirstDayOfMonth(year, month); // 0 = Sunday, 1 = Monday, etc.

  const monthsList = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const handlePrevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const formatDateString = (y: number, m: number, d: number) => {
    const pad = (n: number) => (n < 10 ? `0${n}` : n);
    return `${y}-${pad(m + 1)}-${pad(d)}`;
  };

  // Check if a specific date is blocked and return the block range details
  const getBlockForDate = (dateStr: string): BlockedRange | null => {
    const targetTime = new Date(dateStr).getTime();
    for (const range of blockedRanges) {
      const start = new Date(range.startDate).getTime();
      const end = new Date(range.endDate).getTime();
      if (targetTime >= start && targetTime <= end) {
        return range;
      }
    }
    return null;
  };

  const handleDayClick = (dayNum: number) => {
    const dateStr = formatDateString(year, month, dayNum);
    const existingBlock = getBlockForDate(dateStr);

    if (existingBlock) {
      setSelectedBlock(existingBlock);
    } else {
      setStartDateStr(dateStr);
      setEndDateStr(dateStr);
      setBlockReason("");
      setBlockError("");
      setShowBlockModal(true);
    }
  };

  const handleBlockSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!venueId) return;
    if (!startDateStr || !endDateStr) {
      setBlockError("Start and End dates are required");
      return;
    }

    setBlockLoading(true);
    setBlockError("");

    try {
      await apiFetch(`/venues/${venueId}/block`, {
        method: "POST",
        body: {
          startDate: startDateStr,
          endDate: endDateStr,
          reason: blockReason.trim() || undefined
        }
      });

      setSuccessMsg("Dates blocked successfully!");
      setTimeout(() => setSuccessMsg(""), 3000);
      setShowBlockModal(false);
      await loadBlocksOnly(venueId);
    } catch (err: any) {
      setBlockError(err.message || "Failed to block date range. Conflict exists?");
    } finally {
      setBlockLoading(false);
    }
  };

  const handleDeleteBlock = async () => {
    if (!venueId || !selectedBlock) return;

    setDeleteLoading(true);
    setError("");

    try {
      await apiFetch(`/venues/${venueId}/block/${selectedBlock.id}`, {
        method: "DELETE"
      });

      setSuccessMsg("Dates unblocked successfully!");
      setTimeout(() => setSuccessMsg(""), 3000);
      setSelectedBlock(null);
      await loadBlocksOnly(venueId);
    } catch (err: any) {
      setError(err.message || "Failed to unblock date range.");
    } finally {
      setDeleteLoading(false);
    }
  };

  // Generate days array
  const daysArray = [];
  // Empty spaces for previous month's alignment
  for (let i = 0; i < firstDayIndex; i++) {
    daysArray.push(null);
  }
  // Days of the month
  for (let d = 1; d <= daysInMonth; d++) {
    daysArray.push(d);
  }

  return (
    <div className="space-y-6 max-w-6xl mx-auto font-sans">
      <div>
        <h1 className="font-serif text-2xl md:text-3xl font-bold text-neutral-dark">Blocked Dates</h1>
        <p className="text-xs text-neutral-muted mt-1">Manage dates when your venue is unavailable due to maintenance, private events, or cleaning.</p>
      </div>

      {successMsg && (
        <div className="bg-[#E6F1F1] border border-teal-primary/20 text-[#0D7377] rounded-xl p-4 text-xs flex gap-2 items-center animate-fade-in">
          <CheckCircle2 className="h-5 w-5 shrink-0" />
          <span className="font-bold">{successMsg}</span>
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 rounded-xl p-4 text-xs flex gap-2 items-center">
          <ShieldAlert className="h-5 w-5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {loading ? (
        <div className="h-[50vh] flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-[#0D7377]" />
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
          {/* Calendar View Card */}
          <Card className="lg:col-span-2 border border-[#E2E2DE] shadow-xs bg-white rounded-2xl overflow-hidden">
            {/* Header controls */}
            <div className="px-6 py-4 border-b border-[#E2E2DE] flex justify-between items-center bg-[#FAFAF8]">
              <h3 className="font-serif font-bold text-base text-neutral-dark flex items-center gap-2">
                <CalendarIcon className="h-4.5 w-4.5 text-[#0D7377]" />
                <span>{monthsList[month]} {year}</span>
              </h3>
              <div className="flex gap-1.5">
                <button
                  onClick={handlePrevMonth}
                  className="h-8 w-8 border border-input bg-white hover:bg-neutral-light rounded-lg flex items-center justify-center transition-colors"
                >
                  <ChevronLeft className="h-4 w-4 text-neutral-muted" />
                </button>
                <button
                  onClick={handleNextMonth}
                  className="h-8 w-8 border border-input bg-white hover:bg-neutral-light rounded-lg flex items-center justify-center transition-colors"
                >
                  <ChevronRight className="h-4 w-4 text-neutral-muted" />
                </button>
              </div>
            </div>

            <CardContent className="p-6">
              {/* Day headers */}
              <div className="grid grid-cols-7 gap-2 text-center text-xs font-bold text-neutral-muted mb-4 uppercase tracking-wider">
                <span>Sun</span><span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span>
              </div>

              {/* Days grid */}
              <div className="grid grid-cols-7 gap-2">
                {daysArray.map((dayNum, idx) => {
                  if (dayNum === null) {
                    return <div key={`empty-${idx}`} className="h-14 bg-neutral-light/10 rounded-xl" />;
                  }

                  const dateStr = formatDateString(year, month, dayNum);
                  const block = getBlockForDate(dateStr);
                  const isBlocked = !!block;
                  
                  // Highlight today
                  const isToday = new Date().toDateString() === new Date(dateStr).toDateString();

                  return (
                    <button
                      key={`day-${dayNum}`}
                      onClick={() => handleDayClick(dayNum)}
                      className={`h-14 rounded-xl flex flex-col items-center justify-between p-2 cursor-pointer transition-all border ${
                        isBlocked
                          ? "bg-red-50 text-red-600 border-red-200 hover:bg-red-100/70"
                          : isToday
                          ? "bg-[#E6F1F1] text-[#0D7377] border-teal-primary/30 hover:bg-teal-light/50"
                          : "bg-white hover:bg-[#F0F0EC] border-transparent"
                      }`}
                    >
                      <span className="font-bold text-xs self-start">{dayNum}</span>
                      {isBlocked && (
                        <span className="text-[8px] bg-red-200/50 px-1 py-0.5 rounded-md truncate max-w-full font-bold">
                          Blocked
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Legend */}
              <div className="flex gap-4 justify-start text-[10px] font-bold text-neutral-muted uppercase pt-6 mt-6 border-t border-[#E2E2DE]">
                <span className="flex items-center gap-1"><span className="h-2.5 w-2.5 rounded-md bg-red-100 border border-red-200 block" /> Blocked Dates</span>
                <span className="flex items-center gap-1"><span className="h-2.5 w-2.5 rounded-md bg-[#E6F1F1] border border-teal-primary/20 block" /> Today</span>
                <span className="flex items-center gap-1"><span className="h-2.5 w-2.5 rounded-md bg-white border border-[#E2E2DE] block" /> Available</span>
              </div>
            </CardContent>
          </Card>

          {/* Sidebar Info Card */}
          <div className="space-y-6">
            {/* Block Detail Card */}
            {selectedBlock ? (
              <Card className="border border-[#E2E2DE] shadow-xs bg-white rounded-2xl p-5 space-y-4 animate-fade-in">
                <div className="flex justify-between items-center pb-2 border-b border-[#E2E2DE]">
                  <h4 className="font-serif font-bold text-sm text-[#1A1A19]">Block Details</h4>
                  <button 
                    onClick={() => setSelectedBlock(null)}
                    className="text-neutral-muted hover:text-neutral-dark text-xs font-bold"
                  >
                    Clear selection
                  </button>
                </div>
                <div className="space-y-3.5 text-xs">
                  <div>
                    <span className="text-neutral-muted uppercase font-bold text-[9px] block mb-1">Start Date</span>
                    <span className="font-semibold text-neutral-dark">{selectedBlock.startDate}</span>
                  </div>
                  <div>
                    <span className="text-neutral-muted uppercase font-bold text-[9px] block mb-1">End Date</span>
                    <span className="font-semibold text-neutral-dark">{selectedBlock.endDate}</span>
                  </div>
                  <div>
                    <span className="text-neutral-muted uppercase font-bold text-[9px] block mb-1">Reason</span>
                    <span className="font-semibold text-neutral-dark">{selectedBlock.reason || "No reason specified."}</span>
                  </div>
                  <div className="pt-2 border-t border-[#E2E2DE]">
                    <Button
                      onClick={handleDeleteBlock}
                      disabled={deleteLoading}
                      className="w-full bg-red-600 text-white hover:bg-red-700 font-bold rounded-xl h-10 flex items-center justify-center gap-2"
                    >
                      {deleteLoading ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin" />
                          Releasing date...
                        </>
                      ) : (
                        <>
                          <Trash2 className="h-4 w-4" />
                          Unblock Dates
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </Card>
            ) : (
              <Card className="border border-[#E2E2DE] shadow-xs bg-white rounded-2xl p-5 text-center space-y-4">
                <div className="h-10 w-10 bg-[#E6F1F1] text-[#0D7377] rounded-xl flex items-center justify-center mx-auto">
                  <CalendarIcon className="h-5 w-5" />
                </div>
                <div className="space-y-1">
                  <h4 className="font-serif font-bold text-sm text-[#1A1A19]">Manage Availability</h4>
                  <p className="text-xs text-[#70706e] leading-relaxed">
                    Click on any active calendar day to quickly block date ranges, or click on a red "Blocked" slot to view and delete it.
                  </p>
                </div>
              </Card>
            )}
          </div>
        </div>
      )}

      {/* BLOCK MODAL DIALOG */}
      {showBlockModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in">
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white border border-[#E2E2DE] rounded-3xl w-full max-w-md shadow-2xl overflow-hidden animate-scale-in"
          >
            <div className="p-6 border-b border-[#E2E2DE] flex justify-between items-center">
              <h3 className="font-serif font-bold text-lg text-neutral-dark">Block Dates</h3>
              <button
                onClick={() => setShowBlockModal(false)}
                disabled={blockLoading}
                className="h-8 w-8 text-neutral-muted hover:text-neutral-dark hover:bg-neutral-light rounded-full flex items-center justify-center transition-colors focus:outline-none"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleBlockSubmit}>
              <div className="p-6 space-y-4">
                {blockError && (
                  <div className="bg-red-50 border border-red-200 text-red-600 rounded-xl p-3 text-xs flex gap-2 items-start">
                    <ShieldAlert className="h-4.5 w-4.5 shrink-0 mt-0.5" />
                    <span>{blockError}</span>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-neutral-muted uppercase">Start Date</label>
                    <Input
                      type="date"
                      required
                      value={startDateStr}
                      onChange={(e) => setStartDateStr(e.target.value)}
                      className="border-input h-10 rounded-xl bg-white"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-neutral-muted uppercase">End Date</label>
                    <Input
                      type="date"
                      required
                      value={endDateStr}
                      onChange={(e) => setEndDateStr(e.target.value)}
                      className="border-input h-10 rounded-xl bg-white"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-neutral-muted uppercase">Reason (Optional)</label>
                  <Input
                    type="text"
                    value={blockReason}
                    onChange={(e) => setBlockReason(e.target.value)}
                    placeholder="e.g. Maintenance, Private Wedding Booking"
                    className="border-input h-10 rounded-xl bg-white"
                  />
                </div>
              </div>

              <div className="p-6 border-t border-[#E2E2DE] bg-[#FAFAF8] flex justify-end gap-3">
                <Button
                  type="button"
                  onClick={() => setShowBlockModal(false)}
                  disabled={blockLoading}
                  variant="outline"
                  className="border-input hover:bg-neutral-light font-bold rounded-xl px-5 py-2.5 h-auto text-sm"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={blockLoading}
                  className="bg-[#0D7377] text-white hover:bg-[#0a5b5e] font-bold rounded-xl px-5 py-2.5 h-auto text-sm flex items-center gap-1.5 shadow-md shadow-[#0D7377]/10 cursor-pointer"
                >
                  {blockLoading ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Blocking...
                    </>
                  ) : (
                    "Confirm Block"
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
