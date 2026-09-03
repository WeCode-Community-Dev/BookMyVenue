import { useMemo, useState } from 'react';
import { formatDistanceToNow } from 'date-fns';
import { FiMonitor } from 'react-icons/fi';
import { useSessions } from '@/hooks/useSessions';
import { useToast } from '@/hooks/useToast';
import { extractErrorMessage } from '@/utils/toast';
import { parseUserAgent } from '@/utils/parseUserAgent';
import * as authService from '@/services/authService';
import Spinner from '@/components/common/Spinner';

const NEW_SESSION_REVOKE_LOCK_MS = 48 * 60 * 60 * 1000;

const DevicesCard = () => {
  const { data: sessions, isLoading, refetch } = useSessions();
  const toast = useToast();
  const [revokingId, setRevokingId] = useState<string | null>(null);
  const [revokingOthers, setRevokingOthers] = useState(false);
  const [now] = useState(() => Date.now());

  const currentSession = useMemo(() => sessions?.find((s) => s.isCurrent), [sessions]);

  const lockInfo = useMemo(() => {
    if (!currentSession) return { locked: false, unlocksAt: null as Date | null };

    const currentAgeMs = now - new Date(currentSession.createdAt).getTime();
    if (currentAgeMs >= NEW_SESSION_REVOKE_LOCK_MS) return { locked: false, unlocksAt: null };

    const hasOlderSession = (sessions ?? []).some(
      (s) => !s.isCurrent && new Date(s.createdAt) < new Date(currentSession.createdAt)
    );

    return {
      locked: hasOlderSession,
      unlocksAt: new Date(
        new Date(currentSession.createdAt).getTime() + NEW_SESSION_REVOKE_LOCK_MS
      ),
    };
  }, [sessions, currentSession, now]);

  const anyActionInFlight = revokingId !== null || revokingOthers;

  const handleRevoke = async (sessionId: string) => {
    if (anyActionInFlight) return;
    setRevokingId(sessionId);
    try {
      await authService.revokeSession(sessionId);
      toast.success('Device signed out');
      refetch();
    } catch (error) {
      toast.error(extractErrorMessage(error) || 'Failed to sign out that device');
    } finally {
      setRevokingId(null);
    }
  };

  const handleRevokeOthers = async () => {
    if (anyActionInFlight) return;
    setRevokingOthers(true);
    try {
      const result = await authService.logoutOtherSessions();
      toast.success(`Signed out ${result.revokedCount} other device(s)`);
      refetch();
    } catch (error) {
      toast.error(extractErrorMessage(error) || 'Failed to sign out other devices');
    } finally {
      setRevokingOthers(false);
    }
  };

  const lockTooltip = lockInfo.unlocksAt
    ? `Unlocks ${formatDistanceToNow(lockInfo.unlocksAt, { addSuffix: true })}`
    : undefined;

  return (
    <div className="bg-[var(--bg-tertiary)] border border-[var(--bg-grey)] rounded-2xl p-5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-[var(--text-primary)] font-semibold">
          <FiMonitor className="text-[var(--text-secondary)]" />
          Devices
        </div>
        {sessions && sessions.length > 1 && (
          <button
            type="button"
            onClick={handleRevokeOthers}
            disabled={anyActionInFlight || lockInfo.locked}
            title={lockInfo.locked ? lockTooltip : undefined}
            className="flex items-center gap-1.5 text-sm font-medium text-red-500 hover:underline disabled:text-[var(--text-secondary)] disabled:no-underline disabled:cursor-not-allowed cursor-pointer"
          >
            {revokingOthers && <Spinner size="h-3 w-3" />}
            Log out of all other devices
          </button>
        )}
      </div>

      <div className="mt-3 space-y-2">
        {isLoading && (
          <p className="flex items-center gap-2 text-sm text-[var(--text-secondary)]">
            <Spinner size="h-3.5 w-3.5" />
            Loading devices...
          </p>
        )}

        {sessions?.map((session) => {
          const isBlocked =
            !session.isCurrent &&
            lockInfo.locked &&
            currentSession &&
            new Date(session.createdAt) < new Date(currentSession.createdAt);

          return (
            <div
              key={session.id}
              className="flex items-center justify-between gap-3 rounded-xl border border-[var(--bg-grey)] px-3 py-2.5"
            >
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-medium text-[var(--text-primary)] truncate">
                    {parseUserAgent(session.userAgent)}
                  </p>
                  {session.isCurrent && (
                    <span className="text-xs px-2 py-0.5 rounded-full bg-[var(--bg-green)]/10 text-[var(--bg-green)] font-medium shrink-0">
                      This device
                    </span>
                  )}
                </div>
                <p className="text-xs text-[var(--text-secondary)] truncate">
                  {session.ipAddress} · Active{' '}
                  {formatDistanceToNow(new Date(session.lastLogin), { addSuffix: true })}
                </p>
              </div>

              {!session.isCurrent && (
                <button
                  type="button"
                  onClick={() => handleRevoke(session.id)}
                  disabled={anyActionInFlight || isBlocked}
                  title={isBlocked ? lockTooltip : undefined}
                  className="flex items-center gap-1.5 text-sm font-medium text-red-500 hover:underline disabled:text-[var(--text-secondary)] disabled:no-underline disabled:cursor-not-allowed cursor-pointer shrink-0"
                >
                  {revokingId === session.id && <Spinner size="h-3 w-3" />}
                  Log out
                </button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default DevicesCard;
