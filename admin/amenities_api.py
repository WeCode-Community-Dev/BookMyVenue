from uuid import UUID, uuid4
from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel, ConfigDict
from sqlalchemy import ForeignKey, String
from sqlalchemy.dialects.postgresql import UUID as PG_UUID
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column, relationship
from sqlalchemy.future import select

# DeclarativeBase setup
class Base(DeclarativeBase):
    pass

# --- DB Models ---
class Amenity(Base):
    __tablename__ = "amenities"

    id: Mapped[UUID] = mapped_column(
        PG_UUID(as_uuid=True),
        primary_key=True,
        default=uuid4,
    )

    name: Mapped[str] = mapped_column(
        String(100),
        unique=True,
        nullable=False,
    )


class VenueAmenity(Base):
    __tablename__ = "venue_amenities"

    venue_id: Mapped[UUID] = mapped_column(
        PG_UUID(as_uuid=True),
        ForeignKey("venues.id", ondelete="CASCADE"),
        primary_key=True,
    )

    amenity_id: Mapped[UUID] = mapped_column(
        PG_UUID(as_uuid=True),
        ForeignKey("amenities.id"),
        primary_key=True,
    )

    venue = relationship(
        "Venue",
        back_populates="amenities",
    )

    amenity = relationship("Amenity")


# --- Pydantic Schemas ---
class AmenityResponse(BaseModel):
    id: UUID
    name: str

    model_config = ConfigDict(from_attributes=True)


class AmenityRequest(BaseModel):
    name: str

    model_config = ConfigDict(from_attributes=True)


# --- Router Setup ---
router = APIRouter(
    prefix="/api/v1/admin/venue/amenities",
    tags=["admin-amenities"],
)

# Placeholder database session dependency (to be imported/overwritten in actual application setup)
async def get_db():
    # Example database session lifecycle manager:
    # async with async_session() as session:
    #     yield session
    raise NotImplementedError("Please bind get_db to your actual database session provider.")


# 1. GET: Fetch all amenities
@router.get("", response_model=list[AmenityResponse], status_code=status.HTTP_200_OK)
async def get_amenities(db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Amenity))
    amenities = result.scalars().all()
    return amenities


# 2. POST: Create a new amenity
@router.post("", response_model=AmenityResponse, status_code=status.HTTP_201_CREATED)
async def create_amenity(request: AmenityRequest, db: AsyncSession = Depends(get_db)):
    # Check duplicate names
    stmt = select(Amenity).where(Amenity.name == request.name)
    existing = (await db.execute(stmt)).scalar_one_or_none()
    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Amenity '{request.name}' already exists."
        )

    new_amenity = Amenity(name=request.name)
    db.add(new_amenity)
    await db.commit()
    await db.refresh(new_amenity)
    return new_amenity


# 3. DELETE: Remove an amenity by ID
@router.delete("/{id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_amenity(id: UUID, db: AsyncSession = Depends(get_db)):
    stmt = select(Amenity).where(Amenity.id == id)
    amenity = (await db.execute(stmt)).scalar_one_or_none()
    if not amenity:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Amenity not found."
        )

    await db.delete(amenity)
    await db.commit()
    return None
