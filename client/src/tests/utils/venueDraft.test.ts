import { describe, it, expect, beforeEach } from 'vitest';

describe('venueDraft', () => {
  const userId = 'user-123';

  beforeEach(() => {
    sessionStorage.clear();
  });

  describe('saveDraftSession / loadDraftSession', () => {
    it('should save and load draft session', async () => {
      const { saveDraftSession, loadDraftSession } = await import('../../utils/venueDraft');
      const data = {
        venueId: 'venue-1',
        step: 1,
        formValues: { VenueName: 'Test' } as Record<string, unknown>,
      };
      saveDraftSession(userId, data);
      const loaded = loadDraftSession(userId);
      expect(loaded).toEqual(data);
    });

    it('should return null when no draft exists', async () => {
      const { loadDraftSession } = await import('../../utils/venueDraft');
      expect(loadDraftSession(userId)).toBeNull();
    });
  });

  describe('clearDraftSession', () => {
    it('should remove draft from sessionStorage', async () => {
      const { saveDraftSession, clearDraftSession, loadDraftSession } =
        await import('../../utils/venueDraft');
      saveDraftSession(userId, {
        venueId: 'v1',
        step: 0,
        formValues: {} as Record<string, unknown>,
      });
      clearDraftSession(userId);
      expect(loadDraftSession(userId)).toBeNull();
    });
  });

  describe('legacy helpers', () => {
    it('saveDraft should store serialized data', async () => {
      const { saveDraft, loadDraft } = await import('../../utils/venueDraft');
      saveDraft(userId, { name: 'Test' });
      const loaded = loadDraft<{ name: string }>(userId);
      expect(loaded).toEqual({ name: 'Test' });
    });

    it('clearDraft should remove legacy draft', async () => {
      const { saveDraft, clearDraft, loadDraft } = await import('../../utils/venueDraft');
      saveDraft(userId, { name: 'Test' });
      clearDraft(userId);
      expect(loadDraft(userId)).toBeNull();
    });

    it('loadDraft should return null for missing key', async () => {
      const { loadDraft } = await import('../../utils/venueDraft');
      expect(loadDraft('nonexistent')).toBeNull();
    });
  });
});
