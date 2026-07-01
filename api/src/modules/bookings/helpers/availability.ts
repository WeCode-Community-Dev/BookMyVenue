import {
  BadRequestException,
  ConflictException,
} from '@nestjs/common';

type OperatingHour = {
  weekday: number;
  openTime: string;
  closeTime: string;
  isClosed: boolean;
};

type BlockedPeriod = {
  startAt: Date;
  endAt: Date;
};

type ExistingBooking = {
  startAt: Date;
  endAt: Date;
};

type AssertSlotAvailableParams = {
  startAt: Date;
  endAt: Date;
  timezone: string;
  operatingHours: OperatingHour[];
  blockedPeriods: BlockedPeriod[];
  existingBookings: ExistingBooking[];
};

function parseTimeToMinutes(time: string): number {
  const [hours, minutes] = time.split(':').map(Number);
  return hours * 60 + minutes;
}

function getLocalDateParts(date: Date, timezone: string) {
  const formatter = new Intl.DateTimeFormat('en-US', {
    timeZone: timezone,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    weekday: 'short',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  });

  const parts = formatter.formatToParts(date);
  const get = (type: Intl.DateTimeFormatPartTypes) =>
    parts.find((part) => part.type === type)?.value ?? '';

  const weekdayMap: Record<string, number> = {
    Sun: 0,
    Mon: 1,
    Tue: 2,
    Wed: 3,
    Thu: 4,
    Fri: 5,
    Sat: 6,
  };

  const weekdayLabel = get('weekday');
  const weekday = weekdayMap[weekdayLabel];

  if (weekday === undefined) {
    throw new BadRequestException('Unable to resolve weekday for booking slot');
  }

  const hour = Number(get('hour'));
  const minute = Number(get('minute'));

  return {
    dateKey: `${get('year')}-${get('month')}-${get('day')}`,
    weekday,
    minutesFromMidnight: hour * 60 + minute,
  };
}

function intervalsOverlap(
  aStart: Date,
  aEnd: Date,
  bStart: Date,
  bEnd: Date,
): boolean {
  return aStart < bEnd && aEnd > bStart;
}

export function assertSlotAvailable(params: AssertSlotAvailableParams): void {
  const {
    startAt,
    endAt,
    timezone,
    operatingHours,
    blockedPeriods,
    existingBookings,
  } = params;

  if (startAt >= endAt) {
    throw new BadRequestException('endAt must be after startAt');
  }

  if (startAt <= new Date()) {
    throw new BadRequestException('Booking start time must be in the future');
  }

  const startLocal = getLocalDateParts(startAt, timezone);
  const endLocal = getLocalDateParts(endAt, timezone);

  if (startLocal.dateKey !== endLocal.dateKey) {
    throw new BadRequestException(
      'Booking must start and end on the same calendar day in the venue timezone',
    );
  }

  const dayHours = operatingHours.find(
    (hour) => hour.weekday === startLocal.weekday,
  );

  if (!dayHours || dayHours.isClosed) {
    throw new BadRequestException('Space is closed on the selected day');
  }

  const openMinutes = parseTimeToMinutes(dayHours.openTime);
  const closeMinutes = parseTimeToMinutes(dayHours.closeTime);

  if (closeMinutes <= openMinutes) {
    throw new BadRequestException('Space operating hours are invalid');
  }

  if (
    startLocal.minutesFromMidnight < openMinutes ||
    endLocal.minutesFromMidnight > closeMinutes
  ) {
    throw new BadRequestException(
      'Booking time is outside space operating hours',
    );
  }

  for (const period of blockedPeriods) {
    if (intervalsOverlap(startAt, endAt, period.startAt, period.endAt)) {
      throw new BadRequestException(
        'Booking time overlaps a blocked period for this space',
      );
    }
  }

  for (const booking of existingBookings) {
    if (intervalsOverlap(startAt, endAt, booking.startAt, booking.endAt)) {
      throw new ConflictException('Booking time overlaps an existing booking');
    }
  }
}
