from typing import List, Optional

from sqlalchemy import DateTime, ForeignKey, String, Text, func, Integer
from sqlalchemy.orm import Mapped , mapped_column , DeclarativeBase, relationship
from src.bookmyvenue.core.database import Base  #Importing the unified Base from the main database.py file
from datetime import datetime


class Owner(Base):
    __tablename__ = "owners"

    id: Mapped[int] = mapped_column( primary_key=True ,  nullable=False , autoincrement=True)
    user_id: Mapped[int] = mapped_column(ForeignKey('users.id')) #go to users table, pick it's ID and place it in this column as foreign key relation
    profession: Mapped[str] = mapped_column(String(100), nullable=False)
    promise: Mapped[str] = mapped_column(Text, nullable=False)
    intro_descp: Mapped[str] = mapped_column(Text, nullable=True)
    organization: Mapped[str] = mapped_column(String(200), nullable=False)
    venues_listed: Mapped[int] = mapped_column(Integer , default=0)
    overall_ratting: Mapped[int] = mapped_column(Integer , default=0)
    joined_on: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        server_default=func.now() # when a user is created add the server's that respective time in the created_at column
    )
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        server_default=func.now(), # when a user is created add the server's that respective time in the created_at column
        onupdate=func.now() # when a user updates the exisiting model
    )
    user: Mapped[Optional["User"]] = relationship(
        back_populates="owner"
    )
    venues: Mapped[Optional[List['Venue']]] = relationship(back_populates='owner',cascade="all, delete-orphan")

    def __repr__(self) -> str:
        return f"<Owner(id={self.id}, organization={self.organization!r})>"
    


class PriceManager(Base):
    __tablename__ = "price_manager"

    id: Mapped[int] = mapped_column( primary_key=True ,  nullable=False , autoincrement=True)
    venue_id: Mapped[int] = mapped_column(ForeignKey('venues.id'))
    venue:Mapped['Venue'] = relationship(back_populates="price_manager")
    standerd_price: Mapped[int] = mapped_column(default=1000, nullable=False)
    