from logging.config import fileConfig
import os

from sqlalchemy import engine_from_config
from sqlalchemy import pool

from alembic import context
from dotenv import load_dotenv

# Load .env
load_dotenv()

# Alembic Config
config = context.config

# Override database URL from .env
config.set_main_option(
    "sqlalchemy.url",
    os.getenv("DATABASE_URL")
)

# Logging
if config.config_file_name is not None:
    fileConfig(config.config_file_name)

# Import Base
from app.db.base import Base

# Import ALL models here
from app.modules.users.models import User
from app.modules.venues.models import Venue
from app.modules.bookings.models import Booking

# Future models
# from app.modules.venues.models import VenueImage
# from app.modules.venues.models import Amenity
# from app.modules.venues.models import VenueAmenity
# from app.modules.users.models import OwnerProfile

target_metadata = Base.metadata


def run_migrations_offline() -> None:
    """Run migrations in offline mode."""

    url = config.get_main_option("sqlalchemy.url")

    context.configure(
        url=url,
        target_metadata=target_metadata,
        literal_binds=True,
        dialect_opts={"paramstyle": "named"},
        compare_type=True,
    )

    with context.begin_transaction():
        context.run_migrations()


def run_migrations_online() -> None:
    """Run migrations in online mode."""

    connectable = engine_from_config(
        config.get_section(config.config_ini_section, {}),
        prefix="sqlalchemy.",
        poolclass=pool.NullPool,
    )

    with connectable.connect() as connection:
        context.configure(
            connection=connection,
            target_metadata=target_metadata,
            compare_type=True,
        )

        with context.begin_transaction():
            context.run_migrations()


if context.is_offline_mode():
    run_migrations_offline()
else:
    run_migrations_online()