from sqlalchemy.orm import Session
from fastapi import HTTPException, status
from passlib.context import CryptContext
from app.models.user import User
from app.schemas.user import UserCreate, UserProfileUpdate


pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


def hash_password(password:str) -> str:
    return pwd_context.hash(password)


def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)


def create_user(db: Session, user_data: UserCreate) -> User:
    email = str(user_data.email).lower().strip()
    existing_user = db.query(User).filter(User.email == email).first()

    if existing_user:
        if existing_user.auth_provider == "google" and existing_user.hashed_password is None:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="This email is registered via Google. Please Sign in with Google"
            )
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email is already registered"
        )

    hashed = hash_password(user_data.password)

    new_user = User(
        name=user_data.name,
        email=email,
        phone_number=user_data.phone_number,
        hashed_password=hashed,
        auth_provider="email",
        role="user"
    )

    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    return new_user


def authenticate_user(db: Session, email: str, password: str) -> User:
    user = db.query(User).filter(User.email == email.lower().strip()).first()

    if not user or not user.hashed_password:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password",
        )

    if not verify_password(password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password",
        )

    if not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Account is inactive",
        )

    return user


def authenticate_google_user(db: Session, google_email: str, google_name: str, google_id: str) -> User:
    existing_user = db.query(User).filter(User.email == google_email.lower().strip()).first()

    if existing_user:
        if existing_user.google_id is None:
            existing_user.google_id = google_id
            existing_user.auth_provider = "google"
            db.commit()
            db.refresh(existing_user)
        return existing_user

    new_user = User(
        name=google_name,
        email=google_email.lower().strip(),
        google_id=google_id,
        auth_provider="google",
        hashed_password=None,
        phone_number=None
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return new_user


def _require_current_password(user: User, current_password: str | None) -> None:
    if not user.hashed_password:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email and password changes are not available for Google-only accounts",
        )
    if not current_password:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Current password is required",
        )
    if not verify_password(current_password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Current password is incorrect",
        )


def update_user_profile(db: Session, user: User, data: UserProfileUpdate) -> User:
    email_changing = False
    if data.email is not None:
        normalized_email = str(data.email).lower().strip()
        email_changing = normalized_email != (user.email or "").lower()

    password_changing = bool(data.new_password)

    if email_changing or password_changing:
        _require_current_password(user, data.current_password)

    if data.name is not None:
        user.name = data.name.strip() or user.name

    if data.phone_number is not None:
        user.phone_number = data.phone_number.strip() or None

    if email_changing:
        conflict = (
            db.query(User)
            .filter(User.email == normalized_email, User.id != user.id)
            .first()
        )
        if conflict:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Email is already registered",
            )
        user.email = normalized_email

    if password_changing:
        user.hashed_password = hash_password(data.new_password)

    db.commit()
    db.refresh(user)
    return user
