import { describe, it, expect, vi, beforeEach } from 'vitest';

const mockGet = vi.fn();
const mockPatch = vi.fn();
const mockDelete = vi.fn();

vi.mock('@/config/axios', () => ({
  axiosInstance: {
    get: mockGet,
    patch: mockPatch,
    delete: mockDelete,
  },
}));

vi.mock('@/constants', () => ({
  API_ENDPOINTS: {
    MY_BOOKINGS: '/bookings/my-bookings',
    BOOKING_BY_ID: (id: string) => `/bookings/${id}`,
    SAVE_BOOKER_DETAILS: '/bookings/booker-details',
    CANCEL_BOOKING: (id: string) => `/bookings/${id}`,
  },
}));

describe('bookingService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('getMyBookings', () => {
    it('should GET my-bookings and return response data', async () => {
      const responseData = {
        success: true,
        data: {
          bookings: {
            upcoming: [{ _id: 'b1' }],
            completed: [],
            cancelled: [],
          },
        },
      };
      mockGet.mockResolvedValue({ data: responseData });

      const { getMyBookings } = await import('../../services/bookingService');
      const result = await getMyBookings();

      expect(mockGet).toHaveBeenCalledWith('/bookings/my-bookings');
      expect(result).toEqual(responseData);
    });
  });

  describe('getBookingById', () => {
    it('should GET booking by id and return response data', async () => {
      const responseData = {
        success: true,
        data: {
          _id: 'b1',
          venueName: 'Grand Hall',
          bookingRef: 'REF-001',
        },
      };
      mockGet.mockResolvedValue({ data: responseData });

      const { getBookingById } = await import('../../services/bookingService');
      const result = await getBookingById('b1');

      expect(mockGet).toHaveBeenCalledWith('/bookings/b1');
      expect(result).toEqual(responseData);
    });
  });

  describe('saveBookerDetails', () => {
    it('should PATCH booker details with lockId', async () => {
      mockPatch.mockResolvedValue({ data: { success: true, data: null } });

      const { saveBookerDetails } = await import('../../services/bookingService');
      const result = await saveBookerDetails({
        lockId: 'lock-1',
        guestCount: 50,
        eventType: 'wedding',
        name: 'John',
        email: 'john@test.com',
        phone: '9876543210',
        place: 'Kochi',
      });

      expect(mockPatch).toHaveBeenCalledWith('/bookings/booker-details', {
        lockId: 'lock-1',
        guestCount: 50,
        eventType: 'wedding',
        bookerInfo: {
          name: 'John',
          email: 'john@test.com',
          phone: '9876543210',
          place: 'Kochi',
        },
      });
      expect(result).toEqual({ success: true, data: null });
    });
  });

  describe('cancelBooking', () => {
    it('should DELETE booking with reason', async () => {
      mockDelete.mockResolvedValue({ data: { success: true, data: { refundAmount: 500 } } });

      const { cancelBooking } = await import('../../services/bookingService');
      const result = await cancelBooking('b1', 'Changed mind');

      expect(mockDelete).toHaveBeenCalledWith('/bookings/b1', { data: { reason: 'Changed mind' } });
      expect(result).toEqual({ success: true, data: { refundAmount: 500 } });
    });

    it('should cancel without reason', async () => {
      mockDelete.mockResolvedValue({ data: { success: true, data: { refundAmount: 0 } } });

      const { cancelBooking } = await import('../../services/bookingService');
      const result = await cancelBooking('b1');

      expect(mockDelete).toHaveBeenCalledWith('/bookings/b1', { data: { reason: undefined } });
      expect(result).toEqual({ success: true, data: { refundAmount: 0 } });
    });
  });
});
