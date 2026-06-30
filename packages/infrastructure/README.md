# @repo/infrastructure

All cross-cutting infrastructure lives here. Application code never imports a
provider SDK directly — it depends on **ports** declared in `@repo/contracts`
and receives an **adapter** via the DI container.

## Layout

```
src/
├── auth/
│   ├── supabase.auth.ts      ← in use today
│   ├── cognito.auth.ts       ← SAMPLE: AWS Cognito skeleton
│   └── cloudflare.auth.ts    ← SAMPLE: Cloudflare Access skeleton
├── storage/
│   ├── supabase.storage.ts   ← in use today
│   ├── s3.storage.ts         ← SAMPLE: AWS S3 skeleton
│   └── r2.storage.ts         ← SAMPLE: Cloudflare R2 skeleton
├── db/
│   ├── supabase.db.ts        ← in use today
│   └── drizzle-d1.db.ts      ← SAMPLE: Cloudflare D1 + Drizzle skeleton
├── supabase/                 ← repository implementations (per-vendor)
└── di/container.ts           ← generic DI container
```

## Ports (in `@repo/contracts`)

| Port                                           | Responsibility                                      |
| ---------------------------------------------- | --------------------------------------------------- |
| `AuthProvider`                                 | sign-in/up/out, sessions, OAuth, token verification |
| `StorageProvider`                              | object storage: upload, signed URLs, public URLs    |
| `DbClientFactory`                              | produce admin + per-user query handles for repos    |
| `VenuesRepo`, `BookingsRepo`, `CouponsRepo`, … | domain persistence                                  |

## How to swap providers

There are two seams to flip when migrating a backend concern:

### 1. Composition root (server)

`src/infrastructure/di/composition-root.ts` is the **only** server-side file
that names a vendor. Replace the three factory calls and you're done:

```ts
// Before (Lovable Cloud / Supabase)
const dbFactory = makeSupabaseDbFactory({ admin: supabaseAdmin });
const authProvider = makeSupabaseAuthProvider({ client: browserSupabase });
const storageProvider = makeSupabaseStorageProvider({ client: browserSupabase });

// After (AWS)
const dbFactory = makeDrizzlePgFactory({ url: process.env.DATABASE_URL! });
const authProvider = makeCognitoAuthProvider({ region, userPoolId, clientId });
const storageProvider = makeS3StorageProvider({ region, accessKeyId, secretAccessKey });
```

You'll also swap the per-vendor repository implementations passed to the
container if the new DB isn't query-compatible with Supabase (e.g. moving
from Supabase to Drizzle/Postgres requires rewriting repos under a new
`drizzle/` folder against the same `VenuesRepo` / `BookingsRepo` / `CouponsRepo`
ports — domain code is untouched).

### 2. Client provider singletons

`src/infrastructure/providers.ts` is the **only** browser-side file
that names a vendor. Same pattern:

```ts
// Before
export const authProvider    = makeSupabaseAuthProvider({ client: supabase, oauthBroker: lovable.auth });
export const storageProvider = makeSupabaseStorageProvider({ client: supabase });

// After (Cognito + S3 signed URLs from a server fn)
export const authProvider    = makeCognitoAuthProvider({ ... });
export const storageProvider = makeSignedUrlStorageProvider({ getUploadUrl, getDownloadUrl });
```

Every call site (`useAuth`, `/login`, `/signup`, venue image upload, etc.)
already imports the singleton — no other files change.

### 3. Auth middleware

Server functions today use `requireSupabaseAuth` from
`src/integrations/supabase/auth-middleware.ts`. That file is auto-generated
by Lovable. When you migrate auth, replace its usages with a new middleware
that calls `authProvider.verifyAccessToken(token)` from the container.

## Adding a brand-new provider

1. Implement the relevant port (e.g. `AuthProvider`) in a new file under
   `src/auth/myprovider.auth.ts`.
2. Export the factory from `src/index.ts`.
3. Install any required SDK in `packages/infrastructure/package.json` and
   point both composition roots at the new factory.

Domain and application layers never change.
