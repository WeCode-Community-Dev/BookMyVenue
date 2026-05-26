# 📁 Project Folder Structure (Simple & Clean)

```bash
bookmyvenue/
│
├── app/
│   ├── main.py                # Entry point of FastAPI app
│
│   ├── core/                 # App configuration
│   │   ├── config.py         # Settings (DB URL, secrets)
│   │   ├── security.py       # JWT auth logic
│
│   ├── db/                   # Database connection
│   │   ├── session.py        # DB connection setup
│   │   ├── base.py           # Base model (SQLAlchemy)
│
│   ├── models/               # Database models
│   │   ├── user.py
│   │   ├── venue.py
│   │   ├── booking.py
│   │   ├── amenity.py
│
│   ├── schemas/              # Request / Response (Pydantic)
│   │   ├── user.py
│   │   ├── venue.py
│   │   ├── booking.py
│
│   ├── api/                  # API routes (controllers)
│   │   ├── deps.py           # common dependencies (auth check)
│   │
│   │   ├── auth.py           # login, register
│   │   ├── users.py
│   │   ├── venues.py
│   │   ├── bookings.py
│   │   ├── admin.py
│
│   ├── services/             # Business logic (IMPORTANT)
│   │   ├── auth_service.py
│   │   ├── user_service.py
│   │   ├── venue_service.py
│   │   ├── booking_service.py
│   │
│   ├── utils/                # Helper functions
│   │   ├── helpers.py
│
│
├── migrations/               # Alembic migrations
│
├── tests/                    # Test cases
│
├── .env                      # Environment variables
├── requirements.txt          # Dependencies
├── README.md
```

---

# 🧠 How This Structure Works (Simple Explanation)

## 1. `main.py`

* Starts your FastAPI app
* Connects all routes

---

## 2. `api/` (Routes Layer)

* Handles incoming requests
* Example:

  * `/auth/login`
  * `/venues`
  * `/bookings`

👉 ONLY handles request/response
❌ Don’t write logic here

---

## 3. `services/` (Brain of App)

* All business logic goes here

Example:

* Check booking availability
* Validate venue data
* Apply rules

👉 This is where real work happens

---

## 4. `models/` (Database Tables)

* SQLAlchemy models
* Matches your PostgreSQL tables

---

## 5. `schemas/` (Validation)

* Defines request & response format
* Uses Pydantic

---

## 6. `core/`

* App settings
* Security (JWT)

---

## 7. `db/`

* Database connection setup

---

## 8. `utils/`

* Small helper functions
* Don’t dump business logic here

---

# 🔥 Golden Rules (Follow or regret later)

### Rule 1:

❌ Don’t mix logic in routes
✅ Always use services

---

### Rule 2:

❌ Don’t directly access DB in API
✅ Go through services

---

### Rule 3:

❌ Don’t create random folders
✅ Follow structure strictly

---

### Rule 4:

❌ Don’t over-split files
✅ Keep it readable

---

# ⚠️ Common Mistakes (Avoid This Garbage)

* Putting everything in `main.py` ❌
* Writing logic inside API files ❌
* No separation between models & schemas ❌
* Random naming ❌

---

# 🧱 Example Flow (So You Understand Clearly)

### Booking API Flow:

```text
Client → api/bookings.py → booking_service.py → DB → Response
```

---

