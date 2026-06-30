from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.core.deps import get_current_user
from app.db.session import get_db
from app.modules.users.model import User
from app.modules.users.schemas import (
    OwnerProfileCreate,
    OwnerProfileRead,
    UserRead,
    UserUpdate,
)
from app.modules.users import service

router = APIRouter(prefix="/users", tags=["users"])


@router.get("/me", response_model=UserRead)
def read_me(current_user: User = Depends(get_current_user)):
    return current_user


@router.put("/me", response_model=UserRead)
def update_me(
    data: UserUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    return service.update_user(db, current_user, data)


@router.post("/me/owner", response_model=OwnerProfileRead)
def register_as_owner(
    data: OwnerProfileCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    return service.become_owner(db, current_user, data)


@router.get("/me/owner", response_model=OwnerProfileRead)
def read_my_owner_profile(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    return service.get_owner_profile(db, current_user.id)
