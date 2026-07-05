from fastapi import APIRouter, Depends

from app.modules.auth.dependencies import AuthContext, require_auth
from app.modules.deep_research import query_understanding
from app.modules.deep_research.schemas import QueryUnderstanding, QueryUnderstandingRequest

router = APIRouter()


@router.post("/understand", response_model=QueryUnderstanding)
def understand(
    body: QueryUnderstandingRequest,
    auth: AuthContext = Depends(require_auth),
):
    return query_understanding.understand_query(body.query)
