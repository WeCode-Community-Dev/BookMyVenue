import re

from fastapi import HTTPException
from sqlalchemy.orm import Session


from app.schema.venue_schema import CreateVenueRequest, VenueResponse
from app.model.venue_model import Venue


class VenueService:

    def generate_slug(text: str) -> str:
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
    ) -> VenueResponse:
        try:

            venue_slug = self.generate_slug(data.venue_name)

            new_venue = Venue(
                owner_profile_id=owner_id,
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
            db.commit()
            db.refresh(new_venue)

            return VenueResponse.model_validate(new_venue)

        except HTTPException:
            raise

        except Exception as e:
            raise HTTPException(status_code=500, detail=str(e))


# Singleton instance
venue_service = VenueService()
