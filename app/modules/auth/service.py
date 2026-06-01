# in this file the buisness logic is implemented 
from app.core.security import hash_password 
from app.core.security import (
    verify_password,
    create_access_token
)
from app.modules.users.models import User


# user registration buisness logic
def register_user(db, data):

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
        return None

    if not verify_password(
        password,
        user.password
    ):
        return None

    token = create_access_token({
        "sub": str(user.id),
        "role": user.role
    })

    return token