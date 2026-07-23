# Book My Venue — Frontend

React SPA for venue search and booking. Built with **Bulletproof React** conventions, **Redux Toolkit + RTK Query**, **Tailwind + shadcn**, and **Sonner** toasts.

Project-wide decisions: [`../DESIGN_DECISIONS.md`](../DESIGN_DECISIONS.md)

## Stack

| Layer | Choice |
|-------|--------|
| Bundler | Vite + React (JavaScript) |
| Structure | [Bulletproof React](https://github.com/alan2207/bulletproof-react) |
| State | Redux Toolkit + RTK Query |
| Routing | React Router (lazy `app/routes/*`) |
| UI | Tailwind + shadcn-style components |
| Toasts | Sonner |

## Prerequisites

- Node.js 20+
- Backend API running on `http://localhost:3000` (see [`../backend/README.md`](../backend/README.md))

## Setup

```bash
cd frontend
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173).

API requests to `/api/*` are proxied to the backend in development (`vite.config.js`).

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start dev server |
| `npm run build` | Production build |
| `npm run lint` | ESLint (import zones + kebab-case) |
| `npm run format` | Prettier |

## Conventions (read this before contributing)

### Naming

| Item | Rule | Good | Bad |
|------|------|------|-----|
| Variables | Full words | `year`, `month`, `busySlots` | `y`, `m`, `startA` |
| Functions | Verb + what it does | `convertIstDateHourToUtcIso` | `toUtc`, `handle` |
| Files | kebab-case | `booking-panel.jsx` | `BookingPanel.jsx` (except shadcn ui/) |
| Constants | SCREAMING_SNAKE or clear export | `VENUE_OPEN_HOUR` | `START_HOUR` alone |

### Helpers

- Put in `utils/` only if used in **2+ places** or logic is non-trivial.
- Each helper gets a **one-line comment** + `@example` input/output when non-obvious.
- Do not wrap one-liners in extra functions.

### Architecture (Bulletproof)

- **No cross-feature imports** — compose in `app/routes/*`
- **Unidirectional flow** — shared → features → app
- **Direct imports** — no barrel `index.js` re-exports
- **Absolute paths** — `@/features/...`

### Comments

- Explain **why**, not what the code obviously does.
- Datetime/slot helpers: include input/output examples (IST vs UTC confuses everyone).

### UI

- Use **shadcn CLI/components** when possible — do not hand-roll Button/Input.
- Design tokens in `index.css` — no random hex in components.

## Folder structure

```
src/
├── app/           provider, router, routes (compose features here)
├── components/    shared ui
├── config/        paths.js, env.js
├── features/      auth, venues, bookings, owner
├── lib/           api.js (RTK Query base)
├── utils/         datetime.js, slots.js, cn.js
└── testing/
```



## Environment

Optional `.env`:

```
VITE_API_URL=/api/v1
```

Defaults to `/api/v1` (Vite proxy in dev).
