# Generated manually for soft-lock booking system

import uuid

import django.db.models.deletion
from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("bookings", "0001_initial"),
        ("venues", "0006_remove_venue_unique_venue_slug_alter_venue_slug_and_more"),
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.DeleteModel(
            name="Booking",
        ),
        migrations.CreateModel(
            name="BookingSession",
            fields=[
                (
                    "id",
                    models.UUIDField(
                        default=uuid.uuid4,
                        editable=False,
                        primary_key=True,
                        serialize=False,
                    ),
                ),
                ("booking_date", models.DateField(verbose_name="booking date")),
                (
                    "locked_price",
                    models.DecimalField(
                        decimal_places=2,
                        max_digits=10,
                        verbose_name="locked price",
                    ),
                ),
                (
                    "status",
                    models.CharField(
                        choices=[
                            ("ACTIVE", "Active"),
                            ("EXPIRED", "Expired"),
                            ("COMPLETED", "Completed"),
                        ],
                        default="ACTIVE",
                        max_length=20,
                        verbose_name="status",
                    ),
                ),
                ("expires_at", models.DateTimeField(verbose_name="expires at")),
                (
                    "lock_released_at",
                    models.DateTimeField(
                        blank=True,
                        null=True,
                        verbose_name="lock released at",
                    ),
                ),
                ("remarks", models.TextField(blank=True, verbose_name="remarks")),
                (
                    "created_at",
                    models.DateTimeField(auto_now_add=True, verbose_name="created at"),
                ),
                (
                    "updated_at",
                    models.DateTimeField(auto_now=True, verbose_name="updated at"),
                ),
                (
                    "user",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.PROTECT,
                        related_name="booking_sessions",
                        to=settings.AUTH_USER_MODEL,
                        verbose_name="user",
                    ),
                ),
                (
                    "venue_schedule",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.PROTECT,
                        related_name="booking_sessions",
                        to="venues.venueschedule",
                        verbose_name="venue schedule",
                    ),
                ),
            ],
            options={
                "verbose_name": "booking session",
                "verbose_name_plural": "booking sessions",
                "db_table": "booking_sessions",
            },
        ),
        migrations.CreateModel(
            name="Payment",
            fields=[
                (
                    "id",
                    models.UUIDField(
                        default=uuid.uuid4,
                        editable=False,
                        primary_key=True,
                        serialize=False,
                    ),
                ),
                (
                    "provider",
                    models.CharField(
                        choices=[("RAZORPAY", "Razorpay")],
                        default="RAZORPAY",
                        max_length=20,
                        verbose_name="provider",
                    ),
                ),
                (
                    "razorpay_order_id",
                    models.CharField(
                        max_length=255,
                        unique=True,
                        verbose_name="Razorpay order ID",
                    ),
                ),
                (
                    "razorpay_payment_id",
                    models.CharField(
                        blank=True,
                        max_length=255,
                        null=True,
                        unique=True,
                        verbose_name="Razorpay payment ID",
                    ),
                ),
                (
                    "razorpay_signature",
                    models.CharField(
                        blank=True,
                        max_length=512,
                        verbose_name="Razorpay signature",
                    ),
                ),
                (
                    "amount",
                    models.DecimalField(
                        decimal_places=2,
                        max_digits=10,
                        verbose_name="amount",
                    ),
                ),
                (
                    "currency",
                    models.CharField(
                        default="INR",
                        max_length=3,
                        verbose_name="currency",
                    ),
                ),
                (
                    "status",
                    models.CharField(
                        choices=[
                            ("ORDER_CREATED", "Order Created"),
                            ("SUCCESS", "Success"),
                            ("FAILED", "Failed"),
                            ("REFUND_PENDING", "Refund Pending"),
                            ("REFUNDED", "Refunded"),
                        ],
                        default="ORDER_CREATED",
                        max_length=20,
                        verbose_name="status",
                    ),
                ),
                (
                    "failure_reason",
                    models.TextField(blank=True, verbose_name="failure reason"),
                ),
                (
                    "gateway_response",
                    models.JSONField(
                        blank=True,
                        default=dict,
                        verbose_name="gateway response",
                    ),
                ),
                (
                    "created_at",
                    models.DateTimeField(auto_now_add=True, verbose_name="created at"),
                ),
                (
                    "updated_at",
                    models.DateTimeField(auto_now=True, verbose_name="updated at"),
                ),
                (
                    "verified_at",
                    models.DateTimeField(
                        blank=True,
                        null=True,
                        verbose_name="verified at",
                    ),
                ),
                (
                    "booking_session",
                    models.OneToOneField(
                        on_delete=django.db.models.deletion.PROTECT,
                        related_name="payment",
                        to="bookings.bookingsession",
                        verbose_name="booking session",
                    ),
                ),
            ],
            options={
                "verbose_name": "payment",
                "verbose_name_plural": "payments",
                "db_table": "payments",
            },
        ),
        migrations.CreateModel(
            name="Booking",
            fields=[
                (
                    "id",
                    models.UUIDField(
                        default=uuid.uuid4,
                        editable=False,
                        primary_key=True,
                        serialize=False,
                    ),
                ),
                ("booking_date", models.DateField(verbose_name="booking date")),
                (
                    "booking_amount",
                    models.DecimalField(
                        decimal_places=2,
                        max_digits=10,
                        verbose_name="booking amount",
                    ),
                ),
                (
                    "status",
                    models.CharField(
                        choices=[
                            ("CONFIRMED", "Confirmed"),
                            ("CANCELLED", "Cancelled"),
                            ("COMPLETED", "Completed"),
                        ],
                        default="CONFIRMED",
                        max_length=20,
                        verbose_name="status",
                    ),
                ),
                ("confirmed_at", models.DateTimeField(verbose_name="confirmed at")),
                (
                    "cancelled_at",
                    models.DateTimeField(
                        blank=True,
                        null=True,
                        verbose_name="cancelled at",
                    ),
                ),
                (
                    "created_at",
                    models.DateTimeField(auto_now_add=True, verbose_name="created at"),
                ),
                (
                    "updated_at",
                    models.DateTimeField(auto_now=True, verbose_name="updated at"),
                ),
                (
                    "booking_session",
                    models.OneToOneField(
                        on_delete=django.db.models.deletion.PROTECT,
                        related_name="booking",
                        to="bookings.bookingsession",
                        verbose_name="booking session",
                    ),
                ),
                (
                    "payment",
                    models.OneToOneField(
                        on_delete=django.db.models.deletion.PROTECT,
                        related_name="booking",
                        to="bookings.payment",
                        verbose_name="payment",
                    ),
                ),
                (
                    "user",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.PROTECT,
                        related_name="bookings",
                        to=settings.AUTH_USER_MODEL,
                        verbose_name="user",
                    ),
                ),
                (
                    "venue_schedule",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.PROTECT,
                        related_name="bookings",
                        to="venues.venueschedule",
                        verbose_name="venue schedule",
                    ),
                ),
            ],
            options={
                "verbose_name": "booking",
                "verbose_name_plural": "bookings",
                "db_table": "bookings",
            },
        ),
        migrations.CreateModel(
            name="BookingAuditLog",
            fields=[
                (
                    "id",
                    models.UUIDField(
                        default=uuid.uuid4,
                        editable=False,
                        primary_key=True,
                        serialize=False,
                    ),
                ),
                (
                    "event",
                    models.CharField(
                        choices=[
                            ("BOOKING_STARTED", "Booking Started"),
                            ("PAYMENT_ORDER_CREATED", "Payment Order Created"),
                            ("PAYMENT_SUCCESS", "Payment Success"),
                            ("PAYMENT_FAILED", "Payment Failed"),
                            ("LOCK_EXPIRED", "Lock Expired"),
                            ("BOOKING_CONFIRMED", "Booking Confirmed"),
                            ("BOOKING_CANCELLED", "Booking Cancelled"),
                            ("REFUND_INITIATED", "Refund Initiated"),
                            ("REFUND_COMPLETED", "Refund Completed"),
                        ],
                        max_length=40,
                        verbose_name="event",
                    ),
                ),
                (
                    "description",
                    models.TextField(blank=True, verbose_name="description"),
                ),
                (
                    "metadata",
                    models.JSONField(blank=True, default=dict, verbose_name="metadata"),
                ),
                (
                    "created_at",
                    models.DateTimeField(auto_now_add=True, verbose_name="created at"),
                ),
                (
                    "booking",
                    models.ForeignKey(
                        blank=True,
                        null=True,
                        on_delete=django.db.models.deletion.SET_NULL,
                        related_name="audit_logs",
                        to="bookings.booking",
                        verbose_name="booking",
                    ),
                ),
                (
                    "booking_session",
                    models.ForeignKey(
                        blank=True,
                        null=True,
                        on_delete=django.db.models.deletion.SET_NULL,
                        related_name="audit_logs",
                        to="bookings.bookingsession",
                        verbose_name="booking session",
                    ),
                ),
                (
                    "payment",
                    models.ForeignKey(
                        blank=True,
                        null=True,
                        on_delete=django.db.models.deletion.SET_NULL,
                        related_name="audit_logs",
                        to="bookings.payment",
                        verbose_name="payment",
                    ),
                ),
            ],
            options={
                "verbose_name": "booking audit log",
                "verbose_name_plural": "booking audit logs",
                "db_table": "booking_audit_logs",
            },
        ),
        migrations.CreateModel(
            name="Refund",
            fields=[
                (
                    "id",
                    models.UUIDField(
                        default=uuid.uuid4,
                        editable=False,
                        primary_key=True,
                        serialize=False,
                    ),
                ),
                (
                    "refund_amount",
                    models.DecimalField(
                        decimal_places=2,
                        max_digits=10,
                        verbose_name="refund amount",
                    ),
                ),
                (
                    "provider_refund_id",
                    models.CharField(
                        blank=True,
                        max_length=255,
                        verbose_name="provider refund ID",
                    ),
                ),
                (
                    "status",
                    models.CharField(
                        choices=[
                            ("PENDING", "Pending"),
                            ("PROCESSING", "Processing"),
                            ("SUCCESS", "Success"),
                            ("FAILED", "Failed"),
                        ],
                        default="PENDING",
                        max_length=20,
                        verbose_name="status",
                    ),
                ),
                ("reason", models.TextField(verbose_name="reason")),
                (
                    "gateway_response",
                    models.JSONField(
                        blank=True,
                        default=dict,
                        verbose_name="gateway response",
                    ),
                ),
                (
                    "created_at",
                    models.DateTimeField(auto_now_add=True, verbose_name="created at"),
                ),
                (
                    "updated_at",
                    models.DateTimeField(auto_now=True, verbose_name="updated at"),
                ),
                (
                    "booking",
                    models.ForeignKey(
                        blank=True,
                        null=True,
                        on_delete=django.db.models.deletion.SET_NULL,
                        related_name="refunds",
                        to="bookings.booking",
                        verbose_name="booking",
                    ),
                ),
                (
                    "payment",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.PROTECT,
                        related_name="refunds",
                        to="bookings.payment",
                        verbose_name="payment",
                    ),
                ),
            ],
            options={
                "verbose_name": "refund",
                "verbose_name_plural": "refunds",
                "db_table": "refunds",
            },
        ),
        migrations.AddIndex(
            model_name="bookingsession",
            index=models.Index(
                condition=models.Q(("status", "ACTIVE")),
                fields=["expires_at"],
                name="ix_bs_active_expires",
            ),
        ),
        migrations.AddConstraint(
            model_name="bookingsession",
            constraint=models.CheckConstraint(
                condition=models.Q(("locked_price__gte", 0)),
                name="ck_booking_session_locked_price",
            ),
        ),
        migrations.AddConstraint(
            model_name="bookingsession",
            constraint=models.UniqueConstraint(
                condition=models.Q(("status", "ACTIVE")),
                fields=("venue_schedule", "booking_date"),
                name="uq_bs_active_per_schedule_date",
            ),
        ),
        migrations.AddConstraint(
            model_name="bookingsession",
            constraint=models.UniqueConstraint(
                condition=models.Q(("status", "ACTIVE")),
                fields=("user", "venue_schedule", "booking_date"),
                name="uq_bs_active_per_user_schedule_date",
            ),
        ),
        migrations.AddConstraint(
            model_name="payment",
            constraint=models.CheckConstraint(
                condition=models.Q(("amount__gte", 0)),
                name="ck_payments_amount_non_negative",
            ),
        ),
        migrations.AddIndex(
            model_name="booking",
            index=models.Index(
                fields=["booking_date", "venue_schedule"],
                name="ix_bookings_date_schedule",
            ),
        ),
        migrations.AddConstraint(
            model_name="booking",
            constraint=models.CheckConstraint(
                condition=models.Q(("booking_amount__gte", 0)),
                name="ck_booking_amount_non_negative",
            ),
        ),
        migrations.AddConstraint(
            model_name="booking",
            constraint=models.UniqueConstraint(
                condition=models.Q(("status", "CONFIRMED")),
                fields=("venue_schedule", "booking_date"),
                name="uq_booking_confirmed_per_schedule_date",
            ),
        ),
        migrations.AddIndex(
            model_name="bookingauditlog",
            index=models.Index(
                fields=["booking_session", "created_at"],
                name="ix_audit_logs_session_created",
            ),
        ),
        migrations.AddIndex(
            model_name="bookingauditlog",
            index=models.Index(
                fields=["booking", "created_at"],
                name="ix_audit_logs_booking_created",
            ),
        ),
        migrations.AddIndex(
            model_name="bookingauditlog",
            index=models.Index(
                fields=["payment", "created_at"],
                name="ix_audit_logs_payment_created",
            ),
        ),
        migrations.AddIndex(
            model_name="refund",
            index=models.Index(
                fields=["provider_refund_id"],
                name="ix_refunds_provider_refund_id",
            ),
        ),
        migrations.AddConstraint(
            model_name="refund",
            constraint=models.CheckConstraint(
                condition=models.Q(("refund_amount__gte", 0)),
                name="ck_refunds_amount_non_negative",
            ),
        ),
    ]
