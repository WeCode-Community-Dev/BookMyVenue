from collections.abc import Generator
from contextlib import contextmanager

from fastapi import Request
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
    # Explicit pool sizing, kept under Supabase's session-mode pooler client cap
    # (currently 15) — pool_size + max_overflow must leave headroom for other
    # consumers (migrations, dashboard, scripts) on the same project.
    pool_size=5,
    max_overflow=5,
    pool_timeout=30,
)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


class Base(DeclarativeBase):
    pass


def get_db(request: Request) -> Generator[Session, None, None]:
    """FastAPI request-scoped session dependency.

    Commits unconditionally for mutating HTTP verbs (unchanged behavior).
    For GET/HEAD/OPTIONS, skips the commit — and the WAL-flushing round trip
    that comes with it — as long as the session tracked no ORM writes;
    routes that mutate state from a GET (there shouldn't be any, but this
    guards against it) still get committed.
    """
    db = SessionLocal()
    try:
        yield db
        is_read_only_verb = request.method in ("GET", "HEAD", "OPTIONS")
        session_is_clean = not (db.dirty or db.new or db.deleted)
        if is_read_only_verb and session_is_clean:
            db.rollback()
        else:
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
