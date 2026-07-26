import { describe, it, expect, vi, beforeEach } from 'vitest';
import { Types } from 'mongoose';
import { getVenueAnalyticsData } from '../../src/modules/owner/owner.repository';
import { BookingModel } from '../../src/modules/booking/models/booking.model';
import { BookingStatus } from '../../src/constants/booking.constants';

vi.mock('../../src/modules/booking/models/booking.model', () => ({
  BookingModel: {
    aggregate: vi.fn(),
  },
}));

describe('Owner Repository - Analytics', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('getVenueAnalyticsData', () => {
    it('should query MongoDB aggregate with both CONFIRMED and COMPLETED statuses', async () => {
      const mockVenueId = new Types.ObjectId().toString();
      const mockResult = [
        { year: '2026', month: '07', revenue: 15000, count: 3 },
      ];

      vi.mocked(BookingModel.aggregate).mockResolvedValueOnce(mockResult);

      const result = await getVenueAnalyticsData(mockVenueId);

      expect(BookingModel.aggregate).toHaveBeenCalledTimes(1);
      const pipeline = vi.mocked(BookingModel.aggregate).mock.calls[0][0] as {
        $match: Record<string, unknown>;
      }[];

      const matchStage = pipeline[0].$match;
      expect(matchStage.venueId).toEqual(new Types.ObjectId(mockVenueId));
      expect(matchStage.status).toEqual({
        $in: [BookingStatus.CONFIRMED, BookingStatus.COMPLETED],
      });

      expect(result).toEqual(mockResult);
    });
  });
});
