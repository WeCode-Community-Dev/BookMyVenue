import { Types } from 'mongoose';
import { SlotMutexModel } from '../modules/booking/models/slotMutex.model';

const ACQUIRE_RETRY_ATTEMPTS = 5;
const ACQUIRE_RETRY_DELAY_MS = 200;

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// Attempts to acquire an exclusive mutex for a given venue+date by
// inserting a uniquely-indexed document. Retries briefly if another
// request currently holds it. Returns false if the mutex could not be
// acquired within the retry budget (caller should surface a
// "try again" error rather than proceed unsynchronized).
export async function acquireSlotMutex(venueId: string, date: string): Promise<boolean> {
  const vId = new Types.ObjectId(venueId);
  for (let attempt = 0; attempt < ACQUIRE_RETRY_ATTEMPTS; attempt++) {
    try {
      await SlotMutexModel.create({ venueId: vId, date, lockedAt: new Date() });
      return true;
    } catch (err) {
      const error = err as { code?: number };
      if (error.code !== 11000) throw err;
      await sleep(ACQUIRE_RETRY_DELAY_MS);
    }
  }
  return false;
}

export async function releaseSlotMutex(venueId: string, date: string): Promise<void> {
  const vId = new Types.ObjectId(venueId);
  await SlotMutexModel.deleteOne({ venueId: vId, date });
}
