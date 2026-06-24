from fastapi import APIRouter, Depends
from app.core.dependencies import get_current_user
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.services.user_service import get_users_list

router = APIRouter(
    prefix="/user",
    tags=["User"]
)

@router.get("/profile")
def profile(
    current_user=Depends(get_current_user)
):
    return {
        "message": "Authorized",
        "user": current_user
    }

@router.get("/users")
def get_users(
    current_user=Depends(get_current_user),
    db: Session = Depends(get_db),
    page_no: int = 1,
    limit: int = 20
):
    try:
        return get_users_list(
            db,
            page_no,
            limit
        )
    except Exception as e:
        raise HTTPException(
            status_code=400,
            detail=str(e)
        )