import asyncio
import asyncpg

async def alter_db():
    try:
        conn = await asyncpg.connect(
            user="postgres",
            password="password",
            host="localhost",
            port=5432,
            database="bookmyvenue",
        )
        # Check and create postgis extension just in case
        await conn.execute("CREATE EXTENSION IF NOT EXISTS postgis;")
        
        try:
            await conn.execute("ALTER TABLE venues ADD COLUMN geom geometry(POINT,4326);")
            print("Added geom column.")
        except Exception as e:
            print("Geom column might exist:", e)
            
        try:
            await conn.execute("ALTER TABLE venues ADD COLUMN status VARCHAR DEFAULT 'PENDING';")
            print("Added status column.")
        except Exception as e:
            print("Status column might exist:", e)

        await conn.close()
    except Exception as e:
        print(f"Failed: {e}")

if __name__ == "__main__":
    asyncio.run(alter_db())
