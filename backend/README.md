# BookMyVenue — Backend

FastAPI backend for BookMyVenue. This folder holds the API server that powers venue discovery, bookings, and admin workflows.

See the full architecture reference: [`documents/FolderArchitecture.md`](../documents/FolderArchitecture.md)

---

## Prerequisites

- Python 3.11+ (recommended)
- PostgreSQL
- Git

---

## 1. Create the backend project

From the repository root:

```bash
cd backend
```

Scaffold the **modular monolithic** layout below. One deployable app, organized by feature modules — not microservices.

```bash
backend/
├── app/
│   ├── main.py              # FastAPI entry point — register routes here
│   ├── core/
│   │   ├── config.py        # Settings loaded from .env
│   │   └── security.py      # JWT, password hashing
│   ├── db/
│   │   ├── session.py       # Database session / engine
│   │   └── base.py          # SQLAlchemy declarative base
│   ├── modules/             # Feature-based modules (one folder per domain)
│   │   ├── auth/
│   │   │   ├── routes.py    # HTTP handlers only
│   │   │   ├── schemas.py   # Pydantic request/response models
│   │   │   ├── service.py   # Business logic
│   │   │   └── models.py    # SQLAlchemy tables
│   │   ├── users/
│   │   ├── venues/
│   │   ├── bookings/
│   │   └── admin/
│   └── utils/
│       └── helpers.py
├── migrations/              # Alembic migrations
├── tests/
├── .env                     # Local secrets (never commit)
├── .env.example             # Template for contributors
├── requirements.txt
└── README.md
```

### Modular monolithic rules

| Layer | Responsibility |
|-------|----------------|
| `routes.py` | Accept requests, return responses. No business logic. |
| `service.py` | All business rules and orchestration. |
| `models.py` | Database tables (SQLAlchemy). |
| `schemas.py` | Input/output validation (Pydantic). |
| `core/` | App-wide config, security, shared settings. |
| `db/` | Database connection setup only. |

**Do not** put logic in `main.py` or route handlers. **Do not** access the database directly from routes — go through services.

Request flow:

```text
Client → routes.py → service.py → database → response
```

---

## 2. Create a virtual environment

```bash
python3 -m venv .venv
```

Activate it:

**macOS / Linux**

```bash
source .venv/bin/activate
```

**Windows**

```bash
.venv\Scripts\activate
```

Your shell prompt should show `(.venv)` when active.

---

## 3. Install dependencies

Create a `requirements.txt` with at least:

```txt
fastapi
uvicorn[standard]
sqlalchemy
psycopg2-binary
python-dotenv
pydantic-settings
python-jose[cryptography]
passlib[bcrypt]
alembic
```

Install:

```bash
pip install -r requirements.txt
```

To save your current environment after adding packages:

```bash
pip freeze > requirements.txt
```

---

## 4. Environment variables (`.env`)

Copy the example file and fill in your local values:

```bash
cp .env.example .env
```

Example `.env.example`:

```env
# App
APP_NAME=BookMyVenue
APP_ENV=development
DEBUG=true

# Server
HOST=0.0.0.0
PORT=8000

# Database
DATABASE_URL=postgresql://user:password@localhost:5432/bookmyvenue

# Security
SECRET_KEY=change-me-to-a-long-random-string
ACCESS_TOKEN_EXPIRE_MINUTES=30
ALGORITHM=HS256

# CORS (frontend URL)
CORS_ORIGINS=http://localhost:5173,http://localhost:3000
```

Load these in `app/core/config.py` using `pydantic-settings` or `python-dotenv`. **Never commit `.env`** — it is listed in `.gitignore`.

---

## 5. Run the development server

```bash
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

- API: http://localhost:8000
- Interactive docs: http://localhost:8000/docs
- OpenAPI schema: http://localhost:8000/openapi.json

---

## 6. API workflow smoke test

Seed fixture users, start the server, then run the smoke script:

```bash
cd backend
source .venv/bin/activate
python scripts/seed_admin.py
python scripts/seed_test_data.py
uvicorn app.main:app --reload --port 8000

# In another terminal
BMV_API_URL=http://localhost:8000 python scripts/smoke_test_api.py
```

The script exercises register, login, venue listing, booking, payments, venue-owner dashboard, and superadmin APIs. It prints pass/fail per step and exits with code `1` if any step fails.

**Test credentials:**

| Role | Email | Password |
|------|-------|----------|
| Superadmin | `admin@bookmyvenue.com` | `admin123456` |
| Venue owner | `owner@test.com` | `password123` |

---

## 7. Database migrations (Alembic)

From the `backend/` directory:

```bash
alembic revision --autogenerate -m "describe your change"
alembic upgrade head
```

---

## Adding a new feature module

1. Create a folder under `app/modules/<feature>/`.
2. Add `routes.py`, `schemas.py`, `service.py`, and `models.py`.
3. Register the router in `app/main.py`.
4. Add a migration if the module introduces new tables.

Keep each module self-contained. Shared code belongs in `core/`, `db/`, or `utils/` — not copied across modules.

---

## Related docs

- [System Design](../documents/SystemDesign.md)
- [Folder Architecture](../documents/FolderArchitecture.md)
- [Database Design](../documents/DBDesign.md)
- [Contributing](../CONTRIBUTING.md)
