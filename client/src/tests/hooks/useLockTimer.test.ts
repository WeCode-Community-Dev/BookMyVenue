import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';

describe('useLockTimer', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-07-25T12:00:00Z'));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('should return 0 remaining when no expiresAt', async () => {
    const { useLockTimer } = await import('../../hooks/useLockTimer');
    const { result } = renderHook(() => useLockTimer(null));
    expect(result.current.remainingMs).toBe(0);
    expect(result.current.formattedTime).toBe('00:00');
    expect(result.current.isExpired).toBe(false);
  });

  it('should show remaining time in MM:SS', async () => {
    const { useLockTimer } = await import('../../hooks/useLockTimer');
    const future = new Date('2026-07-25T12:05:00Z');
    const { result } = renderHook(() => useLockTimer(future));

    expect(result.current.remainingMs).toBe(5 * 60 * 1000);
    expect(result.current.formattedTime).toBe('05:00');
    expect(result.current.isExpired).toBe(false);
  });

  it('should count down every second', async () => {
    const { useLockTimer } = await import('../../hooks/useLockTimer');
    const future = new Date('2026-07-25T12:02:00Z');
    const { result } = renderHook(() => useLockTimer(future));

    expect(result.current.formattedTime).toBe('02:00');

    act(() => {
      vi.advanceTimersByTime(1000);
    });

    expect(result.current.formattedTime).toBe('01:59');
  });

  it('should mark as expired when time runs out', async () => {
    const { useLockTimer } = await import('../../hooks/useLockTimer');
    const future = new Date('2026-07-25T12:00:01Z');
    const onExpire = vi.fn();
    const { result } = renderHook(() => useLockTimer(future, onExpire));

    expect(result.current.isExpired).toBe(false);

    act(() => {
      vi.advanceTimersByTime(1000);
    });

    expect(result.current.isExpired).toBe(true);
    expect(result.current.formattedTime).toBe('00:00');
    expect(onExpire).toHaveBeenCalledTimes(1);
  });

  it('should trigger onExpire exactly once when transitioning to expired', async () => {
    const { useLockTimer } = await import('../../hooks/useLockTimer');
    const future = new Date('2026-07-25T12:00:01Z');
    const onExpire = vi.fn();
    const { rerender } = renderHook(({ expiresAt, onExpire: oe }) => useLockTimer(expiresAt, oe), {
      initialProps: { expiresAt: future, onExpire },
    });

    expect(onExpire).toHaveBeenCalledTimes(0);

    act(() => {
      vi.advanceTimersByTime(1000);
    });

    expect(onExpire).toHaveBeenCalledTimes(1);

    rerender({ expiresAt: new Date('2026-07-25T12:00:01Z'), onExpire });

    expect(onExpire).toHaveBeenCalledTimes(1);
  });

  it('should round up to nearest second', async () => {
    const { useLockTimer } = await import('../../hooks/useLockTimer');
    const future = new Date('2026-07-25T12:00:00.500Z');
    const { result } = renderHook(() => useLockTimer(future));
    expect(result.current.formattedTime).toBe('00:01');
  });
});
