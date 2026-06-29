# Book My Venue — Backend API

Node.js + Express (ESM) + PostgreSQL + Prisma.

## Prerequisites

- Node.js 18+
- Homebrew PostgreSQL 15 (`brew services start postgresql@15`)
- Database: `book_my_venue`

### Add `psql` to your terminal PATH (one-time)

Homebrew installs Postgres as `postgresql@15` without adding it to PATH. If `psql` says `command not found`, run:

```bash
echo 'export PATH="/opt/homebrew/opt/postgresql@15/bin:$PATH"' >> ~/.zshrc
source ~/.zshrc
psql --version
```

## Setup (Phase 1)

```bash
# 1. Create database (one-time)
createdb book_my_venue

# 2. Copy env file and edit  your Mac username 
cp .env.example .env

# 3. Install dependencies
npm install

# 4. Generate Prisma client
npm run db:generate

# 5. Verify Postgres connection
npm run check:setup
```

## DATABASE_URL — where does it come from?

After `createdb book_my_venue`, you **manually put** the connection string in `.env`. Nothing auto-generates it.

```
DATABASE_URL="postgresql://jeevan@localhost:5432/book_my_venue"
```

| Part | Meaning |
|------|---------|
| `postgresql://` | Protocol |
| `name` | Your Mac username (Postgres trusts local login — **no password**) |
| `localhost:5432` | Postgres running on your machine, default port |
| `book_my_venue` | Database name from `createdb` |

**Password:** Homebrew Postgres on Mac uses **trust auth** for local connections — leave password blank in pgAdmin and `.env`.

## pgAdmin — how does it see your data?

pgAdmin does **not** receive a copy of data. It is a **client** that connects to the **same** Postgres server as Node/Prisma:

```
┌─────────────┐     ┌──────────────────┐     ┌─────────────────┐
│  Your API   │────▶│  PostgreSQL      │◀────│  pgAdmin        │
│  (Prisma)   │     │  (stores data)   │     │  (views data)   │
└─────────────┘     └──────────────────┘     └─────────────────┘
        localhost:5432 / book_my_venue
```

Data lives **inside** Postgres. Both Prisma and pgAdmin read/write the same database.

## pgAdmin connection

| Field | Value |
|-------|-------|
| Host | `localhost` |
| Port | `5432` |
| Database | `book_my_venue` |
| Username | your Mac username (`whoami`) |
| Password | leave blank |

## ESM (import/export)

This project uses **ESM** (`"type": "module"` in `package.json`):

```javascript
// ✅ ESM
import prisma from '../config/prisma.js';

// ❌ not used
const prisma = require('../config/prisma');
```

Relative imports must include the `.js` extension.

## API (Phase 3+)

```bash
npm run dev
```

| Endpoint | Description |
|----------|-------------|
| `GET /api/v1/health` | Server health check |
| `POST /api/v1/auth/register` | Register user (body: username, email, mobileNumber, password, role?) |
| `POST /api/v1/auth/login` | Login (body: email, password) → returns JWT |
| `GET /api/v1/auth/me` | Current user (header: `Authorization: Bearer <token>`) |

### Venues

| Endpoint | Auth | Description |
|----------|------|-------------|
| `GET /api/v1/venues` | No | List venues; optional `?city=Mumbai` |
| `GET /api/v1/venues/:id` | No | Single venue with amenities |
| `POST /api/v1/venues` | OWNER | Create venue + amenities |
| `PUT /api/v1/venues/:id` | OWNER | Update own venue |
| `DELETE /api/v1/venues/:id` | OWNER | Delete own venue |

### Bookings (Phase 6)

| Endpoint | Auth | Description |
|----------|------|-------------|
| `GET /api/v1/venues/:id/availability` | No | Busy CONFIRMED slots in range (`?from=&to=` **UTC ISO datetimes ending in `Z`**) |
| `POST /api/v1/bookings` | CUSTOMER | Create booking (overlap check + price snapshot) |
| `GET /api/v1/bookings` | CUSTOMER | List your bookings |
| `PATCH /api/v1/bookings/:id/cancel` | CUSTOMER | Cancel your own booking |

**Datetime rule:** All booking/availability datetimes must be ISO 8601 **UTC** — end with `Z` or `+00:00` (e.g. `2026-07-01T10:00:00.000Z`). Date-only (`2026-07-01`) and non-UTC offsets (`+05:30`) are rejected.

**Query strings:** If you use `+00:00` in a URL, encode `+` as `%2B` (otherwise `+` is read as a space).

**Check availability:**

```bash
curl "http://localhost:3000/api/v1/venues/1/availability?from=2026-07-01T10:00:00.000Z&to=2026-07-01T18:00:00.000Z"
```

**Create booking (customer token):**

```bash
curl -X POST http://localhost:3000/api/v1/bookings \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_CUSTOMER_TOKEN" \
  -d '{
    "venueId": 1,
    "bookingFrom": "2026-07-01T10:00:00.000Z",
    "bookingTo": "2026-07-01T14:00:00.000Z"
  }'
```

**Cancel booking:**

```bash
curl -X PATCH http://localhost:3000/api/v1/bookings/1/cancel \
  -H "Authorization: Bearer YOUR_CUSTOMER_TOKEN"
```

**Create venue example:**

```bash
curl -X POST http://localhost:3000/api/v1/venues \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_OWNER_TOKEN" \
  -d '{
    "name": "Grand Hall",
    "description": "Spacious event hall",
    "pricePerHour": 5000,
    "city": "Mumbai",
    "district": "Andheri",
    "state": "Maharashtra",
    "latitude": 19.1136,
    "longitude": 72.8697,
    "country": "India",
    "capacity": 200,
    "amenities": {
      "parking": true,
      "parkingSize": 50,
      "airConditioning": true,
      "wifi": true
    }
  }'
```

| Command | Description |
|---------|-------------|
| `npm run check:setup` | Verify `.env` and database connection |
| `npm run db:generate` | Generate Prisma client |
| `npm run db:migrate` | Run migrations (Phase 2+) |
| `npm run dev` | Start API server with nodemon (auto-restart on file changes) |
| `npm run start` | Start API server (production) |

## Folder structure

```
src/
├── config/        # env + Prisma client
├── routes/        # URL definitions (Phase 3+)
├── controllers/   # HTTP request/response (Phase 3+)
├── services/      # Business logic (Phase 4+)
├── repositories/  # Database access (Phase 4+)
├── middleware/    # Auth, validation, errors (Phase 3+)
├── utils/         # Helpers (Phase 3+)
└── scripts/       # Setup utilities
```
