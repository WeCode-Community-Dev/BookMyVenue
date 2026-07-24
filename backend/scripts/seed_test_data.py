"""
Test data seeding script for BookMyVenue
Creates test user and sample venues for development/testing

Run this with: python scripts/seed_test_data.py
"""

import sys
import os

# Add parent directory to path to import app modules
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from sqlalchemy.orm import Session
from app.db.database import SessionLocal, engine, Base
import app.models  # noqa: F401 — register all mappers
from app.models.user import User
from app.models.venue import Venue
from app.models.amenity import Amenity
from app.models.venue_type import VenueType
from app.seeds.venue_type_seed import seed_venue_types
from app.seeds.amenity_seed import seed_amenities
from app.services.auth_service import hash_password

def seed_test_data():
    """Create test user and venues"""
    db = SessionLocal()
    
    try:
        print("🌱 Starting test data seeding...")
        
        # Create tables if they don't exist
        Base.metadata.create_all(bind=engine)
        print("✅ Database tables ready")

        seed_venue_types(db)
        seed_amenities(db)
        default_type = db.query(VenueType).first()
        if not default_type:
            raise RuntimeError("No venue types found after seeding")
        venue_type_id = default_type.id
        
        existing_user = db.query(User).filter(User.email == "owner@test.com").first()
        
        if existing_user:
            print(f"ℹ️  Test user already exists (ID: {existing_user.id})")
            test_user = existing_user
        else:
            test_user = User(
                email="owner@test.com",
                name="Test Owner",
                phone_number="9876543210",
                role="owner",
                hashed_password=hash_password("password123"),
                auth_provider="email",
                is_active=True,
            )
            db.add(test_user)
            db.commit()
            db.refresh(test_user)
            print(f"✅ Created test user: {test_user.email} (ID: {test_user.id})")
            print(f"   Password: password123")
        
        venues_data = [
            {
                "name": "Grand Conference Hall",
                "location": "Mumbai, Maharashtra",
                "price_per_day": 15000.00,
                "description": "Spacious conference hall perfect for corporate events, seminars, and large meetings. Equipped with modern AV equipment.",
                "approval_status": "approved"
            },
            {
                "name": "Beachside Wedding Venue",
                "location": "Goa, India",
                "price_per_day": 50000.00,
                "description": "Beautiful beachfront venue ideal for weddings and outdoor celebrations. Stunning sunset views included.",
                "approval_status": "approved"
            },
            {
                "name": "Downtown Banquet Hall",
                "location": "Delhi, India",
                "price_per_day": 25000.00,
                "description": "Elegant banquet hall in the heart of the city. Perfect for weddings, receptions, and corporate events.",
                "approval_status": "pending"
            },
            {
                "name": "Garden Party Venue",
                "location": "Bangalore, Karnataka",
                "price_per_day": 18000.00,
                "description": "Lush garden venue with beautiful landscaping. Ideal for outdoor parties and intimate gatherings.",
                "approval_status": "approved"
            },
            {
                "name": "Rooftop Event Space",
                "location": "Mumbai, Maharashtra",
                "price_per_day": 30000.00,
                "description": "Modern rooftop venue with city skyline views. Great for cocktail parties and networking events.",
                "approval_status": "rejected",
                "rejection_reason": "Missing required permits for rooftop events"
            }
        ]
        
        created_venues = []
        for venue_data in venues_data:
            existing_venue = db.query(Venue).filter(
                Venue.name == venue_data["name"],
                Venue.owner_id == test_user.id
            ).first()
            
            if existing_venue:
                print(f"   ⏭️  Venue already exists: {venue_data['name']}")
                created_venues.append(existing_venue)
                continue
            
            venue = Venue(
                owner_id=test_user.id,
                venue_type_id=venue_type_id,
                **venue_data,
            )
            db.add(venue)
            created_venues.append(venue)
            print(f"   ✅ Created venue: {venue_data['name']} ({venue_data['approval_status']})")
        
        db.commit()
        
        amenities = db.query(Amenity).all()
        if amenities:
            print("\n🔗 Linking amenities to venues...")
            for venue in created_venues:
                import random
                venue_amenities = random.sample(amenities, min(3, len(amenities)))
                venue.amenities = venue_amenities
                db.commit()
                amenity_names = [a.name for a in venue_amenities]
                print(f"   ✅ Added amenities to {venue.name}: {', '.join(amenity_names)}")
        
        print("\n" + "="*60)
        print("🎉 Test data seeding completed successfully!")
        print("="*60)
        print("\n📋 Test Credentials:")
        print(f"   Email: owner@test.com")
        print(f"   Password: password123")
        print(f"   Role: owner")
        print(f"\n📊 Created Data:")
        print(f"   User ID: {test_user.id}")
        print(f"   Venues: {len(created_venues)}")
        print(f"   - Approved: {sum(1 for v in created_venues if v.approval_status == 'approved')}")
        print(f"   - Pending: {sum(1 for v in created_venues if v.approval_status == 'pending')}")
        print(f"   - Rejected: {sum(1 for v in created_venues if v.approval_status == 'rejected')}")
        print("\n🌐 Next Steps:")
        print("   1. Go to: http://localhost:5173/login")
        print("   2. Login with: owner@test.com / password123")
        print("   3. Visit: http://localhost:5173/my-venues")
        print("   4. Or browse public venues: http://localhost:5173/venues")
        print("\n" + "="*60)
        
    except Exception as e:
        print(f"\n❌ Error: {e}")
        db.rollback()
        raise
    finally:
        db.close()

if __name__ == "__main__":
    seed_test_data()
