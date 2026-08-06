import uuid

from sqlalchemy import Select, func, select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from app.models.rating import Rating
from app.models.review import Review


class ReviewRepository:
    def __init__(self, db: AsyncSession) -> None:
        self.db = db

    def _venue_ratings_query(self, venue_id: int) -> Select[tuple[Rating]]:
        return (
            select(Rating)
            .options(selectinload(Rating.review))
            .where(Rating.venue_id == venue_id)
            .order_by(Rating.created_at.desc())
        )

    async def list_by_venue(
        self,
        venue_id: int,
        *,
        skip: int = 0,
        limit: int = 20,
    ) -> list[Rating]:
        result = await self.db.execute(
            self._venue_ratings_query(venue_id).offset(skip).limit(limit)
        )
        return list(result.scalars().all())

    async def count_by_venue(self, venue_id: int) -> int:
        result = await self.db.execute(
            select(func.count())
            .select_from(Rating)
            .where(Rating.venue_id == venue_id)
        )
        return int(result.scalar_one())

    async def average_rating_by_venue(self, venue_id: int) -> float | None:
        result = await self.db.execute(
            select(func.avg(Rating.rating)).where(Rating.venue_id == venue_id)
        )
        average = result.scalar_one()
        return float(average) if average is not None else None

    async def get_by_user_and_venue(
        self,
        *,
        user_id: int,
        venue_id: int,
    ) -> Rating | None:
        result = await self.db.execute(
            select(Rating)
            .options(selectinload(Rating.review))
            .where(
                Rating.user_id == user_id,
                Rating.venue_id == venue_id,
            )
        )
        return result.scalar_one_or_none()

    async def get_by_id_and_venue(
        self,
        *,
        rating_id: uuid.UUID,
        venue_id: int,
    ) -> Rating | None:
        result = await self.db.execute(
            select(Rating)
            .options(selectinload(Rating.review))
            .where(
                Rating.id == rating_id,
                Rating.venue_id == venue_id,
            )
        )
        return result.scalar_one_or_none()

    async def create_rating(
        self,
        *,
        venue_id: int,
        user_id: int,
        rating_value: int,
    ) -> Rating:
        rating = Rating(
            id=uuid.uuid4(),
            venue_id=venue_id,
            user_id=user_id,
            rating=rating_value,
        )
        self.db.add(rating)
        await self.db.flush()
        return rating

    async def create_review(
        self,
        *,
        rating_id: uuid.UUID,
        title: str | None,
        review_text: str,
    ) -> Review:
        review = Review(
            id=uuid.uuid4(),
            rating_id=rating_id,
            title=title,
            review=review_text,
        )
        self.db.add(review)
        await self.db.flush()
        return review

    async def update_rating_value(self, rating: Rating, rating_value: int) -> Rating:
        rating.rating = rating_value
        await self.db.flush()
        return rating

    async def update_review(
        self,
        review: Review,
        *,
        title: str | None,
        review_text: str,
    ) -> Review:
        review.title = title
        review.review = review_text
        review.is_edited = True
        await self.db.flush()
        return review

    async def delete_rating(self, rating: Rating) -> None:
        await self.db.delete(rating)
        await self.db.flush()
