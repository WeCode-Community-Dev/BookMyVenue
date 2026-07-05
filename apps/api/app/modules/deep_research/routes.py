from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.modules.auth.dependencies import AuthContext, require_auth
from app.modules.deep_research import service
from app.modules.deep_research.schemas import DeepResearchSearchRequest, DeepResearchSearchResponse

router = APIRouter()


@router.post("/search", response_model=DeepResearchSearchResponse)
def search(
    body: DeepResearchSearchRequest,
    db: Session = Depends(get_db),
    auth: AuthContext = Depends(require_auth),
):
    return service.run_search(db, auth.user_id, body.query, body.page, body.page_size)
