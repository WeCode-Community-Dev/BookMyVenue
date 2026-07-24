from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session

from app.db.deps import get_db
from app.core.security import get_current_user
from app.models.user import User
from app.schemas.review import ReplyCreate, ReviewCreate, ReviewOut
from app.services.review_service import add_or_update_reply, create_review, get_public_reviews

router = APIRouter(prefix="/reviews", tags=["Reviews"])


@router.get("/public", response_model=list[ReviewOut])
def public_reviews(
    limit: int = Query(default=6, ge=1, le=20),
    db: Session = Depends(get_db),
):
    """Public endpoint — recent reviews from approved venues. No auth required."""
    return get_public_reviews(db, limit=limit)

@router.post("/", response_model=ReviewOut)
def submit_review(
    payload: ReviewCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return create_review(db, current_user, payload)



@router.post("/{review_id}/reply", response_model=ReviewOut)
def reply_to_review(
    review_id: int,
    payload: ReplyCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):

    return add_or_update_reply(db, review_id, current_user, payload.reply_text)