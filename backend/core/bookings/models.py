import uuid

from django.conf import settings
from django.db import models
from django.db.models import Q
from django.utils import timezone

from venues.models import VenueSchedule


class BookingSessionStatus(models.TextChoices):
    ACTIVE = "ACTIVE", "Active"
    EXPIRED = "EXPIRED", "Expired"
    FAILED = "FAILED", "Failed"
    COMPLETED = "COMPLETED", "Completed"


class PaymentProvider(models.TextChoices):
    RAZORPAY = "RAZORPAY", "Razorpay"


class PaymentStatus(models.TextChoices):
    ORDER_CREATED = "ORDER_CREATED", "Order Created"
    SUCCESS = "SUCCESS", "Success"
    FAILED = "FAILED", "Failed"
    REFUND_PENDING = "REFUND_PENDING", "Refund Pending"
    REFUNDED = "REFUNDED", "Refunded"


class BookingStatus(models.TextChoices):
    CONFIRMED = "CONFIRMED", "Confirmed"
    CANCELLED = "CANCELLED", "Cancelled"
    COMPLETED = "COMPLETED", "Completed"


class RefundStatus(models.TextChoices):
    PENDING = "PENDING", "Pending"
    PROCESSING = "PROCESSING", "Processing"
    SUCCESS = "SUCCESS", "Success"
    FAILED = "FAILED", "Failed"


class BookingAuditEvent(models.TextChoices):
    BOOKING_STARTED = "BOOKING_STARTED", "Booking Started"
    PAYMENT_ORDER_CREATED = "PAYMENT_ORDER_CREATED", "Payment Order Created"
    PAYMENT_SUCCESS = "PAYMENT_SUCCESS", "Payment Success"
    PAYMENT_FAILED = "PAYMENT_FAILED", "Payment Failed"
    LOCK_EXPIRED = "LOCK_EXPIRED", "Lock Expired"
    BOOKING_CONFIRMED = "BOOKING_CONFIRMED", "Booking Confirmed"
    BOOKING_CANCELLED = "BOOKING_CANCELLED", "Booking Cancelled"
    REFUND_INITIATED = "REFUND_INITIATED", "Refund Initiated"
    REFUND_COMPLETED = "REFUND_COMPLETED", "Refund Completed"


class BookingSession(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.PROTECT,
        related_name="booking_sessions",
        verbose_name="user",
    )
    venue_schedule = models.ForeignKey(
        VenueSchedule,
        on_delete=models.PROTECT,
        related_name="booking_sessions",
        verbose_name="venue schedule",
    )
    booking_date = models.DateField(verbose_name="booking date")
    locked_price = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        verbose_name="locked price",
    )
    status = models.CharField(
        max_length=20,
        choices=BookingSessionStatus.choices,
        default=BookingSessionStatus.ACTIVE,
        verbose_name="status",
    )
    expires_at = models.DateTimeField(verbose_name="expires at")
    lock_released_at = models.DateTimeField(
        blank=True,
        null=True,
        verbose_name="lock released at",
    )
    remarks = models.TextField(blank=True, verbose_name="remarks")
    created_at = models.DateTimeField(auto_now_add=True, verbose_name="created at")
    updated_at = models.DateTimeField(auto_now=True, verbose_name="updated at")

    class Meta:
        db_table = "booking_sessions"
        verbose_name = "booking session"
        verbose_name_plural = "booking sessions"
        indexes = [
            models.Index(
                fields=["expires_at"],
                name="ix_bs_active_expires",
                condition=Q(status=BookingSessionStatus.ACTIVE),
            ),
        ]
        constraints = [
            models.CheckConstraint(
                condition=Q(locked_price__gte=0),
                name="ck_booking_session_locked_price",
            ),
            models.UniqueConstraint(
                fields=["venue_schedule", "booking_date"],
                condition=Q(status=BookingSessionStatus.ACTIVE),
                name="uq_bs_active_per_schedule_date",
            ),
            models.UniqueConstraint(
                fields=["user", "venue_schedule", "booking_date"],
                condition=Q(status=BookingSessionStatus.ACTIVE),
                name="uq_bs_active_per_user_schedule_date",
            ),
        ]

    @property
    def is_expired(self) -> bool:
        return timezone.now() >= self.expires_at

    @property
    def is_active(self) -> bool:
        return self.status == BookingSessionStatus.ACTIVE and not self.is_expired

    def __str__(self) -> str:
        return f"Session {self.id} ({self.status}) — {self.booking_date}"


class Payment(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    booking_session = models.OneToOneField(
        BookingSession,
        on_delete=models.PROTECT,
        related_name="payment",
        verbose_name="booking session",
    )
    provider = models.CharField(
        max_length=20,
        choices=PaymentProvider.choices,
        default=PaymentProvider.RAZORPAY,
        verbose_name="provider",
    )
    razorpay_order_id = models.CharField(
        max_length=255,
        unique=True,
        verbose_name="Razorpay order ID",
    )
    razorpay_payment_id = models.CharField(
        max_length=255,
        blank=True,
        null=True,
        unique=True,
        verbose_name="Razorpay payment ID",
    )
    razorpay_signature = models.CharField(
        max_length=512,
        blank=True,
        verbose_name="Razorpay signature",
    )
    amount = models.DecimalField(max_digits=10, decimal_places=2, verbose_name="amount")
    currency = models.CharField(max_length=3, default="INR", verbose_name="currency")
    status = models.CharField(
        max_length=20,
        choices=PaymentStatus.choices,
        default=PaymentStatus.ORDER_CREATED,
        verbose_name="status",
    )
    failure_reason = models.TextField(blank=True, verbose_name="failure reason")
    gateway_response = models.JSONField(
        default=dict,
        blank=True,
        verbose_name="gateway response",
    )
    created_at = models.DateTimeField(auto_now_add=True, verbose_name="created at")
    updated_at = models.DateTimeField(auto_now=True, verbose_name="updated at")
    verified_at = models.DateTimeField(
        blank=True,
        null=True,
        verbose_name="verified at",
    )

    class Meta:
        db_table = "payments"
        verbose_name = "payment"
        verbose_name_plural = "payments"
        constraints = [
            models.CheckConstraint(
                condition=Q(amount__gte=0),
                name="ck_payments_amount_non_negative",
            ),
        ]

    def __str__(self) -> str:
        return f"Payment {self.id} ({self.status})"


class Booking(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    booking_session = models.OneToOneField(
        BookingSession,
        on_delete=models.PROTECT,
        related_name="booking",
        verbose_name="booking session",
    )
    payment = models.OneToOneField(
        Payment,
        on_delete=models.PROTECT,
        related_name="booking",
        verbose_name="payment",
    )
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.PROTECT,
        related_name="bookings",
        verbose_name="user",
    )
    venue_schedule = models.ForeignKey(
        VenueSchedule,
        on_delete=models.PROTECT,
        related_name="bookings",
        verbose_name="venue schedule",
    )
    booking_date = models.DateField(verbose_name="booking date")
    booking_amount = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        verbose_name="booking amount",
    )
    status = models.CharField(
        max_length=20,
        choices=BookingStatus.choices,
        default=BookingStatus.CONFIRMED,
        verbose_name="status",
    )
    confirmed_at = models.DateTimeField(verbose_name="confirmed at")
    cancelled_at = models.DateTimeField(
        blank=True,
        null=True,
        verbose_name="cancelled at",
    )
    created_at = models.DateTimeField(auto_now_add=True, verbose_name="created at")
    updated_at = models.DateTimeField(auto_now=True, verbose_name="updated at")

    class Meta:
        db_table = "bookings"
        verbose_name = "booking"
        verbose_name_plural = "bookings"
        indexes = [
            models.Index(
                fields=["booking_date", "venue_schedule"],
                name="ix_bookings_date_schedule",
            ),
        ]
        constraints = [
            models.CheckConstraint(
                condition=Q(booking_amount__gte=0),
                name="ck_booking_amount_non_negative",
            ),
            models.UniqueConstraint(
                fields=["venue_schedule", "booking_date"],
                condition=Q(status=BookingStatus.CONFIRMED),
                name="uq_booking_confirmed_per_schedule_date",
            ),
        ]

    def __str__(self) -> str:
        return f"Booking {self.id} ({self.status}) — {self.booking_date}"


class Refund(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    payment = models.ForeignKey(
        Payment,
        on_delete=models.PROTECT,
        related_name="refunds",
        verbose_name="payment",
    )
    booking = models.ForeignKey(
        Booking,
        on_delete=models.SET_NULL,
        related_name="refunds",
        blank=True,
        null=True,
        verbose_name="booking",
    )
    refund_amount = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        verbose_name="refund amount",
    )
    provider_refund_id = models.CharField(
        max_length=255,
        blank=True,
        verbose_name="provider refund ID",
    )
    status = models.CharField(
        max_length=20,
        choices=RefundStatus.choices,
        default=RefundStatus.PENDING,
        verbose_name="status",
    )
    reason = models.TextField(verbose_name="reason")
    gateway_response = models.JSONField(
        default=dict,
        blank=True,
        verbose_name="gateway response",
    )
    created_at = models.DateTimeField(auto_now_add=True, verbose_name="created at")
    updated_at = models.DateTimeField(auto_now=True, verbose_name="updated at")

    class Meta:
        db_table = "refunds"
        verbose_name = "refund"
        verbose_name_plural = "refunds"
        indexes = [
            models.Index(
                fields=["provider_refund_id"],
                name="ix_refunds_provider_refund_id",
            ),
        ]
        constraints = [
            models.CheckConstraint(
                condition=Q(refund_amount__gte=0),
                name="ck_refunds_amount_non_negative",
            ),
        ]

    def __str__(self) -> str:
        return f"Refund {self.id} ({self.status})"


class BookingAuditLog(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    booking_session = models.ForeignKey(
        BookingSession,
        on_delete=models.SET_NULL,
        related_name="audit_logs",
        blank=True,
        null=True,
        verbose_name="booking session",
    )
    booking = models.ForeignKey(
        Booking,
        on_delete=models.SET_NULL,
        related_name="audit_logs",
        blank=True,
        null=True,
        verbose_name="booking",
    )
    payment = models.ForeignKey(
        Payment,
        on_delete=models.SET_NULL,
        related_name="audit_logs",
        blank=True,
        null=True,
        verbose_name="payment",
    )
    event = models.CharField(
        max_length=40,
        choices=BookingAuditEvent.choices,
        verbose_name="event",
    )
    description = models.TextField(blank=True, verbose_name="description")
    metadata = models.JSONField(default=dict, blank=True, verbose_name="metadata")
    created_at = models.DateTimeField(auto_now_add=True, verbose_name="created at")

    class Meta:
        db_table = "booking_audit_logs"
        verbose_name = "booking audit log"
        verbose_name_plural = "booking audit logs"
        indexes = [
            models.Index(
                fields=["booking_session", "created_at"],
                name="ix_audit_logs_session_created",
            ),
            models.Index(
                fields=["booking", "created_at"],
                name="ix_audit_logs_booking_created",
            ),
            models.Index(
                fields=["payment", "created_at"],
                name="ix_audit_logs_payment_created",
            ),
        ]

    def __str__(self) -> str:
        return f"{self.event} @ {self.created_at:%Y-%m-%d %H:%M:%S}"
