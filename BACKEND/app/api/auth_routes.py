from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.schema.auth import (
    SignupRequest,
    LoginRequest
)
from app.services.auth_service import (
    signup,
    login
)

router = APIRouter(
    prefix="/auth",
    tags=["Authentication"]
)

@router.post("/signup")
def signup_user(
    payload: SignupRequest,
    db: Session = Depends(get_db)
):
    try:
        return signup(
            db,
            payload.name,
            payload.email,
            payload.password,
            payload.role
        )
    except Exception as e:
        raise HTTPException(
            status_code=400,
            detail=str(e)
        )

@router.post("/login")
def login_user(
    payload: LoginRequest,
    db: Session = Depends(get_db)
):
    try:
        return login(
            db,
            payload.email,
            payload.password
        )
    except Exception as e:
        raise HTTPException(
            status_code=401,
            detail=str(e)
        )