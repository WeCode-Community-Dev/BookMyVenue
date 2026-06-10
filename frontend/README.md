# BookMyVenue — Frontend

Web client for BookMyVenue. This folder holds the user-facing app for browsing venues, making bookings, and managing listings..

During Phase 1 (MVP), contributors may use any frontend stack. Whatever you choose, follow the **modular monolithic** layout described below — one deployable app, organized by feature modules.

---

## Prerequisites

- Node.js 18+ (recommended: 20 LTS)
- npm, yarn, or pnpm
- Git
- Running backend API (see [`backend/README.md`](../backend/README.md))

---

## 1. Create the frontend project

From the repository root:

```bash
cd frontend
```

### Option A — React + Vite (recommended starting point)

```bash
npm create vite@latest . -- --template react-ts
npm install
```

### Option B — Next.js

```bash
npx create-next-app@latest . --typescript --eslint --app --src-dir
```

### Option C — Your preferred stack

Use Vue, Svelte, Angular, or another framework if you prefer. Document your choice in your Pull Request. The folder structure rules below still apply.

---

## 2. Modular monolithic folder structure

After scaffolding, reorganize (or grow) the project into feature modules. One app, one build — not separate micro-frontends.

```bash
frontend/
├── src/
│   ├── main.tsx                 # App entry point
│   ├── app/                     # App shell: routing, layout, providers
│   │   ├── App.tsx
│   │   ├── router.tsx
│   │   └── providers.tsx
│   ├── core/                    # Global config and shared infrastructure
│   │   ├── config.ts            # Env-based settings (API URL, etc.)
│   │   ├── api/
│   │   │   └── client.ts        # HTTP client (fetch/axios) with auth headers
│   │   └── auth/
│   │       └── AuthContext.tsx  # Auth state shared across modules
│   ├── modules/                 # Feature-based modules (mirror backend domains)
│   │   ├── auth/
│   │   │   ├── pages/           # Login, register
│   │   │   ├── components/      # Module-specific UI
│   │   │   ├── hooks/           # Module-specific hooks
│   │   │   ├── services/        # API calls for this feature
│   │   │   └── types.ts         # Module-specific types
│   │   ├── venues/
│   │   ├── bookings/
│   │   ├── admin/
│   │   └── profile/
│   ├── components/              # Shared, reusable UI (buttons, modals, etc.)
│   │   └── ui/
│   ├── hooks/                   # Shared hooks
│   ├── utils/                   # Pure helpers (formatting, validation)
│   └── styles/                  # Global styles / design tokens
├── public/
├── .env                         # Local env (never commit)
├── .env.example                 # Template for contributors
├── package.json
└── README.md
```

### Modular monolithic rules

| Location | Responsibility |
|----------|----------------|
| `modules/<feature>/pages/` | Route-level screens for one domain. |
| `modules/<feature>/services/` | API calls for that feature only. |
| `modules/<feature>/components/` | UI used inside that module. |
| `core/` | App-wide config, API client, auth — no feature UI here. |
| `components/ui/` | Generic building blocks reused across modules. |
| `app/` | Routing, layout, and top-level providers. |

**Do not** put feature logic in `App.tsx`. **Do not** call the API directly from page components — use the module's `services/`. **Do not** create random top-level folders; add a new folder under `modules/` instead.

Data flow:

```text
Page → module service → core API client → backend → response → UI
```

---

## 3. Install dependencies

After scaffolding, install base dependencies:

```bash
npm install
```

Common additions (install what your stack needs):

```bash
# Routing
npm install react-router-dom

# HTTP client
npm install axios

# Env validation (optional)
npm install zod
```

Lock your versions by committing `package-lock.json` (or `pnpm-lock.yaml` / `yarn.lock`).

---

## 4. Environment variables (`.env`)

Copy the example file and point to your local backend:

```bash
cp .env.example .env
```

Example `.env.example`:

```env
# Backend API base URL
VITE_API_BASE_URL=http://localhost:8000

# App metadata
VITE_APP_NAME=BookMyVenue
```

For **Next.js**, use the `NEXT_PUBLIC_` prefix instead of `VITE_`:

```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:8000
```

Read env values in `src/core/config.ts` — not scattered across components. **Never commit `.env`**.

---

## 5. Run the development server

**Vite (React)**

```bash
npm run dev
```

Default URL: http://localhost:5173

**Next.js**

```bash
npm run dev
```

Default URL: http://localhost:3000

Ensure `CORS_ORIGINS` on the backend includes your frontend URL.

---

## 6. Build for production

```bash
npm run build
npm run preview   # Vite — preview production build locally
```

---

## Adding a new feature module

1. Create `src/modules/<feature>/` with `pages/`, `components/`, `services/`, and `types.ts`.
2. Add routes in `src/app/router.tsx`.
3. Keep API calls inside the module's `services/` layer using the shared client from `core/api/`.
4. Move reusable UI into `src/components/ui/` only when two or more modules need it.

Each module should be understandable on its own, similar to the backend's `app/modules/` layout.

---

## Related docs

- [Backend setup](../backend/README.md)
- [System Design](../documents/SystemDesign.md)
- [Folder Architecture (backend reference)](../documents/FolderArchitecture.md)
- [Product Requirements](../documents/PRD.md)
- [Contributing](../CONTRIBUTING.md)
