from dataclasses import dataclass

import jwt

from app.core.config import settings


@dataclass(frozen=True, slots=True)
class AccessTokenClaims:
    user_id: int
    role: str
    is_active: bool


def decode_access_token(token: str) -> AccessTokenClaims | None:
    """Decode a Django-compatible access JWT and return identity claims."""
    try:
        payload = jwt.decode(
            token,
            settings.SECRET_KEY,
            algorithms=[settings.JWT_ALGORITHM],
        )
        if payload.get("type") not in (None, "access"):
            return None
        role = payload.get("role")
        if not isinstance(role, str) or not role:
            return None
        is_active = payload.get("is_active")
        if not isinstance(is_active, bool):
            return None
        if not is_active:
            return None
        return AccessTokenClaims(
            user_id=int(payload["sub"]),
            role=role,
            is_active=is_active,
        )
    except (jwt.PyJWTError, KeyError, TypeError, ValueError):
        return None
