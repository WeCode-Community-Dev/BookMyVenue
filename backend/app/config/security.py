from datetime import datetime, timedelta, timezone
from typing import Any, Union, Optional
import jwt
from app.core.config import settings
from app.schema.user_auth_schema import RefreshTokenResponse


def create_access_token(
    subject: Union[str, Any], expires_delta: Optional[timedelta] = None
) -> str:
    """
    Generates a short-lived access JWT token.
    """
    if expires_delta:
        expire = datetime.now(timezone.utc) + expires_delta
    else:
        expire = datetime.now(timezone.utc) + timedelta(
            minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES
        )

    to_encode = {"exp": expire, "sub": str(subject), "type": "access"}
    return jwt.encode(to_encode, settings.SECRET_KEY, algorithm=settings.ALGORITHM)


def create_refresh_token(
    subject: Union[str, Any], expires_delta: Optional[timedelta] = None
) -> str:
    """
    Generates a long-lived refresh JWT token.
    """
    if expires_delta:
        expire = datetime.now(timezone.utc) + expires_delta
    else:
        expire = datetime.now(timezone.utc) + timedelta(
            days=settings.REFRESH_TOKEN_EXPIRE_DAYS
        )

    to_encode = {"exp": expire, "sub": str(subject), "type": "refresh"}
    return jwt.encode(to_encode, settings.SECRET_KEY, algorithm=settings.ALGORITHM)


def verify_token(token: str, expected_type: str = "access") -> Optional[str]:
    """
    Decodes and validates a JWT token. Returns the subject (sub) if valid, otherwise None.
    """
    try:
        payload = jwt.decode(
            token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM]
        )
        if payload.get("type") != expected_type:
            return None
        return payload.get("sub")
    except jwt.PyJWTError:
        return None


def refresh_tokens(refresh_token: str) -> RefreshTokenResponse:
    """
    Generate new access and refresh tokens.
    """

    user_id = verify_token(
        token=refresh_token,
        expected_type="refresh",
    )

    if not user_id:
        raise ValueError("Invalid or expired refresh token")

    new_access_token = create_access_token(subject=user_id)
    new_refresh_token = create_refresh_token(subject=user_id)

    return RefreshTokenResponse(
        access_token=new_access_token,
        refresh_token=new_refresh_token,
    )
