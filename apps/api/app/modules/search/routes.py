from typing import Literal

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session

from app.core.database import get_db
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


@router.get("/semantic", response_model=SearchResultPage)
def search_semantic(
    params: SearchParams = Depends(_params),
    db: Session = Depends(get_db),
):
    return service.search_semantic(db, params)


@router.get("/hybrid", response_model=SearchResultPage)
def search_hybrid(
    params: SearchParams = Depends(_params),
    db: Session = Depends(get_db),
):
    try:
        return service.search_hybrid(db, params)
    except ValueError as exc:
        raise HTTPException(status_code=400, detail=str(exc)) from exc
