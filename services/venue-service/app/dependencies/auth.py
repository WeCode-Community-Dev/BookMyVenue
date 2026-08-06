from dataclasses import dataclass

from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer

from app.core.security import AccessTokenClaims, decode_access_token

bearer_scheme = HTTPBearer()
optional_bearer_scheme = HTTPBearer(auto_error=False)

VENUE_MANAGER_ROLES = frozenset({"venue", "admin"})


@dataclass(frozen=True, slots=True)
class AuthUser:
    id: int
    role: str


def _claims_to_user(claims: AccessTokenClaims | None) -> AuthUser | None:
    if claims is None:
        return None
    return AuthUser(id=claims.user_id, role=claims.role)


async def get_current_user_id(
    credentials: HTTPAuthorizationCredentials = Depends(bearer_scheme),
) -> int:
    claims = decode_access_token(credentials.credentials)
    if claims is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired token.",
            headers={"WWW-Authenticate": "Bearer"},
        )
    return claims.user_id


async def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(bearer_scheme),
) -> AuthUser:
    user = _claims_to_user(decode_access_token(credentials.credentials))
    if user is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired token.",
            headers={"WWW-Authenticate": "Bearer"},
        )
    return user


async def get_optional_user(
    credentials: HTTPAuthorizationCredentials | None = Depends(optional_bearer_scheme),
) -> AuthUser | None:
    if credentials is None:
        return None
    return _claims_to_user(decode_access_token(credentials.credentials))


async def require_venue_manager(
    user: AuthUser = Depends(get_current_user),
) -> AuthUser:
    if user.role not in VENUE_MANAGER_ROLES:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You do not have permission to perform this action.",
        )
    return user
