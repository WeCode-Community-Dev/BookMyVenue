from datetime import datetime
import re
from typing import List
from uuid import UUID

from fastapi import HTTPException, status
from sqlalchemy import func, select
from sqlalchemy.orm import Session, joinedload


from app.schema.venue_schema import (
    AmenityRequest,
    AmenityResponse,
    CreateVenueRequest,
    CreateVenueResponse,
    DeleteAmenityResponse,
    UpdateVenueStatusResponse,
    VenueImageResponse,
    VenueLocation,
    VenueResponse,
    VenueServiceResponse,
    VenueSlotResponse,
)
from app.model.venue_model import (
    Amenity,
    Venue,
    VenueAmenity,
    VenueImage,
    VenueServiceSchema,
    VenueSlot,
    VerificationStatus,
)


class VenueService:

    def map_venue_to_response(self, venue: Venue) -> VenueResponse:
        return VenueResponse(
            id=venue.id,
            owner_id=venue.owner_id,
            venue_name=venue.venue_name,
            slug=venue.slug,
            category=venue.category,
            description=venue.description,
            location=VenueLocation(
                address=venue.address,
                city=venue.city,
                state=venue.state,
                country=venue.country,
                pincode=venue.pincode,
                latitude=venue.latitude,
                longitude=venue.longitude,
            ),
            min_capacity=venue.min_capacity,
            max_capacity=venue.max_capacity,
            cover_image_url=venue.cover_image_url,
            virtual_tour_url=venue.virtual_tour_url,
            # amenities=[
            #     AmenityResponse(
            #         id=a.id,
            #         name=a.name,
            #     )
            #     for a in venue.amenities
            # ],
            # gallery_images=[
            #     VenueImageResponse(
            #         id=image.id,
            #         image_url=image.image_url,
            #         sort_order=image.sort_order,
            #         created_at=image.created_at,
            #     )
            #     for image in venue.images
            # ],
            # slots=[
            #     VenueSlotResponse(
            #         id=slot.id,
            #         slot_name=slot.slot_name,
            #         start_time=slot.start_time,
            #         end_time=slot.end_time,
            #         capacity=slot.capacity,
            #         price=slot.price,
            #     )
            #     for slot in venue.slots
            # ],
            # services=[
            #     VenueServiceResponse(
            #         id=service.id,
            #         service_name=service.service_name,
            #         price=service.price,
            #     )
            #     for service in venue.services
            # ],
            # amenities=[AmenityResponse.model_validate(a.ame) for a in venue.amenities],
            amenities=[
                AmenityResponse.model_validate(a.amenity)
                for a in venue.amenities
                if a.amenity
            ],
            slots=[VenueSlotResponse.model_validate(slot) for slot in venue.slots],
            services=[
                VenueServiceResponse.model_validate(service)
                for service in venue.services
            ],
            gallery_images=[
                VenueImageResponse.model_validate(image) for image in venue.images
            ],
            instant_booking=venue.instant_booking,
            status=venue.status,
            verification_status=venue.verification_status,
            average_rating=venue.average_rating,
            total_reviews=venue.total_reviews,
            view_count=venue.view_count,
            booking_count=venue.booking_count,
            is_featured=venue.is_featured,
            approved_by=venue.approved_by,
            approved_at=venue.approved_at,
            rejection_reason=venue.rejection_reason,
            published_at=venue.published_at,
            created_at=venue.created_at,
            updated_at=venue.updated_at,
        )

    def generate_slug(self, text: str) -> str:
        try:
            """
            Convert:
            'Royal Grand Auditorium' ->
            'royal-grand-auditorium'
            """

            text = text.lower().strip()

            # Replace spaces and underscores with hyphens
            text = re.sub(r"[\s_]+", "-", text)

            # Remove special characters
            text = re.sub(r"[^a-z0-9-]", "", text)

            # Remove duplicate hyphens
            text = re.sub(r"-+", "-", text)

            # Remove leading/trailing hyphens
            text = text.strip("-")

            return text
        except:
            return ""

    def create_new_venue(
        self,
        db: Session,
        owner_id: str,
        data: CreateVenueRequest,
    ) -> CreateVenueResponse:
        try:

            venue_slug = self.generate_slug(text=data.venue_name)

            new_venue = Venue(
                owner_id=owner_id,
                venue_name=data.venue_name,
                slug=venue_slug,
                category=data.category,
                description=data.description,
                address=data.location.address,
                city=data.location.city,
                state=data.location.state,
                country=data.location.country,
                pincode=data.location.pincode,
                latitude=data.location.latitude,
                longitude=data.location.longitude,
                min_capacity=data.min_capacity,
                max_capacity=data.max_capacity,
                cover_image_url=str(data.cover_image_url),
                virtual_tour_url=(
                    str(data.virtual_tour_url) if data.virtual_tour_url else None
                ),
                instant_booking=data.instant_booking,
            )

            db.add(new_venue)

            # Generate venue ID before commit
            db.flush()

            # ---------------------------
            # Gallery Images
            # ---------------------------
            for index, image_url in enumerate(data.gallery_images):
                db.add(
                    VenueImage(
                        venue_id=new_venue.id,
                        image_url=str(image_url),
                        sort_order=index + 1,
                    )
                )

            # ---------------------------
            # Slots
            # ---------------------------
            for slot in data.slots:
                db.add(
                    VenueSlot(
                        venue_id=new_venue.id,
                        slot_name=slot.slot_name,
                        start_time=slot.start_time,
                        end_time=slot.end_time,
                        capacity=slot.capacity,
                        price=slot.price,
                    )
                )

            # ---------------------------
            # Services
            # ---------------------------
            for service in data.services:
                db.add(
                    VenueServiceSchema(
                        venue_id=new_venue.id,
                        service_name=service.service_name,
                        price=service.price,
                    )
                )

            # ---------------------------
            # Amenities
            # ---------------------------
            for amenity_id in data.amenity_ids:
                db.add(
                    VenueAmenity(
                        venue_id=new_venue.id,
                        amenity_id=amenity_id,
                    )
                )

            db.commit()
            db.refresh(new_venue)

            return CreateVenueResponse.model_validate(new_venue)

        except HTTPException:
            raise

        except Exception as e:
            db.rollback()
            raise HTTPException(
                status_code=500,
                detail=str(e),
            )

    def get_all_venues(
        self,
        db: Session,
        skip: int = 0,
        limit: int = 20,
    ) -> List[VenueResponse]:

        try:

            venues = (
                db.query(Venue)
                .options(
                    joinedload(Venue.images),
                    joinedload(Venue.slots),
                    joinedload(Venue.services),
                    joinedload(Venue.amenities).joinedload(VenueAmenity.amenity),
                )
                .order_by(Venue.created_at.desc())
                .offset(skip)
                .limit(limit)
                .all()
            )

            for venue in venues:
                print("Venue:", venue.id)
                print("Images:", len(venue.images))
                print("Slots:", len(venue.slots))
                print("Services:", len(venue.services))
                print("Amenities:", len(venue.amenities))

            # return venues

            return [self.map_venue_to_response(v) for v in venues]
        except HTTPException:
            raise

        except Exception as e:
            raise HTTPException(status_code=500, detail=str(e))

    def update_verification_status(
        self,
        db: Session,
        venue_id: str,
        status: VerificationStatus,
        rejection_reason: str | None = None,
    ):
        try:

            venue = db.query(Venue).filter(Venue.id == venue_id).first()

            if venue.verification_status == status:
                raise HTTPException(
                    status_code=409,
                    detail=f"Venue is already {status.value}.",
                )

            if not venue:
                raise HTTPException(
                    status_code=404,
                    detail="Venue not found",
                )

            venue.verification_status = status
            venue.updated_at = datetime.utcnow()

            if status == VerificationStatus.APPROVED:
                venue.approved_by = "Admin"
                venue.approved_at = datetime.utcnow()
                venue.rejection_reason = None

            elif status == VerificationStatus.REJECTED:
                venue.approved_by = None
                venue.approved_at = None
                venue.rejection_reason = rejection_reason

            elif status == VerificationStatus.SUSPENDED:
                venue.rejection_reason = rejection_reason

            db.commit()
            db.refresh(venue)

            return UpdateVenueStatusResponse(
                venue_id=venue.id,
                verification_status=venue.verification_status,
                approved_by=venue.approved_by,
                approved_at=venue.approved_at,
                rejection_reason=venue.rejection_reason,
            )

        except HTTPException:
            raise

        except Exception as e:
            db.rollback()
            raise HTTPException(
                status_code=500,
                detail=str(e),
            )

    def get_all_amenities(
        self,
        db: Session,
        owner_id: str,
    ) -> List[VenueResponse]:

        try:

            amenities = db.query(Amenity).all()

            # return amenities

            return [v for v in amenities]
        except HTTPException:
            raise

        except Exception as e:
            raise HTTPException(status_code=500, detail=str(e))

    def create_amenity(
        self,
        db: Session,
        data: AmenityRequest,
    ) -> AmenityResponse:
        try:

            amenity_name = " ".join(data.name.split())

            existing_amenity = db.execute(
                select(Amenity)
                .where(func.lower(Amenity.name) == amenity_name.lower())
                .with_for_update()
            ).scalar_one_or_none()

            if existing_amenity:
                raise HTTPException(
                    status_code=409,
                    detail="Amenity already exists.",
                )

            new_amenity = Amenity(name=data.name)
            db.add(new_amenity)
            db.commit()
            db.refresh(new_amenity)

            return AmenityResponse(
                id=new_amenity.id,
                name=new_amenity.name,
            )
        except HTTPException:
            db.rollback()
            raise

        except Exception as e:
            db.rollback()
            raise HTTPException(status_code=500, detail=str(e))

    def delete_amenity(
        self,
        db: Session,
        amenity_id: UUID,
    ) -> DeleteAmenityResponse:
        try:

            amenity = db.execute(
                select(Amenity).where(Amenity.id == amenity_id)
            ).scalar_one_or_none()

            if not amenity:
                raise HTTPException(
                    status_code=404,
                    detail="Amenity not found.",
                )

            is_used = db.execute(
                select(VenueAmenity).where(VenueAmenity.amenity_id == amenity_id)
            ).scalar_one_or_none()

            if is_used:
                raise HTTPException(
                    status_code=409,
                    detail="Amenity is assigned to one or more venues and cannot be deleted.",
                )

            db.delete(amenity)
            db.commit()

            return DeleteAmenityResponse(
                id=amenity_id,
                message="Amenity deleted successfully.",
            )

        except HTTPException:
            db.rollback()
            raise

        except Exception:
            db.rollback()
            raise HTTPException(
                status_code=500,
                detail="Failed to delete amenity.",
            )


# Singleton instance
venue_service = VenueService()
