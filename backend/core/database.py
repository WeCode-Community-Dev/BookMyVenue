from sqlalchemy.ext.asyncio import create_async_engine, async_sessionmaker, AsyncSession
from sqlalchemy.orm import declarative_base
from core.config import settings

# Create async engine with robust pooling parameters for high concurrency
engine = create_async_engine(
    settings.DATABASE_URL,
    pool_size=5,  # Reduced pool size per worker, PgBouncer handles the rest
    max_overflow=5,  
    pool_timeout=30,  
    echo=False,  
)

# Async session factory
AsyncSessionLocal = async_sessionmaker(
    bind=engine,
    autocommit=False,
    autoflush=False,
    expire_on_commit=False,
    class_=AsyncSession,
)

Base = declarative_base()


async def get_db():
    """
    Dependency function to yield database sessions.
    """
    async with AsyncSessionLocal() as session:
        try:
            yield session
        finally:
            await session.close()
