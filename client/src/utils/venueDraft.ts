import type { AddVenueFormValues } from '@/types/venue.types';

// ─── Typed Draft Session ────────────────────────────────────────────────────

/**
 * Shape stored in sessionStorage for an in-progress venue wizard.
 * Cleared on submit or logout.
 */
export interface DraftSession {
  venueId: string; // MongoDB _id of the Draft venue document
  step: number; // which step to resume on: 0 | 1 | 2
  formValues: AddVenueFormValues;
}

const getSessionKey = (userId: string): string => `venue_draft_session_${userId}`;

export const saveDraftSession = (userId: string, data: DraftSession): void => {
  sessionStorage.setItem(getSessionKey(userId), JSON.stringify(data));
};

export const loadDraftSession = (userId: string): DraftSession | null => {
  const raw = sessionStorage.getItem(getSessionKey(userId));
  return raw ? (JSON.parse(raw) as DraftSession) : null;
};

export const clearDraftSession = (userId: string): void => {
  sessionStorage.removeItem(getSessionKey(userId));
};

// ─── Legacy helpers (kept for AuthContext.logout compatibility) ─────────────

const getDraftKey = (userId: string): string => `venue_draft_${userId}`;

/** @deprecated use saveDraftSession */
export const saveDraft = (userId: string, values: unknown): void =>
  sessionStorage.setItem(getDraftKey(userId), JSON.stringify(values));

/** @deprecated use loadDraftSession */
export const loadDraft = <T>(userId: string): T | null => {
  const raw = sessionStorage.getItem(getDraftKey(userId));
  return raw ? (JSON.parse(raw) as T) : null;
};

/** @deprecated use clearDraftSession */
export const clearDraft = (userId: string): void => sessionStorage.removeItem(getDraftKey(userId));
