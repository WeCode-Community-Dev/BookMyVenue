from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer

from app.core.security import decode_access_token

bearer_scheme = HTTPBearer()


async def get_current_user_id(
    credentials: HTTPAuthorizationCredentials = Depends(bearer_scheme),
) -> int:
    token = credentials.credentials
    print(
        "[auth] get_current_user_id received Bearer token "
        f"scheme={credentials.scheme!r} len={len(token) if token else 0}",
        flush=True,
    )
    claims = decode_access_token(token)
    if claims is None:
        print("[auth] get_current_user_id -> 401 Invalid or expired token.", flush=True)
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired token.",
            headers={"WWW-Authenticate": "Bearer"},
        )
    print(f"[auth] get_current_user_id OK user_id={claims.user_id}", flush=True)
    return claims.user_id

