"use client";

import React, { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import VenueSection from "./VenueSection";

export default function VenueCalendar() {
  const [currentMonth, setCurrentMonth] = useState("July 2026");

  // Mock booked dates for July 2026
  const bookedDatesJuly = [4, 5, 11, 12, 18, 19, 25, 26, 28, 29];
  // Mock booked dates for August 2026
  const bookedDatesAugust = [1, 2, 8, 9, 15, 16, 22, 23, 29, 30];

  const isJuly = currentMonth === "July 2026";
  const bookedDates = isJuly ? bookedDatesJuly : bookedDatesAugust;
  
  // Starting day offsets: July starts on Wednesday (3), August starts on Saturday (6)
  const offsetDays = isJuly ? 3 : 6;
  const totalDays = isJuly ? 31 : 31;

  const handleNextMonth = () => {
    setCurrentMonth(isJuly ? "August 2026" : "July 2026");
  };

  const handlePrevMonth = () => {
    setCurrentMonth(isJuly ? "August 2026" : "July 2026");
  };

  return (
    <VenueSection title="Availability Preview" id="availability">
      <div className="bg-white border border-slate-200/60 rounded-3xl p-5 md:p-6 max-w-sm sm:max-w-md select-none">
        
        {/* Calendar Navigation Header */}
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-black text-slate-800 tracking-tight">
            {currentMonth}
          </h3>
          <div className="flex items-center gap-1">
            <button
              onClick={handlePrevMonth}
              type="button"
              className="p-1 rounded-lg hover:bg-slate-100 text-slate-500 hover:text-slate-900 border-0 bg-transparent cursor-pointer"
            >
              <ChevronLeft className="size-4" />
            </button>
            <button
              onClick={handleNextMonth}
              type="button"
              className="p-1 rounded-lg hover:bg-slate-100 text-slate-500 hover:text-slate-900 border-0 bg-transparent cursor-pointer"
            >
              <ChevronRight className="size-4" />
            </button>
          </div>
        </div>

        {/* Days of Week Header */}
        <div className="grid grid-cols-7 gap-1 text-center text-[10px] font-black text-slate-400 uppercase tracking-wider mb-2">
          <span>Su</span>
          <span>Mo</span>
          <span>Tu</span>
          <span>We</span>
          <span>Th</span>
          <span>Fr</span>
          <span>Sa</span>
        </div>

        {/* Calendar Grid */}
        <div className="grid grid-cols-7 gap-1 text-center text-xs font-semibold text-slate-700">
          
          {/* Empty Offsets */}
          {Array.from({ length: offsetDays }).map((_, idx) => (
            <div key={`offset-${idx}`} className="h-8" />
          ))}

          {/* Days Numbers */}
          {Array.from({ length: totalDays }).map((_, idx) => {
            const dayNum = idx + 1;
            const isBooked = bookedDates.includes(dayNum);

            return (
              <div
                key={`day-${dayNum}`}
                className={`h-8 flex items-center justify-center rounded-xl relative ${
                  isBooked
                    ? "bg-rose-50 text-rose-500 font-bold border border-rose-100/30 line-through decoration-rose-300"
                    : "hover:bg-slate-100 text-slate-800"
                }`}
              >
                <span>{dayNum}</span>
                {isBooked && (
                  <span className="absolute bottom-1 size-1 rounded-full bg-rose-500" />
                )}
              </div>
            );
          })}
        </div>

        {/* Calendar Legend */}
        <div className="mt-4 pt-4 border-t border-slate-150/50 flex items-center justify-start gap-4 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
          <div className="flex items-center gap-1.5">
            <div className="size-3 rounded-md bg-rose-50 border border-rose-100/30 flex items-center justify-center">
              <span className="size-1 rounded-full bg-rose-500" />
            </div>
            <span>Booked / Reserved</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="size-3 rounded-md border border-slate-200" />
            <span>Available</span>
          </div>
        </div>

      </div>
    </VenueSection>
  );
}
