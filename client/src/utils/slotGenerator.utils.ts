import type { ISlotConfig, IPreviewSlot, IBlockedTime, IPricingRule } from './slotGenerator.types';

export const timeToMinutes = (time: string): number => {
  const [hours, minutes] = time.split(':').map(Number);
  return hours * 60 + minutes;
};

export const minutesToTime = (minutes: number): string => {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return `${String(hours).padStart(2, '0')}:${String(mins).padStart(2, '0')}`;
};

export const isTimeBlocked = (
  startTime: string,
  endTime: string,
  blockedTimes?: IBlockedTime[]
): boolean => {
  if (!blockedTimes || blockedTimes.length === 0) {
    return false;
  }

  const rangeStart = timeToMinutes(startTime);
  const rangeEnd = timeToMinutes(endTime);

  return blockedTimes.some((blocked) => {
    const blockedStart = timeToMinutes(blocked.fromTime);
    const blockedEnd = timeToMinutes(blocked.toTime);

    // Check if ranges overlap: ranges overlap if one starts before the other ends
    return rangeStart < blockedEnd && rangeEnd > blockedStart;
  });
};

export const getPriceForTimeRange = (
  startTime: string,
  endTime: string,
  pricingRules?: IPricingRule[],
  defaultPrice: string = '0'
): number => {
  if (!pricingRules || pricingRules.length === 0) {
    return parseFloat(defaultPrice) || 0;
  }

  const slotStart = timeToMinutes(startTime);
  const slotEnd = timeToMinutes(endTime);

  for (const rule of pricingRules) {
    const ruleStart = timeToMinutes(rule.fromTime);
    const ruleEnd = timeToMinutes(rule.toTime);

    // Check if the pricing rule covers the entire slot
    if (ruleStart <= slotStart && slotEnd <= ruleEnd) {
      return rule.price;
    }
  }

  return parseFloat(defaultPrice) || 0;
};

export const isWorkingDay = (date: Date, workingDays: string[]): boolean => {
  const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const dayName = dayNames[date.getDay()];
  return workingDays.includes(dayName);
};

export const getNextWorkingDay = (startDate: Date, workingDays: string[]): Date => {
  const maxDays = 90;
  const currentDate = new Date(startDate);

  for (let i = 0; i < maxDays; i++) {
    if (isWorkingDay(currentDate, workingDays)) {
      return currentDate;
    }
    currentDate.setDate(currentDate.getDate() + 1);
  }

  return currentDate;
};

export const formatDateToString = (date: Date): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

export const parseDateString = (dateStr: string): Date => {
  const [year, month, day] = dateStr.split('-').map(Number);
  return new Date(year, month - 1, day);
};

export const generateFlexibleSlots = (date: string, config: ISlotConfig): IPreviewSlot[] => {
  const slots: IPreviewSlot[] = [];

  if (!config.workingHours || !config.slotDuration) {
    return slots;
  }

  const slotDurationMinutes = parseInt(config.slotDuration, 10);
  if (isNaN(slotDurationMinutes) || slotDurationMinutes <= 0) {
    return slots;
  }
  const openTime = timeToMinutes(config.workingHours.open);
  const closeTime = timeToMinutes(config.workingHours.close);

  if (isNaN(openTime) || isNaN(closeTime)) {
    return slots;
  }

  const bufferTimeMinutes = config.bufferTime ? parseInt(config.bufferTime, 10) : 0;
  const safeBufferTime = isNaN(bufferTimeMinutes) ? 0 : bufferTimeMinutes;

  let currentTime = openTime;
  let slotIndex = 0;

  while (currentTime + slotDurationMinutes <= closeTime) {
    const startTime = minutesToTime(currentTime);
    const endTime = minutesToTime(currentTime + slotDurationMinutes);

    const isBlocked = isTimeBlocked(startTime, endTime, config.blockedTimes);
    const defaultPrice =
      config.pricingType === 'timeBasedPricing' ? config.basePrice || '0' : config.samePrice || '0';

    const price = getPriceForTimeRange(startTime, endTime, config.pricingRules, defaultPrice);

    const slot: IPreviewSlot = {
      id: `slot-${date}-${slotIndex}`,
      startTime,
      endTime,
      price,
      isAvailable: !isBlocked,
      reason: isBlocked ? 'This time slot is blocked' : undefined,
    };

    slots.push(slot);
    currentTime += slotDurationMinutes + safeBufferTime;
    slotIndex++;
  }

  return slots;
};

export const prepareFixedSlots = (date: string, config: ISlotConfig): IPreviewSlot[] => {
  const slots: IPreviewSlot[] = [];

  if (!config.fixedPackages || config.fixedPackages.length === 0) {
    return slots;
  }

  config.fixedPackages.forEach((pkg, index) => {
    const isBlocked = isTimeBlocked(pkg.startTime, pkg.endTime, config.blockedTimes);

    const slot: IPreviewSlot = {
      id: `fixed-${date}-${index}`,
      startTime: pkg.startTime,
      endTime: pkg.endTime,
      name: pkg.slotName,
      price: pkg.price,
      isAvailable: !isBlocked,
      reason: isBlocked ? 'This package is unavailable' : undefined,
    };

    slots.push(slot);
  });

  return slots;
};

export const generateSlots = (date: string, config: ISlotConfig): IPreviewSlot[] => {
  if (config.bookingType === 'fixedBooking') {
    return prepareFixedSlots(date, config);
  }

  return generateFlexibleSlots(date, config);
};
