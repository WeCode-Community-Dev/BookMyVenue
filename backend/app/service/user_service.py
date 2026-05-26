from sqlalchemy.orm import Session
from typing import Optional
from app.model.user import User


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

    def get_user_by_id(self, db: Session, user_id: int) -> Optional[User]:
        """
        Retrieves a user record by its database integer ID.
        """
        return db.query(User).filter(User.id == user_id).first()

    def create_user(self, db: Session, mobile_number: str) -> User:
        """
        Creates a new user record for the given mobile number.
        """
        db_user = User(mobile_number=mobile_number)
        db.add(db_user)
        db.commit()
        db.refresh(db_user)
        return db_user


# Singleton instance
user_service = UserService()
