# Deep Research

**Status:** Shipped — verified against code, 2026-07-17. Supersedes `deep-research-architecture.md` and `DEEP-RESEARCH-PRD.md` (both incorrectly stated "planned, not yet implemented" / "inert UI" — the module is fully built) and folds in `Venue404_External_Reservation_Onboarding_PRD.md`, which turned out to describe the admin-side extension of this same pipeline rather than a separate feature.

Prompt-driven venue search that combines the platform's own hybrid search with AI-assisted discovery of venues not yet on Venue404, plus an admin workflow to convert that external demand into real, onboarded venues and bookings.

---

## Phase 1 — internal search (query understanding)

`run_search()` in `deep_research/service.py`:

1. **Groq** (`app/infrastructure/llm/groq.py`) parses the free-text prompt into a structured `QueryUnderstanding` (intent, city, venue_type, capacity, budget hint, date hint, required amenities, special requirements) via `understand_query()`.
2. The structured breakdown is merged into a normal search query and passed to **the exact same `search_hybrid()`** used by venue browsing — see [`search.md`](./search.md). There is one ranking implementation for the whole platform, not a separate Deep-Research-specific one.
3. Every query is logged to `deep_research_queries` (prompt text, understanding JSON, result count, average match score, top 5 results) — this is what powers the admin observability page, since match scores are otherwise computed fresh per-request and never persisted anywhere else.

Internal results are genuinely ranked (hybrid FTS + vector + category boost, all from `search_hybrid()`). There is **no additional AI re-ranking on top of that** — the LLM's job here is turning the prompt into search parameters, not scoring results.

---

## Phase 2 — external discovery

Triggered separately (`TriggerExternalDiscoveryRequest`, needs a `query_id` from Phase 1 plus device coordinates), `run_external_discovery()`:

1. Calls the **Google Places API** around the given coordinates for the understood venue type.
2. **Dedupes** each candidate against internal venues using fuzzy name matching (`rapidfuzz.fuzz.token_set_ratio`) combined with a haversine-distance check — a candidate within 200m and >80% name similarity of an existing internal venue is dropped as a duplicate, not surfaced as a "new" lead.
3. Uploads the first Google Places photo to Cloudinary concurrently (`asyncio.gather`) so total wait time is ~1× an upload, not N×. Non-fatal on failure — a lead without a photo is still valid.
4. Bulk-inserts survivors into `external_venue_leads`, capped at `MAX_EXTERNAL_RESULTS = 5`.

**External leads are not ranked or scored** — they're deduped, then returned in whatever order Google Places returned them. This is a different code path from internal search entirely; `DeepResearchSearchResponse.internal_results` (ranked) and the external-leads endpoint are separate calls, not one merged/sorted feed.

Contact info on a lead (`raw_contact_info`, JSONB) is admin-only — never exposed to end users. A customer sees `ExternalLeadPublic`: name, city, address, cover photo, category guess, source, and a disclaimer that it's unverified and reservation is a request only.

---

## Lead reservation → owner onboarding → real booking

This is the piece that used to be its own PRD (`Venue404_External_Reservation_Onboarding_PRD.md`). It's implemented as one continuous status lifecycle on `lead_reservations`, not a separate table or module:

```python
class LeadReservationStatus(enum.StrEnum):
    NEW = "new"
    CONTACTED = "contacted"
    OWNER_INTERESTED = "owner_interested"
    OWNER_INVITED = "owner_invited"
    OWNER_ONBOARDED = "owner_onboarded"
    VENUE_DRAFT_CREATED = "venue_draft_created"
    VENUE_PENDING_APPROVAL = "venue_pending_approval"
    VENUE_APPROVED = "venue_approved"
    BOOKING_CREATED = "booking_created"
    CLOSED = "closed"
    CANCELLED = "cancelled"
    REJECTED = "rejected"
```

1. A customer reserves interest in an external lead (`ReserveLeadRequest`: category, event date, guest count, phone, notes) → `LeadReservation(status=NEW)`.
2. Admin works the lead through the platform-management endpoints in `admin/routes.py`, each backed by `deep_research/service.py`:

   | Endpoint | Effect | New status |
   |---|---|---|
   | `PATCH /admin/external-reservations/{id}/contact` | Records contact method + notes + follow-up date | `CONTACTED` |
   | `PATCH /admin/external-reservations/{id}/mark-interested` | Owner has agreed to join | `OWNER_INTERESTED` |
   | `POST /admin/external-reservations/{id}/invite-owner` | See below | `OWNER_INVITED` |
   | *(owner accepts the invite)* | — | `OWNER_ONBOARDED` |
   | *(owner submits the draft venue)* | Normal venue submission flow | `VENUE_PENDING_APPROVAL` |
   | *(admin approves the venue)* | Normal venue approval flow | `VENUE_APPROVED` |
   | `POST /admin/external-reservations/{id}/create-booking` | Requires owner onboarded + venue approved + no existing booking | `BOOKING_CREATED` |

3. **`invite_owner_for_reservation()`** does four things in one call, requiring the reservation to already be `OWNER_INTERESTED`:
   - Creates a Supabase invite link via the auth provider (`create_invite_link`) — this *is* the invitation email + secure account-setup link, there's no separate email-sending step.
   - Assigns the new profile the `venue_owner` role.
   - Creates a draft `venues` row through the exact same `create_venue()` path an owner uses in the normal Create-Venue wizard — same defaults, same required-fields-later contract. The draft is not a special "lead venue" type; it's an ordinary venue row the owner finishes and submits normally.
   - Links `reservation.owner_id` / `reservation.venue_id`, sets `owner_invited_at`, and writes an `admin_actions` row (`external_reservation_owner_invited`).
4. From that point on, `lead_reservations.owner_id` / `venue_id` / `booking_id` are real FKs into the normal `venue`/`booking` tables — it's an ordinary venue and an ordinary booking, not a special case.
5. `sync_reservation_status_for_venue()` is called from both `venue/service.py` (`submit_venue`) and `admin/service.py` (`approve_venue`) — **on every venue submit/approve on the platform**, not just ones that came from this workflow — to keep `lead_reservations.status` in sync automatically as the venue moves through its normal approval lifecycle.

The admin panel surfaces this as `ExternalReservationSummary`/`ExternalReservationListResponse` (`admin/schemas.py`) — the UI name "External Reservation" and the DB name `LeadReservation` are the same thing.

---

## Design invariants

- External leads never become booking rows directly — they stay in `external_venue_leads`/`lead_reservations` until an admin explicitly walks one through onboarding, so a bad Google Places match can never corrupt the real booking state machine.
- Deep Research reuses `search`, `venue`, `booking`, and `admin` services rather than duplicating their logic — the module's own code is query understanding, external discovery, dedup, and the reservation status lifecycle only.
- Contact info stays admin-only until an owner is actually onboarded.
