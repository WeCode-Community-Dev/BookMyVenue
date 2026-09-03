import { describe, it, expect } from 'vitest';

describe('timeUtils', () => {
  describe('parseTimeToMinutes', () => {
    it('should parse "14:30" to 870', async () => {
      const { parseTimeToMinutes } = await import('../../utils/timeUtils');
      expect(parseTimeToMinutes('14:30')).toBe(870);
    });

    it('should parse "00:00" to 0', async () => {
      const { parseTimeToMinutes } = await import('../../utils/timeUtils');
      expect(parseTimeToMinutes('00:00')).toBe(0);
    });

    it('should parse "23:59" to 1439', async () => {
      const { parseTimeToMinutes } = await import('../../utils/timeUtils');
      expect(parseTimeToMinutes('23:59')).toBe(1439);
    });

    it('should throw on invalid format', async () => {
      const { parseTimeToMinutes } = await import('../../utils/timeUtils');
      expect(() => parseTimeToMinutes('invalid')).toThrow('Invalid time format: invalid');
    });

    it('should throw on empty string', async () => {
      const { parseTimeToMinutes } = await import('../../utils/timeUtils');
      expect(() => parseTimeToMinutes('')).toThrow();
    });
  });

  describe('formatMinutesToTime', () => {
    it('should format 870 to "14:30"', async () => {
      const { formatMinutesToTime } = await import('../../utils/timeUtils');
      expect(formatMinutesToTime(870)).toBe('14:30');
    });

    it('should format 0 to "00:00"', async () => {
      const { formatMinutesToTime } = await import('../../utils/timeUtils');
      expect(formatMinutesToTime(0)).toBe('00:00');
    });

    it('should format 1439 to "23:59"', async () => {
      const { formatMinutesToTime } = await import('../../utils/timeUtils');
      expect(formatMinutesToTime(1439)).toBe('23:59');
    });

    it('should pad single digit hours and minutes', async () => {
      const { formatMinutesToTime } = await import('../../utils/timeUtils');
      expect(formatMinutesToTime(1)).toBe('00:01');
      expect(formatMinutesToTime(60)).toBe('01:00');
    });
  });

  describe('toLocalDateString', () => {
    it('should format Date to YYYY-MM-DD', async () => {
      const { toLocalDateString } = await import('../../utils/timeUtils');
      const date = new Date(2026, 0, 15);
      expect(toLocalDateString(date)).toBe('2026-01-15');
    });

    it('should pad month and day with zeros', async () => {
      const { toLocalDateString } = await import('../../utils/timeUtils');
      const date = new Date(2026, 2, 5);
      expect(toLocalDateString(date)).toBe('2026-03-05');
    });

    it('should handle December dates correctly', async () => {
      const { toLocalDateString } = await import('../../utils/timeUtils');
      const date = new Date(2025, 11, 25);
      expect(toLocalDateString(date)).toBe('2025-12-25');
    });
  });
});
