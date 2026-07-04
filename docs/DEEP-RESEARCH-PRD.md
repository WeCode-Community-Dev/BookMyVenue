# Venue404 Deep Research — Architecture & Plan

## Goal

Turn the existing (currently non-functional) "Deep Research" CTAs in `user-web` into a real feature: a
prompt-driven venue search that first ranks internal (platform) venues via hybrid search, then — on
demand — augments results with externally discovered venues not yet listed on Venue404. Users may
"reserve" an external venue as a lead; Venue404 acts as a manual middleman to contact the venue and
either onboard it or book on the user's behalf, earning commission and a platform fee either way.

---

## Pipeline

```text
User Query
     │
     ▼
Query Understanding (reuse existing SearchParams parsing)
     │
     ├──────────────────────────┐
     ▼                          ▼
Internal Retrieval        External Discovery
(existing /search/hybrid)  (new, async job)
     │                          │
     ▼                          ▼
Lexical (FTS) + Vector     Licensed data API
(pgvector, already live)   (NOT a raw scraper — see Risks)
     │                          │
     └───────────┬──────────────┘
                 ▼
          Candidate Union
                 ▼
            Deduplicate
       (name + city normalization)
                 ▼
   Cross-Encoder Reranker (optional, deferred)
                 ▼
     Business Score Booster
  (internal venues ranked above external leads)
                 ▼
            Final Results
   (internal shown normally; external
    clearly badged: unverified, chance-based,
    extra platform fee)
```

---

## Why this is smaller than it looks

The internal half of this pipeline already exists and needs no new backend work:

- `GET /search/hybrid` in `apps/api/app/modules/search/service.py` already computes
  `0.6 * ts_rank(FTS) + 0.4 * (1 - cosine_distance(embedding))`, with automatic fallback to FTS-only
  when embeddings are missing or generation fails.
- `GET /search/fts` and `GET /search/semantic` exist standalone if needed for debugging/comparison.

What's new is: (1) a real frontend page wired to this endpoint, (2) external discovery, (3) the lead/
reservation concept, (4) admin tooling to manage leads manually.

---

## Phase 1 — Internal-only Deep Research page

**Scope:** Make the existing dead CTA buttons functional with zero backend changes.

- New page `apps/user-web/src/pages/DeepResearch.tsx`: prompt textarea + submit button.
- On submit → `GET /search/hybrid?q=...` via a new `packages/api-client/src/endpoints/deepResearch.ts`
  (or reuse the existing search endpoint file).
- "Load more" → same endpoint, `page + 1`. No new ranking logic required.
- New route `/deep-research` in `apps/user-web/src/routes.tsx` (protected — requires login, since a
  query history is being built for Phase 2/3).
- Wire the three existing dead buttons to `navigate('/deep-research')`:
  - `apps/user-web/src/components/home/HomeLandingSections.tsx` (`DeepResearchSection`)
  - `apps/user-web/src/components/home/HeroSearch.tsx`
  - `apps/user-web/src/components/home/SearchSidebar.tsx`

**Ships independently.** No migration, no new tables, no scraper dependency.

---

## Phase 2 — External discovery

### New tables

```python
class DeepResearchQuery(Base):
    __tablename__ = "deep_research_queries"

    id: UUID (pk)
    user_id: UUID (fk profiles.id)
    query_text: Text
    city_filter: Text | None
    created_at: DateTime
```

```python
class ExternalVenueLead(Base):
    __tablename__ = "external_venue_leads"

    id: UUID (pk)
    discovered_via_query_id: UUID (fk deep_research_queries.id)
    source: Text                 # e.g. "google_places"
    source_ref: Text             # provider place id / URL
    name: Text
    city: Text
    category_guess: Text | None
    raw_contact_info: JSONB      # phone, address, website — admin-only visibility
    status: Text                 # discovered | contacted | onboarded | rejected
    created_at: DateTime
    updated_at: DateTime
```

### Discovery flow (async, mirrors existing search-indexing job pattern)

```text
"Fetch more (external)" click
        │
        ▼
POST /deep-research/external  { query_id }
        │
        ▼
Create job row + push to Upstash
        │
        ▼
Worker (apps/api/app/jobs/, registered in scheduler.py)
        │
        ├── Call external_source.py (licensed data API)
        ├── Normalize results → external_venue_leads
        └── Mark job completed / failed (+ retry, same backoff as search_indexer)
        │
        ▼
Frontend polls GET /deep-research/external/{job_id} until completed
```

Reuses the exact durability pattern already proven in `search_index_jobs` +
`apps/api/app/jobs/search_indexer.py` — no new infra concepts, just a new job type.

### Ranking additions

- **Dedup:** normalize `name + city` (lowercase, strip punctuation) to drop external leads that already
  match an internal venue.
- **Business score booster:** internal (platform) venues always rank above external leads at equal
  relevance — external leads only fill in when internal results are exhausted or the user explicitly
  requests "fetch more."
- **Cross-encoder reranker:** explicitly deferred. Simple relevance + business boosting is sufficient
  for launch; revisit only if ranking quality complaints arise.

### Frontend

- External results rendered in a visually distinct section with mandatory disclaimer copy: *"Not
  verified on Venue404. Reservation is a request only, subject to availability, and includes an
  additional platform fee."*
- Raw contact info (`raw_contact_info`) is **never** sent to the user-web client — only name, city,
  category, and a "Reserve" action.

---

## Phase 3 — Reservation + admin middleman workflow

### New table

```python
class LeadReservation(Base):
    __tablename__ = "lead_reservations"

    id: UUID (pk)
    lead_id: UUID (fk external_venue_leads.id)
    user_id: UUID (fk profiles.id)
    status: Text              # requested | admin_contacted | owner_confirmed | declined | expired
    platform_fee_paise: BigInteger
    event_date: Date | None
    notes: Text | None
    created_at: DateTime
    updated_at: DateTime
```

Deliberately **not** reusing the `bookings` table or its state machine
(`requested → accepted → confirmed → ...`). That state machine encodes hard invariants from
CLAUDE.md — token-payment holds, conflict cancellation, one-confirmed-booking-per-slot — which don't
apply to an unverified external venue that hasn't onboarded. Keeping `lead_reservations` separate
avoids corrupting those invariants or accidentally triggering booking-side automation (hold expiry
jobs, payment reminders) for a lead that was never actually confirmed as bookable.

### API

- `POST /deep-research/leads/{lead_id}/reserve` — user reserves a lead (creates `lead_reservations`
  row, `status=requested`).
- Admin endpoints under `app/modules/admin/` (existing module) to list reservations, update status,
  and optionally promote a lead into a real `venues` row once the owner agrees to onboard (kicks off
  standard venue-owner onboarding flow — no shortcut around venue approval rules).

### Admin panel

- New page `apps/admin-panel/src/pages/DeepResearchLeads.tsx` (patterned on existing `Bookings.tsx` /
  `VenueApprovals.tsx`), route `/deep-research-leads`.
- Shows lead + reservation details including contact info (admin-only), lets admin mark
  `admin_contacted` / `owner_confirmed` / `declined`, and link through to "convert to venue" when the
  owner agrees.
- Every status change is written to the existing `admin_actions` append-only audit table (per
  CLAUDE.md Audit Rules) — new audit action types: `lead_contacted`, `lead_onboarded`, `lead_rejected`.

---

## Files touched (by phase)

**Phase 1**
- `apps/user-web/src/pages/DeepResearch.tsx` (new)
- `apps/user-web/src/routes.tsx`
- `apps/user-web/src/components/home/{HomeLandingSections,HeroSearch,SearchSidebar}.tsx`
- `packages/api-client/src/endpoints/deepResearch.ts` (new)

**Phase 2**
- `apps/api/app/modules/deep_research/{models,schemas,routes,service,external_source,ranking}.py` (new module)
- `apps/api/alembic/` new migration (`deep_research_queries`, `external_venue_leads`)
- `apps/api/app/jobs/scheduler.py` (register discovery worker + retry poll)
- `apps/user-web/src/pages/DeepResearch.tsx` ("fetch more" + polling, external result section)

**Phase 3**
- `apps/api/alembic/` new migration (`lead_reservations`)
- `apps/api/app/modules/deep_research/routes.py` (reserve endpoint)
- `apps/api/app/modules/admin/` (lead management endpoints + audit action types)
- `apps/admin-panel/src/pages/DeepResearchLeads.tsx` (new)
- `apps/admin-panel/src/routes.tsx`
- `packages/api-client/src/endpoints/adminDeepResearch.ts` (new)

---

## Risks

- **Legal/ToS risk of scraping.** Recommend a licensed data API (e.g. Google Places Text Search) over
  a raw scraper for `external_source.py` — scraping listing sites risks ToS violations. This is a
  product/legal decision to confirm before Phase 2 implementation.
- **PII/contact-info handling.** Scraped/sourced phone numbers and addresses must stay admin-only
  (`raw_contact_info` never serialized to user-web responses).
- **Parallel state machine confusion.** `lead_reservations` sits deliberately outside the `bookings`
  state machine — module boundaries and naming must keep this unambiguous to avoid future contributors
  wiring booking-side automation (hold expiry, payment reminders) into it by mistake.
- **Async job UX is new on the frontend.** Search indexing today has no frontend consumer; Phase 2 is
  the first user-web flow that must poll a job to completion. Needs a small polling hook, not just
  copy-paste from existing patterns.
- **Cross-encoder reranker deferred.** Do not build until simple relevance + business boosting proves
  insufficient — avoids unnecessary latency/cost (extra model call per candidate) for MVP.

## Non-Negotiable Invariants (extending CLAUDE.md)

- External leads are never shown as bookable/confirmed — always badged unverified with fee disclosure.
- `lead_reservations` is not a `bookings` row and must never transition through booking-specific status
  values (`accepted`, `hold_expired`, `confirmed`, `conflict_canceled`).
- Raw contact info for external leads is admin-visible only, never exposed to end users.
- All admin actions on leads/reservations are appended to `admin_actions`, never updated or deleted.
- Converting a lead into a real venue must go through standard venue approval — no bypass of
  `status = approved` visibility rules.
