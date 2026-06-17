# This function is a dependency. FastAPI calls it automatically

# 1. FastAPI sees a route needs get_db
# 2. get_db() runs → creates a session (db = SessionLocal())
# 3. yield db → hands the session to the route function
# 4. Route does its work (query users, create booking, etc.)
# 5. Route finishes
# 6. get_db() resumes after yield → runs db.close()

from app.db.database import SessionLocal

def get_db():
    db = SessionLocal()  # Opens a session
    try:
        yield db         # hand it to the route
    finally:
        db.close()       # always close it, even if an error occured