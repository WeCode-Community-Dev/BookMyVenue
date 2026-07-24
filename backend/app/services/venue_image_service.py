from fastapi import HTTPException
from sqlalchemy.orm import Session

from app.models.venue import Venue
from app.models.venue_image import VenueImage
from app.schemas.venue_image import MAX_VENUE_IMAGES


def get_owned_venue(db: Session, venue_id: int, owner_id: int) -> Venue:
    venue = db.query(Venue).filter(Venue.id == venue_id).first()
    if not venue:
        raise HTTPException(status_code=404, detail="Venue not found")
    if venue.owner_id != owner_id:
        raise HTTPException(
            status_code=403,
            detail="You don't have permission to manage images for this venue",
        )
    return venue


def ordered_images(db: Session, venue_id: int) -> list[VenueImage]:
    return (
        db.query(VenueImage)
        .filter(VenueImage.venue_id == venue_id)
        .order_by(VenueImage.sort_order, VenueImage.id)
        .all()
    )


def _renumber(images: list[VenueImage]) -> None:
    for index, image in enumerate(images):
        image.sort_order = index


def sync_cover(
    db: Session,
    venue: Venue,
    preferred_image_id: int | None = None,
) -> list[VenueImage]:
    """Keep exactly one cover row and mirror its url into venues.image_url."""
    images = ordered_images(db, venue.id)
    if not images:
        venue.image_url = None
        return images

    cover = None
    if preferred_image_id is not None:
        cover = next((image for image in images if image.id == preferred_image_id), None)
    if cover is None:
        cover = next((image for image in images if image.is_cover), images[0])
    for image in images:
        image.is_cover = image.id == cover.id
    venue.image_url = cover.url
    return images


def add_images(db: Session, venue_id: int, owner_id: int, urls: list[str]) -> list[VenueImage]:
    venue = get_owned_venue(db, venue_id, owner_id)
    existing = ordered_images(db, venue_id)

    if len(existing) + len(urls) > MAX_VENUE_IMAGES:
        remaining = MAX_VENUE_IMAGES - len(existing)
        raise HTTPException(
            status_code=400,
            detail=(
                f"A venue can have at most {MAX_VENUE_IMAGES} images. "
                f"You can add {max(remaining, 0)} more."
            ),
        )

    next_order = len(existing)
    for offset, url in enumerate(urls):
        db.add(
            VenueImage(
                venue_id=venue_id,
                url=url,
                sort_order=next_order + offset,
                is_cover=not existing and offset == 0,
            )
        )
    db.flush()

    sync_cover(db, venue)
    db.commit()
    return ordered_images(db, venue_id)


def seed_gallery(db: Session, venue: Venue, urls: list[str]) -> None:
    """Fill an empty gallery from a list of urls; the caller commits."""
    for index, url in enumerate(urls[:MAX_VENUE_IMAGES]):
        db.add(
            VenueImage(
                venue_id=venue.id,
                url=url,
                sort_order=index,
                is_cover=index == 0,
            )
        )
    db.flush()
    sync_cover(db, venue)


def _get_image(db: Session, venue_id: int, image_id: int) -> VenueImage:
    image = (
        db.query(VenueImage)
        .filter(VenueImage.id == image_id, VenueImage.venue_id == venue_id)
        .first()
    )
    if not image:
        raise HTTPException(status_code=404, detail="Image not found")
    return image


def update_image(
    db: Session,
    venue_id: int,
    image_id: int,
    owner_id: int,
    *,
    is_cover: bool | None = None,
    sort_order: int | None = None,
) -> list[VenueImage]:
    venue = get_owned_venue(db, venue_id, owner_id)
    image = _get_image(db, venue_id, image_id)

    if sort_order is not None:
        others = [i for i in ordered_images(db, venue_id) if i.id != image.id]
        position = min(sort_order, len(others))
        others.insert(position, image)
        _renumber(others)

    if is_cover is False:
        image.is_cover = False

    db.flush()
    sync_cover(db, venue, preferred_image_id=image.id if is_cover else None)
    db.commit()
    return ordered_images(db, venue_id)


def delete_image(db: Session, venue_id: int, image_id: int, owner_id: int) -> list[VenueImage]:
    venue = get_owned_venue(db, venue_id, owner_id)
    image = _get_image(db, venue_id, image_id)

    db.delete(image)
    db.flush()

    _renumber(ordered_images(db, venue_id))
    db.flush()
    sync_cover(db, venue)
    db.commit()
    return ordered_images(db, venue_id)
