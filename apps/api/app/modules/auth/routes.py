from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.modules.auth.dependencies import get_current_user, require_auth, AuthContext
from app.modules.auth.schemas import AuthMeResponse, ForgotPasswordRequest
from app.modules.auth import service

router = APIRouter()


@router.get("/me", response_model=AuthMeResponse)
def me(current_user: AuthContext = Depends(get_current_user)):
    return service.get_me(current_user)


@router.post("/forgot-password", status_code=204)
def forgot_password(body: ForgotPasswordRequest):
    service.request_password_reset(body.email, body.redirect_to)


@router.post("/register-owner", status_code=204)
def register_owner(
    current_user: AuthContext = Depends(require_auth),
    db: Session = Depends(get_db),
):
    service.register_owner(current_user.user_id, db)


@router.post("/reapply-owner", status_code=204)
def reapply_owner(
    current_user: AuthContext = Depends(require_auth),
    db: Session = Depends(get_db),
):
    service.reapply_owner(current_user.user_id, db)
