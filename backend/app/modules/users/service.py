from sqlalchemy import select
from sqlalchemy.orm import Session

from app.core.exceptions import ConflictError, NotFoundError
from app.core.security import hash_password
from app.modules.users.model import User, UserRole
from app.modules.users.owner_model import OwnerProfile
from app.modules.users.schemas import (
    OwnerProfileCreate,
    UserCreate,
    UserGoogleCreate,
    UserUpdate,
)


def get_user_by_email(db: Session, email: str) -> User | None:
    return db.scalar(select(User).where(User.email == email))


def get_user_by_id(db: Session, user_id: int) -> User:
    user = db.get(User, user_id)
    if not user:
        raise NotFoundError("User not found")
    return user


def get_user_by_google_sub(db: Session, google_sub: str) -> User | None:
    return db.scalar(select(User).where(User.google_sub == google_sub))


def create_user(db: Session, data: UserCreate) -> User:
    if get_user_by_email(db, data.email):
        raise ConflictError("Email already registered")
    user = User(
        email=data.email,
        name=data.name,
        password_hash=hash_password(data.password),
        role=UserRole(data.role.value),
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    return user


def create_or_get_google_user(db: Session, data: UserGoogleCreate) -> User:
    existing = get_user_by_google_sub(db, data.google_sub)
    if existing:
        return existing
    if get_user_by_email(db, data.email):
        raise ConflictError("Email already registered with a different sign-in method")
    user = User(
        email=data.email,
        name=data.name,
        google_sub=data.google_sub,
        role=data.role,
        password_hash=None,
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    return user


def update_user(db: Session, user: User, data: UserUpdate) -> User:
    if data.name is not None:
        user.name = data.name
    db.commit()
    db.refresh(user)
    return user


def become_owner(db: Session, user: User, profile: OwnerProfileCreate) -> OwnerProfile:
    if user.role == UserRole.admin:
        from app.core.exceptions import ForbiddenError
        raise ForbiddenError("Admins cannot become owners")
    existing = db.scalar(select(OwnerProfile).where(OwnerProfile.user_id == user.id))
    if existing:
        existing.business_name = profile.business_name
        existing.contact_phone = profile.contact_phone
        existing.payout_info = profile.payout_info
        owner_profile = existing
    else:
        owner_profile = OwnerProfile(
            user_id=user.id,
            business_name=profile.business_name,
            contact_phone=profile.contact_phone,
            payout_info=profile.payout_info,
        )
        db.add(owner_profile)
    user.role = UserRole.owner
    db.commit()
    db.refresh(owner_profile)
    return owner_profile


def get_owner_profile(db: Session, user_id: int) -> OwnerProfile:
    profile = db.scalar(select(OwnerProfile).where(OwnerProfile.user_id == user_id))
    if not profile:
        raise NotFoundError("Owner profile not found")
    return profile
