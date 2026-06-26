from datetime import timedelta
from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy import func, select
from sqlalchemy.orm import Session
from schemas.auth import UserRegister, UserOut, UserLogin, Token

from database import get_db
import os

from models.user import User, RoleEnum
from utils.hashing import hash_password, verify_password
from utils.jwt import verify_access_token, create_access_token

ACCESS_TOKEN_EXPIRE_MINUTES = int(
    os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", default=30))

router = APIRouter()


@router.post(
    "/register",
    response_model=UserOut,
    status_code=status.HTTP_201_CREATED,
)
def create_user(user: UserRegister, db: Annotated[Session, Depends(get_db)]):
    result = db.execute(select(User).where(func.lower(User.email) == user.email.lower(),
                                           ),
                        )
    print(user.role, "---role")
    existing_user = result.scalars().first()
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )

    new_user = User(
        name=user.name,
        email=user.email.lower(),
        password_hash=hash_password(user.password),
        role=RoleEnum(user.role.lower()),
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return new_user


@router.post(
    "/login",
    response_model=Token,
    status_code=status.HTTP_200_OK
)
def login_for_access_token(
        form_data: Annotated[OAuth2PasswordRequestForm, Depends()],
        db: Annotated[Session, Depends(get_db)]):

    email = form_data.username.strip().lower()

    result = db.execute(select(User).where(User.email == email))
    user = result.scalars().first()
    print("user login", user)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or passwords",
            headers={"WWW-Authenticate": "Bearer"},
        )
    if not verify_password(form_data.password, user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or passwords",
            headers={"WWW-Authenticate": "Bearer"},
        )

    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": str(user.id),
              "role": str(user.role.value)},
        expires_delta=access_token_expires,

    )
    return Token(access_token=access_token, token_type="bearer")
