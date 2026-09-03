import { useCallback, useEffect, useRef, useState } from 'react';
import { useAuth } from './useAuth';
import * as wishlistService from '@/services/wishlistService';
import { STORAGE_KEYS } from '@/constants';

function getSessionId(): string {
  let sessionId = localStorage.getItem(STORAGE_KEYS.SESSION_TOKEN);
  if (!sessionId) {
    sessionId = crypto.randomUUID();
    localStorage.setItem(STORAGE_KEYS.SESSION_TOKEN, sessionId);
  }
  return sessionId;
}

function getLocalWishlistKey(): string {
  return `${STORAGE_KEYS.WISHLIST_PREFIX}${getSessionId()}`;
}

export function getLocalWishlist(): Record<string, boolean> {
  try {
    const data = localStorage.getItem(getLocalWishlistKey());
    return data ? JSON.parse(data) : {};
  } catch (e) {
    console.error('Failed to parse localStorage wishlist:', e);
    return {};
  }
}

function saveLocalWishlist(status: Record<string, boolean>): void {
  try {
    localStorage.setItem(getLocalWishlistKey(), JSON.stringify(status));
  } catch (e) {
    console.error('Failed to save wishlist to localStorage:', e);
  }
}

export function clearLocalWishlist(): void {
  localStorage.removeItem(getLocalWishlistKey());
}

interface UseToggleWishlistReturn {
  toggleWishlist: (venueId: string) => Promise<boolean>;
  isLoading: boolean;
  error: string | null;
}

export function useToggleWishlist(): UseToggleWishlistReturn {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inFlightRef = useRef<Set<string>>(new Set());

  const toggleWishlist = useCallback(
    async (venueId: string): Promise<boolean> => {
      // Prevent double-toggle while request is in flight
      if (inFlightRef.current.has(venueId)) {
        return false;
      }

      inFlightRef.current.add(venueId);
      setIsLoading(true);
      setError(null);

      try {
        // If not authenticated, toggle in localStorage only — no API call
        if (!user) {
          const localStatus = getLocalWishlist();
          const newStatus = { ...localStatus, [venueId]: !localStatus[venueId] };
          saveLocalWishlist(newStatus);
          return newStatus[venueId];
        }

        // If authenticated, use API
        const result = await wishlistService.toggleWishlist(venueId);
        return result.wishlisted;
      } catch (err) {
        const errorMsg = err instanceof Error ? err.message : 'Failed to toggle wishlist';
        setError(errorMsg);
        console.error('toggleWishlist error:', errorMsg);
        return false;
      } finally {
        inFlightRef.current.delete(venueId);
        setIsLoading(false);
      }
    },
    [user]
  );

  return {
    toggleWishlist,
    isLoading,
    error,
  };
}

/**
 * Merges a guest's locally-stored wishlist into the account's wishlist once,
 * the moment `user` transitions from logged-out to logged-in.
 */
export function useWishlistSync(): void {
  const { user } = useAuth();
  const hasSyncedRef = useRef(false);

  useEffect(() => {
    if (!user || hasSyncedRef.current) return;
    hasSyncedRef.current = true;

    const localStatus = getLocalWishlist();
    const likedVenueIds = Object.keys(localStatus).filter((id) => localStatus[id]);
    if (!likedVenueIds.length) return;

    wishlistService
      .syncWishlist(likedVenueIds)
      .then(() => clearLocalWishlist())
      .catch((err) => console.error('Failed to sync wishlist on login:', err));
  }, [user]);
}
