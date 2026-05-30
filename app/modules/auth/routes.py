# authentocation routes
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.db.dependencies import get_db

router = APIRouter()

# login route
@router.post("/login")
async def login(db: Session = Depends(get_db)):
    return {
        "message": "Login endpoint"
    }