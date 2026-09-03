# BookMyVenue — Client

The user-facing web application for browsing venues and making bookings. Built with React 19 + Vite 8 + TailwindCSS 4.

## Tech Stack

- **Framework**: React 19 with TypeScript ~6.0
- **Build Tool**: Vite 8 with rolldown
- **Styling**: TailwindCSS 4 with tw-animate-css
- **Routing**: React Router 7
- **Server State**: TanStack React Query 5
- **HTTP Client**: Axios
- **Forms**: Formik + Yup validation
- **UI Components**: Radix UI primitives, shadcn-style with class-variance-authority
- **Animation**: Framer Motion
- **Maps**: Leaflet (OpenStreetMap)
- **Date Handling**: date-fns, react-day-picker
- **Notifications**: react-hot-toast
- **Image Crop**: react-easy-crop

## Available Scripts

| Script | Description |
|---|---|
| `pnpm dev` | Start Vite dev server (network-exposed: `--host`) |
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

# Start dev server (default: http://localhost:5173)
pnpm dev

# Run tests
pnpm test
```

## Environment Variables

Create `client/.env`:

```env
VITE_API_BASE_URL=http://localhost:3000/api/v1
```

## Project Structure

```
src/
├── pages/          # Page components (routed)
├── components/     # Reusable UI components
├── hooks/          # Custom React hooks (useApi, useAuth, useDebounce, etc.)
├── services/       # API service layer (Axios calls)
├── context/        # React Context providers
├── utils/          # Utility functions
├── constants/      # App constants
├── types/          # TypeScript type definitions
├── tests/          # Vitest test files
├── router.tsx      # React Router configuration
├── App.tsx         # Root app component
└── main.tsx        # Entry point
```

## Key Differences from Admin

- User-facing (browse venues, search, book)
- Public routes + authenticated routes
- Formik for form management
- Leaflet for map display
- Framer Motion for animations
