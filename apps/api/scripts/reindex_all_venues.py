#!/usr/bin/env python3
"""
Re-enqueue ALL venues for search indexing.
"""

import logging
import sys

from app.core.database import SessionLocal
from app.modules.search.indexer import enqueue_job
from app.modules.venue.models import Venue, VenueStatus
from app.modules.booking.models import Booking
from app.modules.profile.models import Profile

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


def reindex_all_venues(batch_size: int = 200):
    db = SessionLocal()
    processed = 0
    total = 0

    try:
        # Count total venues
        total = db.query(Venue).filter(Venue.deleted_at.is_(None)).count()
        logger.info(f"Found {total} venues to reindex.")

        offset = 0

        while True:
            venues = (
                db.query(Venue)
                .filter(Venue.deleted_at.is_(None))
                # .filter(Venue.status == VenueStatus.approved)   # Uncomment if needed
                # .filter(Venue.is_active == True)
                .order_by(Venue.id)
                .offset(offset)
                .limit(batch_size)
                .all()
            )

            if not venues:
                break

            for venue in venues:
                try:
                    enqueue_job(db, venue.id, "reindex")
                    processed += 1
                    if processed % 50 == 0:
                        logger.info(f"Progress: {processed}/{total} venues enqueued")
                except Exception as e:
                    logger.error(f"Failed to enqueue venue {venue.id}: {e}")

            offset += batch_size
            db.commit()  # Commit periodically

        logger.info(f"✅ Successfully enqueued {processed} out of {total} venues.")

    except Exception as exc:
        logger.exception("Reindexing failed")
        sys.exit(1)
    finally:
        db.close()


if __name__ == "__main__":
    reindex_all_venues()
