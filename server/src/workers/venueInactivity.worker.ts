import { VenueModel } from '../modules/venue/venue.model';
import { logModerationAction } from '../modules/moderation/moderationActivity.service';
import { logInfo, logError } from '../utils/logger';

// Closes venues whose wind-down has elapsed; stamps lastInactiveAt, which the cooldown runs from
export async function closeVenuesPastWindDown(): Promise<number> {
  const now = new Date();

  const due = await VenueModel.find({
    status: 'Approved',
    'inactivity.approvedAt': { $exists: true },
    'inactivity.blockedAfterDate': { $lte: now },
    deleted: false,
  })
    .select('_id name inactivity.blockedAfterDate')
    .lean()
    .exec();

  let closedCount = 0;

  for (const venue of due) {
    try {
      // Re-assert both conditions so an owner cancelling mid-run wins the race
      const closed = await VenueModel.findOneAndUpdate(
        {
          _id: venue._id,
          status: 'Approved',
          'inactivity.blockedAfterDate': { $lte: now },
        },
        {
          $set: {
            status: 'Inactive',
            'inactivity.inactiveAt': now,
            'inactivity.lastInactiveAt': now,
          },
          $unset: { 'inactivity.blockedAfterDate': '' },
        },
        { new: true }
      ).exec();

      if (closed) {
        closedCount += 1;
        await logModerationAction('venue_closed', venue._id.toString(), 'venue', {
          actorRole: 'system',
          reason: 'Wind-down period elapsed; venue closed automatically',
          metadata: { blockedAfterDate: venue.inactivity?.blockedAfterDate },
        });
      }
    } catch (err: unknown) {
      logError('Failed to close venue after wind-down', {
        module: 'venueInactivity.worker.ts/closeVenuesPastWindDown',
        venueId: venue._id,
        error: (err as Error).message,
      });
    }
  }

  if (closedCount > 0) {
    logInfo('Closed venues whose wind-down period elapsed', { count: closedCount });
  }

  return closedCount;
}

export function startVenueInactivityWorker(): void {
  // Every 6 hours; the transition is date-granular
  setInterval(
    () => {
      void closeVenuesPastWindDown().catch((err: unknown) => {
        logError('Venue inactivity worker error', { error: err });
      });
    },
    6 * 60 * 60 * 1000
  );

  // Run at startup too, so a restart doesn't delay an overdue closure
  setTimeout(() => {
    void closeVenuesPastWindDown().catch((err: unknown) => {
      logError('Venue inactivity worker startup error', { error: err });
    });
  }, 5000);
}
