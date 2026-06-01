# authentocation routes
from fastapi import HTTPException
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.db.dependencies import get_db
from app.db.dependencies import get_current_user

from app.modules.auth.schemas import RegisterSchema, LoginSchema
from app.modules.auth.service import login_user, register_user


router = APIRouter()



# register route 
@router.post('/register')
async def register(data: RegisterSchema,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)):
    pass 



# login route
@router.post("/login")
async def login(
    data: LoginSchema,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):

    token = login_user(
        db,
        data.email,
        data.password
    )

    if not token:
        raise HTTPException(
            status_code=401,
            detail="Invalid credentials"
        )

    return {
        "access_token": token,
        "token_type": "bearer"
    }

