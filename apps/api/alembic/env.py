from logging.config import fileConfig

from alembic import context
from sqlalchemy import engine_from_config, pool

from app.core.config import settings
from app.core.database import Base

# import all models so Base.metadata is populated for autogenerate
import app.modules.admin.models  # noqa: F401
import app.modules.booking.models  # noqa: F401
import app.modules.deep_research.models  # noqa: F401
import app.modules.notification.models  # noqa: F401
import app.modules.payment.models  # noqa: F401
import app.modules.profile.models  # noqa: F401
import app.modules.review.models  # noqa: F401
import app.modules.search.models  # noqa: F401
import app.modules.venue.models  # noqa: F401

config = context.config

if config.config_file_name is not None:
    fileConfig(config.config_file_name)

target_metadata = Base.metadata


def get_url() -> str:
    url = settings.database_url
    # Alembic needs a sync driver — strip +asyncpg if present
    return url.replace("postgresql+asyncpg://", "postgresql://")


def run_migrations_offline() -> None:
    context.configure(
        url=get_url(),
        target_metadata=target_metadata,
        literal_binds=True,
        dialect_opts={"paramstyle": "named"},
    )
    with context.begin_transaction():
        context.run_migrations()


def run_migrations_online() -> None:
    configuration = config.get_section(config.config_ini_section, {})
    configuration["sqlalchemy.url"] = get_url()
    connectable = engine_from_config(
        configuration,
        prefix="sqlalchemy.",
        poolclass=pool.NullPool,
    )
    with connectable.connect() as connection:
        context.configure(connection=connection, target_metadata=target_metadata)
        with context.begin_transaction():
            context.run_migrations()


if context.is_offline_mode():
    run_migrations_offline()
else:
    run_migrations_online()
