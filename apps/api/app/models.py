"""Import side-effect module: registers every SQLAlchemy model on Base.metadata.

Importing this once guarantees all mappers can resolve their string-based
relationship() targets (e.g. Venue.reviews -> "VenueReview") before any query
triggers mapper configuration. Import it from any entrypoint that touches the
ORM without loading the full FastAPI app — the CLI job runner, the in-process /
endpoint job runner, alembic, one-off scripts.

The full FastAPI app registers everything transitively via its routers, so it
doesn't need this; the standalone entrypoints do. Keep this list complete: a
missing module resurfaces as `InvalidRequestError: ... failed to locate a name`
the moment a mapper with a cross-module relationship is configured.
"""
import app.modules.admin.models  # noqa: F401
import app.modules.booking.models  # noqa: F401
import app.modules.deep_research.models  # noqa: F401
import app.modules.notification.models  # noqa: F401
import app.modules.payment.models  # noqa: F401
import app.modules.profile.models  # noqa: F401
import app.modules.review.models  # noqa: F401
import app.modules.search.models  # noqa: F401
import app.modules.venue.models  # noqa: F401
