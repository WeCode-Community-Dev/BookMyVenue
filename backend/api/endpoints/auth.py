from fastapi import APIRouter, Depends, HTTPException, status, Request, Response
from fastapi.security import OAuth2PasswordRequestForm
from slowapi import Limiter
from slowapi.util import get_remote_address

limiter = Limiter(key_func=get_remote_address)
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
import redis.asyncio as redis
import time
from typing import Optional

from core.database import get_db
from core.redis import get_redis
from core.config import settings
from core.security import (
    verify_password,
    get_password_hash,
    create_access_token,
    create_refresh_token,
    decode_refresh_token,
    decode_access_token
)
from models.user import User
from schemas.user import UserCreate, UserResponse, UserUpdate
from api.dependencies import get_current_user

router = APIRouter()


@router.post("/register", response_model=UserResponse)
@limiter.limit("5/minute")
async def register(
    request: Request, user_req: UserCreate, db: AsyncSession = Depends(get_db)
):
    result = await db.execute(select(User).where(User.username == user_req.username))
    existing_user = result.scalars().first()
    if existing_user:
        raise HTTPException(status_code=400, detail="Username already registered")

    hashed_pwd = get_password_hash(user_req.password)
    new_user = User(
        username=user_req.username,
        hashed_password=hashed_pwd,
        role=user_req.role.upper(),
    )
    db.add(new_user)
    await db.commit()
    await db.refresh(new_user)
    return new_user


@router.post("/login")
@limiter.limit("10/minute")
async def login(
    request: Request,
    response: Response,
    form_data: OAuth2PasswordRequestForm = Depends(),
    db: AsyncSession = Depends(get_db),
):
    result = await db.execute(select(User).where(User.username == form_data.username))
    user = result.scalars().first()
    if not user or not verify_password(form_data.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )

    access_token = create_access_token(data={"sub": str(user.id), "role": user.role})
    refresh_token = create_refresh_token(data={"sub": str(user.id)})

    response.set_cookie(
        key="access_token",
        value=access_token,
        httponly=True,
        secure=settings.ENVIRONMENT == "production",
        samesite="strict",
        max_age=settings.ACCESS_TOKEN_EXPIRE_MINUTES * 60,
    )
    response.set_cookie(
        key="refresh_token",
        value=refresh_token,
        httponly=True,
        secure=settings.ENVIRONMENT == "production",
        samesite="strict",
        max_age=settings.REFRESH_TOKEN_EXPIRE_MINUTES * 60,
    )

    return {"message": "Logged in successfully", "role": user.role}


@router.post("/refresh")
async def refresh(
    request: Request,
    response: Response,
    db: AsyncSession = Depends(get_db),
    redis_client: redis.Redis = Depends(get_redis)
):
    refresh_token = request.cookies.get("refresh_token")
    if not refresh_token:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Refresh token missing")
    
    is_blocked = await redis_client.get(f"blocklist:{refresh_token}")
    if is_blocked:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Token revoked")

    payload = decode_refresh_token(refresh_token)
    if not payload:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid or expired refresh token")

    user_id = payload.get("sub")
    if not user_id:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token payload")

    result = await db.execute(select(User).where(User.id == int(user_id)))
    user = result.scalars().first()
    if not user:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="User not found")

    new_access_token = create_access_token(data={"sub": str(user.id), "role": user.role})
    response.set_cookie(
        key="access_token",
        value=new_access_token,
        httponly=True,
        secure=settings.ENVIRONMENT == "production",
        samesite="strict",
        max_age=settings.ACCESS_TOKEN_EXPIRE_MINUTES * 60,
    )
    return {"message": "Token refreshed"}


@router.post("/logout")
async def logout(
    request: Request,
    response: Response,
    redis_client: redis.Redis = Depends(get_redis)
):
    access_token = request.cookies.get("access_token")
    refresh_token = request.cookies.get("refresh_token")

    if access_token:
        payload = decode_access_token(access_token)
        if payload and "exp" in payload:
            ttl = int(payload["exp"]) - int(time.time())
            if ttl > 0:
                await redis_client.setex(f"blocklist:{access_token}", ttl, "true")

    if refresh_token:
        payload = decode_refresh_token(refresh_token)
        if payload and "exp" in payload:
            ttl = int(payload["exp"]) - int(time.time())
            if ttl > 0:
                await redis_client.setex(f"blocklist:{refresh_token}", ttl, "true")

    response.delete_cookie("access_token")
    response.delete_cookie("refresh_token")
    return {"message": "Logged out successfully"}

@router.get("/me", response_model=UserResponse)
async def get_me(current_user: User = Depends(get_current_user)):
    return current_user

@router.put("/me", response_model=UserResponse)
async def update_me(
    user_update: UserUpdate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    if user_update.username:
        # Check if username is already taken
        result = await db.execute(select(User).where(User.username == user_update.username))
        existing = result.scalars().first()
        if existing and existing.id != current_user.id:
            raise HTTPException(status_code=400, detail="Username already taken")
        current_user.username = user_update.username

    if user_update.password:
        current_user.hashed_password = get_password_hash(user_update.password)

    # Note: We do not allow changing role here for security reasons, unless explicitly required

    db.add(current_user)
    await db.commit()
    await db.refresh(current_user)
    return current_user
