"use client";

import { useEffect, useMemo, useState } from "react";
import { CalendarCheck, Check } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { TimeRangeSelection } from "@/lib/data/public-venue-detail";
import {
  buildTimelineSegments,
  computeRangeHours,
  formatDuration,
  getAllValidStartTimes,
  getAvailableIntervals,
  getBookedIntervalsForDay,
  getValidEndTimes,
  isValidTimeRange,
  resolveDaySchedule,
  type TimeInterval,
  type TimelineSegment,
} from "@/lib/booking/time-range-logic";
import { cn } from "@/lib/utils";
import type {
  SpaceBlockedPeriodResponse,
  SpaceOperatingHourResponse,
} from "@/services/venueServices";

type TimeRangePickerProps = {
  selectedDate: Date;
  operatingHours: SpaceOperatingHourResponse[];
  blockedPeriods: SpaceBlockedPeriodResponse[];
  bookedPeriods?: SpaceBlockedPeriodResponse[];
  selectedRange?: TimeRangeSelection | null;
  onTimeRangeChange?: (range: TimeRangeSelection | null) => void;
};

const SEGMENT_STYLES: Record<TimelineSegment["type"], string> = {
  available: "bg-green-400/80 hover:bg-green-400",
  blocked: "bg-red-300/90 hover:bg-red-400",
  selected: "bg-blue-500 hover:bg-blue-600",
  booked: "bg-slate-400/90 hover:bg-slate-500",
};

const LEGEND_ITEMS: { type: TimelineSegment["type"]; label: string; color: string }[] = [
  { type: "available", label: "Available", color: "bg-green-400" },
  { type: "blocked", label: "Blocked", color: "bg-red-300" },
  { type: "selected", label: "Selected", color: "bg-blue-500" },
  { type: "booked", label: "Booked", color: "bg-gray-400" },
];

function formatIntervalLabel(interval: TimeInterval): string {
  return `${interval.start} – ${interval.end}`;
}

function TimelineBar({ segments }: { segments: TimelineSegment[] }) {
  const totalMinutes = segments.reduce(
    (sum, segment) => sum + segment.durationMinutes,
    0,
  );

  return (
    <div className="flex h-3 w-full overflow-hidden rounded-full bg-surface-container-low shadow-inner transition-all duration-300">
      {segments.map((segment) => {
        const widthPercent =
          totalMinutes > 0
            ? (segment.durationMinutes / totalMinutes) * 100
            : 0;
        const durationHours = segment.durationMinutes / 60;

        return (
          <div
            key={`${segment.type}-${segment.start}-${segment.end}`}
            className={cn(
              "h-full min-w-0 transition-all duration-300 ease-in-out first:rounded-l-full last:rounded-r-full",
              SEGMENT_STYLES[segment.type],
            )}
            style={{ width: `${widthPercent}%` }}
            title={`${segment.start} – ${segment.end}\nDuration: ${formatDuration(durationHours)}`}
            aria-label={`${segment.type} ${segment.start} to ${segment.end}, ${formatDuration(durationHours)}`}
          />
        );
      })}
    </div>
  );
}

function TimelineLabels({ open, close }: { open: string; close: string }) {
  return (
    <div className="flex justify-between text-xs font-medium text-on-surface-variant">
      <span>{open}</span>
      <span>{close}</span>
    </div>
  );
}

export function TimeRangePicker({
  selectedDate,
  operatingHours,
  blockedPeriods,
  bookedPeriods = [],
  selectedRange = null,
  onTimeRangeChange,
}: TimeRangePickerProps) {
  const [startTime, setStartTime] = useState<string>("");
  const [endTime, setEndTime] = useState<string>("");
  const [validationError, setValidationError] = useState<string | null>(null);
  const [confirmMessage, setConfirmMessage] = useState<string | null>(null);
  const [currentSelection, setCurrentSelection] = useState<TimeInterval | null>(null);

  const schedule = useMemo(
    () => resolveDaySchedule(selectedDate, operatingHours, blockedPeriods),
    [selectedDate, operatingHours, blockedPeriods],
  );

  const bookedRanges = useMemo(
    () => getBookedIntervalsForDay(selectedDate, bookedPeriods),
    [selectedDate, bookedPeriods],
  );


  const availableIntervals = useMemo(
    () => getAvailableIntervals(schedule, bookedRanges),
    [schedule, bookedRanges],
  );


  const startOptions = useMemo(
    () => getAllValidStartTimes(availableIntervals),
    [availableIntervals],
  );


  const endOptions = useMemo(() => {
    if (!startTime) return [];
    return getValidEndTimes(startTime, availableIntervals);
  }, [startTime, availableIntervals]);


  useEffect(() => {
    if (startTime && endTime) {
      setCurrentSelection({ start: startTime, end: endTime });
    } else {
      setCurrentSelection(null);
    }
  }, [startTime, endTime]);


  const timelineSegments = useMemo(
    () =>
      buildTimelineSegments(
        schedule,
        availableIntervals,
        currentSelection,
        bookedRanges,
      ),
    [schedule, availableIntervals, currentSelection, bookedRanges],
  );

  const selectionHours = currentSelection
    ? computeRangeHours(currentSelection.start, currentSelection.end)
    : 0;

  const isSelectionValid =
    currentSelection !== null &&
    isValidTimeRange(
      currentSelection.start,
      currentSelection.end,
      availableIntervals,
    );

  // Reset local selection when the selected date changes
  useEffect(() => {
    setStartTime("");
    setEndTime("");
    setValidationError(null);
    setConfirmMessage(null);
    onTimeRangeChange?.(null);
    // eslint-disable-next-line react-hooks/exhaustive-deps -- only reset when date changes
  }, [selectedDate]);

  useEffect(() => {
    if (selectedRange !== null) {
      return;
    }

    setStartTime("");
    setEndTime("");
    setValidationError(null);
    setConfirmMessage(null);
  }, [selectedRange]);

  // Notify parent when a valid range is chosen (live preview for summary)
  useEffect(() => {
    if (isSelectionValid && currentSelection) {
      onTimeRangeChange?.({
        start: currentSelection.start,
        end: currentSelection.end,
        hours: selectionHours,
      });
      setValidationError(null);
    } else if (startTime && endTime) {
      onTimeRangeChange?.(null);
      setValidationError(
        "Selected range is invalid. Choose times within an available slot.",
      );
    } else {
      onTimeRangeChange?.(null);
      if (!startTime && !endTime) {
        setValidationError(null);
      }
    }
  }, [
    isSelectionValid,
    currentSelection,
    selectionHours,
    startTime,
    endTime,
  ]);

  function handleStartChange(value: string) {
    setStartTime(value);
    setEndTime("");
    setConfirmMessage(null);
  }

  function handleEndChange(value: string) {
    setEndTime(value);
    setConfirmMessage(null);
  }

  function handleSlotChipClick(interval: TimeInterval) {
    setStartTime(interval.start);
    setEndTime(interval.end);
    setConfirmMessage(null);
  }

  return (
    <div className="flex flex-col gap-6 rounded-xl border border-outline-variant/40 bg-surface p-5 shadow-elevation-2">
      {/* Working hours header */}
      <div className="flex flex-col gap-1">
        <h3 className="text-sm font-semibold text-on-surface">Working Hours</h3>
        <div className="flex items-center gap-2 text-sm text-on-surface-variant">
          <span className="font-medium text-on-surface">{schedule.open}</span>
          <span className="h-px flex-1 bg-outline-variant/60" aria-hidden />
          <span className="font-medium text-on-surface">{schedule.close}</span>
        </div>
      </div>

      {/* Timeline */}
      <div className="flex flex-col gap-3">
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
          {LEGEND_ITEMS.map((item) => (
            <span
              key={item.type}
              className="flex items-center gap-1.5 text-xs text-on-surface-variant"
            >
              <span
                className={cn("size-2.5 rounded-full", item.color)}
                aria-hidden
              />
              {item.label}
            </span>
          ))}
        </div>

        <TimelineBar segments={timelineSegments} />
        <TimelineLabels open={schedule.open} close={schedule.close} />
      </div>

      <div className="h-px bg-outline-variant/40" />

      {/* Available slots */}
      <div className="flex flex-col gap-3">
        <h4 className="text-sm font-semibold text-on-surface">Available Slots</h4>
        {availableIntervals.length === 0 ? (
          <p className="text-sm text-on-surface-variant">
            No available time slots for this date.
          </p>
        ) : (
          <div className="flex flex-wrap gap-2">
            {availableIntervals.map((interval) => (
              <button
                key={`${interval.start}-${interval.end}`}
                type="button"
                onClick={() => handleSlotChipClick(interval)}
                className={cn(
                  "inline-flex items-center gap-1.5 rounded-full border border-green-500/40 bg-green-50 px-3 py-1.5 text-sm font-medium text-green-800 transition-colors hover:border-green-500 hover:bg-green-100",
                  currentSelection?.start === interval.start &&
                    currentSelection?.end === interval.end &&
                    "ring-2 ring-green-500/50",
                )}
                aria-label={`Select available slot ${formatIntervalLabel(interval)}`}
              >
                <Check className="size-3.5 shrink-0" aria-hidden />
                {formatIntervalLabel(interval)}
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="h-px bg-outline-variant/40" />

      {/* Start / End selects */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="flex flex-col gap-1.5">
          <label
            htmlFor="start-time-select"
            className="text-xs font-semibold uppercase tracking-wide text-on-surface-variant"
          >
            Start Time
          </label>
          <Select
            value={startTime || undefined}
            onValueChange={handleStartChange}
            disabled={startOptions.length === 0}
          >
            <SelectTrigger
              id="start-time-select"
              className="h-10 w-full bg-surface-container-low"
              aria-label="Start time"
            >
              <SelectValue placeholder="Select" />
            </SelectTrigger>
            <SelectContent>
              {startOptions.map((time) => (
                <SelectItem key={time} value={time}>
                  {time}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex flex-col gap-1.5">
          <label
            htmlFor="end-time-select"
            className="text-xs font-semibold uppercase tracking-wide text-on-surface-variant"
          >
            End Time
          </label>
          <Select
            value={endTime || undefined}
            onValueChange={handleEndChange}
            disabled={!startTime || endOptions.length === 0}
          >
            <SelectTrigger
              id="end-time-select"
              className="h-10 w-full bg-surface-container-low"
              aria-label="End time"
            >
              <SelectValue placeholder="Select" />
            </SelectTrigger>
            <SelectContent>
              {endOptions.map((time) => (
                <SelectItem key={time} value={time}>
                  {time}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Selection summary */}
      {isSelectionValid && currentSelection && (
        <div
          className="flex items-center gap-3 rounded-lg bg-blue-50 px-4 py-3 text-sm text-blue-800 transition-all duration-300"
          role="status"
        >
          <CalendarCheck className="size-5 shrink-0 text-blue-600" aria-hidden />
          <div className="flex flex-col gap-0.5">
            <span className="font-semibold">
              Selected: {currentSelection.start} → {currentSelection.end}
            </span>
            <span className="text-blue-700/80">
              Duration: {formatDuration(selectionHours)}
            </span>
          </div>
        </div>
      )}

      {/* Validation / success messages */}
      <div aria-live="polite" className="min-h-5">
        {validationError && (
          <p className="text-sm text-red-600" role="alert">
            {validationError}
          </p>
        )}
        {confirmMessage && !validationError && (
          <p className="text-sm font-medium text-green-700">{confirmMessage}</p>
        )}
      </div>
    </div>
  );
}
