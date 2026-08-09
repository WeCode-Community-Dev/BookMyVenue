import { describe, it, expect, beforeEach, vi } from 'vitest';
import { EmailTaskModel } from '../../src/models/email-task.model';
import { EmailIntent, EmailTaskStatus } from '../../src/constants/email.constants';
import { processNextTask } from '../../src/workers/email.worker';

const sendMock = vi.fn();

vi.mock('../../src/services/email.service', () => ({
  emailService: {
    sendPasswordResetEmail: (...args: unknown[]) => sendMock(...args),
  },
  validateEmailConfig: vi.fn(),
  getMissingEmailConfigVars: () => [],
  isFromDomainVerified: vi.fn(),
  verifyEmailFromDomain: vi.fn(),
}));

async function seedTask(overrides: Partial<Record<string, unknown>> = {}) {
  return EmailTaskModel.create({
    intent: EmailIntent.PASSWORD_RESET,
    recipient: 'user@example.com',
    subject: 'Reset your BookMyVenue password',
    status: EmailTaskStatus.PENDING,
    metadata: { resetLink: 'https://bmv.ashishshaiju.com/reset?token=abc' },
    retryAfter: new Date(Date.now() - 1000),
    deleteAt: new Date(Date.now() + 86400000),
    ...overrides,
  });
}

describe('processNextTask', () => {
  beforeEach(async () => {
    await EmailTaskModel.deleteMany({});
    sendMock.mockReset();
  });

  it('marks a task completed after a successful send', async () => {
    sendMock.mockResolvedValueOnce({ success: true, messageId: 'msg_1' });
    const task = await seedTask();

    await processNextTask();

    const updated = await EmailTaskModel.findById(task._id).lean();
    expect(updated?.status).toBe(EmailTaskStatus.COMPLETED);
    expect(updated?.retries).toBe(0);
  });

  it('schedules a retry with backoff on failure', async () => {
    sendMock.mockRejectedValueOnce(new Error('boom'));
    const task = await seedTask();
    const before = Date.now();

    await processNextTask();

    const updated = await EmailTaskModel.findById(task._id).lean();
    expect(updated?.status).toBe(EmailTaskStatus.PENDING);
    expect(updated?.retries).toBe(1);
    expect(updated?.lastError).toBe('boom');
    expect(updated && new Date(updated.retryAfter).getTime()).toBeGreaterThan(before + 25000);
  });

  it('marks a task failed permanently after MAX_RETRIES', async () => {
    sendMock.mockRejectedValue(new Error('boom'));
    const task = await seedTask({ retries: 2 });

    await processNextTask();

    const updated = await EmailTaskModel.findById(task._id).lean();
    expect(updated?.status).toBe(EmailTaskStatus.FAILED);
    expect(updated?.retries).toBe(3);
  });

  it('does nothing when no task is pending', async () => {
    await processNextTask();
    const count = await EmailTaskModel.countDocuments();
    expect(count).toBe(0);
  });
});
