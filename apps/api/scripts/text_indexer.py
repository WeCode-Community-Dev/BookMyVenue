from pprint import pprint

from sqlalchemy.orm import joinedload

from app.core.database import SessionLocal
from app.modules.search.indexer import _build_search_document
from app.modules.venue.models import Venue

db = SessionLocal()

try:
    venue = (
        db.query(Venue)
        .options(
            joinedload(Venue.category),
            joinedload(Venue.amenities),
        )
        .first()
    )

    if venue is None:
        raise RuntimeError("No venue found")

    document = _build_search_document(venue)
    pprint(document)

finally:
    db.close()
