# BookMyVenue (BMV)

A location-based venue discovery and booking platform. Find and book the perfect
nearby spaces for birthdays, professional meetups, and local events.

This is the **MVP** of a vertical slice covering three personas: **User**,
**Owner**, and **Admin**.

## Stack

- **Backend**: FastAPI · SQLAlchemy 2.0 · Alembic · Pydantic v2 · JWT auth ·
  Google OAuth · SQLite (MVP; Postgres-ready via Alembic).
- **Frontend**: React 18 + Vite + TypeScript · React Router · TanStack Query ·
  Zustand · Tailwind CSS (minimal **red** BookMyShow-style theme).
- **Layout**: monorepo — `frontend/`, `backend/`, `docs/`, `docker-compose.yml`.

## Repository structure

```
BMV/
  frontend/          React + Vite + TS app
    src/
      api/           axios client + endpoint modules
      features/      auth, venues, bookings, owner, admin
      components/    shared UI (Button, Input, Card, layout)
      stores/        zustand stores (auth, filters)
      lib/           utils, types, constants
  backend/           FastAPI app
    app/
      core/          config, security (JWT), google, deps, exceptions
      db/            base, session, init_db, seed
      modules/       auth, users, venues, bookings, payments, admin
        <domain>/    router.py, service.py, schemas.py, (repository/model)
      models/        re-exports for Alembic
      main.py        app factory
    alembic/         migrations
    tests/
  docs/              ERD + API contract
```

## Quick start (local)

### Backend

```bash
cd backend
python -m venv .venv
# Windows: .venv\Scripts\activate   |   macOS/Linux: source .venv/bin/activate
pip install -r requirements.txt
cp .env.example .env

# create tables + seed demo data
python -m app.db.init_db

# run server
uvicorn app.main:app --reload --port 8000
# API docs: http://localhost:8000/docs
```

### Frontend

```bash
cd frontend
npm install
npm run dev
# open http://localhost:5173
```

The Vite dev server proxies `/api` to `http://localhost:8000`.

## Demo accounts (after seeding)

| Role  | Email               | Password   |
|-------|---------------------|------------|
| Admin | admin@example.com   | admin123   |
| Owner | owner@example.com   | owner123   |
| User  | user@example.com    | user123    |

## Docker

```bash
docker compose up --build
# backend -> http://localhost:8000   frontend -> http://localhost:5173
```

## Database migrations (Alembic)

```bash
cd backend
alembic revision --autogenerate -m "describe change"
alembic upgrade head
```

## MVP feature scope

- **User**: email/Google signup, search & filter venues, view details, instant
  booking request, booking history, cancel (mock refund).
- **Owner**: list venue (await approval), manage listings, accept/decline
  incoming bookings.
- **Admin**: approve/reject venues, platform overview stats.

Payments are **mocked** (a `payments` record is created on confirmation and
marked `mock_refunded` on cancellation). Real payment gateway, analytics
dashboards, owner payouts, disputes, and notifications are deferred.

## Key flows

1. Owner submits venue → status `pending`.
2. Admin approves → venue appears in public search.
3. User searches/filters → books → status `pending`.
4. Owner accepts → `confirmed`, mock payment recorded.
5. User cancels → `cancelled`, payment `mock_refunded`.
