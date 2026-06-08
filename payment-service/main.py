from fastapi import FastAPI, HTTPException, Header
from pydantic import BaseModel
from pydantic_settings import BaseSettings
from contextlib import asynccontextmanager
import aiosqlite
import aio_pika
import uuid
import asyncio
import json

class Settings(BaseSettings):
    RABBITMQ_URL: str = "amqp://guest:guest@localhost/"

    class Config:
        env_file = ".env"

settings = Settings()

async def outbox_publisher():
    while True:
        try:
            async with aiosqlite.connect("payments.db") as db:
                db.row_factory = aiosqlite.Row
                async with db.execute("SELECT * FROM outbox_events WHERE status = 'PENDING' LIMIT 50") as cursor:
                    rows = await cursor.fetchall()
                
                if rows:
                    connection = await aio_pika.connect_robust(settings.RABBITMQ_URL)
                    async with connection:
                        channel = await connection.channel()
                        await channel.declare_queue("payment_events", durable=True)
                        for row in rows:
                            message = aio_pika.Message(
                                body=row["payload"].encode(),
                                delivery_mode=aio_pika.DeliveryMode.PERSISTENT
                            )
                            await channel.default_exchange.publish(
                                message,
                                routing_key="payment_events"
                            )
                            await db.execute("UPDATE outbox_events SET status = 'PUBLISHED' WHERE id = ?", (row["id"],))
                        await db.commit()
        except asyncio.CancelledError:
            break
        except Exception as e:
            print(f"Outbox error: {e}")
        await asyncio.sleep(2)


@asynccontextmanager
async def lifespan(app: FastAPI):
    async with aiosqlite.connect("payments.db") as db:
        await db.execute("""
            CREATE TABLE IF NOT EXISTS idempotency_keys (
                key TEXT PRIMARY KEY,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        """)
        await db.execute("""
            CREATE TABLE IF NOT EXISTS outbox_events (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                payload TEXT,
                status TEXT DEFAULT 'PENDING'
            )
        """)
        await db.commit()
    
    publisher_task = asyncio.create_task(outbox_publisher())
    yield
    publisher_task.cancel()

app = FastAPI(title="BookMyVenue Payment Service", lifespan=lifespan)

class PaymentRequest(BaseModel):
    user_id: int
    booking_id: int
    amount: float
    currency: str = "USD"
    payment_method: str = "test_card"

class PaymentResponse(BaseModel):
    transaction_id: str
    status: str
    amount: float

@app.post("/api/v1/payments/process", response_model=PaymentResponse)
async def process_payment(req: PaymentRequest, idempotency_key: str = Header(..., alias="Idempotency-Key")):
    if req.amount <= 0:
        raise HTTPException(status_code=400, detail="Invalid amount")

    async with aiosqlite.connect("payments.db") as db:
        try:
            await db.execute("INSERT INTO idempotency_keys (key) VALUES (?)", (idempotency_key,))
        except aiosqlite.IntegrityError:
            raise HTTPException(status_code=409, detail="Duplicate request detected. Payment already processed or in progress.")
        
        tx_id = str(uuid.uuid4())
        status = "FAILED" if req.payment_method == "fail_card" else "SUCCESS"
        
        payload = json.dumps({
            "booking_id": req.booking_id,
            "status": status,
            "transaction_id": tx_id,
        })

        await db.execute("INSERT INTO outbox_events (payload) VALUES (?)", (payload,))
        await db.commit()
        
    return PaymentResponse(transaction_id=tx_id, status=status, amount=req.amount)

@app.get("/health")
def health_check():
    return {"status": "ok"}
