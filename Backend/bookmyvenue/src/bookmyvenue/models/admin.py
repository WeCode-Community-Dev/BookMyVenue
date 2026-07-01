from typing import Optional, List

from sqlalchemy import ForeignKey, String, Text

from src.bookmyvenue.core.database import Base
from sqlalchemy.orm import Mapped, mapped_column, relationship


class Admin(Base):
    __tablename__ = "admin"

    id: Mapped[int] = mapped_column( primary_key=True , index=True , nullable=False , autoincrement=True)
    user_id: Mapped[int] = mapped_column(ForeignKey('users.id')) #go to users table, pick it's ID and place it in this column as foreign key relation
    
    user: Mapped[Optional["User"]] = relationship(
        back_populates="admin"
    )

class Category(Base):
    __tablename__ = "categories"
    id: Mapped[int] = mapped_column( primary_key=True , index=True , nullable=False , autoincrement=True)
    icon_name:Mapped[str] = mapped_column(String(100), unique=True, nullable=False)
    name:Mapped[str] = mapped_column(String(100), unique=True, nullable=False)

    venues:Mapped[List["Venue"]] = relationship(secondary="venue_category_table",back_populates="categories")

class Amenity(Base):
    __tablename__ = "amenities"
    id: Mapped[int] = mapped_column( primary_key=True , index=True , nullable=False , autoincrement=True)
    icon_name:Mapped[str] = mapped_column(String(20), unique=True, nullable=False)
    name:Mapped[str] = mapped_column(String(100), unique=True, nullable=False)
    

    venues:Mapped[List["Venue"]] = relationship(secondary="venue_amenity_table",back_populates="amenities")