"""Sentry error tracking. No-op unless SENTRY_DSN is set (fail-open like the
other optional integrations in this app — local/dev environments simply
don't report).

Must be initialized before the FastAPI app is constructed so the
Starlette/FastAPI integrations can patch things at import time.
"""

import logging

from app.core.config import settings

logger = logging.getLogger(__name__)


def init_sentry() -> None:
    if not settings.sentry_dsn:
        logger.info("SENTRY_DSN unset — Sentry error tracking disabled")
        return

    import sentry_sdk
    from sentry_sdk.integrations.fastapi import FastApiIntegration
    from sentry_sdk.integrations.starlette import StarletteIntegration

    sentry_sdk.init(
        dsn=settings.sentry_dsn,
        environment=settings.environment,
        integrations=[StarletteIntegration(), FastApiIntegration()],
        traces_sample_rate=settings.sentry_traces_sample_rate,
        send_default_pii=False,
    )
    # All 4 apps can share one Sentry project — this tag is how you tell them
    # apart in the issue list when they do.
    sentry_sdk.set_tag("app", "api")
    logger.info("Sentry initialized for environment=%s", settings.environment)
