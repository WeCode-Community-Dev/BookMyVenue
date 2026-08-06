from uuid import UUID

from fastapi import HTTPException, status
from sqlalchemy.exc import IntegrityError
from sqlalchemy.ext.asyncio import AsyncSession

from app.clients.venue_rating import VenueRatingClient
from app.models.rating import Rating
from app.repositories.review import ReviewRepository
from app.schemas.review import (
    VenueReviewCreate,
    VenueReviewItem,
    VenueReviewUpdate,
    VenueReviewsResponse,
)


class ReviewService:
    def __init__(self, db: AsyncSession) -> None:
        self.db = db
        self.repo = ReviewRepository(db)
        self.venue_rating_client = VenueRatingClient()

    def _to_item(self, rating: Rating) -> VenueReviewItem:
        review = rating.review
        # Hidden reviews are omitted from the payload; the rating still shows.
        if review is not None and review.is_hidden:
            review = None

        return VenueReviewItem(
            rating_id=rating.id,
            user_id=rating.user_id,
            rating=rating.rating,
            review_id=review.id if review else None,
            title=review.title if review else None,
            review=review.review if review else None,
            is_edited=review.is_edited if review else None,
            created_at=rating.created_at,
        )

    def _validate_review_fields(
        self,
        *,
        title: str | None,
        review: str | None,
    ) -> None:
        if title and not review:
            raise HTTPException(
                status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
                detail="Review text is required when a title is provided.",
            )

    async def _get_owned_rating(
        self,
        *,
        venue_id: int,
        rating_id: UUID,
        user_id: int,
    ) -> Rating:
        rating = await self.repo.get_by_id_and_venue(
            rating_id=rating_id,
            venue_id=venue_id,
        )
        if rating is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Rating not found for this venue.",
            )
        if rating.user_id != user_id:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="You can only modify your own rating.",
            )
        return rating

    async def _sync_venue_rating(self, venue_id: int) -> None:
        """Recalculate venue stats and push them to the backend (best-effort)."""
        review_count = await self.repo.count_by_venue(venue_id)
        average_rating = await self.repo.average_rating_by_venue(venue_id)
        # Backend stores one decimal place; default to 0.0 when no ratings remain.
        synced_average = (
            round(average_rating, 1) if average_rating is not None else 0.0
        )
        await self.venue_rating_client.update_venue_rating(
            venue_id,
            average_rating=synced_average,
            review_count=review_count,
        )

    async def list_venue_reviews(
        self,
        venue_id: int,
        *,
        skip: int = 0,
        limit: int = 20,
    ) -> VenueReviewsResponse:
        ratings = await self.repo.list_by_venue(venue_id, skip=skip, limit=limit)
        total_count = await self.repo.count_by_venue(venue_id)
        average_rating = await self.repo.average_rating_by_venue(venue_id)

        return VenueReviewsResponse(
            venue_id=venue_id,
            average_rating=(
                round(average_rating, 2) if average_rating is not None else None
            ),
            total_count=total_count,
            items=[self._to_item(rating) for rating in ratings],
        )

    async def create_venue_review(
        self,
        *,
        venue_id: int,
        user_id: int,
        payload: VenueReviewCreate,
    ) -> VenueReviewItem:
        self._validate_review_fields(title=payload.title, review=payload.review)

        existing = await self.repo.get_by_user_and_venue(
            user_id=user_id,
            venue_id=venue_id,
        )
        if existing is not None:
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail="You have already rated this venue.",
            )

        try:
            rating = await self.repo.create_rating(
                venue_id=venue_id,
                user_id=user_id,
                rating_value=payload.rating,
            )

            if payload.review:
                await self.repo.create_review(
                    rating_id=rating.id,
                    title=payload.title,
                    review_text=payload.review,
                )

            await self.db.refresh(rating, attribute_names=["review"])
        except IntegrityError as exc:
            await self.db.rollback()
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail="You have already rated this venue.",
            ) from exc

        await self._sync_venue_rating(venue_id)
        return self._to_item(rating)

    async def update_venue_review(
        self,
        *,
        venue_id: int,
        rating_id: UUID,
        user_id: int,
        payload: VenueReviewUpdate,
    ) -> VenueReviewItem:
        if (
            payload.rating is None
            and payload.title is None
            and payload.review is None
        ):
            raise HTTPException(
                status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
                detail="Provide at least one field to update.",
            )

        rating = await self._get_owned_rating(
            venue_id=venue_id,
            rating_id=rating_id,
            user_id=user_id,
        )

        if payload.rating is not None:
            await self.repo.update_rating_value(rating, payload.rating)

        # Review fields: only touch review row when title/review is sent.
        if payload.title is not None or payload.review is not None:
            new_title = (
                payload.title if payload.title is not None else (
                    rating.review.title if rating.review else None
                )
            )
            new_review_text = (
                payload.review
                if payload.review is not None
                else (rating.review.review if rating.review else None)
            )
            self._validate_review_fields(title=new_title, review=new_review_text)

            if new_review_text is None:
                raise HTTPException(
                    status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
                    detail="Review text is required to create or update a review.",
                )

            if rating.review is None:
                await self.repo.create_review(
                    rating_id=rating.id,
                    title=new_title,
                    review_text=new_review_text,
                )
            else:
                await self.repo.update_review(
                    rating.review,
                    title=new_title,
                    review_text=new_review_text,
                )

            await self.db.refresh(rating, attribute_names=["review"])

        await self._sync_venue_rating(venue_id)
        return self._to_item(rating)

    async def delete_venue_review(
        self,
        *,
        venue_id: int,
        rating_id: UUID,
        user_id: int,
    ) -> None:
        rating = await self._get_owned_rating(
            venue_id=venue_id,
            rating_id=rating_id,
            user_id=user_id,
        )
        await self.repo.delete_rating(rating)
        await self._sync_venue_rating(venue_id)
