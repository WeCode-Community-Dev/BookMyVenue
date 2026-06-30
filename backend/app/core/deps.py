from typing import Annotated, Callable

from fastapi import Depends, Request
from sqlalchemy.orm import Session

from app.core.exceptions import ForbiddenError, UnauthorizedError
from app.core.security import decode_token
from app.db.session import get_db
from app.modules.users.model import User, UserRole

COOKIE_NAME = "bmv_token"


def _extract_token(request: Request) -> str | None:
    auth = request.headers.get("Authorization")
    if auth and auth.lower().startswith("bearer "):
        return auth.split(" ", 1)[1].strip()
    return request.cookies.get(COOKIE_NAME)


def get_current_user(
    request: Request,
    db: Session = Depends(get_db),
) -> User:
    token = _extract_token(request)
    if not token:
        raise UnauthorizedError("Not authenticated")
    try:
        payload = decode_token(token)
    except ValueError as exc:
        raise UnauthorizedError("Invalid or expired token") from exc

    user_id = payload.get("sub")
    if not user_id:
        raise UnauthorizedError("Invalid token payload")
    user = db.get(User, int(user_id))
    if not user:
        raise UnauthorizedError("User not found")
    return user


def require_role(*allowed: UserRole) -> Callable[..., User]:
    allowed_set = set(allowed)

    def _checker(current_user: User = Depends(get_current_user)) -> User:
        if current_user.role not in allowed_set:
            raise ForbiddenError("Insufficient permissions")
        return current_user

    return _checker


# Pre-built role dependencies
require_user = require_role(UserRole.user, UserRole.owner, UserRole.admin)
require_owner = require_role(UserRole.owner, UserRole.admin)
require_admin = require_role(UserRole.admin)
