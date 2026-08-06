# Setup

Local development guide for BookMyVenue.

## Tech stack

| Layer | Technologies |
| --- | --- |
| Frontend | React, Vite, Tailwind CSS |
| Backend | Django, Django REST Framework |
| Data | PostgreSQL (PostGIS), Redis |
| Jobs | Celery, Celery Beat |

## Features

- User and venue-owner auth (email + Google OAuth)
- Venue listing, search, and detail pages
- Booking flow with session handling
- Payments verification
- Contact form
- Image uploads
- Background tasks via Celery

## Prerequisites

- [Docker](https://docs.docker.com/get-docker/) and Docker Compose

## Run locally

```bash
git clone <repo-url>
cd BookMyVenue
docker compose up --build
```

| Service | URL |
| --- | --- |
| Frontend | http://localhost:5173 |
| Backend API | http://localhost:8000 |
| Django Admin | http://localhost:8000/admin/ |

Migrations run automatically on first backend start.

### Environment

Defaults live in `backend/.env` and `frontend/.env`. To customize:

```bash
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env
```

Keep backend secrets out of the frontend env file.

### Seed demo data (optional)

```bash
make seed
```

| Email | Password | Role |
| --- | --- | --- |
| `admin@bookmyvenue.local` | `admin12345` | Admin |
| `user@bookmyvenue.local` | `user12345` | User |
| `venue@bookmyvenue.local` | `venue12345` | Venue owner |

### Useful commands

```bash
make down              # stop containers
make logs              # follow logs
make migrate           # run migrations
make makemigrations    # create migrations
make createsuperuser   # create admin user
make shell             # Django shell
make test              # run backend tests
```

Reset the database:

```bash
docker compose down -v
```

## Project layout

```text
frontend/       # React + Vite
backend/        # Django + DRF
compose.yml     # local Docker services
Makefile        # shortcuts
```
