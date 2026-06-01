#  this is the file for crearting hash password and verify password 
from passlib.context import CryptContext

from datetime import datetime, timedelta
from jose import jwt,JWTError
from app.core.config import settings

from fastapi.security import HTTPBearer

security = HTTPBearer()

# setting up the encryption tool using cryptocontect
pwd_context = CryptContext(
    schemes=["bcrypt"],
    deprecated="auto"
) 

# hast the password 
def hash_password(password: str) -> str:
    return pwd_context.hash(password) 

# verify the password 
def verify_password(
    plain_password: str,
    hashed_password: str
) -> bool:
    return pwd_context.verify(
        plain_password,
        hashed_password
    )

# genarte the acess token 
def create_access_token(data: dict):
    payload = data.copy()

    expire = datetime.utcnow() + timedelta(
        minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES
    )

    payload.update({
        "exp": expire
    })

    return jwt.encode(
        payload,
        settings.SECRET_KEY,
        algorithm=settings.ALGORITHM
    )

# verify the token 
def verify_token(token: str):
    try:
        payload = jwt.decode(
            token,
            settings.SECRET_KEY,
            algorithms=[settings.ALGORITHM]
        )

        return payload

    except JWTError:
        return None 

