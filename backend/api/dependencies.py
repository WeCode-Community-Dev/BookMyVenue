from fastapi import Depends, HTTPException, status, Request
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
import redis.asyncio as redis

from core.database import get_db
from core.redis import get_redis
from core.security import decode_access_token
from models.user import User


async def get_current_user(
    request: Request, 
    db: AsyncSession = Depends(get_db),
    redis_client: redis.Redis = Depends(get_redis)
):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
    )
    
    token = request.cookies.get("access_token")
    if not token:
        auth_header = request.headers.get("Authorization")
        if auth_header and auth_header.startswith("Bearer "):
            token = auth_header.split(" ")[1]
        else:
            raise credentials_exception

    is_blocked = await redis_client.get(f"blocklist:{token}")
    if is_blocked:
        raise credentials_exception

    payload = decode_access_token(token)
    if payload is None:
        raise credentials_exception
    user_id: str = payload.get("sub")
    if user_id is None:
        raise credentials_exception

    result = await db.execute(select(User).where(User.id == int(user_id)))
    user = result.scalars().first()
    if user is None:
        raise credentials_exception
    return user


async def get_current_active_admin_or_owner(
    current_user: User = Depends(get_current_user),
):
    if current_user.role not in ["PARTNER", "SUPER_ADMIN"]:
        raise HTTPException(status_code=403, detail="Not enough permissions")
    return current_user


async def get_current_super_admin(current_user: User = Depends(get_current_user)):
    if current_user.role != "SUPER_ADMIN":
        raise HTTPException(status_code=403, detail="Admin permissions required")
    return current_user
