"""
Simple test data seeding - minimal dependencies
Run: python scripts/simple_seed.py
"""

import sys
import os
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from sqlalchemy.orm import Session
from app.db.database import SessionLocal, Base, engine
from app.models.user import User
from app.models.venue import Venue
from passlib.context import CryptContext

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def main():
    print("Creating test data...")
    
    # Create tables
    Base.metadata.create_all(bind=engine)
    
    db = SessionLocal()
    
    try:
        # Check if user exists
        user = db.query(User).filter(User.email == "owner@test.com").first()
        
        if not user:
            # Create user
            user = User(
                email="owner@test.com",
                name="Test Owner",
                phone_number="9876543210",
                role="owner",
                hashed_password=pwd_context.hash("password123"),
                is_active=True
            )
            db.add(user)
            db.commit()
            db.refresh(user)
            print(f"✅ Created user: {user.email}")
        else:
            print(f"✅ User exists: {user.email}")
        
        # Check if venues exist
        existing = db.query(Venue).filter(Venue.owner_id == user.id).count()
        
        if existing == 0:
            # Create venues
            venues = [
                Venue(
                    owner_id=user.id,
                    name="Grand Conference Hall",
                    location="Mumbai",
                    price_per_day=15000,
                    approval_status="approved"
                ),
                Venue(
                    owner_id=user.id,
                    name="Beach Wedding Venue",
                    location="Goa",
                    price_per_day=50000,
                    approval_status="approved"
                ),
                Venue(
                    owner_id=user.id,
                    name="Downtown Banquet",
                    location="Delhi",
                    price_per_day=25000,
                    approval_status="pending"
                )
            ]
            
            for v in venues:
                db.add(v)
            
            db.commit()
            print(f"✅ Created {len(venues)} venues")
        else:
            print(f"✅ {existing} venues already exist")
        
        print("\n" + "="*50)
        print("SUCCESS!")
        print("="*50)
        print("Email: owner@test.com")
        print("Password: password123")
        print("\nLogin at: http://localhost:5173/login")
        print("="*50)
        
    except Exception as e:
        print(f"ERROR: {e}")
        import traceback
        traceback.print_exc()
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    main()
