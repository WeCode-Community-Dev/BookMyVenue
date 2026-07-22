import smtplib
from email.message import EmailMessage
from app.core.config import settings
import resend


resend.api_key = settings.RESEND_API_KEY

def send_email(to_email: str, subject: str, body: str) -> bool:
    try:
        print(f"Sending email to: {to_email}")

        response = resend.Emails.send({
            "from": f"BookMyVenue <{settings.RESEND_FROM_EMAIL}>",
            "to": [to_email],
            "subject": subject,
            "text": body,
        })

        print(f"Email sent successfully: {response}")
        return True

    except Exception as error:
        print(f"Email sending failed: {error}")
        raise Exception(f"Email sending failed: {error}") from error

