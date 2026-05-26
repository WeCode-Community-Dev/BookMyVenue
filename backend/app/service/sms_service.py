import logging

logger = logging.getLogger(__name__)


class SMSService:
    """
    Service responsible for transmitting SMS messages.
    Can be easily connected to third-party SMS providers (Twilio, SNS, Plivo).
    """

    def send_otp(self, mobile_number: str, otp: str) -> bool:
        """
        Dispatches an OTP to the given mobile number.
        For development/testing, it prints directly to console and writes to system log.
        """
        message = (
            f"Your Book My Venue verification code is: {otp}. Valid for 5 minutes."
        )

        # Log to application logs
        logger.info(f"[SMS OUTBOX] Sending to {mobile_number}: {message}")

        # Visual printing to server stdout for developers
        print("\n" + "=" * 80)
        print(f"🔑 SMS OTP DISPATCHED")
        print(f"📱 TO: {mobile_number}")
        print(f"💬 MESSAGE: {message}")
        print("=" * 80 + "\n")

        return True


# Singleton instance
sms_service = SMSService()
