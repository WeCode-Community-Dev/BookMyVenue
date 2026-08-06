from dataclasses import dataclass


@dataclass(frozen=True)
class EmailTemplate:
    subject: str
    html_template: str
    text_template: str


EMAIL_TEMPLATES: dict[str, EmailTemplate] = {
    "otp_verification": EmailTemplate(
        subject="Your {app_name} verification code",
        html_template="emails/otp_verification.html",
        text_template="emails/otp_verification.txt",
    ),
    "contact_admin": EmailTemplate(
        subject="New contact form message from {full_name} — {app_name}",
        html_template="emails/contact_admin.html",
        text_template="emails/contact_admin.txt",
    ),
}
