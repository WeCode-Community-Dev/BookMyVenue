// ─── Four landing-page sections ───────────────────────────────────────────────
//   1. ProgrammeMetrics  — "What you get back" stats strip
//   2. WhyVenue404       — differentiation pitch
//   3. DeepResearchSection — dark CTA card
//   4. IntelligentPlatform — 6-feature grid

import type { ReactNode } from 'react'
import { useNavigate } from 'react-router-dom'

// ══════════════════════════════════════════════════════════════════════════════
// 1 · What your booking programme gets back
// ══════════════════════════════════════════════════════════════════════════════

const METRICS = [
  { value: '23%',    label: 'saved on average venue spend' },
  { value: '10 hrs', label: 'back per booking, on average' },
  { value: '₹100Cr+', label: 'of events booked through Venue404' },
  { value: '100%',   label: 'verified venues, every listing' },
]

export function ProgrammeMetrics() {
  return (
    <section className="border-y border-zinc-100 bg-zinc-50/60 py-14 sm:py-16 dark:border-ink-800 dark:bg-ink-900/40">
      <div className="mx-auto max-w-5xl px-6">
        <p className="mb-10 text-center text-xs font-semibold uppercase tracking-widest text-zinc-400">
          What your event programme gets back
        </p>
        <div className="grid grid-cols-2 gap-8 sm:grid-cols-4">
          {METRICS.map(({ value, label }) => (
            <div key={label} className="text-center">
              <p className="text-3xl font-bold tracking-tight text-zinc-900 sm:text-4xl dark:text-zinc-100">
                {value}
              </p>
              <p className="mt-2 text-sm leading-snug text-zinc-500">{label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ══════════════════════════════════════════════════════════════════════════════
// 2 · Why Venue404
// ══════════════════════════════════════════════════════════════════════════════

type FeatureRowProps = { icon: ReactNode; title: string; body: string }

function FeatureRow({ icon, title, body }: FeatureRowProps) {
  return (
    <div className="flex items-start gap-5">
      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-brand/10 text-brand">
        {icon}
      </div>
      <div>
        <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">{title}</p>
        <p className="mt-1 text-sm leading-relaxed text-zinc-500">{body}</p>
      </div>
    </div>
  )
}

export function WhyVenue404() {
  return (
    <section className="bg-white py-16 sm:py-24 dark:bg-ink-950">
      <div className="mx-auto max-w-5xl px-6">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-16 lg:items-center">

          {/* Left — copy */}
          <div>
            <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-brand">
              Why Venue404
            </p>
            <h2 className="text-2xl font-bold leading-tight tracking-tight text-zinc-900 sm:text-3xl lg:text-4xl dark:text-zinc-100">
              We don't just list venues.{' '}
              <span className="text-brand">We find, price, and make booking easy.</span>
            </h2>
            <p className="mt-5 text-base leading-relaxed text-zinc-500">
              Other platforms search a database. We search the whole market — including
              venues that aren't yet online — and put a data-backed price on every option
              in seconds. No inbox chaos, no back-and-forth. Just bookings.
            </p>
            <a
              href="#"
              className="mt-7 inline-flex items-center gap-1.5 text-sm font-semibold text-brand transition-colors hover:text-brand-hover"
            >
              See how it works
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </a>
          </div>

          {/* Right — features */}
          <div className="space-y-7">
            <FeatureRow
              icon={
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              }
              title="Know what it costs, right now"
              body="Instant pricing on every venue. No quote requests, no waiting. Compare costs across styles, cities, and capacity in one view."
            />
            <FeatureRow
              icon={
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                </svg>
              }
              title="Any venue, anywhere in India"
              body="We source from our marketplace and beyond — banquet halls, rooftops, lawns, and private estates that never show up on other platforms."
            />
            <FeatureRow
              icon={
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              }
              title="Secure, transparent bookings"
              body="Every venue is verified. Payments are held safely until the owner confirms. Full refund policy if anything goes wrong."
            />
          </div>
        </div>
      </div>
    </section>
  )
}

// ══════════════════════════════════════════════════════════════════════════════
// 3 · Deep Research card
// ══════════════════════════════════════════════════════════════════════════════

export function DeepResearchSection() {
  const navigate = useNavigate()

  return (
    <section className="bg-zinc-50 py-10 sm:py-14 dark:border-y dark:border-ink-800 dark:bg-ink-900/40">
      <div className="mx-auto max-w-5xl px-6">
        <div className="relative overflow-hidden rounded-3xl bg-zinc-900 px-8 py-12 sm:px-14 sm:py-16 dark:bg-ink-900 dark:ring-1 dark:ring-ink-700">

          {/* Background glow blobs */}
          <div className="pointer-events-none absolute -top-20 -right-20 h-72 w-72 rounded-full bg-brand/20 blur-3xl" aria-hidden="true" />
          <div className="pointer-events-none absolute -bottom-16 -left-16 h-56 w-56 rounded-full bg-brand/10 blur-2xl" aria-hidden="true" />

          <div className="relative grid gap-10 lg:grid-cols-2 lg:items-center">

            {/* Copy */}
            <div>
              <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-brand/30 bg-brand/10 px-3.5 py-1.5 text-xs font-semibold text-brand">
                <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                Deep Research
              </div>
              <h2 className="text-2xl font-bold leading-tight text-white sm:text-3xl">
                Other platforms search their database.{' '}
                <span className="text-brand">We search everything.</span>
              </h2>
              <p className="mt-4 text-base leading-relaxed text-zinc-400">
                Tell us what you need. Our deep research team finds any venue — whether
                it's in our marketplace or not. No one else does this.
              </p>
              <button
                type="button"
                onClick={() => navigate('/deep-research')}
                className="mt-8 inline-flex cursor-pointer items-center gap-2 rounded-xl bg-brand px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-brand/20 transition-all hover:bg-brand-hover hover:shadow-brand/30 active:scale-[0.98]"
              >
                Start Deep Research
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-4">
              {[
                { metric: '2,000+',  desc: 'venues sourced outside our marketplace' },
                { metric: '48 hrs',  desc: 'average turnaround for deep research' },
                { metric: '97%',     desc: 'client satisfaction rate on sourced venues' },
                { metric: '₹0',      desc: 'extra cost — included in every account' },
              ].map(({ metric, desc }) => (
                <div key={desc} className="rounded-2xl border border-white/10 bg-white/5 p-5">
                  <p className="text-2xl font-bold text-white">{metric}</p>
                  <p className="mt-1.5 text-xs leading-relaxed text-zinc-400">{desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

// ══════════════════════════════════════════════════════════════════════════════
// 4 · The intelligent venue platform
// ══════════════════════════════════════════════════════════════════════════════

type PlatformFeature = { title: string; body: string; icon: ReactNode }

const PLATFORM_FEATURES: PlatformFeature[] = [
  {
    title: 'Know what it costs, right now',
    body: 'Instant price estimates on every venue. No inbox tennis, no waiting days for a quote.',
    icon: (
      <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
  {
    title: 'Any venue, anywhere',
    body: 'Our marketplace plus our research network covers venues no other platform can show you.',
    icon: (
      <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
  },
  {
    title: 'All your events, one place',
    body: 'Every booking, document, and conversation lives in one dashboard. No more scattered emails.',
    icon: (
      <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
      </svg>
    ),
  },
  {
    title: 'Owner confirmed bookings',
    body: 'No hidden surprises. Owners review and confirm every request within their stated window.',
    icon: (
      <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
  {
    title: 'Concierge support',
    body: 'Real humans available to help source, shortlist, and negotiate on your behalf.',
    icon: (
      <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" />
      </svg>
    ),
  },
  {
    title: 'Full spend visibility',
    body: 'Track every rupee spent on events across bookings, advance payments, and final settlements.',
    icon: (
      <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
      </svg>
    ),
  },
]

export function IntelligentPlatform() {
  return (
    <section className="bg-white py-16 sm:py-24 dark:bg-ink-950">
      <div className="mx-auto max-w-5xl px-6">

        {/* Header */}
        <div className="mb-12 max-w-2xl">
          <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-brand">
            Platform
          </p>
          <h2 className="text-2xl font-bold leading-tight tracking-tight text-zinc-900 sm:text-3xl lg:text-4xl dark:text-zinc-100">
            The intelligent venue platform
          </h2>
          <p className="mt-4 text-base leading-relaxed text-zinc-500">
            We don't just list venues. We research them, price them, and make every
            booking effortless — from first search to final confirmation.
          </p>
        </div>

        {/* Features grid */}
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {PLATFORM_FEATURES.map(({ title, body, icon }) => (
            <div
              key={title}
              className="group rounded-2xl border border-zinc-100 bg-zinc-50/60 p-6 transition-all duration-200 hover:border-brand/20 hover:bg-brand/5 hover:shadow-sm dark:border-ink-800 dark:bg-ink-900/60"
            >
              <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-white shadow-sm text-brand ring-1 ring-zinc-100 transition-all group-hover:bg-brand group-hover:text-white group-hover:shadow-brand/20 dark:bg-ink-800 dark:ring-ink-700">
                {icon}
              </div>
              <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">{title}</p>
              <p className="mt-2 text-sm leading-relaxed text-zinc-500">{body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
