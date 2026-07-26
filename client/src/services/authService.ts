import { axiosInstance } from '@/config/axios';
import { API_ENDPOINTS } from '@/constants';

export interface SessionSummary {
  id: string;
  ipAddress: string;
  userAgent: string;
  lastLogin: string;
  createdAt: string;
  isCurrent: boolean;
}

export async function changePassword(oldPassword: string, newPassword: string): Promise<void> {
  await axiosInstance.patch(API_ENDPOINTS.CHANGE_PASSWORD, { oldPassword, newPassword });
}

export async function getSessions(): Promise<SessionSummary[]> {
  const res = await axiosInstance.get(API_ENDPOINTS.SESSIONS);
  return res.data?.data ?? res.data;
}

export async function revokeSession(sessionId: string): Promise<void> {
  await axiosInstance.delete(API_ENDPOINTS.SESSION_BY_ID(sessionId));
}

export async function logoutOtherSessions(): Promise<{ revokedCount: number }> {
  const res = await axiosInstance.post(API_ENDPOINTS.LOGOUT_OTHER_SESSIONS);
  return res.data?.data ?? res.data;
}
