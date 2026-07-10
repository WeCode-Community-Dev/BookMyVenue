"""Manual trigger for confirm_payment - Docker friendly"""

import sys

# Add correct path for Docker
sys.path.insert(0, "/app")

from app.core.database import SessionLocal
from app.modules.booking.models import Booking
from app.modules.payment import service


def main():
    payment_intent_id = "pi_3TkRDgGhjSGtBU6K1jQuJXAE"  # ← Change if needed

    print(f"🔄 [Docker] Triggering confirm_payment for: {payment_intent_id}")

    db = SessionLocal()
    try:
        service.confirm_payment(db, payment_intent_id)
        db.commit()
        print("✅ confirm_payment executed successfully!")

        # Check result
        booking = (
            db.query(Booking)
            .filter_by(id="bddb9e73-8931-483c-8fe4-00662144d4f6")
            .first()
        )
        if booking:
            print(
                f"📊 Final Status → Booking: {booking.status} | Payment: {booking.payment_status}"
            )

    except Exception as e:
        db.rollback()
        print(f"❌ Error: {e}")
    finally:
        db.close()


if __name__ == "__main__":
    main()
