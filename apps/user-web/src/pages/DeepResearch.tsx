import { useEffect, useRef, useState } from 'react'
import { useMutation } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { createClient, deepResearchEndpoints } from '@venue404/api-client'
import type { DeepResearchSearchResponse } from '@venue404/api-client'
import {
  ArrowRight,
  AlertTriangle,
  Sparkles,
  MapPin,
  Users,
  Wallet,
  CalendarDays,
  Tag,
  ShieldCheck,
  SearchX,
  Globe2,
} from 'lucide-react'
import { AppNavbar } from '../components/shared/AppNavbar'
import { VenueCard } from '../components/home/VenueCard'
import { StageProgress, type ResearchStage } from '../components/deepResearch/StageProgress'

const EXAMPLE_PROMPTS = [
  'Wedding hall in Bangalore for 300 guests, under 5 lakhs',
  'Pet-friendly rooftop for a birthday this weekend in Chennai',
  'Corporate offsite conference room for 40 people in Hyderabad',
]

// Stages 2 & 3 are a visual choreography synced to the single /search call —
// internal retrieval genuinely happens server-side within that call, but the
// stepper breaks it into perceived steps (matching, ranking) so the reveal
// feels earned rather than instant.
const MATCHING_DELAY_MS = 700
const RANKING_DELAY_MS = 1300

export default function DeepResearch() {
  const client = createClient()
  const navigate = useNavigate()
  const [query, setQuery] = useState('')
  const [stage, setStage] = useState<ResearchStage>('understanding')
  const timers = useRef<ReturnType<typeof setTimeout>[]>([])

  useEffect(() => {
    return () => {
      timers.current.forEach(clearTimeout)
    }
  }, [])

  const searchMutation = useMutation({
    mutationFn: (q: string) => deepResearchEndpoints(client).search(q),
    onSuccess: () => {
      timers.current.push(setTimeout(() => setStage('ranking'), MATCHING_DELAY_MS))
      timers.current.push(setTimeout(() => setStage('done'), RANKING_DELAY_MS))
    },
  })

  function runSearch() {
    if (!query.trim() || searchMutation.isPending) return
    timers.current.forEach(clearTimeout)
    timers.current = []
    setStage('understanding')
    searchMutation.mutate(query.trim())
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    runSearch()
  }

  const result: DeepResearchSearchResponse | undefined = searchMutation.data
  const breakdown = result?.understanding
  const internalVenues = result?.internal_results.items ?? []
  const internalTotal = result?.internal_results.total ?? 0
  const isProcessing = searchMutation.isPending || (searchMutation.isSuccess && stage !== 'done')
  const showResults = stage === 'done' && !!breakdown

  return (
    <div className="min-h-screen bg-white">
      <AppNavbar />

      <section className="relative overflow-hidden bg-gradient-to-br from-[#0b1c19] via-[#0f2920] to-[#163326] py-16 sm:py-20">
        <div
          className="pointer-events-none absolute -top-24 -right-24 h-96 w-96 rounded-full bg-brand-secondary/20 blur-3xl"
          aria-hidden="true"
        />
        <div
          className="pointer-events-none absolute -bottom-20 -left-20 h-72 w-72 rounded-full bg-brand/20 blur-3xl"
          aria-hidden="true"
        />

        <div className="relative mx-auto max-w-2xl px-6 text-center">
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-brand-secondary/30 bg-white/5 px-3.5 py-1.5 text-xs font-semibold text-brand-secondary backdrop-blur-sm">
            <Sparkles className="h-3.5 w-3.5" />
            Deep Research
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl lg:text-[2.75rem]">
            Describe the venue you need.
          </h1>
          <p className="mx-auto mt-3 max-w-lg text-sm leading-relaxed text-zinc-400 sm:text-base">
            We'll search our marketplace first — and go further if you need us to. Not listed
            anywhere else? We'll find it.
          </p>

          <form
            onSubmit={handleSubmit}
            className="group mx-auto mt-9 rounded-2xl border border-white/10 bg-white p-3 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.5)] transition-shadow duration-300 focus-within:shadow-[0_20px_60px_-10px_rgba(64,138,113,0.35)]"
          >
            <textarea
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault()
                  runSearch()
                }
              }}
              placeholder="e.g. Wedding hall in Bangalore for 300 guests, under 5 lakhs..."
              rows={3}
              className="w-full resize-none rounded-xl border-0 px-4 py-3 text-sm text-zinc-900 shadow-none focus:shadow-none"
            />
            <div className="flex flex-col gap-3 px-1 pb-1 pt-1 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex flex-wrap gap-2">
                {EXAMPLE_PROMPTS.map((p) => (
                  <button
                    key={p}
                    type="button"
                    onClick={() => setQuery(p)}
                    className="max-w-[220px] truncate rounded-full border border-zinc-200 px-3 py-1 text-xs text-zinc-500 transition-colors hover:border-brand/40 hover:bg-brand/5 hover:text-brand"
                    title={p}
                  >
                    {p}
                  </button>
                ))}
              </div>
              <button
                type="submit"
                disabled={!query.trim() || isProcessing}
                className="press flex shrink-0 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-brand to-brand-secondary px-6 py-2.5 text-sm font-bold text-white shadow-lg shadow-brand/20 transition-all hover:shadow-brand/30 disabled:cursor-not-allowed disabled:opacity-50 disabled:shadow-none"
              >
                Start Deep Research
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </form>

          {isProcessing && (
            <div className="page-enter mt-8 text-left">
              <StageProgress current={stage} />
            </div>
          )}

          {searchMutation.isError && (
            <div className="page-enter mt-8 flex items-start gap-3 rounded-2xl border border-red-400/20 bg-red-500/10 p-5 text-left">
              <AlertTriangle className="h-5 w-5 shrink-0 text-red-400" />
              <div>
                <p className="text-sm font-semibold text-red-300">Something went wrong</p>
                <p className="mt-0.5 text-xs text-red-300/70">
                  We couldn't understand that request. Please try again.
                </p>
              </div>
            </div>
          )}
        </div>
      </section>

      {showResults && breakdown && (
        <section className="mx-auto max-w-5xl px-6 py-12">
          <div className="mx-auto max-w-2xl">
            <div className="card-enter rounded-2xl border border-zinc-100 bg-white p-7 shadow-[0_1px_3px_rgba(0,0,0,0.05)] ring-1 ring-zinc-100">
              <div className="mb-6 flex items-center gap-2.5">
                <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand/10 text-brand">
                  <ShieldCheck className="h-4 w-4" />
                </span>
                <div>
                  <p className="text-sm font-semibold text-zinc-900">Here's what we understood</p>
                  <p className="text-xs text-zinc-400">Matched against our verified catalog below</p>
                </div>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <Field icon={Sparkles} label="Intent" value={breakdown.intent} />
                <Field icon={MapPin} label="City" value={breakdown.city} />
                <Field icon={Tag} label="Venue type" value={breakdown.venue_type} />
                <Field
                  icon={Users}
                  label="Capacity"
                  value={breakdown.capacity != null ? `${breakdown.capacity} guests` : null}
                />
                <Field icon={Wallet} label="Budget" value={breakdown.budget_hint} />
                <Field icon={CalendarDays} label="Date" value={breakdown.date_hint} />
              </div>

              {breakdown.required_amenities.length > 0 && (
                <div className="mt-5 border-t border-zinc-100 pt-5">
                  <p className="mb-2.5 text-[11px] font-bold uppercase tracking-widest text-zinc-400">
                    Required amenities
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {breakdown.required_amenities.map((tag) => (
                      <span
                        key={tag}
                        className="rounded-full border border-brand/15 bg-brand/5 px-3 py-1 text-xs font-medium capitalize text-brand"
                      >
                        {tag.replace(/_/g, ' ')}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {breakdown.special_requirements.length > 0 && (
                <div className="mt-5 border-t border-zinc-100 pt-5">
                  <p className="mb-2.5 text-[11px] font-bold uppercase tracking-widest text-zinc-400">
                    Other requirements
                  </p>
                  <ul className="space-y-1.5">
                    {breakdown.special_requirements.map((req) => (
                      <li key={req} className="flex items-start gap-2 text-sm text-zinc-700">
                        <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-zinc-400" />
                        {req}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>

          {/* ── Internal catalog results ─────────────────────────────── */}
          <div className="mt-10">
            <div className="mb-5 flex items-center justify-between">
              <h2 className="text-lg font-bold text-zinc-900">
                {internalVenues.length > 0
                  ? `${internalTotal} venue${internalTotal === 1 ? '' : 's'} in our catalog`
                  : 'Nothing matched in our catalog'}
              </h2>
            </div>

            {internalVenues.length > 0 ? (
              <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {internalVenues.map((venue) => (
                  <div key={venue.id} className="card-enter">
                    <VenueCard venue={venue} onClick={() => navigate(`/venues/${venue.id}`)} />
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center gap-3 rounded-2xl border border-dashed border-zinc-200 py-16 text-center">
                <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-zinc-100 text-zinc-300">
                  <SearchX className="h-5 w-5" />
                </span>
                <p className="text-sm font-semibold text-zinc-900">No venues matched yet</p>
                <p className="max-w-xs text-sm text-zinc-400">
                  Try widening your search, or let us look beyond our marketplace.
                </p>
              </div>
            )}

            {/* Phase 2 (external discovery) is a teammate's in-progress
                endpoint — POST /api/deep-research/external {query_id}. Wired
                as a disabled placeholder here so the UI is ready the moment
                it ships. */}
            <div className="mt-8 flex flex-col items-center gap-2 rounded-2xl border border-zinc-100 bg-zinc-50/60 p-6 text-center">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-zinc-400 ring-1 ring-zinc-100">
                <Globe2 className="h-4 w-4" />
              </span>
              <p className="text-sm font-semibold text-zinc-900">Still not finding the right fit?</p>
              <p className="max-w-sm text-xs leading-relaxed text-zinc-400">
                We can search beyond our marketplace and get back to you with venues that aren't
                listed anywhere else yet.
              </p>
              <button
                type="button"
                disabled
                title="Coming soon"
                className="mt-2 inline-flex items-center gap-2 rounded-xl border border-zinc-200 bg-white px-5 py-2.5 text-sm font-semibold text-zinc-400 opacity-70"
              >
                Search externally
                <span className="rounded-full bg-zinc-100 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-zinc-400">
                  Soon
                </span>
              </button>
            </div>
          </div>
        </section>
      )}
    </div>
  )
}

function Field({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof Sparkles
  label: string
  value: string | null
}) {
  return (
    <div className="flex items-start gap-3 rounded-xl border border-zinc-100 bg-zinc-50/60 p-3.5">
      <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-white text-zinc-400 ring-1 ring-zinc-100">
        <Icon className="h-3.5 w-3.5" />
      </span>
      <div className="min-w-0">
        <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">{label}</p>
        <p className="mt-0.5 truncate text-sm font-medium text-zinc-900">{value ?? '—'}</p>
      </div>
    </div>
  )
}
