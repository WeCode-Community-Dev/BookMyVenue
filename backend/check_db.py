import asyncio
import asyncpg


async def check_db():
    try:
        conn = await asyncpg.connect(
            user="postgres",
            password="1236",
            host="localhost",
            port=5432,
            database="postgres",
        )
        exists = await conn.fetchval(
            "SELECT 1 FROM pg_database WHERE datname = 'bookmyvenue_db'"
        )
        if exists:
            print("DATABASE_EXISTS")
        else:
            print("DATABASE_MISSING")

            # Since we are here, we might as well create it if it's missing!
            print("Creating database...")
            # You cannot run CREATE DATABASE inside a transaction block
            await conn.execute("COMMIT")
            await conn.execute("CREATE DATABASE bookmyvenue_db")
            print("DATABASE_CREATED")

        await conn.close()
    except Exception as e:
        print(f"CONNECTION_FAILED: {e}")


if __name__ == "__main__":
    asyncio.run(check_db())
