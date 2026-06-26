from jose import jwt
from pydantic import ValidationError
from datetime import UTC, datetime, timedelta
from typing import Optional
import os

SECRET_KEY = os.getenv("SECRET_KEY", default="mysecretkey")
ALGORITHM = os.getenv("ALGORITHM", default="HS256")
ACCESS_TOKEN_EXPIRE_MINUTES = int(
    os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", default=30))


def create_access_token(data: dict, expires_delta: timedelta | None = None) -> str:
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.now(UTC) + expires_delta
    else:
        expire = datetime.now(UTC) + timedelta(
            minutes=ACCESS_TOKEN_EXPIRE_MINUTES)

    to_encode.update({"exp": expire})

    encoded_jwt = jwt.encode(
        to_encode,
        SECRET_KEY,
        algorithm=ALGORITHM
    )
    return encoded_jwt


def verify_access_token(token: str) -> str | None:
    try:
        payload = jwt.decode(
            token,
            SECRET_KEY,
            ALGORITHM,
            options={"require": ["exp", "sub"]}
        )
    except ValidationError:
        return None
    else:
        return payload.get("sub")
