import { describe, it, expect, vi, beforeEach } from 'vitest';

const mockGet = vi.fn();
const mockPost = vi.fn();
const mockPut = vi.fn();

vi.mock('@/config/axios', () => ({
  axiosInstance: {
    get: mockGet,
    post: mockPost,
    put: mockPut,
  },
}));

vi.mock('@/constants', () => ({
  API_ENDPOINTS: {
    VENUES: '/venues',
    VENUE_SUBMIT: (id: string) => `/venues/${id}/submit`,
    UPLOAD_SIGNATURE: '/venues/upload-signature',
    MY_VENUES: '/venues/my-venues',
    VENUE_DRAFT: '/venues/draft',
    VENUE_UPDATE: (id: string) => `/venues/${id}`,
    VENUE_BY_ID: (id: string) => `/venues/${id}`,
  },
}));

describe('venueService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('createVenue', () => {
    it('should POST to VENUES endpoint', async () => {
      mockPost.mockResolvedValue({ data: { data: { id: 'venue-1' } } });
      const { createVenue } = await import('../../services/venueService');
      const result = await createVenue({ name: 'Test' });
      expect(mockPost).toHaveBeenCalledWith('/venues', { name: 'Test' });
      expect(result).toEqual({ id: 'venue-1' });
    });

    it('should fall back to response.data', async () => {
      mockPost.mockResolvedValue({ data: { id: 'venue-1' } });
      const { createVenue } = await import('../../services/venueService');
      const result = await createVenue({ name: 'Test' });
      expect(result).toEqual({ id: 'venue-1' });
    });
  });

  describe('submitVenue', () => {
    it('should POST to VENUE_SUBMIT endpoint', async () => {
      mockPost.mockResolvedValue({ data: { data: { status: 'PendingReview' } } });
      const { submitVenue } = await import('../../services/venueService');
      const result = await submitVenue('venue-1');
      expect(mockPost).toHaveBeenCalledWith('/venues/venue-1/submit');
      expect(result).toEqual({ status: 'PendingReview' });
    });
  });

  describe('getUploadSignature', () => {
    it('should GET upload-signature endpoint', async () => {
      mockGet.mockResolvedValue({ data: { data: { signature: 'abc' } } });
      const { getUploadSignature } = await import('../../services/venueService');
      const result = await getUploadSignature();
      expect(mockGet).toHaveBeenCalledWith('/venues/upload-signature');
      expect(result).toEqual({ signature: 'abc' });
    });
  });

  describe('getMyVenues', () => {
    it('should GET my-venues endpoint', async () => {
      mockGet.mockResolvedValue({ data: { data: [{ id: 'v1' }] } });
      const { getMyVenues } = await import('../../services/venueService');
      const result = await getMyVenues();
      expect(mockGet).toHaveBeenCalledWith('/venues/my-venues');
      expect(result).toEqual([{ id: 'v1' }]);
    });
  });

  describe('upsertVenueDraft', () => {
    it('should PUT to draft endpoint with step and formValues', async () => {
      mockPut.mockResolvedValue({ data: { data: { id: 'draft-1' } } });
      const { upsertVenueDraft } = await import('../../services/venueService');
      const formValues = { VenueName: 'Test' };
      const result = await upsertVenueDraft(1, formValues);
      expect(mockPut).toHaveBeenCalledWith('/venues/draft', { step: 1, formValues });
      expect(result).toEqual({ id: 'draft-1' });
    });
  });

  describe('getMyDraft', () => {
    it('should GET draft endpoint and return data', async () => {
      mockGet.mockResolvedValue({ data: { data: { step: 1 } } });
      const { getMyDraft } = await import('../../services/venueService');
      const result = await getMyDraft();
      expect(mockGet).toHaveBeenCalledWith('/venues/draft');
      expect(result).toEqual({ step: 1 });
    });

    it('should return null when no draft', async () => {
      mockGet.mockResolvedValue({ data: {} });
      const { getMyDraft } = await import('../../services/venueService');
      const result = await getMyDraft();
      expect(result).toBeNull();
    });
  });

  describe('updateVenue', () => {
    it('should PUT to venue update endpoint', async () => {
      mockPut.mockResolvedValue({ data: { data: { id: 'venue-1' } } });
      const { updateVenue } = await import('../../services/venueService');
      const result = await updateVenue('venue-1', { name: 'Updated' });
      expect(mockPut).toHaveBeenCalledWith('/venues/venue-1', { name: 'Updated' });
      expect(result).toEqual({ id: 'venue-1' });
    });
  });

  describe('getPublicVenues', () => {
    it('should GET venues with filters, page, limit', async () => {
      mockGet.mockResolvedValue({ data: { data: { venues: [{ id: 'v1' }], pagination: {} } } });
      const { getPublicVenues } = await import('../../services/venueService');
      const result = await getPublicVenues({ venueType: ['hall'] }, 1, 12);
      expect(mockGet).toHaveBeenCalledWith('/venues', {
        params: { venueType: ['hall'], page: 1, limit: 12 },
      });
      expect(result).toEqual({ venues: [{ id: 'v1' }], pagination: {} });
    });
  });

  describe('getVenueById', () => {
    it('should GET venue by id endpoint', async () => {
      mockGet.mockResolvedValue({ data: { data: { id: 'venue-1', name: 'Grand Hall' } } });
      const { getVenueById } = await import('../../services/venueService');
      const result = await getVenueById('venue-1');
      expect(mockGet).toHaveBeenCalledWith('/venues/venue-1');
      expect(result).toEqual({ id: 'venue-1', name: 'Grand Hall' });
    });
  });
});
