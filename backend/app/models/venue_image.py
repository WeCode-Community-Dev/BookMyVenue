from datetime import datetime, timezone

from sqlalchemy import (
    Boolean,
    Column,
    DateTime,
    ForeignKey,
    Integer,
    String,
)
from sqlalchemy.orm import relationship

from app.db.database import Base


class VenueImage(Base):
    __tablename__ = "venue_images"

    id = Column(Integer, primary_key=True, index=True)

    venue_id = Column(
        Integer,
        ForeignKey("venues.id", ondelete="CASCADE"),
        nullable=False,
    )

    url = Column(String(500), nullable=False)

    sort_order = Column(Integer, nullable=False, default=0)

    # Exactly one image per venue carries the cover flag; it is mirrored into
    # venues.image_url so venue cards keep working off a single column.
    is_cover = Column(Boolean, nullable=False, default=False)

    created_at = Column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
    )

    venue = relationship("Venue", back_populates="images")
