# PRD: Rule-Based Dynamic Pricing for Venue404

| Field | Value |
|---|---|
| Status | Draft v2 |
| Author | — |
| Last updated | 2026-07-02 |
| Target release | Phase 1 (see Rollout) |

**v2 changes:** added owner price bounds (min/max %), Phase 1 UI simplified to percentage rules only, simplified listing price display (no batch worker), added `source` column for future smart pricing, expanded phase roadmap.

---

## 1. Overview

Venue404 currently supports static pricing per venue: a flat full-day price (`starting_price_paise`) and/or an hourly rate (`hourly_rate_paise`), selected via `pricing_mode`. Venue owners cannot vary prices by day of week, season, or time of day, which leaves money on the table during high-demand periods (weekends, wedding season, festivals) and makes venues uncompetitive during off-peak periods.

This PRD introduces **rule-based dynamic pricing**: owners define percentage-based pricing rules that adjust the base price when a booking matches certain conditions (day of week, date range, time window). The system resolves matching rules deterministically — one rule wins by priority — and quotes a final price at booking time, always clamped within owner-defined bounds.

The owner's mental model for Phase 1 is deliberately simple: **"my base price, ± a percentage, for weekends / weekdays / special dates, never outside my min–max bounds."**

Demand-based pricing (occupancy surge, lead-time discounts, smart pricing) is explicitly out of scope for this phase, but the design must not preclude it — see Rollout.

## 2. Goals

1. Owners can charge different prices for weekends vs weekdays via a percentage on their base price.
2. Owners can set special-date pricing for date ranges (wedding season, Diwali, New Year's Eve) that **overrides** weekend/weekday rules via priority.
3. Owners can set peak-hour pricing for time windows on time-slot bookings.
4. Owners define min/max price bounds; no rule can ever push the price outside them.
5. Customers always see the correct final price before paying; the quoted price is immutable once a booking is created.
6. Pricing resolution is deterministic and explainable — an owner can always answer "why was this booking priced at X?"

## 3. Non-Goals (this phase)

- Occupancy/demand/traffic-based surge pricing (Phase 2/3).
- Lead-time (early-bird / last-minute) pricing (Phase 2).
- Rating-based pricing (future; as base-price *suggestions*, not live multipliers).
- Per-guest or capacity-based pricing.
- Promotional codes, coupons, or negotiated quotes.
- Fixed-amount surcharges/overrides in the owner UI (schema supports them; UI exposes percentages only in Phase 1).
- Changes to commission, advance, or refund logic — these compute from the final quoted price exactly as they do from the static price today.

## 4. Background & Current State

The `Venue` model stores:

- `pricing_mode` ∈ {`flat`, `hourly`, `mixed`}
- `starting_price_paise` — full-day price
- `hourly_rate_paise` — per-hour rate for time-slot bookings
- `slot_interval_minutes` — booking granularity (default 30)
- `allowed_booking_types` — `full_day` and/or `time_slot`

All monetary values are integer paise. Bookings derive price from these static fields at creation time.

## 5. User Stories

**Owner**

- As a venue owner, after creating my venue I can set a **weekend %** (e.g., +50%) and a **weekday %** (e.g., −10%) on my base price.
- As a venue owner, I can add a **special-date rule** (e.g., "New Year's Eve +100%", "Wedding season 15 Nov–15 Feb +60%") that automatically overrides my weekend/weekday percentages because it has higher priority.
- As a venue owner, I can add a **peak-hours %** for time-slot bookings (e.g., 18:00–22:00 +25%).
- As a venue owner, I can set **min and max price bounds** (as % of base) so no rule — mine today, or the system's in the future — can price outside that range.
- As a venue owner, I can reorder rule priority, deactivate a rule without deleting it, and preview the computed price for any date/time before saving.

**Customer**

- As a customer browsing listings, I see a single price if the venue has no rules, or a price range (computed from its rules) if it does.
- As a customer who selects a date/time, I see the exact quoted price for that date before I pay the advance.
- As a customer browsing time slots, I can see which slots are more expensive (peak indicator).
- As a customer, the price I was quoted at booking never changes, even if the owner later edits rules.

**Platform**

- Commission (`platform_commission_pct`) and advance (`advance_pct`) are computed from the final quoted price with no changes to existing logic.

## 6. Functional Requirements

### 6.1 Data model

#### New columns on `venues`

| Column | Type | Default | Notes |
|---|---|---|---|
| `min_price_pct` | numeric(5,2) | 50.00 | Price floor as % of base |
| `max_price_pct` | numeric(5,2) | 200.00 | Price ceiling as % of base |
| `display_price_min_paise` | bigint nullable | NULL | Cached listing display range (see 6.6) |
| `display_price_max_paise` | bigint nullable | NULL | Cached listing display range (see 6.6) |

Constraints: `0 < min_price_pct <= 100 <= max_price_pct`, `max_price_pct <= 500` (platform sanity cap).

#### New table `venue_pricing_rules`

| Column | Type | Notes |
|---|---|---|
| `id` | UUID PK | |
| `venue_id` | UUID FK → venues, `ON DELETE CASCADE` | |
| `name` | text, required | Owner-facing label ("Weekend rate") |
| `days_of_week` | int[] nullable | 0=Mon … 6=Sun; NULL = any day |
| `start_date` | date nullable | Inclusive; NULL = no lower bound |
| `end_date` | date nullable | Inclusive; NULL = no upper bound |
| `start_time` | time nullable | Inclusive; NULL = all day |
| `end_time` | time nullable | Exclusive |
| `adjustment_type` | text, required | `multiplier` \| `fixed_delta` \| `override` — **Phase 1 UI exposes `multiplier` only** |
| `multiplier` | numeric(5,2) nullable | Required iff type = multiplier; must be > 0. Owner UI shows this as ±% (1.50 ↔ "+50%") |
| `amount_paise` | bigint nullable | Required iff type = fixed_delta or override; override must be ≥ 0 |
| `applies_to` | text, default `both` | `full_day` \| `time_slot` \| `both` |
| `priority` | int, default 0 | Higher wins |
| `source` | text, default `owner` | `owner` \| `system` — forward-compat for smart pricing; Phase 1 writes `owner` only |
| `is_active` | bool, default true | |
| `deleted_at`, `created_at`, `updated_at` | timestamptz | Soft delete, consistent with existing tables |

**Matching semantics:** every non-NULL condition must be satisfied for the rule to match (AND semantics). NULL means "don't care".

**Constraints:** enforce adjustment payload validity, `start_date <= end_date`, valid enum values via CHECK constraints. Partial index on `(venue_id, priority)` where `deleted_at IS NULL AND is_active = true`.

**Limits:** max **20 active rules per venue** (application-enforced).

**Rule-save validation:** if a rule's multiplier falls outside the venue's `min_price_pct`–`max_price_pct` window, warn the owner at save time ("this +250% rule exceeds your max of 200% and will be capped") rather than surprising them at quote time.

### 6.2 Resolution engine

1. Load the venue's active, non-deleted rules, sorted by `priority` DESC, `created_at` DESC (tiebreak).
2. **No stacking.** Exactly one rule (the highest-priority match) applies to any priced unit. If no rule matches, the base price applies. This is what makes special-date rules override weekend/weekday rules: the special-date rule simply carries higher priority.
3. **Full-day bookings:** the priced unit is the event date. Match rules with `applies_to ∈ {full_day, both}` against the date (day-of-week + date range; time conditions ignored). Apply the winner to `starting_price_paise`.
4. **Time-slot bookings:** segment the booking at `slot_interval_minutes` granularity. For each segment, match rules with `applies_to ∈ {time_slot, both}` against the segment's date and start time. Apply the winner to that segment's base price (`hourly_rate_paise` prorated by segment length). Total = sum of segments. A 16:00–20:00 booking with peak pricing from 18:00 charges peak only for 18:00–20:00.
5. **Adjustment math** (integer paise, round half up):
   - `multiplier`: `round(base × multiplier)`
   - `fixed_delta`: `max(0, base + amount_paise)` — once per booking (not exposed in Phase 1 UI)
   - `override`: `amount_paise` replaces base (not exposed in Phase 1 UI)
6. **Bounds clamp (final step, always):** per priced unit, `final = clamp(computed, base × min_price_pct/100, base × max_price_pct/100)`. This is the invariant that later phases of automated pricing must also respect — the owner's contract that the system never prices outside their range.
7. Enforce `min_booking_duration_minutes`, buffers, and availability exactly as today — pricing does not alter availability logic.
8. **`spans_next_day` venues:** segments rolling past midnight take the calendar date of the segment's actual start; day-of-week and date-range conditions evaluate against that date.

### 6.3 Price quoting & booking integration

- **Quote endpoint** — `GET /venues/{id}/quote?date=&start_time=&end_time=&booking_type=` returns:
  - `total_paise`
  - `breakdown[]`: per-segment (or per-day) base price, applied rule id/name, clamp applied (bool), final price
  - This endpoint is the **single source of truth**; venue detail page, slot picker, and checkout all call it. No client-side price math.
- **Snapshot at booking creation.** New columns on `bookings`:
  - `quoted_total_paise` (bigint, required)
  - `pricing_breakdown` (jsonb, required)
  - Server recomputes the quote at booking creation and compares to the client-submitted expected total; on mismatch (owner edited rules mid-checkout), reject with `409 PRICE_CHANGED` and the fresh quote.
- Advance = `quoted_total_paise × advance_pct`; commission from `quoted_total_paise`. **No recomputation from rules after booking creation, ever** — refunds, balance due, and disputes read the snapshot.

### 6.4 Owner rule management API

- `POST /venues/{id}/pricing-rules` — create (validates payload, rule limit, bounds warning)
- `GET /venues/{id}/pricing-rules` — list, sorted by priority
- `PATCH /venues/{id}/pricing-rules/{rule_id}` — update
- `DELETE /venues/{id}/pricing-rules/{rule_id}` — soft delete
- `PATCH /venues/{id}` — extended to accept `min_price_pct` / `max_price_pct`
- `GET /venues/{id}/pricing-preview?date=&start_time=&end_time=` — owner-facing dry run showing which rule wins, whether the clamp applied, and why
- Authorization: venue owner only; existing owner-auth pattern.
- Rule edits take effect immediately for **new quotes only**; existing bookings untouched (snapshot).
- Every rule write recomputes and stores `display_price_min_paise` / `display_price_max_paise` in the same transaction (see 6.6).

### 6.5 Owner dashboard (UI)

Phase 1 presents pricing as **percentages on the base price** — no raw multipliers, no fixed amounts:

- After venue creation, a "Pricing" section offers: **Weekday %**, **Weekend %**, **Peak hours %** (optional time window), and **Special dates** (add date range + %). Each maps to one `multiplier` rule under the hood with sensible default priorities: special dates (100) > peak hours (75) > weekend/weekday (50).
- **Bounds panel:** "Never price below __% / above __% of my base price," with a live example ("base ₹50,000 → your price always stays between ₹25,000 and ₹1,00,000").
- Rules list with drag-to-reorder priority, active toggle, and plain-language summary per rule ("Sat–Sun · +50% · full day & slots").
- Live preview panel ("A Saturday full-day booking would cost ₹75,000"), including a capped indicator when the clamp bites.
- Conflict hint: when two active rules can match the same date/time, show which wins by priority.

### 6.6 Customer-facing price display (Phase 1 — simple, no workers)

Prices are **computed at read time by the quote engine**; nothing is scheduled, and no per-date prices are ever stored. The only derived data is the listing display range, computed directly from the venue's rules:

- **No active rules** → listing shows the base price as a single number: "₹50,000".
- **Has active multiplier rules** → listing shows the actual achievable range:
  - `display_min = base × min(1.0, lowest active multiplier)`, `display_max = base × max(1.0, highest active multiplier)`, each clamped by the venue bounds.
  - Computed over at most 20 rules — cheap enough at read time, but stored on `display_price_min_paise` / `display_price_max_paise` (updated transactionally on every rule/bounds write) so listing queries stay index-only. **No batch job, no cache invalidation, no scheduler.**
  - Displayed as "₹50,000 – ₹75,000" (or "From ₹{min}" — final call with design).
- **Venue detail page / date selected** → call the quote endpoint for that date/time; show the exact price. Slot picker flags above-base slots as "peak".
- **Checkout** → quote endpoint total + customer-friendly line items (generic labels like "Peak pricing", not internal rule names).

**Known, accepted imprecision:** a seasonal rule (e.g., Diwali +100%) widens the displayed max all year, even when the season is months away. Accepted for Phase 1. Optional cheap refinement if it proves confusing: when computing the range, skip date-range rules whose range doesn't overlap the next 30 days — still read-time, still no worker.

**Important distinction:** the displayed range is the *actual price spread from rules*, NOT the owner's min/max bounds. Bounds are safety clamps (e.g., 50%–200%) and would show a misleadingly wide range.

## 7. Edge Cases & Rules

1. **Rule edited during checkout** → `409 PRICE_CHANGED` with fresh quote (6.3).
2. **Booking crosses midnight** (`spans_next_day`) → segment dates roll over (6.2.8).
3. **Rule pushes price beyond bounds** → clamped (6.2.6); preview and quote breakdown flag `clamped: true`.
4. **Multiplier rule on a venue with no `hourly_rate_paise`** and `applies_to = time_slot` → valid but inert; preview warns.
5. **Overlapping rules with equal priority** → deterministic tiebreak by `created_at` DESC; owner UI nudges toward distinct priorities (defaults in 6.5 avoid this for the common cases).
6. **Deleted/deactivated rule referenced in a booking snapshot** → fine by design; snapshot is self-contained.
7. **Owner tightens bounds after rules exist** → existing rules stay; quotes clamp harder; display range recomputed on the same write.
8. **Timezone**: all date/time matching uses the venue's `timezone`, consistent with availability logic.

## 8. Rollout Plan

**Phase 1 (this PRD) — owner-defined % rules + bounds**
1. Migration: `venue_pricing_rules` table; `venues` columns (`min_price_pct`, `max_price_pct`, display range columns); `bookings.quoted_total_paise` / `pricing_breakdown` (backfill existing bookings from static price).
2. Quote engine + quote endpoint behind a feature flag; shadow-compare against static pricing (identical when no rules exist — regression-safe).
3. Owner CRUD API + dashboard (percentage-based UI, bounds panel, preview).
4. Customer surfaces: listing range/single price, slot peak indicators, checkout breakdown.
5. Pilot cohort of owners → GA.

**Phase 2 — richer owner-configured conditions (future)**
- Lead-time rules: early-bird ("booked 90+ days out: −10%") and last-minute ("within 7 days, date unsold: −20%") as new nullable condition columns on the same table, same engine.
- Occupancy rules: "if ≥70% of this month is booked, +20%" — owner-configured thresholds, computed from existing bookings at quote time.

**Phase 3 — smart pricing (future)**
- System-generated rules (`source = 'system'`) driven by demand signals: quote-request volume, page views/traffic, search impressions, occupancy of surrounding dates. Same table, same engine, always inside the owner's min/max bounds — the bounds set in Phase 1 are the contract that makes automation trustworthy. Opt-in per venue.
- Rating enters as a **base-price suggestion** ("venues rated 4.8+ nearby charge ~20% more — consider raising your base"), not a live multiplier — customers distrust rating-driven price swings.

Nothing in Phase 1 requires rework to reach Phases 2–3; the `source` column and bounds clamp are the only forward-looking additions, and both ship in Phase 1.

## 9. Success Metrics

- % of active venues with ≥1 pricing rule within 60 days of GA (target: 25%).
- Uplift in average booking value on rule-matched bookings vs base-priced bookings.
- Quote-to-booking conversion does not degrade by more than 2% on venues with rules.
- Zero pricing-mismatch incidents (booking charged ≠ snapshot) post-GA.
- % of quotes where the bounds clamp fires (watch metric — high rates mean owners misunderstand the % UI).
- Support tickets tagged "pricing confusion" per 100 bookings (watch metric).

## 10. Open Questions

1. Listing display: single "From ₹X" vs full range "₹X – ₹Y"? (Data is identical; design/trust call.)
2. Default `min_price_pct`/`max_price_pct` values — 50/200 proposed; confirm with owner research.
3. Should Phase 1 skip out-of-window seasonal rules in the display range from day one, or ship the simple version and refine if confusing?
4. `fixed_delta` semantics (per booking vs per segment) — deferred; not exposed in Phase 1 UI, decide before any UI exposes it. Flat surcharges (cleaning, staffing) likely belong in a separate "fees" concept anyway.
5. Customer-facing breakdown labels: generic ("Peak pricing") vs owner rule names? Recommendation: generic.

## 11. Acceptance Criteria (summary)

- [ ] Owner can set weekday %, weekend %, peak-hours %, and special-date % rules; special-date rules override weekend/weekday via default priorities.
- [ ] Owner can set min/max bounds; every quote is clamped within them; breakdown flags clamped units.
- [ ] Rule-save warns when a rule exceeds bounds.
- [ ] Quote endpoint returns correct totals for: no rules, weekend %, special-date override, peak-hour boundary-crossing slot booking, midnight-crossing booking, clamp-triggering rule.
- [ ] Highest-priority single rule wins; no stacking; deterministic tiebreak.
- [ ] Listing shows base price when no rules; correct computed range when rules exist; display columns update transactionally on rule/bounds writes.
- [ ] Booking stores immutable snapshot; later rule edits do not affect it; `409 PRICE_CHANGED` on stale checkout quote.
- [ ] Venues with zero rules price identically to today (regression-safe).
