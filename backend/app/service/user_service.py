from uuid import UUID

from sqlalchemy.orm import Session
from typing import Optional
from app.model.user import User, UserRole, UserStatus


class UserService:
    """
    Service containing database operations on User records.
    """

    def get_user_by_mobile_number(
        self, db: Session, mobile_number: str
    ) -> Optional[User]:
        """
        Retrieves a user record matching a specific mobile number.
        """
        return db.query(User).filter(User.mobile_number == mobile_number).first()

    def get_user_by_id(self, db: Session, user_id: UUID) -> Optional[User]:
        """
        Retrieves a user record by its database integer ID.
        """
        return db.query(User).filter(User.id == user_id).first()

    def create_user(
        self,
        db: Session,
        mobile_number: str,
        full_name: str | None = None,
        email: str | None = None,
        role: UserRole = UserRole.CUSTOMER,
    ) -> User:
        """
        Creates a new user record for the given mobile number.
        """
        db_user = User(
            mobile_number=mobile_number,
            full_name=full_name,
            email=email,
            role=role,
            status=UserStatus.ACTIVE,
            mobile_verified=False,
            email_verified=False,
        )

        db.add(db_user)
        db.commit()
        db.refresh(db_user)

        return db_user


# Singleton instance
user_service = UserService()
