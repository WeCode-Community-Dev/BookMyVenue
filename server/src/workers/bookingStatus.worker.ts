import { BookingModel } from '../modules/booking/models/booking.model.js';
import { BookingStatus } from '../constants/booking.constants.js';
import { logInfo } from '../utils/logger.js';

const POLL_INTERVAL_MS = 60_000;
let intervalHandle: ReturnType<typeof setInterval> | null = null;

export function startBookingStatusWorker(): void {
  logInfo('Booking status worker started', { module: 'bookingStatus.worker' });
  void runOnce();
  intervalHandle = setInterval(() => {
    void runOnce();
  }, POLL_INTERVAL_MS);
}

async function runOnce(): Promise<void> {
  const now = new Date();
  const nowMinutes = now.getHours() * 60 + now.getMinutes();
  const nowDate = now.toISOString().slice(0, 10);

  // 1. Confirmed bookings past endTime → completed
  const pastConfirmed = await BookingModel.updateMany(
    {
      status: BookingStatus.CONFIRMED,
      $or: [{ date: { $lt: nowDate } }, { date: nowDate, endTime: { $lte: nowMinutes } }],
    },
    { $set: { status: BookingStatus.COMPLETED } }
  ).lean();

  if (pastConfirmed.modifiedCount > 0) {
    logInfo(`Marked ${String(pastConfirmed.modifiedCount)} confirmed bookings as completed`, {
      module: 'bookingStatus.worker',
    });
  }

  // 2. Confirmed bookings currently active → in_progress
  const activeConfirmed = await BookingModel.updateMany(
    {
      status: BookingStatus.CONFIRMED,
      date: nowDate,
      startTime: { $lte: nowMinutes },
      endTime: { $gt: nowMinutes },
    },
    { $set: { status: BookingStatus.IN_PROGRESS } }
  ).lean();

  if (activeConfirmed.modifiedCount > 0) {
    logInfo(`Marked ${String(activeConfirmed.modifiedCount)} confirmed bookings as in_progress`, {
      module: 'bookingStatus.worker',
    });
  }

  // 3. In-progress bookings past endTime → completed
  const pastInProgress = await BookingModel.updateMany(
    {
      status: BookingStatus.IN_PROGRESS,
      $or: [{ date: { $lt: nowDate } }, { date: nowDate, endTime: { $lte: nowMinutes } }],
    },
    { $set: { status: BookingStatus.COMPLETED } }
  ).lean();

  if (pastInProgress.modifiedCount > 0) {
    logInfo(`Marked ${String(pastInProgress.modifiedCount)} in_progress bookings as completed`, {
      module: 'bookingStatus.worker',
    });
  }
}

export function stopBookingStatusWorker(): void {
  if (intervalHandle) {
    clearInterval(intervalHandle);
    intervalHandle = null;
    logInfo('Booking status worker stopped', { module: 'bookingStatus.worker' });
  }
}
