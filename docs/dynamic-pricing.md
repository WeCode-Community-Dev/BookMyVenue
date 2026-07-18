# Dynamic Pricing

**Status:** Shipped (rule-based, Phase 1) — verified against code, 2026-07-17. Supersedes `dynamic-pricing-prd.md`, whose "Draft v2" schema is confirmed live in `venue/models.py` (`VenuePricingRule`, `min_price_pct`/`max_price_pct` on `venues`) with matching CHECK constraints.

Owners define percentage-based pricing rules that adjust a venue's base price when a booking matches certain conditions (day of week, date range, time window). Demand-based/ML pricing is explicitly **not** implemented — this is rule-based only, by design, for now.

## 1. Overview

Venues previously had only static pricing: a flat full-day price (`starting_price_paise`) and/or an hourly rate (`hourly_rate_paise`), selected via `pricing_mode`. Dynamic pricing lets owners vary the price by weekend/weekday, special dates, and peak hours — without giving up predictability. The owner's mental model: **"my base price, ± a percentage, for weekends / weekdays / special dates, never outside my min–max bounds."**

## 2. Data model

**`venues` columns:**

| Column | Default | Notes |
|---|---|---|
| `min_price_pct` | 50.00 | Price floor as % of base |
| `max_price_pct` | 200.00 | Price ceiling as % of base (capped at 500 platform-wide) |
| `display_price_min_paise` / `display_price_max_paise` | NULL | Cached listing display range, recomputed transactionally on every rule/bounds write |

**`venue_pricing_rules` table:**

| Column | Notes |
|---|---|
| `days_of_week` | int array, 0=Mon…6=Sun; NULL = any day |
| `start_date` / `end_date` | Inclusive date range; NULL = unbounded |
| `start_time` / `end_time` | Time window for peak-hour rules; NULL = all day |
| `adjustment_type` | `multiplier` \| `fixed_delta` \| `override` — **the owner UI exposes `multiplier` only** in Phase 1 |
| `multiplier` | Required iff `multiplier` type; owner UI shows it as ±% |
| `amount_paise` | Required iff `fixed_delta`/`override` |
| `applies_to` | `full_day` \| `time_slot` \| `both` |
| `priority` | Higher wins — no stacking |
| `source` | `owner` \| `system` — Phase 1 only ever writes `owner`; the column exists so a future demand-based engine needs no migration |

Max 20 active rules per venue (application-enforced).

## 3. Resolution engine

1. Load the venue's active, non-deleted rules, sorted by `priority` DESC, `created_at` DESC (tiebreak).
2. **No stacking.** Exactly one rule — the highest-priority match — applies to any priced unit. If nothing matches, the base price applies. This is what lets a special-date rule override weekend/weekday rules: it simply carries higher priority.
3. **Full-day bookings**: match against the event date (day-of-week + date range; time conditions ignored). Apply the winner to `starting_price_paise`.
4. **Time-slot bookings**: segment at `slot_interval_minutes` granularity; match each segment independently against its date and start time; apply the winner to that segment's prorated base price. A 16:00–20:00 booking with peak pricing from 18:00 only charges peak for 18:00–20:00.
5. **Adjustment math** (integer paise, round half up): `multiplier` → `round(base × multiplier)`; `fixed_delta` → `max(0, base + amount_paise)`; `override` → `amount_paise` replaces the base.
6. **Bounds clamp, always applied last**: `final = clamp(computed, base × min_price_pct/100, base × max_price_pct/100)` — the invariant any future automated pricing must also respect.
7. `spans_next_day` venues: a segment rolling past midnight is matched against the calendar date of its actual start.

## 4. Quoting & booking integration

- **`GET /venues/{id}/quote`** is the single source of truth for price — venue detail page, slot picker, and checkout all call it. No client-side price math.
- **Snapshot at booking creation**: `bookings.quoted_price_paise` / `pricing_breakdown` are computed server-side at booking time and never recomputed afterward — refunds, balance-due, and disputes all read this snapshot, not live rules. See [`booking-lifecycle.md`](./booking-lifecycle.md).
- The server recomputes the quote at booking creation and compares it to the client-submitted expected total; on mismatch (owner edited rules mid-checkout) it rejects with `409 PRICE_CHANGED` and a fresh quote.
- Advance/commission are computed from the final quoted price with no separate logic path.

## 5. Owner rule management

`POST/GET/PATCH/DELETE /venues/{id}/pricing-rules`, plus `GET /venues/{id}/pricing-preview` (owner-facing dry run showing which rule wins, whether the clamp applied, and why). Rule edits take effect immediately for **new quotes only** — existing bookings are untouched by design (the snapshot).

## 6. Customer-facing price display

Prices are computed at read/quote time — **no batch pricing worker, no scheduler**:

- No active rules → listing shows a single base price.
- Active multiplier rules → listing shows the actual achievable range (`display_min`/`display_max`, each clamped by venue bounds), cached on the venue row and updated transactionally on every rule/bounds write — cheap, index-only reads, no cache invalidation logic needed.
- Venue detail page with a date selected, or checkout, calls the quote endpoint directly for the exact price.

## 7. Roadmap (not built)

- **Phase 2** — lead-time rules (early-bird / last-minute) and occupancy-based rules, same table and engine, owner-configured thresholds.
- **Phase 3** — system-generated rules (`source = 'system'`) driven by demand signals (quote-request volume, page views, occupancy of surrounding dates), always inside the owner's Phase-1 min/max bounds. Opt-in per venue. Rating would enter as a base-price *suggestion*, not a live multiplier.

Nothing shipped in Phase 1 requires rework to reach Phase 2/3 — the `source` column and bounds clamp are the only forward-looking pieces, and both are already live.
