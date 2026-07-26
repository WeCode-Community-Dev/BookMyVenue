import { EmailTaskModel } from '../models/email-task.model';
import type { EmailIntentType, EmailTaskStatusType } from '../constants/email.constants';

const SEVEN_DAYS_MS = 7 * 24 * 60 * 60 * 1000;

export async function enqueueEmailTask(
  recipient: string,
  intent: EmailIntentType,
  subject: string,
  status: EmailTaskStatusType,
  metadata: Record<string, string>
): Promise<void> {
  await EmailTaskModel.create({
    recipient,
    intent,
    subject,
    status,
    retryAfter: new Date(),
    metadata,
    deleteAt: new Date(Date.now() + SEVEN_DAYS_MS),
  });
}
