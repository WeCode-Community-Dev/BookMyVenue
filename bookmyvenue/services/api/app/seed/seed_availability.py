from datetime import date, timedelta, time

from sqlalchemy.orm import Session

from models.availability import Availability
from models.booking import BookingTypeEnum
from models.venue import Venue

HOURLY_SLOTS = [
    (time(9, 0), time(10, 0)),
    (time(10, 0), time(11, 0)),
    (time(11, 0), time(12, 0)),
    (time(12, 0), time(13, 0)),
    (time(14, 0), time(15, 0)),
    (time(15, 0), time(16, 0)),
    (time(16, 0), time(17, 0)),
    (time(17, 0), time(18, 0)),
]


def seed_availability(db: Session):

    print("Seeding availability...")

    venues = db.query(Venue).all()

    created = 0

    today = date.today()

    for venue in venues:

        for day in range(30):

            current_date = today + timedelta(days=day)

            # Skip if already seeded
            existing = (
                db.query(Availability)
                .filter(
                    Availability.venue_id == venue.id,
                    Availability.date == current_date
                )
                .first()
            )

            if existing:
                continue

            # DAILY
            if venue.supports_daily:

                db.add(
                    Availability(
                        venue_id=venue.id,
                        date=current_date,
                        booking_type=BookingTypeEnum.DAILY,
                        start_time=None,
                        end_time=None,
                        is_booked=False
                    )
                )

                created += 1

            # HOURLY
            if venue.supports_hourly:

                for start, end in HOURLY_SLOTS:

                    db.add(
                        Availability(
                            venue_id=venue.id,
                            date=current_date,
                            booking_type=BookingTypeEnum.HOURLY,
                            start_time=start,
                            end_time=end,
                            is_booked=False
                        )
                    )

                    created += 1

    db.commit()

    print(f"✓ {created} availability rows created.")
