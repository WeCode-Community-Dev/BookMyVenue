export interface SessionSummary {
  id: string;
  ipAddress: string;
  userAgent: string;
  lastLogin: string;
  createdAt: string;
  isCurrent: boolean;
}

export interface LoginResponse {
  userId?: string;
  id?: string;
  username: string;
  email: string;
}

export interface AuthMessageResponse {
  message?: string;
}
