# in this file the buisness logic is implemented 
from app.core.security import hash_password 
from app.core.security import (
    verify_password,
    create_access_token
)
from app.modules.users.models import User


# user registration buisness logic
def register_user(db, data):

    # Check email exists
    existing_email = (
        db.query(User)
        .filter(User.email == data.email)
        .first()
    )

    if existing_email:
        raise ValueError("Email already registered")

    # Check username exists
    existing_username = (
        db.query(User)
        .filter(User.username == data.username)
        .first()
    )

    if existing_username:
        raise ValueError("Username already taken")

    # Password validation
    if len(data.password) < 8:
        raise ValueError(
            "Password must be at least 8 characters long"
        )

    hashed_password = hash_password(
        data.password
    )

    # create user

    user = User(
        name=data.name,
        username=data.username,
        email=data.email,
        password=hashed_password,
        role="user"
    )

    db.add(user)
    db.commit()
    db.refresh(user)

    return user 


#  user login
def login_user(db, email, password):

    user = db.query(User).filter(
        User.email == email
    ).first()

    if not user:
        raise ValueError("Invalid email or password")

    if not verify_password(
        password,
        user.password
    ):
        raise ValueError("Invalid email or password")

    token = create_access_token(
        {
            "sub": str(user.id),
            "role": user.role,
            "email": user.email
        }
    )

    return {
        "access_token": token,
        "token_type": "bearer"
    }

# change the password
def change_password(
    db,
    email,
    old_password,
    new_password
):

    user = (
        db.query(User)
        .filter(User.email == email)
        .first()
    )

    if not user:
        raise ValueError("User not found")

    # verify current password
    if not verify_password(
        old_password,
        user.password
    ):
        raise ValueError("Old password is incorrect")

    # check new password is old password
    if old_password == new_password:
        raise ValueError(
            "New password cannot be same as old password"
        )

    # password rule
    if len(new_password) < 8:
        raise ValueError(
            "Password must be at least 8 characters long"
        )

    # hashing the new password 
    user.password = hash_password(new_password)

    db.commit()
    db.refresh(user)

    return {
        "message": "Password changed successfully"
    }

# *****todo***** 
# 1. add proper htt validation with status code 

