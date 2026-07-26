import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
  changePassword,
  getSessions,
  revokeSession,
  logoutOtherSessions,
} from '@/services/authService';
import { axiosInstance } from '@/config/axios';
import { API_ENDPOINTS } from '@/constants';

vi.mock('@/config/axios', () => ({
  axiosInstance: {
    get: vi.fn(),
    post: vi.fn(),
    patch: vi.fn(),
    delete: vi.fn(),
  },
}));

describe('client authService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should call changePassword endpoint with old and new password', async () => {
    vi.mocked(axiosInstance.patch).mockResolvedValueOnce({ data: { success: true } });

    await changePassword('OldPass123!', 'NewPass123!');

    expect(axiosInstance.patch).toHaveBeenCalledWith(API_ENDPOINTS.CHANGE_PASSWORD, {
      oldPassword: 'OldPass123!',
      newPassword: 'NewPass123!',
    });
  });

  it('should fetch user sessions list via getSessions', async () => {
    const mockSessions = [
      {
        id: 'sess_1',
        ipAddress: '127.0.0.1',
        userAgent: 'Chrome',
        lastLogin: '2026-07-22',
        createdAt: '2026-07-22',
        isCurrent: true,
      },
    ];

    vi.mocked(axiosInstance.get).mockResolvedValueOnce({ data: { data: mockSessions } });

    const result = await getSessions();

    expect(axiosInstance.get).toHaveBeenCalledWith(API_ENDPOINTS.SESSIONS);
    expect(result).toEqual(mockSessions);
  });

  it('should revoke a session via revokeSession', async () => {
    vi.mocked(axiosInstance.delete).mockResolvedValueOnce({ data: { success: true } });

    await revokeSession('sess_123');

    expect(axiosInstance.delete).toHaveBeenCalledWith(API_ENDPOINTS.SESSION_BY_ID('sess_123'));
  });

  it('should call logoutOtherSessions and return revoked count', async () => {
    vi.mocked(axiosInstance.post).mockResolvedValueOnce({ data: { data: { revokedCount: 2 } } });

    const result = await logoutOtherSessions();

    expect(axiosInstance.post).toHaveBeenCalledWith(API_ENDPOINTS.LOGOUT_OTHER_SESSIONS);
    expect(result).toEqual({ revokedCount: 2 });
  });
});
