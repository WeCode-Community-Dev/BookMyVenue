"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  formatMonthYear,
  getMonthDays,
  isDateUnavailable,
} from "@/lib/data/public-venue-detail";
import { cn } from "@/lib/utils";

const WEEKDAY_LABELS = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

type AvailabilityCalendarProps = {
  selectedDate: Date;
  viewYear: number;
  viewMonth: number;
  onSelectDate: (date: Date) => void;
  onMonthChange: (year: number, month: number) => void;
};

export function AvailabilityCalendar({
  selectedDate,
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
          <span key={label} className="py-1">{label}</span>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1">
        {days.map((day, index) => {
          if (!day) {
            return <div key={`empty-${index}`} />;
          }

          const unavailable = isDateUnavailable(day);
          const selected = isSameDay(day, selectedDate);

          return (
            <button
              key={day.toISOString()}
              type="button"
              disabled={unavailable}
              onClick={() => onSelectDate(day)}
              className={cn(
                "flex size-9 items-center justify-center rounded-lg text-sm transition-colors mx-auto",
                selected
                  ? "bg-surface-tint text-on-primary font-semibold"
                  : unavailable
                    ? "text-on-surface-variant/40 line-through cursor-not-allowed"
                    : "hover:bg-surface-container-low text-on-surface",
              )}
            >
              {day.getDate()}
            </button>
          );
        })}
      </div>
    </div>
  );
}
