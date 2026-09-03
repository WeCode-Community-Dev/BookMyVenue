import { describe, it, expect, vi } from 'vitest';
import { renderHook } from '@testing-library/react';

vi.mock('@/context/AuthContext', () => ({
  AuthContext: {
    Consumer: ({ children }: { children: (value: unknown) => unknown }) => children({}),
  },
}));

describe('useAuth', () => {
  it('should throw when used outside AuthProvider', async () => {
    const { useAuth } = await import('../../hooks/useAuth');

    expect(() => {
      renderHook(() => useAuth());
    }).toThrow('useAuth must be used within an AuthProvider');
  });
});
