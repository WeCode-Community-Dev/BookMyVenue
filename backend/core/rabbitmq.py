import asyncio
import json
import logging
import aio_pika
from sqlalchemy.future import select
from core.config import settings
from core.database import AsyncSessionLocal
from models.venue import Booking
from core.redis import get_redis

logger = logging.getLogger(__name__)

async def consume_payment_events():
    connection = None
    while not connection:
        try:
            connection = await aio_pika.connect_robust(settings.RABBITMQ_URL)
        except Exception as e:
            logger.warning(f"RabbitMQ connection failed, retrying in 5 seconds... {e}")
            await asyncio.sleep(5)

    async with connection:
        channel = await connection.channel()
        queue = await channel.declare_queue("payment_events", durable=True)
        
        logger.info("Started consuming from payment_events queue")
        
        async with queue.iterator() as queue_iter:
            async for message in queue_iter:
                async with message.process():
                    try:
                        payload = json.loads(message.body.decode())
                        booking_id = payload.get("booking_id")
                        status = payload.get("status")
                        
                        logger.info(f"Processing payment event for booking_id: {booking_id}, status: {status}")
                        
                        async with AsyncSessionLocal() as db:
                            stmt = select(Booking).where(Booking.id == booking_id)
                            result = await db.execute(stmt)
                            booking = result.scalar_one_or_none()
                            
                            if not booking:
                                logger.error(f"Booking {booking_id} not found")
                                continue
                            
                            if status == "SUCCESS":
                                booking.status = "CONFIRMED"
                                booking.expires_at = None
                            else:
                                booking.status = "CANCELLED"
                            
                            await db.commit()
                            
                            # Invalidate cache
                            redis_client_gen = get_redis()
                            redis_client = await anext(redis_client_gen)
                            await redis_client.delete(f"venue:{booking.venue_id}:active_bookings")
                            
                    except Exception as e:
                        logger.error(f"Error processing payment message: {e}")
