"""Development DB initializer + seeder. Run via: python -m app.db.init_db"""
from app.db.base import Base
from app.db.session import SessionLocal, engine
from app.db.seed import seed_demo_data


def init_db() -> None:
    import app.models  # noqa: F401

    Base.metadata.create_all(bind=engine)
    with SessionLocal() as db:
        seed_demo_data(db)


if __name__ == "__main__":
    init_db()
    print("Database initialized and seeded.")
