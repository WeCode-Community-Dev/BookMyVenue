# authentocation routes
from fastapi import HTTPException
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.db.dependencies import get_db
from app.db.dependencies import get_current_user

from app.modules.auth.schemas import RegisterSchema, LoginSchema,ChangePasswordRequest
from app.modules.auth.service import login_user, register_user,change_password


router = APIRouter()



# register route 
@router.post("/register")
async def register(
    data: RegisterSchema,
    db: Session = Depends(get_db)
):
    try:
        user = register_user(
            db=db,
            data=data
        )

        return {
            "message": "User registered successfully",
            "user_id": user.id
        }

    except ValueError as e:
        raise HTTPException(
            status_code=400,
            detail=str(e)
        )



# login route
@router.post("/login")
async def login(
    data: LoginSchema,
    db: Session = Depends(get_db)
):
    try:

        token = login_user(
            db=db,
            email=data.email,
            password=data.password
        )

        return token

    except ValueError as e:
        raise HTTPException(
            status_code=401,
            detail=str(e)
        )

# get the user info 
@router.get("/me")
async def me(
    current_user=Depends(get_current_user)
):
    return {
        "id": current_user.id,
        "name": current_user.name,
        "username": current_user.username,
        "email": current_user.email,
        "role": current_user.role
    } 

@router.post("/change-password")
async def change_password_route(
    data: ChangePasswordRequest,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    try:

        result = change_password(
            db=db,
            email=current_user.email,
            old_password=data.old_password,
            new_password=data.new_password
        )

        return result

    except ValueError as e:
        raise HTTPException(
            status_code=400,
            detail=str(e)
        )

