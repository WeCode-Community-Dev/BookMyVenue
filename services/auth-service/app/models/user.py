from datetime import datetime

from sqlalchemy import (
    Boolean,
    CheckConstraint, 
    UniqueConstraint, 
    ForeignKey,
    DateTime, 
    Enum, 
    Index, 
    String, 
    Text,
    func,
)
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.core.database import Base
from .enums import UserRole, AuthProvider


class User(Base):
    __tablename__ = "users"

    __table_args__ = (
        CheckConstraint(
            "email IS NOT NULL OR phone IS NOT NULL",
            name="must_have_contact"
        ),
        Index("idx_users_email", "email"),
        Index("idx_users_phone", "phone"),
        Index("idx_users_role", "role"),
    )


    id: Mapped[int] = mapped_column(primary_key=True)

    full_name: Mapped[str | None] = mapped_column(
        String(255),
        nullable=True,
    )

    email: Mapped[str | None] = mapped_column(
        String(255),
        unique=True,
        nullable=True,
    )

    phone: Mapped[str | None] = mapped_column(
        String(20),
        nullable=True,
    )

    avatar_url: Mapped[str | None] = mapped_column(
        Text,
        nullable=True,
    )

    role: Mapped[UserRole] = mapped_column(
        Enum(UserRole),
        default=UserRole.USER,
    )

    is_active: Mapped[bool] = mapped_column(
        Boolean,
        default=True,
    )

    is_blocked: Mapped[bool] = mapped_column(
        Boolean,
        default=False,
    )

    is_email_verified: Mapped[bool] = mapped_column(
        Boolean,
        default=False,
    )

    is_phone_verified: Mapped[bool] = mapped_column(
        Boolean,
        default=False,
    )

    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        server_default=func.now(),
    )

    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        server_default=func.now(),
        onupdate=func.now(),
    )

    auth_accounts: Mapped[list["AuthAccount"]] = relationship(
        back_populates="user",
        cascade="all, delete-orphan",
    )


class AuthAccount(Base):
    __tablename__ = "auth_accounts"

    __table_args__ = (
        UniqueConstraint(
            "provider",
            "provider_user_id",
            name="uq_auth_accounts_provider_user",
        ),
        Index(
            "idx_auth_accounts_provider",
            "provider",
        ),
        Index(
            "idx_auth_acct_provider_uid",
            "provider_user_id",
        ),
    )

    id: Mapped[int] = mapped_column(primary_key=True)

    user_id: Mapped[int] = mapped_column(
        ForeignKey("users.id", ondelete="CASCADE"),
    )

    provider: Mapped[AuthProvider] = mapped_column(
        Enum(AuthProvider),
    )

    provider_user_id: Mapped[str | None] = mapped_column(
        String(255),
        nullable=True,
    )

    password_hash: Mapped[str | None] = mapped_column(
        Text,
        nullable=True,
    )

    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        server_default=func.now(),
    )

    user: Mapped["User"] = relationship(
        back_populates="auth_accounts"
    )






# accounts/
# │
# ├── models.py
# │      User
# │      AuthAccount
# │
# ├── repository.py
# │      get_user_by_email()
# │      get_user_by_phone()
# │      create_user()
# │      create_auth_account()
# │
# ├── services.py
# │      register_user()
# │      create_superuser()
# │      set_password()
# │      verify_password()
# │      login()
# │      change_password()
# │
# ├── security.py
# │      hash_password()
# │      verify_password()
# │      create_access_token()
# │
# ├── schemas.py
# │      UserCreate
# │      UserLogin
# │      UserResponse
# │
# └── dependencies.py
#        get_current_user()
#        require_admin()