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


# Registering a new user manually

def create_user(db: Session, user_data: UserCreate) -> User:
    # Checking whether email already registered
    existing_user = db.query(User).filter(User.email == user_data.email).first()
    
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
        
    # Hashing the password
    
    hashed = hash_password(user_data.password)
    
    # Creating the User object
    new_user = User(
        name=user_data.name,
        email=user_data.email,
        phone_number=user_data.phone_number,
        hashed_password=hashed,
        auth_provider="email",
        role=user_data.role
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


# Find or create a user from Google login (Google Authentication)
def authenticate_google_user(db: Session, google_email: str, google_name: str, google_id: str) -> User:
    existing_user = db.query(User).filter(User.email == google_email).first()

    if existing_user:
        if existing_user.google_id is None:
            existing_user.google_id = google_id
            existing_user.auth_provider = "google"
            db.commit()
            db.refresh(existing_user)
        return existing_user

    new_user = User(
        name=google_name,
        email=google_email,
        google_id=google_id,
        auth_provider="google",
        hashed_password=None,
        phone_number=None
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return new_user