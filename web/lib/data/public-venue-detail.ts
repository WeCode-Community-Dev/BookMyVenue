import type { Space, VenueDetails } from "@/lib/data/venues";
import { CapacityType } from "@/lib/data/venues";
import { getVenueRating } from "@/lib/data/venue-detail";
import {
  DEFAULT_OPERATING_HOURS,
  parseTimeToMinutes,
  PRICING_MODEL_OPTIONS,
} from "@/lib/data/space-manage";
import type {
  PricingType,
  SpaceBlockedPeriodResponse,
  SpaceOperatingHourResponse,
  SpacePricingResponse,
} from "@/services/venueServices";

export type PublicReview = {
  id: string;
  author: string;
  date: string;
  eventType: string;
  text: string;
};

export const DUMMY_REVIEWS: PublicReview[] = [
  {
    id: "1",
    author: "Sarah Mitchell",
    date: "September 2024",
    eventType: "Corporate Conference",
    text:
      "An absolutely stunning venue. The glass atrium created the perfect atmosphere for our annual summit. Staff were incredibly professional and the AV setup was seamless.",
  },
  {
    id: "2",
    author: "James Chen",
    date: "August 2024",
    eventType: "Product Launch",
    text:
      "We hosted our product launch in the Grand Atrium and it exceeded expectations. Great natural light, flexible layout, and excellent catering options on-site.",
  },
  {
    id: "3",
    author: "Emily Rodriguez",
    date: "July 2024",
    eventType: "Networking Event",
    text:
      "Perfect location in Kensington with easy transport links. The rooftop terrace was a highlight for our evening reception. Would book again without hesitation.",
  },
];

export const PREMIUM_RATING_THRESHOLD = 4.8;

export const BOOKING_DEFAULT_HOURS = 4;
export const CLEANING_FEE = 75;
export const SERVICE_FEE_RATE = 0.08;

export function getPlaceholderHourlyPrice(entityId: string): number {
  let hash = 0;
  for (let i = 0; i < entityId.length; i++) {
    hash = (hash + entityId.charCodeAt(i) * (i + 1)) % 451;
  }
  return 45 + hash;
}

export function getSpaceHourlyPrice(spaceId: string): number {
  return getPlaceholderHourlyPrice(spaceId);
}

export function getVenueAverageHourlyPrice(venue: VenueDetails): number {
  const activeSpaces = venue.spaces.filter((s) => s.isActive);
  const spaces = activeSpaces.length > 0 ? activeSpaces : venue.spaces;
  if (spaces.length === 0) {
    return getPlaceholderHourlyPrice(venue.id);
  }
  const total = spaces.reduce(
    (sum, space) => sum + getSpaceHourlyPrice(space.id),
    0,
  );
  return Math.round(total / spaces.length);
}

export function isPremiumVenue(): boolean {
  return getVenueRating() >= PREMIUM_RATING_THRESHOLD;
}

export function formatFullAddress(venue: VenueDetails): string {
  const parts = [
    venue.address,
    venue.city,
    venue.postalCode,
  ].filter(Boolean);
  return parts.join(", ");
}

export function formatSpaceCapacity(space: Space): string | null {
  if (!space.capacityValue) return null;
  const value = parseFloat(space.capacityValue);
  if (Number.isNaN(value)) return space.capacityValue;

  const type = space.capacityType;
  if (
    type === CapacityType.PEOPLE ||
    type === CapacityType.SEATS ||
    type === CapacityType.PLAYERS
  ) {
    return `up to ${Math.round(value)}`;
  }
  return null;
}

export function formatSpaceArea(space: Space): string | null {
  if (!space.capacityValue) return null;
  const value = parseFloat(space.capacityValue);
  if (Number.isNaN(value)) return null;

  const type = space.capacityType;
  if (type === CapacityType.SQFT) {
    return `${Math.round(value).toLocaleString()} sq ft`;
  }
  if (type === CapacityType.SQM) {
    return `${Math.round(value).toLocaleString()} sq m`;
  }
  return null;
}

export function getActiveSpaces(venue: VenueDetails): Space[] {
  const active = venue.spaces.filter((s) => s.isActive);
  return active.length > 0 ? active : venue.spaces;
}

export type BookingBreakdown = {
  spaceLine: string;
  spaceAmount: number;
  cleaningFee: number;
  serviceFee: number;
  total: number;
};

export function computeBookingBreakdown(
  spaceName: string,
  hourlyRate: number,
  hours = BOOKING_DEFAULT_HOURS,
): BookingBreakdown {
  const spaceAmount = hourlyRate * hours;
  const serviceFee = Math.round(spaceAmount * SERVICE_FEE_RATE);
  const total = spaceAmount + CLEANING_FEE + serviceFee;

  return {
    spaceLine: `${spaceName} x ${hours} hrs`,
    spaceAmount,
    cleaningFee: CLEANING_FEE,
    serviceFee,
    total,
  };
}

const PRICING_TYPE_PRIORITY: PricingType[] = [
  "HOURLY",
  "DAILY",
  "SESSION",
  "EVENT",
  "CUSTOM",
];

export function getPrimaryPricingRecord(
  records: SpacePricingResponse[],
): SpacePricingResponse | null {
  if (records.length === 0) return null;

  for (const type of PRICING_TYPE_PRIORITY) {
    const match = records.find((record) => record.pricingType === type);
    if (match) return match;
  }

  return [...records].sort(
    (a, b) =>
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  )[0];
}

export function getDefaultPricingType(
  records: SpacePricingResponse[],
): PricingType | null {
  return getPrimaryPricingRecord(records)?.pricingType ?? null;
}

export function sortPricingRecordsByPriority(
  records: SpacePricingResponse[],
): SpacePricingResponse[] {
  return [...records].sort(
    (a, b) =>
      PRICING_TYPE_PRIORITY.indexOf(a.pricingType) -
      PRICING_TYPE_PRIORITY.indexOf(b.pricingType),
  );
}

export function formatPricingAmount(amount: string, currency: string): string {
  const value = parseFloat(amount);
  if (Number.isNaN(value)) return amount;

  return new Intl.NumberFormat(undefined, {
    style: "currency",
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(value);
}

export function getPricingUnitLabel(pricingType: PricingType): string {
  switch (pricingType) {
    case "HOURLY":
      return "/ hour";
    case "DAILY":
      return "/ day";
    case "SESSION":
      return "/ session";
    case "EVENT":
      return "/ event";
    case "CUSTOM":
      return "Custom quote";
    default:
      return "";
  }
}

export function getPricingTypeLabel(pricingType: PricingType): string {
  const option = PRICING_MODEL_OPTIONS.find(
    (item) => item.pricingType === pricingType,
  );
  if (option) return option.label;

  const unit = getPricingUnitLabel(pricingType);
  return unit.startsWith("/ ") ? unit.slice(2) : unit;
}

export function getBreakdownFromPricing(
  record: SpacePricingResponse,
  spaceName: string,
): BookingBreakdown | null {
  if (record.pricingType === "CUSTOM") return null;

  const amount = parseFloat(record.amount);
  if (Number.isNaN(amount)) return null;

  if (record.pricingType === "HOURLY") {
    return computeBookingBreakdown(spaceName, amount);
  }

  const unitLabel =
    record.pricingType === "DAILY"
      ? "day"
      : record.pricingType === "SESSION"
        ? "session"
        : "event";
  const spaceAmount = amount;
  const serviceFee = Math.round(spaceAmount * SERVICE_FEE_RATE);
  const total = spaceAmount + CLEANING_FEE + serviceFee;

  return {
    spaceLine: `${spaceName} x 1 ${unitLabel}`,
    spaceAmount,
    cleaningFee: CLEANING_FEE,
    serviceFee,
    total,
  };
}

export function getNeighborhoodDescription(city: string): string {
  return `${city} is a vibrant neighborhood known for its cultural landmarks, excellent dining, and convenient transport connections. The area offers a mix of historic charm and modern amenities, making it ideal for corporate events and special occasions.`;
}

export function getTransportDescription(city: string): string {
  return `Located in ${city}, this venue is well connected by public transport with nearby tube and bus links, plus on-street parking options in the surrounding area.`;
}

export type TimeRangeSelection = {
  start: string;
  end: string;
  hours: number;
};

export function formatTimeRangeLabel(range: TimeRangeSelection): string {
  return `${range.start} → ${range.end}`;
}

export function getSpaceMaxGuests(space: Space): string | null {
  if (!space.capacityValue) return null;
  const value = parseFloat(space.capacityValue);
  if (Number.isNaN(value)) return null;

  const type = space.capacityType;
  if (
    type === CapacityType.PEOPLE ||
    type === CapacityType.SEATS ||
    type === CapacityType.PLAYERS ||
    !type
  ) {
    return `Up to ${Math.round(value)} guests`;
  }
  return null;
}

export function computeSpaceBookingTotal(
  hourlyRate: number,
  hours: number,
): {
  subtotalLine: string;
  subtotal: number;
  serviceFee: number;
  total: number;
} {
  const subtotal = hourlyRate * hours;
  const serviceFee = Math.round(subtotal * SERVICE_FEE_RATE);
  const total = subtotal + serviceFee;

  return {
    subtotalLine: `$${hourlyRate} x ${hours} hours`,
    subtotal,
    serviceFee,
    total,
  };
}

export type CalendarDayAvailability = "available" | "partial" | "unavailable";

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

function isPastDate(date: Date, today: Date): boolean {
  return startOfDay(date).getTime() < startOfDay(today).getTime();
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

function toMinutesOnDay(day: Date, instant: Date): number {
  const dayStart = startOfDay(day);
  const dayEnd = endOfDay(day);

  if (instant <= dayStart) return 0;
  if (instant >= dayEnd) return 24 * 60;

  return instant.getHours() * 60 + instant.getMinutes();
}

function getBlockedIntervalsInWindow(
  date: Date,
  blockedPeriods: SpaceBlockedPeriodResponse[],
  window: { open: number; close: number },
): { start: number; end: number }[] {
  const dayStart = startOfDay(date);
  const dayEnd = endOfDay(date);
  const intervals: { start: number; end: number }[] = [];

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

  return intervals;
}

function mergeIntervals(
  intervals: { start: number; end: number }[],
): { start: number; end: number }[] {
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

function intervalsFullyCoverWindow(
  merged: { start: number; end: number }[],
  window: { open: number; close: number },
): boolean {
  if (merged.length === 0) return false;
  if (merged[0].start > window.open) return false;

  let coveredUntil = merged[0].end;
  if (coveredUntil >= window.close) return true;

  for (let i = 1; i < merged.length; i++) {
    if (merged[i].start > coveredUntil) return false;
    coveredUntil = Math.max(coveredUntil, merged[i].end);
    if (coveredUntil >= window.close) return true;
  }

  return false;
}

export function getCalendarDayAvailability(
  date: Date,
  operatingHours: SpaceOperatingHourResponse[],
  blockedPeriods: SpaceBlockedPeriodResponse[],
  today: Date = new Date(),
): CalendarDayAvailability {
  if (isPastDate(date, today)) return "unavailable";

  const window = getOperatingWindow(date, operatingHours);
  if (!window) return "unavailable";

  const blockedInWindow = getBlockedIntervalsInWindow(
    date,
    blockedPeriods,
    window,
  );
  const merged = mergeIntervals(blockedInWindow);

  if (merged.length === 0) return "available";
  if (intervalsFullyCoverWindow(merged, window)) return "unavailable";
  return "partial";
}

export function getMonthDays(year: number, month: number): (Date | null)[] {
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const startPadding = firstDay.getDay();
  const days: (Date | null)[] = [];

  for (let i = 0; i < startPadding; i++) {
    days.push(null);
  }

  for (let d = 1; d <= lastDay.getDate(); d++) {
    days.push(new Date(year, month, d));
  }

  return days;
}

export function formatDisplayDate(date: Date): string {
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function formatShortDate(date: Date): string {
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
}

export function formatMonthYear(year: number, month: number): string {
  return new Date(year, month, 1).toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });
}

export function parseDateParam(value: string | undefined): Date | null {
  if (!value) return null;
  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
}

export function getSpaceAmenities(
  space: Space,
  venue: VenueDetails,
): { id: string; name: string }[] {
  if (space.amenities.length > 0) {
    return space.amenities.map((a) => ({
      id: a.amenityId,
      name: a.amenity.name,
    }));
  }
  return venue.amenities.map((a) => ({
    id: a.amenityId,
    name: a.amenity.name,
  }));
}
