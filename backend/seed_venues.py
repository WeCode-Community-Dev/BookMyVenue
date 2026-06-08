import asyncio
import random
from faker import Faker
from sqlalchemy.ext.asyncio import AsyncSession
from core.database import AsyncSessionLocal
from models.user import User
from models.venue import Venue
from sqlalchemy.future import select

fake = Faker()

COMMON_FACILITIES = [
    'WiFi', 'Projector', 'Whiteboard', 'Parking', 'Air Conditioning', 
    'Catering', 'Wheelchair Accessible', 'Audio System'
]

VENUE_ADJECTIVES = ["Grand", "Royal", "Elite", "Modern", "Classic", "Vintage", "Urban", "Rustic", "Premium", "Luxe"]
VENUE_NOUNS = ["Hall", "Lounge", "Studio", "Space", "Loft", "Center", "Pavilion", "Terrace", "Garden", "Estate"]

async def seed_venues():
    async with AsyncSessionLocal() as db:
        # Get an admin or partner user to assign ownership
        result = await db.execute(select(User).where(User.role.in_(["SUPER_ADMIN", "PARTNER"])))
        users = result.scalars().all()
        
        if not users:
            print("No Admin or Partner found in the database. Please create one first.")
            return

        owner_id = users[0].id
        print(f"Assigning 1000 venues to User ID {owner_id}")

        venues_to_add = []
        for i in range(1000):
            # Generate realistic features map
            num_facilities = random.randint(1, len(COMMON_FACILITIES))
            selected_facilities = random.sample(COMMON_FACILITIES, num_facilities)
            features = {fac: True for fac in selected_facilities}
            
            # Generate random location within realistic coordinates (e.g., somewhere in the US)
            lat = random.uniform(30.0, 45.0)
            lng = random.uniform(-120.0, -75.0)

            name = f"The {random.choice(VENUE_ADJECTIVES)} {random.choice(VENUE_NOUNS)} {fake.city()}"
            
            venue = Venue(
                name=name,
                location=f"{fake.street_address()}, {fake.city()}",
                capacity=random.randint(20, 1500),
                price_per_hour=round(random.uniform(50.0, 1000.0), 2),
                latitude=lat,
                longitude=lng,
                photos=[f"https://picsum.photos/seed/{fake.uuid4()}/800/600", f"https://picsum.photos/seed/{fake.uuid4()}/800/600"],
                features=features,
                inventory_type=random.choice(["capacity_based", "entire_venue"]),
                owner_id=owner_id
            )
            venues_to_add.append(venue)

            if len(venues_to_add) == 100:
                db.add_all(venues_to_add)
                await db.commit()
                venues_to_add = []
                print(f"Inserted {i+1} venues...")

        if venues_to_add:
            db.add_all(venues_to_add)
            await db.commit()
            print("Finished inserting 1000 venues!")

if __name__ == "__main__":
    asyncio.run(seed_venues())
