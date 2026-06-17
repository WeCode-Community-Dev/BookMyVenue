from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.db.deps import get_db
from app.schemas.user import UserCreate, UserLogin, UserOut, TokenOut
from app.services.auth_service import create_user, authenticate_user
from app.core.security import create_access_token, get_current_user
from app.models.user import User


router = APIRouter(prefix="/auth", tags=["Authentication"])

# Register router

@router.post("/register", response_model = UserOut)
def register(user_data: UserCreate, db: Session = Depends(get_db)):
    new_user = create_user(db, user_data)
    return new_user


# Login router

@router.post("/login", response_model = TokenOut)
def login(credential: UserLogin, db: Session = Depends(get_db)):
    user = authenticate_user(db, credential.email, credential.password)
    
    access_token = create_access_token(data={"sub": str(user.id)})
    
    return TokenOut(access_token=access_token)


# Get current logged in user

@router.get("/me", response_model=UserOut)
def get_me(current_user: User = Depends(get_current_user)):
    return current_user