from datetime import datetime
from enum import Enum as PyEnum
from uuid import uuid4

from sqlalchemy import Boolean, DateTime, Enum as SqlEnum, String, text
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column

from app.config.database import Base

"""
from enum import Enum


class UserRole(str, Enum):
    CUSTOMER = "customer"
    VENUE_OWNER = "venue_owner"
    ADMIN = "admin"


class UserStatus(str, Enum):
    ACTIVE = "active"
    INACTIVE = "inactive"
    BLOCKED = "blocked"


class BusinessType(str, Enum):
    INDIVIDUAL = "individual"
    EVENT_MANAGEMENT = "event_management"
    BANQUET_HALL = "banquet_hall"
    AUDITORIUM = "auditorium"
    HOTEL = "hotel"
    RESORT = "resort"
    OTHER = "other"
"""


# CREATE TABLE users (
#     id UUID PRIMARY KEY,

#     mobile_number VARCHAR(15) UNIQUE NOT NULL,

#     full_name VARCHAR(100),
#     email VARCHAR(255),

#     mobile_verified BOOLEAN DEFAULT FALSE,
#     email_verified BOOLEAN DEFAULT FALSE,

#     role VARCHAR(20) NOT NULL DEFAULT 'customer',

#     status VARCHAR(20) NOT NULL DEFAULT 'active',

#     created_at TIMESTAMP NOT NULL,
#     updated_at TIMESTAMP NOT NULL
# );


class UserRole(str, PyEnum):
    CUSTOMER = "customer"
    VENUE_OWNER = "venue_owner"
    ADMIN = "admin"


class UserStatus(str, PyEnum):
    ACTIVE = "active"
    INACTIVE = "inactive"
    BLOCKED = "blocked"
    DELETED = "deleted"


class User(Base):
    __tablename__ = "users"

    id: Mapped[str] = mapped_column(
        UUID(as_uuid=True),
        primary_key=True,
        default=uuid4,
        nullable=False,
        server_default=text("gen_random_uuid()"),
    )

    mobile_number: Mapped[str] = mapped_column(
        String(15),
        unique=True,
        nullable=False,
        index=True,
    )

    full_name: Mapped[str | None] = mapped_column(
        String(100),
        nullable=True,
    )

    email: Mapped[str | None] = mapped_column(
        String(255),
        nullable=True,
        unique=True,
    )

    password_hash: Mapped[str | None] = mapped_column(
        String(255),
        nullable=True,
    )

    mobile_verified: Mapped[bool] = mapped_column(
        Boolean,
        nullable=False,
        default=False,
        server_default="false",
    )

    email_verified: Mapped[bool] = mapped_column(
        Boolean,
        nullable=False,
        default=False,
        server_default="false",
    )

    # role: Mapped[UserRole] = mapped_column(
    #     SqlEnum(UserRole, name="user_role"),
    #     nullable=False,
    #     default=UserRole.CUSTOMER,
    #     server_default=UserRole.CUSTOMER.value,
    # )
    role: Mapped[UserRole] = mapped_column(
        SqlEnum(
            UserRole,
            name="user_role",
            values_callable=lambda enum_cls: [e.value for e in enum_cls],
        ),
        nullable=False,
        default=UserRole.CUSTOMER,
        server_default=UserRole.CUSTOMER.value,
    )

    # status: Mapped[UserStatus] = mapped_column(
    #     SqlEnum(UserStatus, name="user_status"),
    #     nullable=False,
    #     default=UserStatus.ACTIVE,
    #     server_default=UserStatus.ACTIVE.value,
    # )
    status: Mapped[UserStatus] = mapped_column(
        SqlEnum(
            UserStatus,
            name="user_status",
            values_callable=lambda enum_cls: [e.value for e in enum_cls],
        ),
        nullable=False,
        default=UserStatus.ACTIVE,
        server_default=UserStatus.ACTIVE.value,
    )

    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        nullable=False,
        default=datetime.utcnow,
    )

    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        nullable=False,
        default=datetime.utcnow,
        onupdate=datetime.utcnow,
    )
