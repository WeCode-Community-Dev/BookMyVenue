import logging
from typing import Any

from django.conf import settings
from django.core.mail import EmailMultiAlternatives
from django.template.loader import render_to_string

from notifications.email_types import EMAIL_TEMPLATES, EmailTemplate

logger = logging.getLogger(__name__)


class EmailService:
    @staticmethod
    def get_template(template_key: str) -> EmailTemplate:
        try:
            return EMAIL_TEMPLATES[template_key]
        except KeyError as exc:
            raise ValueError(f"Unknown email template: {template_key}") from exc

    @staticmethod
    def build_context(context: dict[str, Any] | None = None) -> dict[str, Any]:
        base_context = {
            "app_name": settings.APP_NAME,
            "support_email": settings.APP_SUPPORT_EMAIL,
        }
        if context:
            base_context.update(context)
        return base_context

    @classmethod
    def send(
        cls,
        *,
        template_key: str,
        to: str | list[str],
        context: dict[str, Any] | None = None,
        subject: str | None = None,
        reply_to: str | list[str] | None = None,
    ) -> int:
        template = cls.get_template(template_key)
        merged_context = cls.build_context(context)
        resolved_subject = (subject or template.subject).format(**merged_context)

        html_body = render_to_string(template.html_template, merged_context)
        text_body = render_to_string(template.text_template, merged_context)

        recipients = [to] if isinstance(to, str) else to
        message = EmailMultiAlternatives(
            subject=resolved_subject,
            body=text_body,
            from_email=settings.DEFAULT_FROM_EMAIL,
            to=recipients,
            reply_to=([reply_to] if isinstance(reply_to, str) else reply_to)
            if reply_to
            else None,
        )
        message.attach_alternative(html_body, "text/html")

        sent_count = message.send(fail_silently=False)
        logger.info(
            "Sent '%s' email to %s (count=%s).",
            template_key,
            recipients,
            sent_count,
        )
        return sent_count
