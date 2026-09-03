# BookMyVenue — Admin Dashboard

The owner and admin dashboard for managing venues, bookings, users, and moderation. Built with React 19 + Vite 8 + Zustand + TanStack React Table.

## Tech Stack

- **Framework**: React 19 with TypeScript ~6.0
- **Build Tool**: Vite 8 with rolldown
- **Styling**: TailwindCSS 4
- **Routing**: React Router 7
- **Server State**: TanStack React Query 5
- **Client State**: Zustand 5
- **HTTP Client**: Axios
- **Tables**: TanStack React Table 8
- **Charts**: Recharts
- **UI Components**: Radix UI (Dialog, Slot, Tooltip), class-variance-authority
- **Date Handling**: date-fns, react-day-picker
- **Notifications**: react-hot-toast

## Available Scripts

| Script | Description |
|---|---|
| `pnpm dev` | Start Vite dev server (local only) |
| `pnpm build` | Type-check (`tsc -b`) then build (`vite build`) |
| `pnpm test` | Run vitest tests |
| `pnpm test:watch` | Run tests in watch mode |
| `pnpm test:coverage` | Run tests with coverage report |
| `pnpm lint` | ESLint check |
| `pnpm lint:fix` | Auto-fix ESLint issues |
| `pnpm preview` | Preview production build locally |

## Development

```bash
# Install dependencies (from repo root)
pnpm install

# Start dev server (default: http://localhost:5174)
pnpm dev

# Run tests
pnpm test
```

## Environment Variables

Create `admin/.env`:

```env
VITE_API_BASE_URL=http://localhost:3003/api/v1
VITE_CLIENT_URL=http://localhost:5173
```

## Project Structure

```
src/
├── pages/          # Page components (routed)
├── components/     # Reusable UI components
│   └── guards/     # Auth guards (AuthGuard, RoleGuard, OwnerGuard)
├── hooks/          # Custom React hooks (useApi, useModal, useToast)
├── services/       # API service layer (Axios)
├── store/          # Zustand stores (useAuthStore, useAppStore, useModalStore)
├── utils/          # Utility functions
├── constants/      # App constants
├── types/          # TypeScript type definitions
├── tests/          # Vitest test files
├── config/         # Axios instance and query client config
├── App.tsx         # Root app component
└── main.tsx        # Entry point
```

## Key Differences from Client

- Owner/admin dashboard (authenticated-only routes)
- Zustand for client state management (no React Context)
- TanStack React Table for data tables
- Recharts for analytics charts
- Auth guards (AuthGuard, RoleGuard, OwnerGuard) for route protection
- No map or animation libraries
