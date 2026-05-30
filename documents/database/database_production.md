Better Production Approach

For development:

Base.metadata.create_all(bind=engine)

is fine.

For production:

alembic init migrations

Use:

alembic revision --autogenerate -m "create users table"
alembic upgrade head

Never rely on create_all() in production.