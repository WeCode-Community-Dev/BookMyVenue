# BookMyVenue (by WeCode)

BookMyVenue is a 100% open-source initiative built by the **WeCode community**, designed to simplify the process of finding and booking venues in local areas. This is a platform built for the community, by the community. Whether you're looking for a cozy cafe for a quick meetup, a spacious auditorium for a community event, or a scenic outdoor space for a personal celebration, BookMyVenue aims to connect people with the perfect space—without the commercial overhead.

## 🚧 The Problem

Organizing an event—big or small—often comes with the hassle of finding a suitable location. Traditionally, people struggle with:

- **Fragmented Information:** Venue details, availability, and pricing are scattered across various websites or require time-consuming phone calls.
- **Lack of Transparency:** Hidden costs, unclear amenities, and outdated photos make it hard to trust what you are booking.
- **Time Inefficiency:** Manually comparing options, negotiating, and finalizing bookings is a tedious and frustrating process for organizers.
- **Underutilized Spaces:** Owners of small or unique spaces (like local cafes, art studios, or boutique halls) often lack the marketing reach to showcase their venues to a wider audience.

## 💡 The Solution

BookMyVenue acts as a completely free and open bridge between space owners and the community, offering a seamless booking experience for everyone:

- **Centralized Marketplace:** A single platform to discover a wide variety of venues, ranging from conventional banquet halls and auditoriums to unconventional spaces like cafes, studios, and mall pop-up spaces.
- **Real-Time Availability & Pricing:** Transparent access to schedules and upfront pricing so you can make informed decisions quickly without the back-and-forth.
- **Detailed Listings:** High-quality photos, comprehensive amenity lists (e.g., Wi-Fi, parking, AV equipment), and verified user reviews.
- **Simplified Booking Process:** Easy, hassle-free online reservations in just a few clicks.
- **Empowering Local Communities:** Providing small venue owners, community centers, and local spaces an open platform to manage their underutilized spaces and share them with the public.

## 🗺️ Project Roadmap

We are building BookMyVenue iteratively through **4 Phases**:
- **Phase 1: MVP (Current):** Anyone can contribute in *any stack*. If it's good, we merge it!
- **Phase 2 & 3: Feature & Modularization:** Implementing features module by module and refining the architecture.
- **Phase 4: Scalability:** Building a fully scalable, cloud-native solution for high traffic.

## 🤝 How to Contribute

This is a collective effort, and everyone in the WeCode community shares the benefits of what we build! Whether you're a beginner or a pro, we would love your help. 
Please check out our full [Contribution Guidelines](CONTRIBUTING.md) to learn how to:
- Fork and clone the repository.
- Create your feature branch (`feat/<branch-name>`).
- Submit a Pull Request.

### 📝 Pull Request Format
To maintain a high standard of code, all Pull Requests must use our [standard template](.github/PULL_REQUEST_TEMPLATE.md). When you open a PR, you will be prompted to:
1. **Select the Phase Category** (e.g., Phase 1 MVP).
2. **Document your Tech Stack** (Frontend, Backend, Database).
3. **Complete the Review Checklist** (Self-review, community standards).
4. **Sign the AI Disclosure** (Confirming you have reviewed any AI-generated code).
5. **Attach Screenshots** (If your PR includes UI changes).

---

# MVP Implementation (FastAPI + React)

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

**BookMyVenue belongs to all of us. Join WeCode today and let's build something amazing together!**
