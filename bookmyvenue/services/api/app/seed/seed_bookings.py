import random

from sqlalchemy.orm import Session

from models.user import User, RoleEnum
from models.venue import Venue
from models.availability import Availability
from models.booking import (
    Booking,
    BookingTypeEnum,
    BookingStatusEnum,
    PaymentEnum,
)
from models.booking_slot import BookingSlot

from config import TAX_PERCENT, PLATFORM_FEE


def seed_bookings(db: Session):

    print("Seeding bookings...")

    users = (
        db.query(User)
        .filter(User.role == RoleEnum.BOOKER)
        .all()
    )

    venues = db.query(Venue).all()

    created = 0

    # create roughly 70 bookings
    for _ in range(70):

        venue = random.choice(venues)
        user = random.choice(users)

        booking_type = random.choice(
            [
                BookingTypeEnum.HOURLY,
                BookingTypeEnum.DAILY,
            ]
        )

        # venue must support booking type
        if booking_type == BookingTypeEnum.HOURLY and not venue.supports_hourly:
            continue

        if booking_type == BookingTypeEnum.DAILY and not venue.supports_daily:
            continue

        available_slots = (
            db.query(Availability)
            .filter(
                Availability.venue_id == venue.id,
                Availability.booking_type == booking_type,
                Availability.is_booked == False,
            )
            .order_by(Availability.date, Availability.start_time)
            .all()
        )

        if not available_slots:
            continue

        if booking_type == BookingTypeEnum.DAILY:

            selected_slots = [random.choice(available_slots)]

        else:

            slot_count = random.randint(1, 3)

            if len(available_slots) < slot_count:
                continue

            selected_slots = random.sample(
                available_slots,
                slot_count,
            )

        number_of_slots = len(selected_slots)

        if booking_type == BookingTypeEnum.HOURLY:
            base_price = venue.hourly_price * number_of_slots
        else:
            base_price = venue.daily_price * number_of_slots

        tax_amount = base_price * (TAX_PERCENT / 100)

        platform_fee = PLATFORM_FEE

        total_amount = (
            base_price
            + tax_amount
            + platform_fee
        )

        status = random.choices(
            [
                BookingStatusEnum.PENDING,
                BookingStatusEnum.CONFIRMED,
                BookingStatusEnum.REJECTED,
            ],
            weights=[20, 60, 20],
        )[0]

        payment = (
            PaymentEnum.PAID
            if status == BookingStatusEnum.CONFIRMED
            else random.choice(
                [
                    PaymentEnum.UNPAID,
                    PaymentEnum.PAID,
                ]
            )
        )

        booking = Booking(
            venue_id=venue.id,
            booker_id=user.id,
            booking_type=booking_type,
            base_price=base_price,
            tax_amount=tax_amount,
            platform_fee=platform_fee,
            total_amount=total_amount,
            status=status,
            payment_status=payment,
        )

        db.add(booking)

        db.flush()

        for slot in selected_slots:

            slot.is_booked = True

            db.add(
                BookingSlot(
                    booking_id=booking.id,
                    availability_id=slot.id,
                )
            )

        if status == BookingStatusEnum.REJECTED:

            for slot in selected_slots:
                slot.is_booked = False

        created += 1

    db.commit()

    print(f"✓ {created} bookings created.")
