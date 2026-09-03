import React, { useState, useEffect } from 'react';

interface UseLockTimerResult {
  formattedTime: string;
  isExpired: boolean;
  remainingMs: number;
}

/**
 * A hook to track countdown to an absolute expiration timestamp.
 * Returns the remaining time in "MM:SS" format and an isExpired flag.
 * Triggers onExpire callback precisely when the timer hits zero.
 */
export function useLockTimer(
  expiresAt: string | Date | null | undefined,
  onExpire?: () => void
): UseLockTimerResult {
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    if (!expiresAt) return;

    // Update current time every second
    const intervalId = setInterval(() => {
      setNow(Date.now());
    }, 1000);

    return () => clearInterval(intervalId);
  }, [expiresAt]);

  const remainingMs = expiresAt ? Math.max(0, new Date(expiresAt).getTime() - now) : 0;
  const isExpired = expiresAt ? remainingMs === 0 : false;

  // Track previous expiration state to trigger onExpire exactly once when transitioning to expired
  const prevIsExpired = React.useRef(isExpired);
  useEffect(() => {
    if (isExpired && !prevIsExpired.current) {
      if (onExpire) onExpire();
    }
    prevIsExpired.current = isExpired;
  }, [isExpired, onExpire]);

  // Format as MM:SS
  const totalSeconds = Math.ceil(remainingMs / 1000);
  const m = Math.floor(totalSeconds / 60);
  const s = totalSeconds % 60;
  const formattedTime = `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;

  return { formattedTime, isExpired, remainingMs };
}
