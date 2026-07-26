import { describe, it, expect } from 'vitest';
import { parseTimeToMinutes, formatMinutesToTime, toLocalDateString } from '@/utils/timeUtils';

describe('client timeUtils', () => {
  describe('parseTimeToMinutes', () => {
    it('should parse "00:00" to 0 minutes', () => {
      expect(parseTimeToMinutes('00:00')).toBe(0);
    });

    it('should parse "14:30" to 870 minutes', () => {
      expect(parseTimeToMinutes('14:30')).toBe(870);
    });

    it('should parse "23:59" to 1439 minutes', () => {
      expect(parseTimeToMinutes('23:59')).toBe(1439);
    });

    it('should throw an error for invalid time formats', () => {
      expect(() => parseTimeToMinutes('invalid')).toThrow('Invalid time format: invalid');
    });
  });

  describe('formatMinutesToTime', () => {
    it('should format 0 minutes to "00:00"', () => {
      expect(formatMinutesToTime(0)).toBe('00:00');
    });

    it('should format 870 minutes to "14:30"', () => {
      expect(formatMinutesToTime(870)).toBe('14:30');
    });

    it('should format 1439 minutes to "23:59"', () => {
      expect(formatMinutesToTime(1439)).toBe('23:59');
    });
  });

  describe('toLocalDateString', () => {
    it('should format date object to YYYY-MM-DD format', () => {
      const date = new Date(2026, 6, 22); // Month is 0-indexed (6 = July)
      expect(toLocalDateString(date)).toBe('2026-07-22');
    });
  });
});
