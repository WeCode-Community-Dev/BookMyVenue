from sqlalchemy import Column, Integer, String, Boolean, DateTime
from datetime import datetime, timezone
from app.config.database import Base


class User(Base):
    """
    SQLAlchemy Model representing a User account.
    """

    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)

    # Store mobile numbers uniquely for rapid querying
    mobile_number = Column(String, unique=True, index=True, nullable=False)

    # Account status flags
    is_active = Column(Boolean, default=True, nullable=False)

    # Timestamps
    created_at = Column(
        DateTime, default=lambda: datetime.now(timezone.utc), nullable=False
    )
    updated_at = Column(
        DateTime,
        default=lambda: datetime.now(timezone.utc),
        onupdate=lambda: datetime.now(timezone.utc),
        nullable=False,
    )
