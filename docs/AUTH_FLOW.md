# Venue404 — Authentication Flow

**Status:** Shipped — verified against code, 2026-07-17

## Architecture Summary

Venue404 is a **pnpm monorepo** with a **FastAPI (Python)** backend and **three React + Vite
frontends** (`user-web`, `owner-portal`, `admin-panel`). Authentication is **Supabase-backed**:

- **Supabase Auth is the source of truth** for credentials, sessions, and JWT issuance.
- The **FastAPI backend never stores passwords or sessions** — it only *verifies* the Supabase
  JWT on each request and maps the user to internal `profiles` + `user_roles` data in PostgreSQL.
- A **shared `packages/api-client`** owns the Supabase client, token injection, and the typed
  API client used by all three frontends.

**Roles:** `customer` (default), `venue_owner`, `super_admin`. Enforced on **both** the client
(route guards) and server (FastAPI dependencies).

### Key files

| Layer | File | Role |
|-------|------|------|
| FE auth fns | `packages/api-client/src/auth.ts` | `signUpWithEmail`, `signInWithEmail`, `signOut`, `getAccessToken`, `onAuthStateChange` |
| FE supabase | `packages/api-client/src/supabase.ts` | Supabase client init (anon key) |
| FE http | `packages/api-client/src/client.ts` | Injects `Authorization: Bearer <jwt>`; on 401 auto-`signOut()` |
| FE context | `apps/*/src/lib/AuthContext.tsx` | React auth state, `loadUser()` → `GET /api/auth/me` |
| FE guard | `apps/*/src/components/ProtectedRoute.tsx` | Client-side route protection + role check |
| FE login | `apps/user-web/src/pages/Login.tsx` | Role-based redirect across apps |
| BE verify | `apps/api/app/modules/auth/providers/supabase.py` | JWT verification (HS256 secret / RS256 via JWKS) |
| BE deps | `apps/api/app/modules/auth/dependencies.py` | `get_current_user`, `require_role/admin/owner` |
| BE route | `apps/api/app/modules/auth/routes.py` | `GET /api/auth/me` |
| DB schema | `apps/api/alembic/versions/0001_auth_schema.py` | `profiles`, `user_roles`, `admin_actions` |
| DB trigger | `apps/api/alembic/versions/0002_signup_trigger.py` | Auto-create profile + `customer` role on signup |
| Admin seed | `apps/api/app/modules/admin/service.py` | `seed_super_admin()` via Supabase Admin API on startup |

---

## Flow descriptions

### 1. Signup
1. Frontend collects email/password/fullName/phone → `signUpWithEmail()` → `supabase.auth.signUp()` (metadata `{full_name, phone}`).
2. Supabase inserts into `auth.users`.
3. Postgres trigger `on_auth_user_created` → `handle_new_user()` creates a `profiles` row (`status=active`) and a `user_roles` row (`role=customer`).
4. Supabase fires `SIGNED_IN` → `AuthContext.onAuthStateChange` → `loadUser()` → `GET /api/auth/me` with Bearer token → user hydrated.

### 2. Login
1. `signInWithEmail()` → `supabase.auth.signInWithPassword()`; Supabase validates and returns an access + refresh token.
2. `SIGNED_IN` event → `loadUser()` → `GET /api/auth/me`.
3. Backend `get_current_user`: extract Bearer → `SupabaseAuthProvider.verify_token` (RS256 via JWKS, or HS256 via secret; audience `authenticated`) → load `profiles` (reject if missing/suspended) → load `user_roles` → return `AuthContext`.
4. Frontend `Login.tsx` redirects by role: `super_admin`→admin-panel, `venue_owner`→owner-portal, `customer`→user-web.

### 3. Authenticated API call
`client.ts` calls `getAccessToken()` (Supabase auto-refreshes), adds `Authorization: Bearer`, hits FastAPI. Endpoint depends on `get_current_user` / `require_role(...)`. A `401` makes the client auto-`signOut()`.

### 4. Logout
`signOut()` → `supabase.auth.signOut()` → `SIGNED_OUT` event → `AuthContext` clears `user` → `ProtectedRoute` redirects to `/login`.

### 5. Admin seed (startup)
On FastAPI startup `seed_super_admin()` (idempotent, only if `SUPER_ADMIN_EMAIL/PASSWORD` set) uses the Supabase **Admin API** to create the auth user (no confirm email) and assigns the `super_admin` role.

---

## End-to-end Mermaid diagram (master sequence)

```mermaid
sequenceDiagram
    autonumber
    actor U as User
    participant FE as React App<br/>(AuthContext / ProtectedRoute)
    participant AC as api-client<br/>(auth.ts + client.ts)
    participant SB as Supabase Auth
    participant API as FastAPI<br/>(get_current_user)
    participant PV as SupabaseAuthProvider<br/>(verify_token)
    participant DB as PostgreSQL<br/>(profiles / user_roles)

    rect rgb(235,245,255)
    note over U,DB: SIGNUP
    U->>FE: submit email, password, name, phone
    FE->>AC: signUpWithEmail()
    AC->>SB: auth.signUp({metadata})
    SB->>DB: INSERT auth.users
    DB-->>DB: trigger handle_new_user()<br/>create profile + role=customer
    SB-->>AC: session (JWT)
    end

    rect rgb(235,255,240)
    note over U,DB: LOGIN
    U->>FE: submit email, password
    FE->>AC: signInWithEmail()
    AC->>SB: auth.signInWithPassword()
    SB-->>SB: validate credentials
    SB-->>AC: access_token + refresh_token (RS256 JWT)
    SB-->>FE: emit SIGNED_IN
    end

    rect rgb(255,250,235)
    note over FE,DB: HYDRATE / PROTECTED CALL — GET /api/auth/me
    FE->>AC: loadUser()
    AC->>SB: getAccessToken() (auto-refresh)
    SB-->>AC: JWT
    AC->>API: GET /api/auth/me<br/>Authorization: Bearer JWT
    API->>PV: verify_token(JWT)
    alt alg = RS256
        PV->>SB: GET /.well-known/jwks.json
        SB-->>PV: public keys (JWKS, cached)
    else alg = HS256
        PV-->>PV: decode with SUPABASE_JWT_SECRET
    end
    PV-->>API: ProviderUser(id, email)
    API->>DB: SELECT profile WHERE id, deleted_at IS NULL
    DB-->>API: profile
    alt profile missing or suspended
        API-->>AC: 403 Forbidden
    else ok
        API->>DB: SELECT user_roles
        DB-->>API: roles[]
        API-->>AC: 200 AuthMeResponse{id,email,profile,roles}
    end
    AC-->>FE: user state set
    end

    rect rgb(255,240,245)
    note over FE,U: ROLE-BASED REDIRECT
    alt super_admin
        FE-->>U: → admin-panel
    else venue_owner
        FE-->>U: → owner-portal
    else customer
        FE-->>U: stay on user-web
    end
    end

    rect rgb(240,240,240)
    note over U,SB: LOGOUT / 401
    U->>FE: click logout (or API returns 401)
    FE->>AC: signOut()
    AC->>SB: auth.signOut()
    SB-->>FE: emit SIGNED_OUT (user=null)
    FE-->>U: redirect /login
    end
```

### Supporting diagram — server-side authorization (per request)

```mermaid
flowchart TD
    A[Incoming request<br/>Authorization: Bearer JWT] --> B{Bearer header valid?}
    B -- no --> E1[401 UnauthorizedError]
    B -- yes --> C[verify_token]
    C --> D{JWT valid?<br/>sig + aud=authenticated}
    D -- no --> E1
    D -- yes --> F[Load profile by sub UUID]
    F --> G{Profile exists<br/>& not deleted?}
    G -- no --> E2[403 Account not found]
    G -- yes --> H{status != suspended?}
    H -- no --> E3[403 Account suspended]
    H -- yes --> I[Load user_roles → AuthContext]
    I --> J{Endpoint dependency}
    J -- require_auth --> K[Allow]
    J -- require_role/admin/owner --> L{role in user.roles?}
    L -- no --> E4[403 Insufficient permissions]
    L -- yes --> K
```

---

## Verification
- Render the Mermaid blocks (GitHub preview / VS Code Mermaid extension / mermaid.live) to confirm they parse.
- Cross-check against source: `dependencies.py` (guards), `providers/supabase.py` (HS256/RS256), `client.ts` (Bearer + 401), `0002_signup_trigger.py` (auto profile/role).
