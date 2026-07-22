import {
  DEFAULT_OPERATING_HOURS,
  parseTimeToMinutes,
} from "@/lib/data/space-manage";
import type {
  SpaceBlockedPeriodResponse,
  SpaceOperatingHourResponse,
} from "@/services/venueServices";

/** A time interval expressed as HH:mm strings. */
export type TimeInterval = {
  start: string;
  end: string;
};

/** Minute-based interval used internally for calculations. */
export type MinuteInterval = {
  start: number;
  end: number;
};

export type TimelineSegmentType = "available" | "blocked" | "selected" | "booked";

export type TimelineSegment = {
  type: TimelineSegmentType;
  start: string;
  end: string;
  durationMinutes: number;
};

export type DaySchedule = {
  open: string;
  close: string;
  openMinutes: number;
  closeMinutes: number;
  /** Permanent blocks (API + mock) — not reduced by demo bookings. */
  blockedIntervals: TimeInterval[];
  /** Permanent blocks in minutes within the working window. */
  blockedMinutes: MinuteInterval[];
};

export const SLOT_STEP_MINUTES = 30;

const MOCK_BLOCKED: TimeInterval = { start: "11:00", end: "13:00" };

/** Convert minutes since midnight to HH:mm. */
export function formatTime(minutes: number): string {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return `${String(hours).padStart(2, "0")}:${String(mins).padStart(2, "0")}`;
}

/** Duration between two HH:mm strings in minutes. */
export function minutesBetween(start: string, end: string): number {
  return parseTimeToMinutes(end) - parseTimeToMinutes(start);
}

/** Human-readable duration label (e.g. "2 hours", "30 minutes"). */
export function formatDuration(hours: number): string {
  if (hours === 1) return "1 hour";
  if (Number.isInteger(hours)) return `${hours} hours`;
  const totalMinutes = Math.round(hours * 60);
  if (totalMinutes < 60) return `${totalMinutes} minutes`;
  const h = Math.floor(totalMinutes / 60);
  const m = totalMinutes % 60;
  if (m === 0) return h === 1 ? "1 hour" : `${h} hours`;
  return `${h}h ${m}m`;
}

function startOfDay(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate(), 0, 0, 0, 0);
}

function endOfDay(date: Date): Date {
  return new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate(),
    23,
    59,
    59,
    999,
  );
}

function toMinutesOnDay(day: Date, instant: Date): number {
  const dayStart = startOfDay(day);
  const dayEnd = endOfDay(day);

  if (instant <= dayStart) return 0;
  if (instant >= dayEnd) return 24 * 60;

  return instant.getHours() * 60 + instant.getMinutes();
}

function mergeMinuteIntervals(intervals: MinuteInterval[]): MinuteInterval[] {
  if (intervals.length === 0) return [];

  const sorted = [...intervals].sort((a, b) => a.start - b.start);
  const merged = [{ ...sorted[0] }];

  for (let i = 1; i < sorted.length; i++) {
    const current = sorted[i];
    const last = merged[merged.length - 1];

    if (current.start <= last.end) {
      last.end = Math.max(last.end, current.end);
    } else {
      merged.push({ ...current });
    }
  }

  return merged;
}

function minuteIntervalToTime(interval: MinuteInterval): TimeInterval {
  return {
    start: formatTime(interval.start),
    end: formatTime(interval.end),
  };
}

function subtractIntervalsFromWindow(
  window: MinuteInterval,
  toRemove: MinuteInterval[],
): MinuteInterval[] {
  if (toRemove.length === 0) return [window];

  const sorted = [...toRemove]
    .map((interval) => ({
      start: Math.max(interval.start, window.start),
      end: Math.min(interval.end, window.end),
    }))
    .filter((interval) => interval.end > interval.start)
    .sort((a, b) => a.start - b.start);

  const result: MinuteInterval[] = [];
  let cursor = window.start;

  for (const block of sorted) {
    if (block.start > cursor) {
      result.push({ start: cursor, end: block.start });
    }
    cursor = Math.max(cursor, block.end);
  }

  if (cursor < window.end) {
    result.push({ start: cursor, end: window.end });
  }

  return result;
}

function getOperatingWindow(
  date: Date,
  operatingHours: SpaceOperatingHourResponse[],
): { open: number; close: number } | null {
  const weekday = date.getDay();
  const entry = operatingHours.find((hour) => hour.weekday === weekday);

  if (entry?.isClosed) return null;

  const openTime = entry?.openTime ?? DEFAULT_OPERATING_HOURS.openTime;
  const closeTime = entry?.closeTime ?? DEFAULT_OPERATING_HOURS.closeTime;
  const open = parseTimeToMinutes(openTime);
  const close = parseTimeToMinutes(closeTime);

  if (close <= open) return null;

  return { open, close };
}

function getBlockedIntervalsInWindow(
  date: Date,
  blockedPeriods: SpaceBlockedPeriodResponse[],
  window: { open: number; close: number },
): MinuteInterval[] {
  const dayStart = startOfDay(date);
  const dayEnd = endOfDay(date);
  const intervals: MinuteInterval[] = [];

  for (const period of blockedPeriods) {
    const blockStart = new Date(period.startAt);
    const blockEnd = new Date(period.endAt);

    if (blockEnd < dayStart || blockStart > dayEnd) continue;

    const startMin = Math.max(toMinutesOnDay(date, blockStart), window.open);
    const endMin = Math.min(toMinutesOnDay(date, blockEnd), window.close);

    if (endMin > startMin) {
      intervals.push({ start: startMin, end: endMin });
    }
  }

  return mergeMinuteIntervals(intervals);
}

export function getBookedIntervalsForDay(
  date: Date,
  periods: SpaceBlockedPeriodResponse[],
): TimeInterval[] {
  const dayStart = startOfDay(date);
  const dayEnd = endOfDay(date);
  const intervals: MinuteInterval[] = [];

  for (const period of periods) {
    const periodStart = new Date(period.startAt);
    const periodEnd = new Date(period.endAt);

    if (periodEnd < dayStart || periodStart > dayEnd) continue;

    const startMin = toMinutesOnDay(date, periodStart);
    const endMin = toMinutesOnDay(date, periodEnd);

    if (endMin > startMin) {
      intervals.push({ start: startMin, end: endMin });
    }
  }

  return mergeMinuteIntervals(intervals).map((interval) => ({
    start: formatTime(interval.start),
    end: formatTime(interval.end),
  }));
}

/**
 * Resolve working hours and blocked periods for a day.
 * Falls back to mock data when API arrays are empty.
 */
export function resolveDaySchedule(
  selectedDate: Date,
  operatingHours: SpaceOperatingHourResponse[],
  blockedPeriods: SpaceBlockedPeriodResponse[],
): DaySchedule {
  const useMockHours = operatingHours.length === 0;
  const openMinutes = useMockHours
    ? parseTimeToMinutes(DEFAULT_OPERATING_HOURS.openTime)
    : (getOperatingWindow(selectedDate, operatingHours)?.open ??
      parseTimeToMinutes(DEFAULT_OPERATING_HOURS.openTime));
  const closeMinutes = useMockHours
    ? parseTimeToMinutes(DEFAULT_OPERATING_HOURS.closeTime)
    : (getOperatingWindow(selectedDate, operatingHours)?.close ??
      parseTimeToMinutes(DEFAULT_OPERATING_HOURS.closeTime));

  const window = { open: openMinutes, close: closeMinutes };

  let blockedMinutes: MinuteInterval[];

  if (blockedPeriods.length === 0) {
    // Demo fallback: lunch break block
    blockedMinutes = [
      {
        start: parseTimeToMinutes(MOCK_BLOCKED.start),
        end: parseTimeToMinutes(MOCK_BLOCKED.end),
      },
    ];
  } else if (useMockHours) {
    blockedMinutes = getBlockedIntervalsInWindow(
      selectedDate,
      blockedPeriods,
      window,
    );
  } else {
    blockedMinutes = getBlockedIntervalsInWindow(
      selectedDate,
      blockedPeriods,
      window,
    );
  }

  blockedMinutes = mergeMinuteIntervals(blockedMinutes);

  return {
    open: formatTime(openMinutes),
    close: formatTime(closeMinutes),
    openMinutes,
    closeMinutes,
    blockedIntervals: blockedMinutes.map(minuteIntervalToTime),
    blockedMinutes,
  };
}

/**
 * Compute free intervals within working hours after subtracting
 * permanent blocks and locally confirmed demo bookings.
 */
export function getAvailableIntervals(
  schedule: DaySchedule,
  bookedRanges: TimeInterval[] = [],
): TimeInterval[] {
  const workingWindow: MinuteInterval = {
    start: schedule.openMinutes,
    end: schedule.closeMinutes,
  };

  const bookedMinutes = bookedRanges.map((range) => ({
    start: parseTimeToMinutes(range.start),
    end: parseTimeToMinutes(range.end),
  }));

  const obstacles = mergeMinuteIntervals([
    ...schedule.blockedMinutes,
    ...bookedMinutes,
  ]);

  return subtractIntervalsFromWindow(workingWindow, obstacles).map(
    minuteIntervalToTime,
  );
}

/**
 * Generate start-time options at fixed steps within one available interval.
 * Start times must allow at least one step before the interval ends.
 */
export function generateTimeSlots(
  interval: TimeInterval,
  stepMinutes: number = SLOT_STEP_MINUTES,
): string[] {
  const startMin = parseTimeToMinutes(interval.start);
  const endMin = parseTimeToMinutes(interval.end);
  const slots: string[] = [];

  for (let t = startMin; t + stepMinutes <= endMin; t += stepMinutes) {
    slots.push(formatTime(t));
  }

  return slots;
}

/** All valid start times across available intervals. */
export function getAllValidStartTimes(
  availableIntervals: TimeInterval[],
  stepMinutes: number = SLOT_STEP_MINUTES,
): string[] {
  return availableIntervals.flatMap((interval) =>
    generateTimeSlots(interval, stepMinutes),
  );
}

/**
 * Given a selected start time, return valid end times within the same
 * available interval — up to (but not past) the interval boundary.
 */
export function getValidEndTimes(
  start: string,
  availableIntervals: TimeInterval[],
  stepMinutes: number = SLOT_STEP_MINUTES,
): string[] {
  const startMin = parseTimeToMinutes(start);
  const container = availableIntervals.find((interval) => {
    const intervalStart = parseTimeToMinutes(interval.start);
    const intervalEnd = parseTimeToMinutes(interval.end);
    return startMin >= intervalStart && startMin < intervalEnd;
  });

  if (!container) return [];

  const endMin = parseTimeToMinutes(container.end);
  const options: string[] = [];

  for (let t = startMin + stepMinutes; t <= endMin; t += stepMinutes) {
    options.push(formatTime(t));
  }

  return options;
}

/** Check whether a start/end pair fits entirely inside one available interval. */
export function isValidTimeRange(
  start: string,
  end: string,
  availableIntervals: TimeInterval[],
): boolean {
  if (parseTimeToMinutes(end) <= parseTimeToMinutes(start)) return false;

  return availableIntervals.some((interval) => {
    const intervalStart = parseTimeToMinutes(interval.start);
    const intervalEnd = parseTimeToMinutes(interval.end);
    const startMin = parseTimeToMinutes(start);
    const endMin = parseTimeToMinutes(end);
    return startMin >= intervalStart && endMin <= intervalEnd;
  });
}

/** Build ordered timeline segments for the visual bar. */
export function buildTimelineSegments(
  schedule: DaySchedule,
  availableIntervals: TimeInterval[],
  selectedRange: TimeInterval | null,
  bookedRanges: TimeInterval[] = [],
): TimelineSegment[] {
  type RawSegment = {
    type: TimelineSegmentType;
    start: number;
    end: number;
  };

  const dayStart = schedule.openMinutes;
  const dayEnd = schedule.closeMinutes;
  const boundaries = new Set<number>([dayStart, dayEnd]);

  for (const block of schedule.blockedMinutes) {
    boundaries.add(block.start);
    boundaries.add(block.end);
  }

  for (const booked of bookedRanges) {
    boundaries.add(parseTimeToMinutes(booked.start));
    boundaries.add(parseTimeToMinutes(booked.end));
  }

  if (selectedRange) {
    boundaries.add(parseTimeToMinutes(selectedRange.start));
    boundaries.add(parseTimeToMinutes(selectedRange.end));
  }

  const sortedBounds = [...boundaries]
    .filter((b) => b >= dayStart && b <= dayEnd)
    .sort((a, b) => a - b);

  const availableMinutes = availableIntervals.map((interval) => ({
    start: parseTimeToMinutes(interval.start),
    end: parseTimeToMinutes(interval.end),
  }));

  const bookedMinutes = bookedRanges.map((range) => ({
    start: parseTimeToMinutes(range.start),
    end: parseTimeToMinutes(range.end),
  }));

  const selectedMinutes = selectedRange
    ? {
        start: parseTimeToMinutes(selectedRange.start),
        end: parseTimeToMinutes(selectedRange.end),
      }
    : null;

  const raw: RawSegment[] = [];

  for (let i = 0; i < sortedBounds.length - 1; i++) {
    const segStart = sortedBounds[i];
    const segEnd = sortedBounds[i + 1];
    if (segEnd <= segStart) continue;

    const mid = (segStart + segEnd) / 2;

    let type: TimelineSegmentType = "blocked";

    const isBlocked = schedule.blockedMinutes.some(
      (block) => mid >= block.start && mid < block.end,
    );
    const isBooked = bookedMinutes.some(
      (booked) => mid >= booked.start && mid < booked.end,
    );
    const isSelected =
      selectedMinutes !== null &&
      mid >= selectedMinutes.start &&
      mid < selectedMinutes.end;
    const isAvailable = availableMinutes.some(
      (available) => mid >= available.start && mid < available.end,
    );

    if (isSelected) {
      type = "selected";
    } else if (isBlocked) {
      type = "blocked";
    } else if (isBooked) {
      type = "booked";
    } else if (isAvailable) {
      type = "available";
    }

    raw.push({ type, start: segStart, end: segEnd });
  }

  // Merge adjacent segments of the same type
  const merged: RawSegment[] = [];
  for (const segment of raw) {
    const last = merged[merged.length - 1];
    if (last && last.type === segment.type && last.end === segment.start) {
      last.end = segment.end;
    } else {
      merged.push({ ...segment });
    }
  }

  return merged.map((segment) => ({
    type: segment.type,
    start: formatTime(segment.start),
    end: formatTime(segment.end),
    durationMinutes: segment.end - segment.start,
  }));
}

/** Compute hours (decimal) for a time range selection. */
export function computeRangeHours(start: string, end: string): number {
  return minutesBetween(start, end) / 60;
}
