from fastapi import APIRouter, Depends, Response
from sqlalchemy.orm import Session

from app.core.config import settings
from app.core.exceptions import UnauthorizedError
from app.core.security import create_access_token, verify_password
from app.db.session import get_db
from app.modules.auth.google import verify_google_token
from app.modules.auth.schemas import (
    GoogleLoginRequest,
    GoogleUserInfo,
    LoginRequest,
    Token,
)
from app.modules.users import service as users_service
from app.modules.users.schemas import UserCreate, UserGoogleCreate

router = APIRouter(prefix="/auth", tags=["auth"])

COOKIE_NAME = "bmv_token"


def _set_token_cookie(response: Response, token: str) -> None:
    secure = settings.ENVIRONMENT != "development"
    response.set_cookie(
        key=COOKIE_NAME,
        value=token,
        httponly=True,
        secure=secure,
        samesite="lax",
        max_age=settings.ACCESS_TOKEN_EXPIRE_MINUTES * 60,
        path="/",
    )


def _issue(user_id: int, role: str, response: Response) -> Token:
    token = create_access_token(subject=user_id, extra={"role": role})
    _set_token_cookie(response, token)
    return Token(access_token=token)


@router.post("/signup", response_model=Token)
def signup(data: UserCreate, response: Response, db: Session = Depends(get_db)):
    user = users_service.create_user(db, data)
    return _issue(user.id, user.role.value, response)


@router.post("/login", response_model=Token)
def login(data: LoginRequest, response: Response, db: Session = Depends(get_db)):
    user = users_service.get_user_by_email(db, data.email)
    if not user or not user.password_hash or not verify_password(
        data.password, user.password_hash
    ):
        raise UnauthorizedError("Invalid email or password")
    return _issue(user.id, user.role.value, response)


@router.post("/google", response_model=Token)
def google_login(
    data: GoogleLoginRequest, response: Response, db: Session = Depends(get_db)
):
    info: GoogleUserInfo = verify_google_token(data.credential)
    user = users_service.create_or_get_google_user(
        db,
        UserGoogleCreate(email=info.email, name=info.name, google_sub=info.sub),
    )
    return _issue(user.id, user.role.value, response)


@router.post("/logout")
def logout(response: Response):
    response.delete_cookie(COOKIE_NAME, path="/")
    return {"detail": "logged out"}
