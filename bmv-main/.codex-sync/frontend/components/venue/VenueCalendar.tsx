"use client";

import React, { useEffect, useMemo, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import VenueSection from "./VenueSection";
import * as venueService from "@/services/venue.service";

interface VenueCalendarProps {
  venueId: string;
  refreshKey?: number;
}

function monthLabel(date: Date) {
  return date.toLocaleString("en-IN", { month: "long", year: "numeric" });
}

export default function VenueCalendar({ venueId, refreshKey = 0 }: VenueCalendarProps) {
  const [currentMonth, setCurrentMonth] = useState(() => {
    const date = new Date();
    date.setDate(1);
    return date;
  });
  const [unavailableDates, setUnavailableDates] = useState<string[]>([]);

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      try {
        const availability = await venueService.getVenueAvailability(venueId);
        if (!cancelled) {
          setUnavailableDates(availability.unavailableDates || []);
        }
      } catch (error) {
        console.error("Failed to load venue availability:", error);
        if (!cancelled) {
          setUnavailableDates([]);
        }
      }
    };

    load();
    return () => {
      cancelled = true;
    };
  }, [venueId, refreshKey]);

  const unavailableSet = useMemo(() => new Set(unavailableDates), [unavailableDates]);
  const offsetDays = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1).getDay();
  const totalDays = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0).getDate();

  return (
    <VenueSection title="Availability Preview" id="availability">
      <div className="bg-white border border-slate-200/60 rounded-3xl p-5 md:p-6 max-w-sm sm:max-w-md select-none">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-black text-slate-800 tracking-tight">{monthLabel(currentMonth)}</h3>
          <div className="flex items-center gap-1">
            <button type="button" onClick={() => setCurrentMonth((prev) => new Date(prev.getFullYear(), prev.getMonth() - 1, 1))} className="p-1 rounded-lg hover:bg-slate-100 text-slate-500 hover:text-slate-900 bg-transparent cursor-pointer">
              <ChevronLeft className="size-4" />
            </button>
            <button type="button" onClick={() => setCurrentMonth((prev) => new Date(prev.getFullYear(), prev.getMonth() + 1, 1))} className="p-1 rounded-lg hover:bg-slate-100 text-slate-500 hover:text-slate-900 bg-transparent cursor-pointer">
              <ChevronRight className="size-4" />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-7 gap-1 text-center text-[10px] font-black text-slate-400 uppercase tracking-wider mb-2">
          <span>Su</span><span>Mo</span><span>Tu</span><span>We</span><span>Th</span><span>Fr</span><span>Sa</span>
        </div>

        <div className="grid grid-cols-7 gap-1 text-center text-xs font-semibold text-slate-700">
          {Array.from({ length: offsetDays }).map((_, idx) => <div key={`offset-${idx}`} className="h-8" />)}
          {Array.from({ length: totalDays }).map((_, idx) => {
            const dayNum = idx + 1;
            const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), dayNum);
            const dateKey = date.toISOString().split("T")[0];
            const isUnavailable = unavailableSet.has(dateKey);
            return (
              <div key={dateKey} className={`h-8 flex items-center justify-center rounded-xl relative ${isUnavailable ? "bg-rose-50 text-rose-500 font-bold border border-rose-100/30 line-through decoration-rose-300" : "hover:bg-slate-100 text-slate-800"}`}>
                <span>{dayNum}</span>
                {isUnavailable && <span className="absolute bottom-1 size-1 rounded-full bg-rose-500" />}
              </div>
            );
          })}
        </div>

        <div className="mt-4 pt-4 border-t border-slate-150/50 flex items-center justify-start gap-4 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
          <div className="flex items-center gap-1.5"><div className="size-3 rounded-md bg-rose-50 border border-rose-100/30 flex items-center justify-center"><span className="size-1 rounded-full bg-rose-500" /></div><span>Unavailable</span></div>
          <div className="flex items-center gap-1.5"><div className="size-3 rounded-md border border-slate-200" /><span>Available</span></div>
        </div>
      </div>
    </VenueSection>
  );
}
