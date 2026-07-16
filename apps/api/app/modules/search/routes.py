from typing import Literal

from fastapi import APIRouter, Depends, HTTPException, Query, Request
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.rate_limit import enforce_ip_hourly_limit
from app.modules.admin import settings_store
from app.modules.search import service
from app.modules.search.schemas import SearchParams, SearchResult, SearchResultPage
from app.shared.pagination import Page

router = APIRouter()

SortOption = Literal["recommended", "price_asc", "price_desc", "capacity_desc"]


def _params(
    q: str = Query(default=""),
    city: str = Query(default=""),
    venue_type: str | None = Query(default=None),
    capacity: int = Query(default=0),
    instant_booking: bool = Query(default=False),
    sort: SortOption = Query(default="recommended"),
    cursor: str | None = Query(default=None),
    page: int = Query(default=1, ge=1),
    page_size: int = Query(default=25, ge=1, le=100),
) -> SearchParams:
    return SearchParams(
        q=q,
        city=city,
        venue_type=venue_type,
        capacity=capacity,
        instant_booking=instant_booking,
        sort=sort,
        cursor=cursor,
        page=page,
        page_size=page_size,
    )


@router.get("/", response_model=Page[SearchResult])
def search_venues(
    params: SearchParams = Depends(_params),
    db: Session = Depends(get_db),
):
    return service.search(db, params)


@router.get("/fts", response_model=SearchResultPage)
def search_fts(
    params: SearchParams = Depends(_params),
    db: Session = Depends(get_db),
):
    try:
        return service.search_fts(db, params)
    except ValueError as exc:
        raise HTTPException(status_code=400, detail=str(exc)) from exc


def _enforce_embedding_rate_limit(request: Request, db: Session) -> None:
    """/semantic and /hybrid both call the paid Jina embeddings API on every
    request and are fully public — shared budget so alternating between the
    two endpoints can't be used to double the effective limit."""
    client_ip = request.client.host if request.client else "unknown"
    limit = settings_store.get_setting(db, "search_embedding_rate_limit_per_hour")
    enforce_ip_hourly_limit(client_ip, "search_embedding", limit)


@router.get("/semantic", response_model=SearchResultPage)
def search_semantic(
    request: Request,
    params: SearchParams = Depends(_params),
    db: Session = Depends(get_db),
):
    _enforce_embedding_rate_limit(request, db)
    return service.search_semantic(db, params)


@router.get("/hybrid", response_model=SearchResultPage)
def search_hybrid(
    request: Request,
    params: SearchParams = Depends(_params),
    db: Session = Depends(get_db),
):
    _enforce_embedding_rate_limit(request, db)
    try:
        return service.search_hybrid(db, params)
    except ValueError as exc:
        raise HTTPException(status_code=400, detail=str(exc)) from exc
