import asyncio
import asyncpg


async def reset_db():
    try:
        conn = await asyncpg.connect(
            user="postgres",
            password="1236",
            host="localhost",
            port=5432,
            database="postgres",
        )
        # Kill other connections
        await conn.execute("""
            SELECT pg_terminate_backend(pg_stat_activity.pid)
            FROM pg_stat_activity
            WHERE pg_stat_activity.datname = 'bookmyvenue_db' AND pid <> pg_backend_pid();
        """)
        # Drop the db and recreate
        await conn.execute("COMMIT")
        await conn.execute("DROP DATABASE IF EXISTS bookmyvenue_db")
        await conn.execute("CREATE DATABASE bookmyvenue_db")
        print("Database reset successfully")
        await conn.close()
    except Exception as e:
        print(f"Failed to reset db: {e}")


if __name__ == "__main__":
    asyncio.run(reset_db())
