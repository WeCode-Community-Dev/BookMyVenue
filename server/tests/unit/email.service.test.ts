import { describe, it, expect, afterEach, vi, beforeEach } from 'vitest';
import { emailService } from '../../src/services/email.service';

const sendMock = vi.fn();

vi.mock('resend', () => {
  return {
    Resend: vi.fn().mockImplementation(function () {
      return {
        emails: { send: (...args: unknown[]) => sendMock(...args) },
        domains: { list: vi.fn() },
      };
    }),
  };
});

beforeEach(() => {
  sendMock.mockReset();
  process.env.NODE_ENV = 'test';
  process.env.RESEND_API_KEY = 're_test_key';
  process.env.EMAIL_FROM_NAME = 'BookMyVenue';
  process.env.EMAIL_FROM_EMAIL = 'noreply@bmv.ashishshaiju.com';
});

afterEach(() => {
  vi.unstubAllEnvs();
});

describe('EmailService.sendPasswordResetEmail', () => {
  it('sends with the configured from address and returns success', async () => {
    sendMock.mockResolvedValueOnce({ data: { id: 'msg_1' }, error: null });

    const result = await emailService.sendPasswordResetEmail(
      'user@example.com',
      'https://bmv.ashishshaiju.com/reset?token=abc'
    );

    expect(result.success).toBe(true);
    expect(result.messageId).toBe('msg_1');
    expect(sendMock).toHaveBeenCalledTimes(1);
    const args = sendMock.mock.calls[0][0];
    expect(args.from).toBe('BookMyVenue <noreply@bmv.ashishshaiju.com>');
    expect(args.to).toBe('user@example.com');
    expect(args.html).toContain('Reset your password');
  });

  it('returns success:false when Resend returns an error', async () => {
    sendMock.mockResolvedValueOnce({ data: null, error: { message: 'from address not verified' } });

    const result = await emailService.sendPasswordResetEmail(
      'user@example.com',
      'https://bmv.ashishshaiju.com/reset?token=abc'
    );

    expect(result.success).toBe(false);
    expect(result.messageId).toBeUndefined();
  });

  it('returns success:false when Resend throws', async () => {
    sendMock.mockRejectedValueOnce(new Error('network down'));

    const result = await emailService.sendPasswordResetEmail(
      'user@example.com',
      'https://bmv.ashishshaiju.com/reset?token=abc'
    );

    expect(result.success).toBe(false);
  });
});
