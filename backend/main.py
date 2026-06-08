from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
from core.database import engine, Base
from core.redis import init_redis_pool, close_redis_pool
from core.rabbitmq import consume_payment_events
from api.endpoints import venues, auth, admin, upload, chat
from core.minio_client import init_minio
import asyncio
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded
from slowapi.middleware import SlowAPIMiddleware

limiter = Limiter(key_func=get_remote_address)


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Initialize DB (in a real app, use alembic)
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)

    # Initialize Redis pool
    await init_redis_pool()

    # Initialize MinIO
    init_minio()

    # Start RabbitMQ Consumer
    rabbitmq_task = asyncio.create_task(consume_payment_events())

    yield
    # Close Redis pool
    await close_redis_pool()
    # Cancel RabbitMQ Task
    rabbitmq_task.cancel()


app = FastAPI(lifespan=lifespan, title="BookMyVenue API")
app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)
app.add_middleware(SlowAPIMiddleware)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router, prefix="/api/v1/auth", tags=["auth"])
app.include_router(venues.router, prefix="/api/v1/venues", tags=["venues"])
app.include_router(admin.router, prefix="/api/v1/admin", tags=["admin"])
app.include_router(upload.router, prefix="/api/v1/upload", tags=["upload"])
app.include_router(chat.router, prefix="/api/v1/chat", tags=["chat"])


@app.get("/")
def read_root():
    return {"message": "Welcome to the highly concurrent async BookMyVenue API!"}
