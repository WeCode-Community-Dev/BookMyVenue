export const TokenRevocationReason = {
  ADMIN_REVOKED: 'admin:revoked',
  EXPIRED: 'system:expired',
  INVALID: 'system:invalid',
  PASSWORD_CHANGED: 'system:password_changed',
  PASSWORD_REUSE_ATTEMPT: 'system:password_reuse_attempt',
  SECURITY_BREACH: 'admin:security_breach',
  SUSPICIOUS_ACTIVITY: 'system:suspicious_activity',
  TOKEN_ROTATION: 'system:token_rotation',
  USER_LOGIN: 'system:user_login',
  USER_LOGOUT: 'user:manual_logout',
  USER_REVOKED: 'user:revoked',
} as const;

export type TokenRevocationReasonType =
  (typeof TokenRevocationReason)[keyof typeof TokenRevocationReason];

export const AuthConstants = {
  MAX_ACTIVE_TOKENS: 3,
  MAX_EMAILS_PER_HR: 5,
  MAX_REQUESTS_PER_HR: 10,
  RESEND_COOLDOWN_MS: 30 * 1000, // 30s
  TOKEN_EXPIRY_MS: 15 * 60 * 1000, //15mins
  SESSION_ABSOLUTE_EXPIRY_MS: 30 * 24 * 60 * 60 * 1000, // 30d
  NEW_SESSION_REVOKE_LOCK_MS: 48 * 60 * 60 * 1000, // 48h
} as const;
