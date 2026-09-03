# BookMyVenue — Development Setup Guide

## Prerequisites

- Node.js 22+
- pnpm 10.16.1 (`npm install -g pnpm@10.16.1`)
- MongoDB (local instance or MongoDB Atlas)
- Git

## Getting Started

```bash
git clone https://github.com/ashishshaiju/BookMyVenue.git
cd BookMyVenue
pnpm install
```

## Environment Variables

### Server (`server/.env`)

Copy `server/.env.example` to `server/.env`. Key variables:

| Variable | Description | Default |
|---|---|---|
| `MONGODB_URI` | MongoDB connection string | `mongodb://localhost:27017/book-my-venue` |
| `PORT` | Server port | `3000` |
| `NODE_ENV` | Environment | `development` |
| `JWT_ACCESS_SECRET` | JWT access token secret | (generate random 64-char hex) |
| `JWT_REFRESH_SECRET` | JWT refresh token secret | (generate random 64-char hex) |
| `ACCESS_TOKEN_EXPIRY` | Access token lifetime | `15m` |
| `REFRESH_TOKEN_EXPIRY` | Refresh token lifetime | `7d` |
| `RESEND_API_KEY` | Resend email API key | — |
| `EMAIL_FROM_NAME` | Sender name | `BookMyVenue` |
| `EMAIL_FROM_EMAIL` | Sender email | `noreply@bookmyvenue.com` |
| `FRONTEND_URL` | Client app URL | `http://localhost:5173` |
| `CLOUDINARY_CLOUD_NAME` | Cloudinary cloud name | — |
| `CLOUDINARY_API_KEY` | Cloudinary API key | — |
| `CLOUDINARY_API_SECRET` | Cloudinary API secret | — |
| `RAZORPAY_KEY_ID` | Razorpay key ID | — |
| `RAZORPAY_KEY_SECRET` | Razorpay key secret | — |
| `RAZORPAY_WEBHOOK_SECRET` | Razorpay webhook secret | — |
| `SWAGGER_USER` | Swagger UI basic auth user | `admin` |
| `SWAGGER_PASS` | Swagger UI basic auth pass | `password` |

### Client (`client/.env`)

```env
VITE_API_BASE_URL=http://localhost:3000/api/v1
```

### Admin (`admin/.env`)

```env
VITE_API_BASE_URL=http://localhost:3003/api/v1
VITE_CLIENT_URL=http://localhost:5173
```

## Database Setup

1. Start MongoDB locally or use MongoDB Atlas
2. The server connects automatically on startup using `MONGODB_URI`
3. Required after a fresh database:

```bash
cd server
pnpm script seed:rbac
```

This seeds roles, permissions, and RBAC data. The server verifies this at startup via `verifyRbacSeed()` and exits if missing.

## Running the Workspaces

### Root (all workspaces simultaneously)

```bash
pnpm dev
```

Starts server (port 3000/3003), client (port 5173), and admin (port 5174) in parallel.

### Server (Backend)

```bash
cd server
pnpm dev              # Start with auto-reload (tsx watch)
pnpm build            # Compile TypeScript to dist/
pnpm start            # Run built server (node dist/server.js)
pnpm lint             # ESLint
pnpm typecheck        # tsc --noEmit
```

Runs on `http://localhost:3000` (configurable via `PORT`). Uses Express 5 + Mongoose. Swagger API docs at `http://localhost:3000/api/v1/swagger` (basic auth: user/pass from env).

### Client (User App)

```bash
cd client
pnpm dev              # Vite dev server on http://localhost:5173 (--host)
pnpm build            # tsc -b && vite build
pnpm lint             # ESLint
pnpm preview          # Preview production build
```

User-facing React 19 app for browsing venues and booking.

### Admin (Admin Dashboard)

```bash
cd admin
pnpm dev              # Vite dev server on http://localhost:5174
pnpm build            # tsc -b && vite build
pnpm lint             # ESLint
pnpm preview          # Preview production build
```

Owner/admin dashboard built with React 19 + Zustand + TanStack React Table.

## Docker

The project includes a server-only Docker Compose setup for local dev:

```bash
docker compose up
```

This runs the server in a container, mapping host port 3000 to container port 3003. It reads `server/.env` for configuration and persists logs to `server/logs/`.

Note: Docker Compose does NOT include MongoDB or the frontend apps — it's for smoke-testing the containerised server only.

## Background Workers

The server starts 3 background workers automatically:

- **email.worker.ts** — Processes email tasks from the `email-task` MongoDB collection
- **banExpiry.worker.ts** — Handles automatic ban expiration
- **venueEditDeadline.worker.ts** — Manages venue edit deadlines

## Testing

```bash
# Run tests in current workspace
pnpm test

# Run tests in all workspaces
pnpm -r test

# Run a specific workspace command from root
pnpm --filter server exec <cmd>
pnpm --filter client exec <cmd>
pnpm --filter admin exec <cmd>
```

- **Server**: vitest with `mongodb-memory-server` + `supertest` for integration tests
- **Client**: vitest with jsdom + @testing-library/react
- **Admin**: vitest with jsdom + @testing-library/react

## Pre-commit / Pre-push

- **pre-commit**: lint-staged (ESLint on staged files → `tsc --noEmit` → test per workspace)
- **pre-push**: ESLint + test + build on changed workspaces

## Useful Commands

```bash
pnpm install:all     # Install all dependencies
pnpm build           # Build all workspaces
pnpm lint            # Lint all workspaces
pnpm format          # Format code in all workspaces
```

## Troubleshooting

- **"RBAC data missing" on server startup**: Run `pnpm script seed:rbac` in the server directory
- **Build failures**: Ensure you have the correct Node version (22+) and pnpm version (10.16.1)
- **MongoDB connection refused**: Verify MongoDB is running locally or check `MONGODB_URI`
- **Client can't reach API**: Check `VITE_API_BASE_URL` in `client/.env`
