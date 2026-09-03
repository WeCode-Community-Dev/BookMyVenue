import { describe, it, expect, afterEach, vi } from 'vitest';
import { getMissingEmailConfigVars, isFromDomainVerified } from '../../src/services/email.service';

afterEach(() => {
  vi.unstubAllEnvs();
});

const baseVars = () => ({
  RESEND_API_KEY: 're_test_key',
  EMAIL_FROM_NAME: 'BookMyVenue',
  EMAIL_FROM_EMAIL: 'noreply@bmv.ashishshaiju.com',
  FRONTEND_URL: 'https://bmv.ashishshaiju.com',
});

describe('getMissingEmailConfigVars', () => {
  it('does not require RESEND_DEV_RECIPIENT in production', () => {
    vi.stubEnv('NODE_ENV', 'production');
    Object.entries(baseVars()).forEach(([k, v]) => vi.stubEnv(k, v));
    vi.stubEnv('RESEND_DEV_RECIPIENT', '');

    expect(getMissingEmailConfigVars()).toEqual([]);
  });

  it('requires RESEND_DEV_RECIPIENT in development and reports its real name', () => {
    vi.stubEnv('NODE_ENV', 'development');
    Object.entries(baseVars()).forEach(([k, v]) => vi.stubEnv(k, v));
    vi.stubEnv('RESEND_DEV_RECIPIENT', '');

    const missing = getMissingEmailConfigVars();
    expect(missing).toContain('RESEND_DEV_RECIPIENT');
    expect(missing).not.toContain('RESEND_DEV_EMAIL_ADDRESS');
  });

  it('reports RESEND_API_KEY missing', () => {
    vi.stubEnv('NODE_ENV', 'production');
    vi.stubEnv('RESEND_API_KEY', '');
    vi.stubEnv('EMAIL_FROM_NAME', 'BookMyVenue');
    vi.stubEnv('EMAIL_FROM_EMAIL', 'noreply@bmv.ashishshaiju.com');
    vi.stubEnv('FRONTEND_URL', 'https://bmv.ashishshaiju.com');

    expect(getMissingEmailConfigVars()).toContain('RESEND_API_KEY');
  });
});

describe('isFromDomainVerified', () => {
  const domains = [
    { name: 'bmv.ashishshaiju.com', status: 'verified' },
    { name: 'pending.com', status: 'pending' },
  ];

  it('returns true when domain is present and verified', () => {
    expect(isFromDomainVerified('bmv.ashishshaiju.com', domains)).toBe(true);
  });

  it('returns false when domain is present but not verified', () => {
    expect(isFromDomainVerified('pending.com', domains)).toBe(false);
  });

  it('returns false when domain is not present', () => {
    expect(isFromDomainVerified('other.com', domains)).toBe(false);
  });
});
