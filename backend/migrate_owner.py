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

        # Check if the column already exists
        col_check = await conn.fetchval("""
            SELECT column_name 
            FROM information_schema.columns 
            WHERE table_name='venues' AND column_name='owner_id'
        """)

        if not col_check:
            print("Adding owner_id column...")
            await conn.execute("ALTER TABLE venues ADD COLUMN owner_id INTEGER")

            # Get an admin user (assume id 1 or the first user)
            admin_id = await conn.fetchval(
                "SELECT id FROM users ORDER BY id ASC LIMIT 1"
            )

            if admin_id:
                print(f"Setting default owner_id to {admin_id} for existing venues...")
                await conn.execute("UPDATE venues SET owner_id = $1", admin_id)

            # Now add foreign key constraint and not null
            await conn.execute("ALTER TABLE venues ALTER COLUMN owner_id SET NOT NULL")
            await conn.execute(
                "ALTER TABLE venues ADD CONSTRAINT fk_venue_owner FOREIGN KEY (owner_id) REFERENCES users(id)"
            )

            print("Migration successful.")
        else:
            print("owner_id column already exists.")

        await conn.close()
    except Exception as e:
        print(f"Migration failed: {e}")


if __name__ == "__main__":
    asyncio.run(migrate())
