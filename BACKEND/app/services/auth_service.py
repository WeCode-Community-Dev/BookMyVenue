from sqlalchemy.orm import Session

from passlib.context import CryptContext

from app.model.user import User

from app.core.security import (
    create_access_token
)

pwd_context = CryptContext(
    schemes=["bcrypt"],
    deprecated="auto"
)


def signup(
    db: Session,
    name: str,
    email: str,
    password: str
):

    existing_user = (
        db.query(User)
        .filter(User.email == email)
        .first()
    )

    if existing_user:
        raise Exception(
            "Email already registered"
        )

    hashed_password = (
        pwd_context.hash(password)
    )

    user = User(
        name=name,
        email=email,
        password=hashed_password
    )

    db.add(user)

    db.commit()

    db.refresh(user)

    return {
        "message": "Signup successful"
    }


def login(
    db: Session,
    email: str,
    password: str
):

    user = (
        db.query(User)
        .filter(User.email == email)
        .first()
    )

    if not user:
        raise Exception(
            "Invalid credentials"
        )

    if not pwd_context.verify(
        password,
        user.password
    ):
        raise Exception(
            "Invalid credentials"
        )

    token = create_access_token(
        {
            "sub": str(user.id),
            "email": user.email
        }
    )

    return {
        "access_token": token,
        "token_type": "bearer",
        "user": {
            "id": user.id,
            "name": user.name,
            "email": user.email
        }
    }