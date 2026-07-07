from sqlalchemy import Column, Integer, String, ForeignKey
from app.db.database import Base

class OwnerProfile(Base):
    __tablename__ = "owner_profiles"

    id = Column(Integer, primary_key=True, index=True)

    user_id = Column(
        Integer,
        ForeignKey("users.id"),
        nullable=False
    )

    business_name = Column(
        String,
        nullable=False
    )