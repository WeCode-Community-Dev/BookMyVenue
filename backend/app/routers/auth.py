from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.db.deps import get_db
from app.schemas.user import UserCreate, UserLogin, UserOut, TokenOut, GoogleAuthRequest
from app.services.auth_service import create_user, authenticate_user, authenticate_google_user
from app.core.security import create_access_token, get_current_user, verify_google_token
from app.models.user import User


router = APIRouter(prefix="/auth", tags=["Authentication"])

# Register router

@router.post("/register", response_model = UserOut)
def register(user_data: UserCreate, db: Session = Depends(get_db)):
    new_user = create_user(db, user_data)
    return UserOut(
        id=new_user.id,
        name=new_user.name,
        email=new_user.email,
        phone_number=new_user.phone_number,
        role=new_user.role,
        is_active=new_user.is_active,
        auth_provider=new_user.auth_provider,
        created_at=new_user.created_at,
        is_venue_owner=False, 
    )


# Login router

@router.post("/login", response_model = TokenOut)
def login(credential: UserLogin, db: Session = Depends(get_db)):
    user = authenticate_user(db, credential.email, credential.password)
    
    access_token = create_access_token(data={"sub": str(user.id)})
    
    return TokenOut(access_token=access_token)


# Get current logged in user

@router.get("/me", response_model=UserOut)
def get_me(current_user: User = Depends(get_current_user)):
    return UserOut(
        id=current_user.id,
        name=current_user.name,
        email=current_user.email,
        phone_number=current_user.phone_number,
        role=current_user.role,
        is_active=current_user.is_active,
        auth_provider=current_user.auth_provider,
        created_at=current_user.created_at,
        is_venue_owner=current_user.venue_owner_profile is not None,
    )


# Route for Google Authentication

@router.post("/google", response_model=TokenOut)
def google_login(payload: GoogleAuthRequest, db:Session = Depends(get_db)):
    idinfo = verify_google_token(payload.id_token)

    user = authenticate_google_user(
        db,
        google_email=idinfo["email"],
        google_name=idinfo.get("name", ""),
        google_id=idinfo["sub"]
    )

    access_token = create_access_token(data={"sub": str(user.id)})
    return TokenOut(access_token=access_token)
