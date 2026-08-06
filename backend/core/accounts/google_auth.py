from dataclasses import dataclass

from django.conf import settings
from google.auth.transport import requests as google_requests
from google.oauth2 import id_token
from rest_framework.exceptions import ValidationError

from accounts.models import AuthAccount, AuthProvider, User, UserRole


@dataclass(frozen=True)
class GoogleUserInfo:
    sub: str
    email: str
    name: str | None
    picture: str | None


def verify_google_id_token(token: str) -> GoogleUserInfo:
    if not settings.GOOGLE_CLIENT_ID:
        raise ValidationError({"detail": "Google sign-in is not configured."})

    try:
        idinfo = id_token.verify_oauth2_token(
            token,
            google_requests.Request(),
            settings.GOOGLE_CLIENT_ID,
        )
    except ValueError as exc:
        raise ValidationError({"detail": "Invalid Google token."}) from exc

    issuer = idinfo.get("iss")
    if issuer not in ("accounts.google.com", "https://accounts.google.com"):
        raise ValidationError({"detail": "Invalid Google token."})

    email = idinfo.get("email")
    if not email:
        raise ValidationError({"detail": "Google account has no email."})

    if not idinfo.get("email_verified", False):
        raise ValidationError({"detail": "Google email is not verified."})

    return GoogleUserInfo(
        sub=idinfo["sub"],
        email=User.objects.normalize_email(email),
        name=idinfo.get("name"),
        picture=idinfo.get("picture"),
    )


def login_or_register_with_google(info: GoogleUserInfo, role: UserRole) -> User:
    auth_account = (
        AuthAccount.objects.filter(
            provider=AuthProvider.GOOGLE,
            provider_user_id=info.sub,
        )
        .select_related("user")
        .first()
    )

    if auth_account:
        user = auth_account.user
        if user.role != role:
            raise ValidationError(
                {
                    "detail": (
                        f"This Google account is associated with a "
                        f"{user.role} account."
                    ),
                },
            )
        _sync_google_profile(user, info)
        return _ensure_active_user(user)

    user = User.objects.filter(email__iexact=info.email).first()
    if user:
        if user.role != role:
            raise ValidationError(
                {
                    "detail": (
                        f"This email is associated with a {user.role} account."
                    ),
                },
            )

        AuthAccount.objects.create(
            user=user,
            provider=AuthProvider.GOOGLE,
            provider_user_id=info.sub,
        )
        _sync_google_profile(user, info)
        if not user.is_email_verified:
            user.is_email_verified = True
            user.save(update_fields=["is_email_verified", "updated_at"])
        return _ensure_active_user(user)

    user = User.objects.create_user(
        email=info.email,
        full_name=info.name,
        avatar_url=info.picture,
        role=role,
        is_email_verified=True,
    )
    AuthAccount.objects.create(
        user=user,
        provider=AuthProvider.GOOGLE,
        provider_user_id=info.sub,
    )
    return user


def _sync_google_profile(user: User, info: GoogleUserInfo) -> None:
    updates: list[str] = []

    if info.name and not user.full_name:
        user.full_name = info.name
        updates.append("full_name")

    if info.picture and user.avatar_url != info.picture:
        user.avatar_url = info.picture
        updates.append("avatar_url")

    if updates:
        updates.append("updated_at")
        user.save(update_fields=updates)


def _ensure_active_user(user: User) -> User:
    if not user.is_active or user.is_blocked:
        raise ValidationError({"detail": "Account is disabled."})
    return user
