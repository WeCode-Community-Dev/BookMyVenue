"""
Check what users exist in the database
"""
import sys
import os
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from app.db.database import SessionLocal
from app.models.user import User

db = SessionLocal()

try:
    users = db.query(User).all()
    
    if not users:
        print("❌ No users found in database!")
        print("   Run: python scripts/simple_seed.py")
    else:
        print(f"✅ Found {len(users)} user(s):\n")
        for user in users:
            print(f"   ID: {user.id}")
            print(f"   Email: {user.email}")
            print(f"   Name: {user.name}")
            print(f"   Role: {user.role}")
            print(f"   Active: {user.is_active}")
            print()
finally:
    db.close()
