"""Google OAuth: verify a Google ID token and extract user info.

Uses Authlib's ID token verifier. Falls back gracefully in development when
GOOGLE_CLIENT_ID is not configured (returns a stub) so the flow is testable.
"""
from __future__ import annotations

from authlib.jose import JoseError
from authlib.oidc.core import CodeIDToken

from app.core.config import settings
from app.core.exceptions import UnauthorizedError
from app.modules.auth.schemas import GoogleUserInfo

_AUDIENCE_FALLBACK = "stub-google-client-id"


def verify_google_token(credential: str) -> GoogleUserInfo:
    if not settings.GOOGLE_CLIENT_ID:
        if settings.ENVIRONMENT != "development":
            raise UnauthorizedError(
                "Google OAuth is not configured (GOOGLE_CLIENT_ID missing)."
            )
        # Development stub mode: accept any non-empty credential and fabricate
        # deterministic user info so the OAuth flow is exercisable end-to-end
        # without a real Google project configured. NEVER available in non-dev.
        import hashlib

        digest = hashlib.sha256(credential.encode()).hexdigest()
        return GoogleUserInfo(
            sub=f"stub-{digest[:16]}",
            email=f"user_{digest[:8]}@stub-google.example",
            name="Google User",
        )

    try:
        claims = CodeIDToken().validate(credential, settings.GOOGLE_CLIENT_ID)
    except JoseError as exc:
        raise UnauthorizedError(f"Invalid Google token: {exc}") from exc

    return GoogleUserInfo(
        sub=str(claims.get("sub")),
        email=str(claims.get("email")),
        name=str(claims.get("name") or claims.get("email", "Google User")),
    )
