# Code Review Rubric — BookMyVenue

> The bar every change clears **before commit**. Used by me (manual self-review) and by the
> review workflow (Antigravity).
>
> **Division of labour:** deterministic checks (ESLint, `tsc`, `knip` for dead code) run
> automatically in the pre-commit hook + CI and catch the mechanical issues. This rubric is for
> the **judgment a linter can't make** — naive approaches, design, security, missing edge cases.

## How to use it

1. Stage your changes (`git add`).
2. Run the review workflow (Antigravity).
3. The reviewer reports issues **by severity** and **explains the principle** behind each.
   It does **not** auto-fix — you fix it yourself, because that's where the learning is.
4. Severity: **🔴 Blocker** (do not commit) · **🟡 Should-fix** · **🟢 Nice-to-have**.

---

## 1. Correctness & edge cases

- Handles failure paths, not just the happy path?
- Empty / null / missing / duplicate inputs handled?
- Concurrent requests considered (two people booking the same slot at once)?
- `async`/`await` used correctly — no unawaited promises, no missed `try/catch`?

## 2. Naive-approach traps _(the most important section)_

- **Logic that belongs in the database done in app code?** The classic: checking for a booking
  clash with "query, then insert" instead of a DB unique constraint / transaction — that's a
  race condition waiting to happen. This is the project's showcase detail; get it right.
- **N+1 queries** — a DB query inside a loop, instead of one query with an `include`/join?
- **Loading a whole table into memory** and filtering in JavaScript instead of in the query?
- **Missing transaction** around a multi-step money/booking state change?
- **Reinventing** something the framework or a library already provides?

## 3. Security

- Every external input validated at the boundary with Zod (`nestjs-zod`)?
- **Authorization** checked, not just authentication? (Can a plain user hit an owner/admin route?)
- Tenant scoping: are owner-facing queries scoped by `organizationId` / `ownerId`?
- Razorpay: are **both** the checkout signature and the webhook signature verified server-side?
- No secrets in code; nothing sensitive in logs or in API responses?

## 4. Dead code & cruft _(linters catch most of this — fix those first)_

- Unused imports, variables, exports, or files? (`knip` flags these.)
- Commented-out code, leftover `console.log` / debug statements, stray `TODO`s?
- Unreachable branches?

## 5. Production-grade code quality

- Errors handled, not swallowed; messages meaningful; correct HTTP status codes?
- Config read from env (`ConfigModule`) — nothing hardcoded?
- Consistent API response shape across endpoints?
- _(Deploy/infra concerns — monitoring, scaling, autoscaling — are out of scope this phase.
  "Production-grade" here means the code itself, not the infrastructure.)_

## 6. Design & principles

- **Single responsibility** — does each function / class do one clear thing?
- **Module boundaries respected** — payments reached only via `PaymentService`; modules talk
  through injected services, not by reaching into each other's internals?
- **Dependency injection** used instead of `new`-ing dependencies inside a class?
- Naming clear and honest? Function / file not bloated (~300-line guideline)?
- **DRY, but not over-abstracted.** Repeated code is a smell; so is a clever abstraction built
  for a single use. Prefer the simplest thing that reads clearly.

## 7. Types

- No `any`; no non-null `!` used just to silence the compiler?
- Shared types / Zod schemas imported from `packages/shared`, not duplicated per app?

## 8. Tests

- Is the core logic (booking-conflict prevention, auth, signature verification) covered?
- Does this change break or require updating an existing test?
