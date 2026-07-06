from uuid import UUID

from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.modules.auth.dependencies import AuthContext, require_admin
from app.modules.deep_research import admin_service
from app.modules.deep_research.schemas import (
    DeepResearchQueryDetail,
    DeepResearchQueryListResponse,
    DeepResearchStatsResponse,
)

router = APIRouter()


@router.get("/stats", response_model=DeepResearchStatsResponse)
def get_stats(
    days: int = Query(30, ge=1, le=90),
    _: AuthContext = Depends(require_admin),
    db: Session = Depends(get_db),
):
    return admin_service.get_query_stats(db, days=days)


@router.get("/queries", response_model=DeepResearchQueryListResponse)
def list_queries(
    page: int = Query(1, ge=1),
    page_size: int = Query(20, ge=1, le=100),
    search: str | None = Query(None),
    _: AuthContext = Depends(require_admin),
    db: Session = Depends(get_db),
):
    return admin_service.list_queries(db, page=page, page_size=page_size, search=search)


@router.get("/queries/{query_id}", response_model=DeepResearchQueryDetail)
def get_query(
    query_id: UUID,
    _: AuthContext = Depends(require_admin),
    db: Session = Depends(get_db),
):
    return admin_service.get_query_detail(db, query_id)
