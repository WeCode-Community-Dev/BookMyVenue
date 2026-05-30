from datetime import datetime

from sqlalchemy import (
    String,
    Text,
    DateTime,
    CheckConstraint,
    func
)
from sqlalchemy.orm import Mapped, mapped_column

from app.db.base import Base


class User(Base):
    __tablename__ = "users"

    id: Mapped[int] = mapped_column(primary_key=True,index=True)
    name: Mapped[str] = mapped_column(String(100),nullable=False)
    username: Mapped[str] = mapped_column(String(100),nullable=False)
    email: Mapped[str] = mapped_column(String(150),unique=True,nullable=False)
    password: Mapped[str] = mapped_column(Text,nullable=False)
    role: Mapped[str] = mapped_column(String(20),nullable=False)
    created_at: Mapped[datetime] = mapped_column(DateTime,server_default=func.now())
    updated_at: Mapped[datetime] = mapped_column(DateTime,server_default=func.now(),onupdate=func.now())

    # check if any role must be in role field 
    __table_args__ = (
        CheckConstraint(
            "role IN ('user', 'owner', 'admin')",
            name="check_user_role"
        ),
    )