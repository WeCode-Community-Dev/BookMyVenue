import mongoose from 'mongoose';

export async function runInTransaction<T>(
  work: (session: mongoose.ClientSession) => Promise<T>
): Promise<T> {
  const session = await mongoose.startSession();
  try {
    return await session.withTransaction(() => work(session), {
      maxCommitTimeMS: 10000,
    });
  } catch (error) {
    if (
      error instanceof Error &&
      (error.message.includes('Unable to acquire IX lock') ||
        error.message.includes('TransientTransactionError') ||
        error.message.includes('WriteConflict'))
    ) {
      await new Promise((resolve) => setTimeout(resolve, 100));
      return await session.withTransaction(() => work(session), {
        maxCommitTimeMS: 10000,
      });
    }
    throw error;
  } finally {
    await session.endSession();
  }
}
