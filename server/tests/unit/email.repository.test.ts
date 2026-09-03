import { describe, it, expect, beforeEach } from 'vitest';
import { EmailTaskModel } from '../../src/models/email-task.model';
import { EmailIntent, EmailTaskStatus } from '../../src/constants/email.constants';
import { enqueueEmailTask } from '../../src/services/email.repository';

describe('enqueueEmailTask', () => {
  beforeEach(async () => {
    await EmailTaskModel.deleteMany({});
  });

  it('creates a PENDING task with metadata and a 7-day deleteAt', async () => {
    await enqueueEmailTask(
      'owner@example.com',
      EmailIntent.VENUE_SUSPENDED,
      'Important: Your Venue "X" has been Suspended',
      EmailTaskStatus.PENDING,
      { venueName: 'X', reason: 'r' }
    );

    const task = await EmailTaskModel.findOne({ recipient: 'owner@example.com' }).lean();
    expect(task).not.toBeNull();
    expect(task?.intent).toBe(EmailIntent.VENUE_SUSPENDED);
    expect(task?.status).toBe(EmailTaskStatus.PENDING);
    expect(task?.retries).toBe(0);
    expect(task?.metadata?.venueName).toBe('X');
    expect(task && new Date(task.deleteAt).getTime()).toBeGreaterThan(
      Date.now() + 6 * 24 * 60 * 60 * 1000
    );
  });
});
