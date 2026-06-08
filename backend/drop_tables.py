import asyncio
import asyncpg


async def migrate():
    try:
        conn = await asyncpg.connect(
            user="postgres",
            password="1236",
            host="localhost",
            port=5432,
            database="bookmyvenue_db",
        )

        print("Dropping bookings and events tables...")
        await conn.execute("DROP TABLE IF EXISTS bookings CASCADE")
        await conn.execute("DROP TABLE IF EXISTS events CASCADE")

        print("Tables dropped successfully.")

        await conn.close()
    except Exception as e:
        print(f"Migration failed: {e}")


if __name__ == "__main__":
    asyncio.run(migrate())
