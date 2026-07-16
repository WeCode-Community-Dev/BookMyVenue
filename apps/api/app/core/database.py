from contextlib import contextmanager

from sqlalchemy import create_engine
from sqlalchemy.orm import DeclarativeBase, Session, sessionmaker

from app.core.config import settings

engine = create_engine(
    settings.database_url,
    # pool_pre_ping avoids handing out dead connections (common with managed
    # Postgres that closes idle connections server-side, e.g. Supabase) —
    # without it, the first query on a stale connection fails/stalls instead
    # of transparently reconnecting.
    pool_pre_ping=True,
    # Recycle connections before Supabase's server-side idle timeout can
    # close them out from under us.
    pool_recycle=1800,
    # Explicit pool sizing to handle concurrent WebSocket connections and API requests.
    # Default is 5, which is too small for production load.
    pool_size=20,
    max_overflow=30,
    pool_timeout=30,
)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


class Base(DeclarativeBase):
    pass


def get_db():
    """FastAPI request-scoped session dependency."""
    db = SessionLocal()
    try:
        yield db
        db.commit()
    except Exception:
        db.rollback()
        raise
    finally:
        db.close()


@contextmanager
def with_session() -> Session:
    """Session for code that runs outside a request (jobs, webhooks).

    Commits on success, rolls back on exception, always closes. Use this for
    transactional work like payment confirmation that needs explicit control.
    """
    db = SessionLocal()
    try:
        yield db
        db.commit()
    except Exception:
        db.rollback()
        raise
    finally:
        db.close()
