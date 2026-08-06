from dataclasses import dataclass
import hashlib

import jwt

from app.core.config import settings


@dataclass(frozen=True, slots=True)
class AccessTokenClaims:
    user_id: int
    role: str
    is_active: bool


def _secret_fingerprint() -> str:
    """Short fingerprint of SECRET_KEY so we can compare envs without logging the secret."""
    digest = hashlib.sha256(settings.SECRET_KEY.encode("utf-8")).hexdigest()
    return f"len={len(settings.SECRET_KEY)} sha256={digest[:12]}..."


def _token_preview(token: str) -> str:
    if not token:
        return "<empty>"
    if len(token) <= 24:
        return f"len={len(token)} value={token!r}"
    return f"len={len(token)} prefix={token[:12]}... suffix=...{token[-8:]}"


def decode_access_token(token: str) -> AccessTokenClaims | None:
    """Decode a Django-compatible access JWT and return identity claims.

    Tokens without ``role`` / ``is_active`` (legacy) are rejected so clients
    re-login or refresh.
    """
    print(
        "[auth] decode_access_token start:",
        _token_preview(token),
        f"algorithm={settings.JWT_ALGORITHM!r}",
        f"secret={_secret_fingerprint()}",
        flush=True,
    )

    try:
        # Inspect unverified header/payload first to see what Django issued,
        # even when signature verification fails (common SECRET_KEY mismatch).
        try:
            header = jwt.get_unverified_header(token)
            print(f"[auth] unverified header: {header}", flush=True)
        except Exception as exc:
            print(f"[auth] failed to read JWT header: {type(exc).__name__}: {exc}", flush=True)

        try:
            unverified = jwt.decode(
                token,
                options={"verify_signature": False, "verify_exp": False},
                algorithms=[settings.JWT_ALGORITHM],
            )
            print(
                "[auth] unverified payload keys/values:",
                {
                    "sub": unverified.get("sub"),
                    "type": unverified.get("type"),
                    "role": unverified.get("role"),
                    "is_active": unverified.get("is_active"),
                    "is_active_type": type(unverified.get("is_active")).__name__,
                    "exp": unverified.get("exp"),
                },
                flush=True,
            )
        except Exception as exc:
            print(
                f"[auth] failed to read unverified payload: {type(exc).__name__}: {exc}",
                flush=True,
            )

        payload = jwt.decode(
            token,
            settings.SECRET_KEY,
            algorithms=[settings.JWT_ALGORITHM],
        )
        print(f"[auth] jwt.decode OK, claims={list(payload.keys())}", flush=True)

        token_type = payload.get("type")
        if token_type not in (None, "access"):
            print(f"[auth] reject: invalid token type={token_type!r}", flush=True)
            return None

        role = payload.get("role")
        if not isinstance(role, str) or not role:
            print(
                f"[auth] reject: missing/invalid role={role!r} type={type(role).__name__}",
                flush=True,
            )
            return None

        is_active = payload.get("is_active")
        if not isinstance(is_active, bool):
            print(
                f"[auth] reject: is_active must be bool, got {is_active!r} "
                f"type={type(is_active).__name__}",
                flush=True,
            )
            return None
        if not is_active:
            print("[auth] reject: user is_active=False", flush=True)
            return None

        user_id = int(payload["sub"])
        print(f"[auth] decode success user_id={user_id} role={role!r}", flush=True)
        return AccessTokenClaims(
            user_id=user_id,
            role=role,
            is_active=is_active,
        )
    except jwt.ExpiredSignatureError as exc:
        print(f"[auth] jwt.decode FAILED ExpiredSignatureError: {exc}", flush=True)
        return None
    except jwt.InvalidSignatureError as exc:
        print(
            f"[auth] jwt.decode FAILED InvalidSignatureError: {exc} "
            f"(likely SECRET_KEY mismatch with Django) secret={_secret_fingerprint()}",
            flush=True,
        )
        return None
    except jwt.PyJWTError as exc:
        print(f"[auth] jwt.decode FAILED {type(exc).__name__}: {exc}", flush=True)
        return None
    except (KeyError, TypeError, ValueError) as exc:
        print(f"[auth] claim parsing FAILED {type(exc).__name__}: {exc}", flush=True)
        return None
