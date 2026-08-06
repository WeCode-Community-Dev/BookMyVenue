from notifications.tasks import send_contact_admin_email


class ContactService:
    @staticmethod
    def submit_message(*, payload: dict) -> None:
        send_contact_admin_email.delay(
            role=payload["role"],
            full_name=payload["full_name"],
            email=payload["email"],
            phone=payload.get("phone", ""),
            city=payload.get("city", ""),
            venue_name=payload.get("venue_name", ""),
            message=payload["message"],
        )
