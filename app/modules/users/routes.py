# users routes
from fastapi import APIRouter
from fastapi import Depends
from fastapi import HTTPException
from sqlalchemy.orm import Session

from app.db.dependencies import get_db
from app.db.dependencies import get_current_user

from app.modules.users.schemas import (
    UserResponse,
    UpdateUserSchema
)

from app.modules.users.service import (
    get_profile,
    update_profile
)


router = APIRouter()


# list the users
@router.get(
    "/me",
    response_model=UserResponse
)
async def me(
    current_user=Depends(get_current_user)
):
    return get_profile(current_user)

@router.put(
    "/me",
    response_model=UserResponse
)
async def update_me(
    data: UpdateUserSchema,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    try:

        user = update_profile(
            db=db,
            current_user=current_user,
            data=data
        )

        return user

    except ValueError as e:
        raise HTTPException(
            status_code=400,
            detail=str(e)
        )

# todo
# 1. add the protect route