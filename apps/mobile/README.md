# Book My Venue — Mobile (Expo)

React Native app that reuses the monorepo's business logic
(`@repo/domain`, `@repo/application`, `@repo/contracts`,
`@repo/infrastructure`) and design tokens (`@repo/ui-tokens`).

## Setup

1. Install workspace dependencies from the repo root:

   ```bash
   npm install --legacy-peer-deps
   ```

2. Add the public Supabase env vars (these mirror the web app's
   `VITE_SUPABASE_*` values):

   ```bash
   # apps/mobile/.env
   EXPO_PUBLIC_SUPABASE_URL=...
   EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY=...
   ```

3. Start the dev server:

   ```bash
   cd apps/mobile
   npm start          # then press i for iOS, a for Android, or scan with Expo Go
   ```

## What's shared with the web app

| Package                | Purpose                                            |
| ---------------------- | -------------------------------------------------- |
| `@repo/domain`         | Entities, value objects, pricing rules             |
| `@repo/application`    | Use-cases (quoteBooking, listVenues, …)            |
| `@repo/contracts`      | Ports: `AuthProvider`, `StorageProvider`, repos, … |
| `@repo/infrastructure` | Supabase adapters (auth, storage, db, repos)       |
| `@repo/ui-tokens`      | Color, radius, spacing, font tokens (web + mobile) |

## What's mobile-only

| Path                                     | Why                                 |
| ---------------------------------------- | ----------------------------------- |
| `src/integrations/supabase.ts`           | RN client (AsyncStorage session)    |
| `src/infrastructure/providers.native.ts` | Native provider singletons          |
| `app/**`                                 | Expo Router screens                 |
| `components/ui.tsx`                      | RN equivalents of shadcn primitives |

## Swapping providers

Same story as the web app — change the factories in
`src/infrastructure/providers.native.ts` and nothing else changes.
See `packages/infrastructure/README.md` for adapter options
(Cognito, R2, S3, D1, …).

## Screen ↔ web route mapping

| Web route                          | Mobile screen                                 |
| ---------------------------------- | --------------------------------------------- |
| `/`                                | `app/index.tsx`                               |
| `/login`, `/signup`                | `app/login.tsx`, `app/signup.tsx`             |
| `/venues`, `/venues/:venueId`      | `app/venues/index.tsx`, `app/venues/[id].tsx` |
| `/_authenticated/account/bookings` | `app/(auth)/account/bookings.tsx`             |

Host flows (`/_authenticated/host/*`) can follow the same pattern when
needed — copy from the web routes and replace HTML/shadcn with the RN
primitives in `components/ui.tsx`.
