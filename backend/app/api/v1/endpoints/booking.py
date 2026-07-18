from typing import List
from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session

from app.schema.base_schema import SuccessResponse
from app.schema.booking_schema import (
    CheckoutRequest,
    CheckoutResponse,
    PaymentVerificationRequest,
    BookingDetailResponse,
    BookingSlotDetail,
    BookingUserDetail,
)
from app.service.booking_service import booking_service
from app.config.database import get_db
from app.config.dependencies import get_current_user
from app.model.user import User, UserRole
from app.model.booking import Booking
from app.core.config import settings

router = APIRouter()


def map_booking_to_response(booking: Booking) -> BookingDetailResponse:
    slots_detail = [
        BookingSlotDetail(
            id=slot.id,
            slot_name=slot.slot_name,
            start_time=slot.start_time,
            end_time=slot.end_time,
            price=float(slot.price),
        )
        for slot in booking.slots
    ]
    user_detail = None
    if booking.user:
        user_detail = BookingUserDetail(
            id=booking.user.id,
            full_name=booking.user.full_name,
            mobile_number=booking.user.mobile_number,
            email=booking.user.email,
        )
    return BookingDetailResponse(
        id=booking.id,
        venue_id=booking.venue_id,
        venue_name=booking.venue.venue_name if booking.venue else "Unknown Venue",
        booking_date=booking.booking_date,
        status=booking.status.value,
        amount=float(booking.amount),
        venue_amount=float(booking.venue_amount),
        cleaning_fee=float(booking.cleaning_fee),
        commission_percent=float(booking.commission_percent),
        commission_amount=float(booking.commission_amount),
        security_amount=float(booking.security_amount),
        total_amount=float(booking.amount),
        lock_expires_at=booking.lock_expires_at,
        created_at=booking.created_at,
        slots=slots_detail,
        user=user_detail,
    )


@router.post(
    "/checkout",
    response_model=SuccessResponse[CheckoutResponse],
    status_code=status.HTTP_201_CREATED,
    summary="Checkout Venue Slot",
    description="Initiates booking, locks selected slots for 10 minutes, and creates a Razorpay payment order.",
)
def checkout(
    data: CheckoutRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    booking = booking_service.checkout_booking(
        db=db,
        user_id=current_user.id,
        data=data,
    )

    response_data = CheckoutResponse(
        booking_id=booking.id,
        amount=float(booking.amount),
        razorpay_order_id=booking.razorpay_order_id,
        razorpay_key_id=settings.RAZORPAY_KEY_ID,
        lock_expires_at=booking.lock_expires_at,
    )

    return SuccessResponse(
        message="Booking initiated and slots locked for 10 minutes.",
        data=response_data,
    )


@router.post(
    "/verify-payment",
    response_model=SuccessResponse[BookingDetailResponse],
    status_code=status.HTTP_200_OK,
    summary="Verify Payment and Confirm Booking",
    description="Verifies the Razorpay payment signature and confirms the booking details.",
)
def verify_payment(
    data: PaymentVerificationRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    booking = booking_service.verify_payment(
        db=db,
        user_id=current_user.id,
        data=data,
    )

    return SuccessResponse(
        message="Payment verified and booking confirmed successfully.",
        data=map_booking_to_response(booking),
    )


@router.post(
    "/{booking_id}/cancel",
    response_model=SuccessResponse[BookingDetailResponse],
    status_code=status.HTTP_200_OK,
    summary="Cancel Pending Booking",
    description="Cancels a pending booking, releasing the locked slots immediately so they can be booked again.",
)
def cancel_pending_booking(
    booking_id: UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    booking = booking_service.cancel_booking(
        db=db,
        user_id=current_user.id,
        booking_id=booking_id,
    )

    return SuccessResponse(
        message="Booking cancelled and locked slots released successfully.",
        data=map_booking_to_response(booking),
    )


@router.get(
    "/my-bookings",
    response_model=SuccessResponse[List[BookingDetailResponse]],
    status_code=status.HTTP_200_OK,
    summary="List User Bookings",
    description="Retrieves a list of bookings created by the authenticated user.",
)
def get_my_bookings(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    bookings = booking_service.get_user_bookings(
        db=db,
        user_id=current_user.id,
    )

    response_data = [map_booking_to_response(b) for b in bookings]

    return SuccessResponse(
        message="User bookings retrieved successfully.",
        data=response_data,
    )


@router.get(
    "/{booking_id}",
    response_model=SuccessResponse[BookingDetailResponse],
    status_code=status.HTTP_200_OK,
    summary="Get Booking Details",
    description="Fetches detailed information about a specific booking.",
)
def get_booking_details(
    booking_id: UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    booking = booking_service.get_booking_details(
        db=db,
        user_id=current_user.id,
        booking_id=booking_id,
    )

    return SuccessResponse(
        message="Booking details retrieved successfully.",
        data=map_booking_to_response(booking),
    )


@router.get(
    "",
    response_model=SuccessResponse[List[BookingDetailResponse]],
    status_code=status.HTTP_200_OK,
    summary="Get All Bookings",
    description="Retrieves a list of all bookings in the system with pagination (no token required).",
)
def get_all_bookings(
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=100),
    db: Session = Depends(get_db),
):
    bookings = booking_service.get_all_bookings(
        db=db,
        skip=skip,
        limit=limit,
    )

    response_data = [map_booking_to_response(b) for b in bookings]

    return SuccessResponse(
        message="All bookings retrieved successfully.",
        data=response_data,
    )


@router.get(
    "/owner/my-bookings",
    response_model=SuccessResponse[List[BookingDetailResponse]],
    status_code=status.HTTP_200_OK,
    summary="Get Owner Bookings",
    description="Retrieves a list of bookings for venues owned by the authenticated owner.",
)
def get_owner_bookings(
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=100),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    if current_user.role not in [UserRole.VENUE_OWNER, UserRole.ADMIN]:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only venue owners and admins can retrieve owner bookings.",
        )

    bookings = booking_service.get_owner_bookings(
        db=db,
        owner_id=current_user.id,
        skip=skip,
        limit=limit,
    )

    response_data = [map_booking_to_response(b) for b in bookings]

    return SuccessResponse(
        message="Owner bookings retrieved successfully.",
        data=response_data,
    )
