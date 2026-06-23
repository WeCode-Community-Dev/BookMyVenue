from sqlalchemy.orm import Session
from fastapi import HTTPException, status
from passlib.context import CryptContext
from app.models.user import User
from app.schemas.user import UserCreate


# Creating an instance of CryptoContext Class.

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


# function to hash password

def hash_password(password:str) -> str:
    return pwd_context.hash(password)


# function to verify the login password with the stored hashed password

def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)


# Registering a new user

def create_user(db: Session, user_data: UserCreate) -> User:
    # Checking whether email already registered
    existing_user = db.query(User).filter(User.email == user_data.email).first()
    
    if existing_user:
        raise HTTPException(
            status_code = status.HTTP_400_BAD_REQUEST,
            detail = "Email is already registered"
        )
        
    # Hashing the password
    
    hashed = hash_password(user_data.password)
    
    # Creating the User object
    new_user = User(
        email = user_data.email,
        hashed_password = hashed,
        role = user_data.role
    )
    
    # Saving to database
    
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    
    return new_user


# Authenticate user on login

def authenticate_user(db: Session, email: str, password: str) -> User:
    # Finding user by email
    
    user = db.query(User).filter(User.email == email).first()
    
    if not user:
        raise HTTPException(
            status_code = status.HTTP_401_UNAUTHORIZED,
            detail = "Invalid email or password"
        )
        
    # verifying password
    
    if not verify_password(password, user.hashed_password):
        raise HTTPException(
            status_code = status.HTTP_401_UNAUTHORIZED,
            detail = "Invalid email or password"
        )
        
    # checking account is active
    
    if not user.is_active:
        raise HTTPException(
            status_code = status.HTTP_403_FORBIDDEN,
            detail = "Account is inactive"
        )
        
    return user