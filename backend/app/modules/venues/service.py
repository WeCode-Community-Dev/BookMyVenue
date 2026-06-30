from sqlalchemy.orm import Session

from app.modules.venues import repository
from app.modules.venues.model import Venue, VenueStatus
from app.modules.venues.schemas import VenueCreate, VenueSearchParams, VenueUpdate


def search(db: Session, params: VenueSearchParams) -> list[Venue]:
    return repository.search_venues(db, params)


def get_public(db: Session, venue_id: int) -> Venue:
    return repository.get_approved_venue(db, venue_id)


def create(db: Session, owner_id: int, data: VenueCreate) -> Venue:
    return repository.create_venue(db, owner_id, data)


def update(db: Session, venue: Venue, owner_id: int, data: VenueUpdate) -> Venue:
    return repository.update_venue(db, venue, owner_id, data)


def list_for_owner(db: Session, owner_id: int) -> list[Venue]:
    return repository.list_owner_venues(db, owner_id)


def approve(db: Session, venue: Venue) -> Venue:
    return repository.set_venue_status(db, venue, VenueStatus.approved)


def reject(db: Session, venue: Venue) -> Venue:
    return repository.set_venue_status(db, venue, VenueStatus.rejected)
