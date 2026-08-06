from __future__ import annotations

import re
import unicodedata

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.venue import Venue


def slugify(value: str) -> str:
    value = (
        unicodedata.normalize("NFKD", value)
        .encode("ascii", "ignore")
        .decode("ascii")
    )
    value = re.sub(r"[^\w\s-]", "", value.lower())
    return re.sub(r"[-\s]+", "-", value).strip("-_")


async def generate_unique_venue_slug(
    session: AsyncSession,
    name: str,
    *,
    exclude_pk: int | None = None,
) -> str:
    base_slug = slugify(name)[:200] or "venue"
    slug = base_slug
    counter = 1

    while True:
        query = select(Venue.id).where(Venue.slug == slug)
        if exclude_pk is not None:
            query = query.where(Venue.id != exclude_pk)
        existing = await session.scalar(query)
        if existing is None:
            return slug
        suffix = f"-{counter}"
        slug = f"{base_slug[: 200 - len(suffix)]}{suffix}"
        counter += 1
