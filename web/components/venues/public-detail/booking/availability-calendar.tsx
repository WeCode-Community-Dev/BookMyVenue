"use client";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  formatMonthYear,
  getCalendarDayAvailability,
  getMonthDays,
} from "@/lib/data/public-venue-detail";
import { cn } from "@/lib/utils";
import {
  SpaceBlockedPeriodResponse,
  SpaceOperatingHourResponse,

} from "@/services/venueServices";
const WEEKDAY_LABELS = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];
type AvailabilityCalendarProps = {
  selectedDate: Date;
  operatingHours: SpaceOperatingHourResponse[];
  blockedPeriods: SpaceBlockedPeriodResponse[];
  bookedPeriods: SpaceBlockedPeriodResponse[];
  viewYear: number;
  viewMonth: number;
  onSelectDate: (date: Date) => void;
  onMonthChange: (year: number, month: number) => void;

};
export function AvailabilityCalendar({
  selectedDate,
  operatingHours,
  blockedPeriods,
  bookedPeriods,
  viewYear,
  viewMonth,
  onSelectDate,
  onMonthChange,

}: AvailabilityCalendarProps) {
  const days = getMonthDays(viewYear, viewMonth);
  function goToPrevMonth() {
    const d = new Date(viewYear, viewMonth - 1, 1);
    onMonthChange(d.getFullYear(), d.getMonth());

  }
  function goToNextMonth() {
    const d = new Date(viewYear, viewMonth + 1, 1);
    onMonthChange(d.getFullYear(), d.getMonth());

  }
  function isSameDay(a: Date, b: Date) {
    return (
      a.getFullYear() === b.getFullYear() &&
      a.getMonth() === b.getMonth() &&
      a.getDate() === b.getDate()
    );

  }
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h3 className="text-base font-semibold text-on-surface">
          {formatMonthYear(viewYear, viewMonth)}
        </h3>
        <div className="flex items-center gap-1">
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="size-8"
            onClick={goToPrevMonth}
            aria-label="Previous month"
          >
            <ChevronLeft className="size-4" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="size-8"
            onClick={goToNextMonth}
            aria-label="Next month"
          >
            <ChevronRight className="size-4" />
          </Button>
        </div>
      </div>
      <div className="grid grid-cols-7 gap-1 text-center text-xs font-medium text-on-surface-variant">
        {WEEKDAY_LABELS.map((label) => (
          <span key={label} className="py-1">
            {label}
          </span>

        ))}
      </div>
      <div className="grid grid-cols-7 gap-1">
        {days.map((day, index) => {
          if (!day) {
            return <div key={`empty-${index}`} />;
          }
          const availability = getCalendarDayAvailability(
            day,
            operatingHours,
            [...blockedPeriods, ...bookedPeriods],
            
          );
          const unavailable = availability === "unavailable";
          const partial = availability === "partial";
          const selected = isSameDay(day, selectedDate);
          return (
            <button
              key={day.toISOString()}
              type="button"
              disabled={unavailable}
              onClick={() => onSelectDate(day)}
              className={cn(
                "relative flex size-9 items-center justify-center rounded-lg text-sm transition-colors mx-auto",
                selected
                  ? "border-2 border-primary font-semibold" : "",
                unavailable ?
                  "text-on-surface-variant/80 bg-on-surface-variant/30 cursor-not-allowed"
                  : partial
                    ? "bg-amber-200 text-amber-900 ring-1 ring-amber-200"
                    : "bg-green-200 hover:bg-surface-container-low text-on-surface",

              )}
            >
              {day.getDate()}
              
            </button>
          );
        })}
      </div>
      <div className="flex flex-wrap items-center gap-4 pt-2 text-xs text-on-surface-variant">
        <span className="flex items-center gap-1.5">
          <span className="size-2.5 rounded-full bg-green-400 ring-1 ring-outline-variant/40" />
          Available
        </span>
        <span className="flex items-center gap-1.5">
          <span className="size-2.5 rounded-full bg-amber-400" />
          Partially available
        </span>
        <span className="flex items-center gap-1.5">
          <span className="size-2.5 rounded-full bg-on-surface-variant/30 line-through" />
          Unavailable
        </span>
      </div>
    </div>
  );
}
