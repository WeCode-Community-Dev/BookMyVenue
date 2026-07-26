import { describe, it, expect } from 'vitest';
import {
  timeToMinutes,
  minutesToTime,
  isTimeBlocked,
  getPriceForTimeRange,
  generateFlexibleSlots,
  prepareFixedSlots,
  generateSlots,
} from '@/utils/slotGenerator.utils';
import type { ISlotConfig } from '@/utils/slotGenerator.types';

describe('client slotGenerator.utils', () => {
  describe('timeToMinutes & minutesToTime', () => {
    it('should convert time string to minutes and back', () => {
      expect(timeToMinutes('09:30')).toBe(570);
      expect(minutesToTime(570)).toBe('09:30');
    });
  });

  describe('isTimeBlocked', () => {
    it('should return false when blockedTimes is empty or undefined', () => {
      expect(isTimeBlocked('09:00', '10:00', [])).toBe(false);
      expect(isTimeBlocked('09:00', '10:00', undefined)).toBe(false);
    });

    it('should detect overlapping blocked time slots', () => {
      const blockedTimes = [{ fromTime: '10:00', toTime: '12:00' }];
      expect(isTimeBlocked('09:00', '10:30', blockedTimes)).toBe(true);
      expect(isTimeBlocked('11:30', '13:00', blockedTimes)).toBe(true);
      expect(isTimeBlocked('08:00', '09:30', blockedTimes)).toBe(false);
    });
  });

  describe('getPriceForTimeRange', () => {
    it('should return default price when no pricing rules are provided', () => {
      expect(getPriceForTimeRange('09:00', '10:00', [], '500')).toBe(500);
    });

    it('should apply matching pricing rule price when slot falls within range', () => {
      const pricingRules = [{ fromTime: '18:00', toTime: '22:00', price: 1500 }];
      expect(getPriceForTimeRange('19:00', '20:00', pricingRules, '1000')).toBe(1500);
    });
  });

  describe('generateFlexibleSlots & prepareFixedSlots', () => {
    it('should generate flexible slots directly via generateFlexibleSlots', () => {
      const config: ISlotConfig = {
        bookingType: 'flexibleBooking',
        workingDays: ['Monday', 'Tuesday'],
        workingHours: { open: '09:00', close: '11:00' },
        slotDuration: '60',
        bufferTime: '0',
        samePrice: '1000',
      };
      const slots = generateFlexibleSlots('2026-07-22', config);
      expect(slots).toHaveLength(2);
    });

    it('should prepare fixed slots directly via prepareFixedSlots', () => {
      const config: ISlotConfig = {
        bookingType: 'fixedBooking',
        workingDays: ['Monday', 'Tuesday'],
        fixedPackages: [
          { slotName: 'Full Package', startTime: '09:00', endTime: '17:00', price: 10000 },
        ],
      };
      const slots = prepareFixedSlots('2026-07-22', config);
      expect(slots).toHaveLength(1);
      expect(slots[0].name).toBe('Full Package');
    });
  });

  describe('generateSlots', () => {
    it('should generate flexible slots correctly within working hours', () => {
      const config: ISlotConfig = {
        bookingType: 'flexibleBooking',
        workingDays: ['Monday', 'Tuesday'],
        workingHours: { open: '09:00', close: '12:00' },
        slotDuration: '60',
        bufferTime: '0',
        samePrice: '1000',
      };

      const slots = generateSlots('2026-07-22', config);
      expect(slots).toHaveLength(3);
      expect(slots[0]).toEqual({
        id: 'slot-2026-07-22-0',
        startTime: '09:00',
        endTime: '10:00',
        price: 1000,
        isAvailable: true,
        reason: undefined,
      });
    });

    it('should generate fixed package slots correctly', () => {
      const config: ISlotConfig = {
        bookingType: 'fixedBooking',
        workingDays: ['Monday', 'Tuesday'],
        fixedPackages: [
          { slotName: 'Morning Session', startTime: '08:00', endTime: '12:00', price: 2500 },
          { slotName: 'Evening Party', startTime: '16:00', endTime: '22:00', price: 5000 },
        ],
      };

      const slots = generateSlots('2026-07-22', config);
      expect(slots).toHaveLength(2);
      expect(slots[0].name).toBe('Morning Session');
    });
  });
});
