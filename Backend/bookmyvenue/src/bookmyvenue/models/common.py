from decimal import Decimal
from typing import List, Optional
from sqlalchemy import ARRAY, Boolean, Column, DateTime, ForeignKey, Numeric, String, Table, Text, false, func
from sqlalchemy.orm import Mapped, mapped_column, relationship
from datetime import datetime
from src.bookmyvenue.core.database import Base

venue_category_table = Table(
    "venue_category_table",
    Base.metadata,
    Column("venue_id", ForeignKey("venues.id"), primary_key=True),
    Column("category_id", ForeignKey("categories.id"), primary_key=True),
)

venue_amenity_table = Table(
    "venue_amenity_table",
    Base.metadata,
    Column("venue_id", ForeignKey("venues.id"), primary_key=True),
    Column("amenity_id", ForeignKey("amenities.id"), primary_key=True),
)


class Venue(Base):
    __tablename__ = "venues"

    id: Mapped[int] = mapped_column( primary_key=True , index=True , nullable=False , autoincrement=True)
    categories: Mapped[List['Category']] = relationship(
        secondary=venue_category_table,
        back_populates='venues'
    )
    amenities: Mapped[List['Amenity']] = relationship(
        secondary=venue_amenity_table,
        back_populates='venues'
    )
    owner_id: Mapped[int] = mapped_column(ForeignKey('owners.id'))
    owner: Mapped['Owner'] = relationship(back_populates="venues")
    name: Mapped[str] = mapped_column(String(255), nullable=False)
    max_capacity: Mapped[int] = mapped_column(nullable=False, default=0)
    city: Mapped[str] = mapped_column(String(255), nullable=False)
    district: Mapped[str] = mapped_column(String(255), nullable=False)
    state: Mapped[str] = mapped_column(String(255), nullable=False)
    country: Mapped[str] = mapped_column(String(255), nullable=False)
    location_url: Mapped[str] = mapped_column(Text, nullable=False)
    description: Mapped[str] = mapped_column(Text, nullable=False)
    cover_image: Mapped[str] = mapped_column(Text, nullable=False, default='https://www.magnific.com/vectors/venue-booking')
    cancellation: Mapped[bool] = mapped_column(Boolean , default=False)
    cancellation_percentage: Mapped[int] = mapped_column( default=0)
    street_address: Mapped[str] = mapped_column(Text, nullable=False)
    minimum_slot_duration: Mapped[int] = mapped_column(default=2, nullable=False)
    cancellation_time_limit: Mapped[int] = mapped_column(default=0, nullable=False)
    total_reviews: Mapped[int] = mapped_column(default=0, nullable=False)
    hourly_rent: Mapped[int] = mapped_column(default=1000, nullable=False)
    approval_status: Mapped[bool] = mapped_column(default=False, nullable=False)
    rejection_reason: Mapped[str] = mapped_column(Text, nullable=True)
    task_status: Mapped[str] = mapped_column(String(255),  default='Pending' , nullable=True)   #options available --->  *Pending , *Uploading, *Completed, *Failed
    celery_task_ID: Mapped[str] = mapped_column(Text, nullable=True)
    overall_rating: Mapped[Decimal] = mapped_column(
        Numeric(precision=5,scale=2), #precision refers with the total numbers exist with scale which determines no of digits after decimal point
        default=Decimal("0.00"),
        nullable=False,
    )
    gallery: Mapped[List[str]] = mapped_column(ARRAY(String), default=list, nullable=False)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        server_default=func.now() # when a user is created add the server's that respective time in the created_at column
    )
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        server_default=func.now(), # when a user is created add the server's that respective time in the created_at column
        onupdate=func.now() # when a user updates the exisiting model
    )

    price_manager: Mapped[Optional['PriceManager']] = relationship(
        back_populates='venue',
        cascade="all, delete-orphan"
    )


    def __repr__(self) -> str:
        return f"<Venue(id={self.id}, name={self.name!r})>"





    