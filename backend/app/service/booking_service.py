from datetime import datetime, timedelta, date, timezone
from typing import List, Dict, Any
from uuid import UUID, uuid4
import razorpay

from fastapi import HTTPException, status
from sqlalchemy.orm import Session, joinedload

from app.core.config import settings
from app.model.booking import Booking, BookingStatus
from app.model.venue_model import Venue, VenueSlot, VerificationStatus
from app.schema.venue_schema import validate_slot_duration
from app.schema.booking_schema import CheckoutRequest, PaymentVerificationRequest


def get_now_comparable(dt: datetime) -> datetime:
    from datetime import timezone
    if dt.tzinfo is not None:
        return datetime.now(timezone.utc)
    else:
        return datetime.utcnow()


class BookingService:

    def checkout_booking(
        self,
        db: Session,
        user_id: UUID,
        data: CheckoutRequest,
    ) -> Booking:
        # 1. Fetch the venue
        venue = db.query(Venue).filter(Venue.id == data.venue_id).first()
        if not venue:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND, detail="Venue not found."
            )

        if venue.verification_status != VerificationStatus.APPROVED:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="This venue is not available for bookings.",
            )

        # 2. Fetch slots and validate they belong to this venue
        slots = (
            db.query(VenueSlot)
            .filter(
                VenueSlot.id.in_(data.slot_ids), VenueSlot.venue_id == data.venue_id
            )
            .all()
        )

        if len(slots) != len(data.slot_ids):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Some selected slots do not exist or do not belong to this venue.",
            )

        # 3. Validate category-specific slot durations
        for slot in slots:
            try:
                validate_slot_duration(venue.category, slot.start_time, slot.end_time)
            except ValueError as e:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST, detail=str(e)
                )

        # 4. Enforce single-slot limit for categories other than marriage hall and auditorium
        # cat_lower = venue.category.lower().strip()
        # if cat_lower not in ["marriage_hall", "auditorium"]:
        #     if len(data.slot_ids) > 1:
        #         raise HTTPException(
        #             status_code=status.HTTP_400_BAD_REQUEST,
        #             detail=f"Multiple slot selection is not allowed for category '{venue.category}'.",
        #         )

        # 5. Check for booking and lock overlaps/conflicts on the same day
        now = datetime.now(timezone.utc)
        active_bookings = (
            db.query(Booking)
            .filter(
                Booking.venue_id == data.venue_id,
                Booking.booking_date == data.booking_date,
                Booking.status.in_([BookingStatus.CONFIRMED, BookingStatus.PENDING]),
            )
            .all()
        )

        # A booking is an active conflict if it's confirmed, or if it is pending and lock is active
        valid_active_bookings = [
            b
            for b in active_bookings
            if b.status == BookingStatus.CONFIRMED
            or (b.status == BookingStatus.PENDING and b.lock_expires_at > get_now_comparable(b.lock_expires_at))
        ]

        # Verify time-based overlaps with existing booked/locked slots
        for booking in valid_active_bookings:
            for active_slot in booking.slots:
                for req_slot in slots:
                    # Overlap logic: start1 < end2 and start2 < end1
                    if (
                        active_slot.start_time < req_slot.end_time
                        and req_slot.start_time < active_slot.end_time
                    ):
                        raise HTTPException(
                            status_code=status.HTTP_400_BAD_REQUEST,
                            detail=f"Slot '{req_slot.slot_name}' overlaps with an existing booking or active lock on this date.",
                        )

        # 6. Calculate total booking amount
        venue_amount = float(sum(slot.price for slot in slots))

        # Search for cleaning fee or fallback to first service
        cleaning_fee = 0.0
        if venue.services:
            matching_services = [
                s for s in venue.services
                if "clean" in s.service_name.lower() or "fee" in s.service_name.lower()
            ]
            if matching_services:
                cleaning_fee = float(matching_services[0].price)
            else:
                cleaning_fee = float(venue.services[0].price)

        security_amount = 1000.0
        commission_percent = 2.0
        commission_amount = venue_amount * 0.02
        total_amount = venue_amount + cleaning_fee + security_amount + commission_amount

        # 7. Pre-generate booking UUID and 10-minute lock expiration time
        booking_id = uuid4()
        lock_expires_at = now + timedelta(minutes=10)

        # 8. Create Razorpay order
        try:
            client = razorpay.Client(
                auth=(settings.RAZORPAY_KEY_ID, settings.RAZORPAY_KEY_SECRET)
            )
            order_data = {
                "amount": int(
                    total_amount * 100
                ),  # Razorpay expects amount in paise (1 INR = 100 Paise)
                "currency": "INR",
                "receipt": str(booking_id),
                "payment_capture": 1,
            }
            razorpay_order = client.order.create(data=order_data)
            razorpay_order_id = razorpay_order["id"]
        except Exception as e:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Failed to initiate Razorpay payment order: {str(e)}",
            )

        # 9. Create booking record in database
        new_booking = Booking(
            id=booking_id,
            user_id=user_id,
            venue_id=data.venue_id,
            booking_date=data.booking_date,
            status=BookingStatus.PENDING,
            amount=total_amount,
            venue_amount=venue_amount,
            cleaning_fee=cleaning_fee,
            commission_percent=commission_percent,
            commission_amount=commission_amount,
            security_amount=security_amount,
            lock_expires_at=lock_expires_at,
            razorpay_order_id=razorpay_order_id,
        )

        db.add(new_booking)

        # Associate the slots with this booking
        for slot in slots:
            new_booking.slots.append(slot)

        db.commit()
        db.refresh(new_booking)

        return new_booking

    def verify_payment(
        self,
        db: Session,
        user_id: UUID,
        data: PaymentVerificationRequest,
    ) -> Booking:
        # Fetch the booking
        booking = db.query(Booking).filter(Booking.id == data.booking_id).first()
        if not booking:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND, detail="Booking not found."
            )

        if booking.user_id != user_id:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="You are not authorized to verify this payment.",
            )

        now = datetime.now(timezone.utc)

        # Check lock expiration
        if booking.status == BookingStatus.PENDING and booking.lock_expires_at <= get_now_comparable(booking.lock_expires_at):
            booking.status = BookingStatus.FAILED
            db.commit()
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="The 10-minute lock on this booking has expired. Please check out again.",
            )

        if booking.status != BookingStatus.PENDING:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Booking is not in pending status (current status: {booking.status.value}).",
            )

        # Verify signature using Razorpay SDK utility
        try:
            client = razorpay.Client(
                auth=(settings.RAZORPAY_KEY_ID, settings.RAZORPAY_KEY_SECRET)
            )
            params_dict = {
                "razorpay_order_id": data.razorpay_order_id,
                "razorpay_payment_id": data.razorpay_payment_id,
                "razorpay_signature": data.razorpay_signature,
            }
            client.utility.verify_payment_signature(params_dict)
        except Exception as e:
            # On signature verification failure, mark booking status as FAILED
            booking.status = BookingStatus.FAILED
            db.commit()
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Payment signature verification failed.",
            )

        # Mark booking as confirmed on successful payment verification
        booking.status = BookingStatus.CONFIRMED
        booking.razorpay_payment_id = data.razorpay_payment_id
        booking.razorpay_signature = data.razorpay_signature

        db.commit()
        db.refresh(booking)

        return booking

    def cancel_booking(self, db: Session, user_id: UUID, booking_id: UUID) -> Booking:
        booking = db.query(Booking).filter(Booking.id == booking_id).first()
        if not booking:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Booking not found."
            )

        if booking.user_id != user_id:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="You are not authorized to cancel this booking."
            )

        if booking.status != BookingStatus.PENDING:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Only pending bookings can be cancelled (current status: {booking.status.value})."
            )

        booking.status = BookingStatus.CANCELLED
        db.commit()
        db.refresh(booking)
        return booking

    def get_user_bookings(self, db: Session, user_id: UUID) -> List[Booking]:
        return (
            db.query(Booking)
            .options(joinedload(Booking.slots), joinedload(Booking.venue), joinedload(Booking.user))
            .filter(Booking.user_id == user_id)
            .order_by(Booking.created_at.desc())
            .all()
        )

    def get_booking_details(
        self, db: Session, user_id: UUID, booking_id: UUID
    ) -> Booking:
        booking = (
            db.query(Booking)
            .options(joinedload(Booking.slots), joinedload(Booking.venue), joinedload(Booking.user))
            .filter(Booking.id == booking_id)
            .first()
        )
        if not booking:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND, detail="Booking not found."
            )

        if booking.user_id != user_id:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="You are not authorized to view this booking.",
            )

        return booking

    def get_all_bookings(self, db: Session, skip: int = 0, limit: int = 100) -> List[Booking]:
        return (
            db.query(Booking)
            .options(joinedload(Booking.slots), joinedload(Booking.venue), joinedload(Booking.user))
            .order_by(Booking.created_at.desc())
            .offset(skip)
            .limit(limit)
            .all()
        )

    def get_owner_bookings(self, db: Session, owner_id: UUID, skip: int = 0, limit: int = 100) -> List[Booking]:
        return (
            db.query(Booking)
            .options(joinedload(Booking.slots), joinedload(Booking.venue), joinedload(Booking.user))
            .join(Venue)
            .filter(Venue.owner_id == owner_id)
            .order_by(Booking.created_at.desc())
            .offset(skip)
            .limit(limit)
            .all()
        )


booking_service = BookingService()
