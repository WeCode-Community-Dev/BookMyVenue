import smtplib
from email.message import EmailMessage
from app.core.config import settings

def send_email(to_email: str, subject: str, body: str):
    try:
        print(f"To email: {to_email}")

        msg = EmailMessage()
        msg["From"] = settings.SMTP_EMAIL
        msg["To"] = to_email
        msg["Subject"] = subject
        msg.set_content(body)

        print("Connecting to SMTP server...")

        with smtplib.SMTP(settings.SMTP_HOST, settings.SMTP_PORT) as smtp:
            smtp.starttls()
            smtp.login(settings.SMTP_EMAIL, settings.SMTP_PASSWORD)

            print("Sending email...")
            smtp.send_message(msg)

        print("Email sent successfully.")
        return True

    except Exception as e:
        raise Exception(f"Email sending failed: {e}")