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

# 2. Copy env file and edit if your Mac username is not jeevan
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
| `jeevan` | Your Mac username (Postgres trusts local login — **no password**) |
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
