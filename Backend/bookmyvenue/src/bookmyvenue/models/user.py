from typing import Optional

from sqlalchemy import DateTime, String, func
from sqlalchemy.orm import Mapped , mapped_column , DeclarativeBase, relationship
from src.bookmyvenue.core.database import Base  #Importing the unified Base from the main database.py file
from datetime import datetime




class User(Base):
    __tablename__ = "users"

    id: Mapped[int] = mapped_column( primary_key=True , index=True , nullable=False , autoincrement=True)
    clerkUserID: Mapped[str] = mapped_column( index=True , nullable=False )
    username: Mapped[str] = mapped_column(String(50), unique=True, nullable=False)
    email: Mapped[str] = mapped_column(nullable=False , unique=True)
    fullname: Mapped[str] = mapped_column(nullable=False)
    phone: Mapped[Optional[str]] = mapped_column(String(10))  #we need phone number which only contains 10 digits
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        server_default=func.now() # when a user is created add the server's that respective time in the created_at column
    )
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        server_default=func.now(), # when a user is created add the server's that respective time in the created_at column
        onupdate=func.now() # when a user updates the exisiting model
    )

    owner: Mapped[Optional["Owner"]] = relationship(
        back_populates="user",
        cascade="all, delete-orphan"
    )

    admin: Mapped[Optional["Admin"]] = relationship(
        back_populates="user",
        cascade="all, delete-orphan"
    )

    def __repr__(self) -> str:
        return f"<User(username={self.username!r}, email={self.email!r})>"