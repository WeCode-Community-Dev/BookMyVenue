import type { IVenue } from '../venue/venue.types';
import {
  timeStringToMinutes,
  minutesToTimeString,
  checkOverlap,
  toLocalDateString,
} from '../../utils/timeUtils';

interface AvailabilitySlot {
  slotId: string;
  name: string | null;
  startTime: string;
  endTime: string;
  price: number;
  isAvailable: boolean;
  reason: string | null;
}

interface AvailabilityResponse {
  venueId: unknown;
  date: string;
  bookingType: 'fixedBooking' | 'flexibleBooking';
  slots: AvailabilitySlot[];
}

export const generateAvailability = (
  venue: IVenue,
  date: string,
  externalConflicts: { start: number; end: number }[]
): AvailabilityResponse => {
  // Merge venue blocked times/breaks with external conflicts
  const internalConflicts = (venue.blockedTimes ?? []).map((bt) => ({
    start: timeStringToMinutes(bt.fromTime),
    end: timeStringToMinutes(bt.toTime),
  }));
  const allConflicts = [...externalConflicts, ...internalConflicts];

  const slots: AvailabilitySlot[] = [];

  // Fixed bookings branch
  if (venue.bookingType === 'fixedBooking') {
    for (const pkg of venue.fixedPackages ?? []) {
      const startMin = timeStringToMinutes(pkg.startTime);
      const endMin = timeStringToMinutes(pkg.endTime);

      const isBlocked = checkOverlap(startMin, endMin, allConflicts);

      slots.push({
        slotId: pkg.slotName.replace(/\s+/g, '_').toLowerCase(),
        name: pkg.slotName,
        startTime: pkg.startTime,
        endTime: pkg.endTime,
        price: pkg.price,
        isAvailable: !isBlocked,
        reason: isBlocked ? 'UNAVAILABLE' : null,
      });
    }
    return { venueId: venue._id, date, bookingType: 'fixedBooking', slots };
  }

  // Flexible bookings branch
  if (!venue.workingHours) {
    throw new Error('Working hours are required for flexible booking venues');
  }
  const openMin = timeStringToMinutes(venue.workingHours.open);
  const closeMin = timeStringToMinutes(venue.workingHours.close);
  const duration = venue.flexibleBooking?.slotDuration ?? 60;
  const buffer = venue.flexibleBooking?.bufferTime ?? 0;

  let currentStart = openMin;

  while (currentStart + duration <= closeMin) {
    const currentEnd = currentStart + duration;
    const isBlocked = checkOverlap(currentStart, currentEnd, allConflicts);

    // Determine pricing based on base price or rules
    if (!venue.pricing) {
      throw new Error('Pricing configuration missing for flexible booking venue');
    }
    let appliedPrice = venue.pricing.basePrice;
    if (venue.pricing.pricingType === 'timeBasedPricing') {
      for (const rule of venue.pricing.pricingRules) {
        const ruleStart = timeStringToMinutes(rule.fromTime);
        const ruleEnd = timeStringToMinutes(rule.toTime);
        if (currentStart >= ruleStart && currentStart < ruleEnd) {
          appliedPrice = rule.price;
          break;
        }
      }
    }

    slots.push({
      slotId: `${currentStart.toString()}-${currentEnd.toString()}`,
      name: null,
      startTime: minutesToTimeString(currentStart),
      endTime: minutesToTimeString(currentEnd),
      price: appliedPrice,
      isAvailable: !isBlocked,
      reason: isBlocked ? 'UNAVAILABLE' : null,
    });

    // Advance loop adding slot duration and buffer
    currentStart = currentEnd + buffer;
  }

  return { venueId: venue._id, date, bookingType: 'flexibleBooking', slots };
};

export interface BookableDatesResponse {
  bookableDates: string[];
  disabledDates: string[];
  maxDate: string;
}

export const getBookableDates = (venue: IVenue): BookableDatesResponse => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  const maxDateObj = new Date(today);
  maxDateObj.setDate(maxDateObj.getDate() + 90);

  // Apply blockedAfterDate (tightest date wins)
  if (venue.temporaryBlockAfterDate) {
    const blockDate = new Date(venue.temporaryBlockAfterDate);
    if (blockDate < maxDateObj) {
      maxDateObj.setTime(blockDate.getTime());
    }
  }
  if (venue.inactivity?.blockedAfterDate) {
    const blockDate = new Date(venue.inactivity.blockedAfterDate);
    if (blockDate < maxDateObj) {
      maxDateObj.setTime(blockDate.getTime());
    }
  }

  const bookableDates: string[] = [];
  const disabledDates: string[] = [];

  const blockedDatesStr = venue.blockedDates.map((d) => d.toISOString().split('T')[0]);

  const workingDays = venue.workingDays;

  for (let d = new Date(today); d <= maxDateObj; d.setDate(d.getDate() + 1)) {
    const dateStr = toLocalDateString(d);

    if (d < tomorrow) {
      disabledDates.push(dateStr);
      continue;
    }

    const dayName = d.toLocaleDateString('en-US', { weekday: 'long' });
    const isWorkingDay = workingDays.includes(dayName);
    const isBlocked = blockedDatesStr.includes(dateStr);

    if (isWorkingDay && !isBlocked) {
      bookableDates.push(dateStr);
    } else {
      disabledDates.push(dateStr);
    }
  }

  return {
    bookableDates,
    disabledDates,
    maxDate: toLocalDateString(maxDateObj),
  };
};
