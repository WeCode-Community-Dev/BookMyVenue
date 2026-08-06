import logging

import razorpay
from django.conf import settings

from bookings.exceptions import RazorpayOrderCreationError

logger = logging.getLogger(__name__)


class RazorpayService:
    def __init__(self) -> None:
        self.client = razorpay.Client(
            auth=(settings.RAZORPAY_KEY_ID, settings.RAZORPAY_KEY_SECRET),
        )

    def create_order(
        self,
        *,
        amount_paise: int,
        currency: str,
        receipt: str,
    ) -> dict:
        try:
            return self.client.order.create(
                {
                    "amount": amount_paise,
                    "currency": currency,
                    "receipt": receipt,
                    "payment_capture": 1,
                },
            )
        except Exception as exc:
            logger.exception("Razorpay order creation failed for receipt %s", receipt)
            raise RazorpayOrderCreationError(
                "Unable to create payment order. Please try again.",
            ) from exc
