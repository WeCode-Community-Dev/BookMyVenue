import hashlib
import hmac

import requests
from fastapi import HTTPException, status

from app.core.config import settings

RAZORPAY_API_BASE = "https://api.razorpay.com/v1"


def _require_config() -> tuple[str, str]:
    if not settings.RAZORPAY_API_KEY or not settings.RAZORPAY_API_SECRET:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="Razorpay is not configured",
        )
    return settings.RAZORPAY_API_KEY, settings.RAZORPAY_API_SECRET


def get_key_id() -> str:
    key_id, _ = _require_config()
    return key_id


def create_order(amount_paise: int, currency: str, receipt: str) -> dict:
    key_id, key_secret = _require_config()
    response = requests.post(
        f"{RAZORPAY_API_BASE}/orders",
        auth=(key_id, key_secret),
        json={
            "amount": amount_paise,
            "currency": currency,
            "receipt": receipt[:40],
            "payment_capture": 1,
        },
        timeout=30,
    )
    if response.status_code >= 400:
        raise HTTPException(
            status_code=status.HTTP_502_BAD_GATEWAY,
            detail=f"Razorpay order creation failed: {response.text[:200]}",
        )
    return response.json()


def verify_payment_signature(order_id: str, payment_id: str, signature: str) -> None:
    _, key_secret = _require_config()
    message = f"{order_id}|{payment_id}".encode("utf-8")
    expected = hmac.new(key_secret.encode("utf-8"), message, hashlib.sha256).hexdigest()
    if not hmac.compare_digest(expected, signature):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="INVALID_SIGNATURE",
        )
