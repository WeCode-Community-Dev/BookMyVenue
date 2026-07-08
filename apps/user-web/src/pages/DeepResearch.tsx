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
import { MatchBadge } from '../components/deepResearch/MatchCitation'
import { ExternalVenueCard } from '../components/deepResearch/ExternalVenueCard'
import type { ExternalLeadPublic } from '@venue404/api-client'

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

  // External discovery state — simple: idle | locating | loading | completed | failed
  const [extStatus, setExtStatus] = useState<'idle' | 'locating' | 'loading' | 'completed' | 'failed'>('idle')
  const [extLeads, setExtLeads] = useState<ExternalLeadPublic[]>([])
  const [extError, setExtError] = useState<string | null>(null)

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
    
    // reset external state
    setExtStatus('idle')
    setExtLeads([])
    setExtError(null)

    searchMutation.mutate(query.trim())
  }

  function handleTriggerExternal() {
    const queryId = searchMutation.data?.query_id
    if (!queryId) return

    if (!navigator.geolocation) {
      setExtStatus('failed')
      setExtError('Geolocation is not supported by your browser.')
      return
    }

    setExtStatus('locating')
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        setExtStatus('loading')
        try {
          const endpoints = deepResearchEndpoints(client)
          const leads = await endpoints.triggerExternal(
            queryId,
            pos.coords.latitude,
            pos.coords.longitude,
          )
          setExtLeads(leads)
          setExtStatus('completed')
        } catch (err) {
          console.error(err)
          setExtStatus('failed')
          setExtError('External search failed. Please try again.')
        }
      },
      (err) => {
        console.error(err)
        setExtStatus('failed')
        setExtError('Could not get your location. We need it to find venues near you.')
      },
      { timeout: 10000 },
    )
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
    <div className="min-h-screen bg-white dark:bg-ink-950">
      <AppNavbar />

      <section className="relative flex min-h-[calc(100dvh-60px)] items-center overflow-hidden bg-gradient-to-br from-brand-light via-white to-white py-16 sm:py-20 dark:bg-ink-950 dark:from-ink-950 dark:via-ink-950 dark:to-ink-950">
        <div
          className="pointer-events-none absolute -top-24 -right-24 h-96 w-96 rounded-full bg-brand-secondary/30 blur-3xl dark:bg-brand-secondary/20"
          aria-hidden="true"
        />
        <div
          className="pointer-events-none absolute -bottom-20 -left-20 h-72 w-72 rounded-full bg-brand/30 blur-3xl dark:bg-brand/20"
          aria-hidden="true"
        />

        <div className="relative mx-auto w-full max-w-2xl px-6 text-center">
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-brand/20 bg-brand/5 px-3.5 py-1.5 text-xs font-semibold text-brand backdrop-blur-sm dark:border-brand-secondary/30 dark:bg-white/5 dark:text-brand-secondary">
            <Sparkles className="h-3.5 w-3.5" />
            Deep Research
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-zinc-900 sm:text-4xl lg:text-[2.75rem] dark:text-white">
            Describe the venue you need.
          </h1>
          <p className="mx-auto mt-3 max-w-lg text-sm leading-relaxed text-zinc-500 sm:text-base dark:text-zinc-400">
            We'll search our marketplace first — and go further if you need us to. Not listed
            anywhere else? We'll find it.
          </p>

          <form
            onSubmit={handleSubmit}
            className="group mx-auto mt-9 rounded-2xl border border-zinc-200 bg-white p-3 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.15)] transition-shadow duration-300 focus-within:shadow-[0_20px_60px_-10px_rgba(64,138,113,0.25)] dark:border-white/10 dark:shadow-[0_20px_60px_-15px_rgba(0,0,0,0.5)] dark:focus-within:shadow-[0_20px_60px_-10px_rgba(64,138,113,0.35)]"
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
              className="w-full resize-none rounded-xl border-0 bg-transparent px-4 py-3 text-sm text-zinc-900 shadow-none focus:shadow-none"
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
            <div className="page-enter mt-8 flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 p-5 text-left dark:border-red-400/20 dark:bg-red-500/10">
              <AlertTriangle className="h-5 w-5 shrink-0 text-red-600 dark:text-red-400" />
              <div>
                <p className="text-sm font-semibold text-red-700 dark:text-red-300">Something went wrong</p>
                <p className="mt-0.5 text-xs text-red-600/80 dark:text-red-300/70">
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
            <div className="card-enter rounded-2xl border border-zinc-100 bg-white p-7 shadow-[0_1px_3px_rgba(0,0,0,0.05)] ring-1 ring-zinc-100 dark:border-ink-800 dark:bg-ink-900 dark:ring-ink-800">
              <div className="mb-6 flex items-center gap-2.5">
                <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand/10 text-brand dark:bg-brand/15 dark:text-brand-secondary">
                  <ShieldCheck className="h-4 w-4" />
                </span>
                <div>
                  <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">Here's what we understood</p>
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
                <div className="mt-5 border-t border-zinc-100 pt-5 dark:border-ink-800">
                  <p className="mb-2.5 text-[11px] font-bold uppercase tracking-widest text-zinc-400">
                    Required amenities
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {breakdown.required_amenities.map((tag) => (
                      <span
                        key={tag}
                        className="rounded-full border border-brand/15 bg-brand/5 px-3 py-1 text-xs font-medium capitalize text-brand dark:border-brand/25 dark:bg-brand/10 dark:text-brand-secondary"
                      >
                        {tag.replace(/_/g, ' ')}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {breakdown.special_requirements.length > 0 && (
                <div className="mt-5 border-t border-zinc-100 pt-5 dark:border-ink-800">
                  <p className="mb-2.5 text-[11px] font-bold uppercase tracking-widest text-zinc-400">
                    Other requirements
                  </p>
                  <ul className="space-y-1.5">
                    {breakdown.special_requirements.map((req) => (
                      <li key={req} className="flex items-start gap-2 text-sm text-zinc-700 dark:text-zinc-300">
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
              <h2 className="text-lg font-bold text-zinc-900 dark:text-zinc-100">
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
                    <MatchBadge venue={venue} />
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center gap-3 rounded-2xl border border-dashed border-zinc-200 py-16 text-center dark:border-ink-700">
                <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-zinc-100 text-zinc-300 dark:bg-ink-800">
                  <SearchX className="h-5 w-5" />
                </span>
                <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">No venues matched yet</p>
                <p className="max-w-xs text-sm text-zinc-400">
                  Try widening your search, or let us look beyond our marketplace.
                </p>
              </div>
            )}

            {/* ── External discovery results ─────────────────────────────── */}
            {extStatus === 'completed' && extLeads.length > 0 ? (
              <div className="mt-12 border-t border-zinc-100 pt-10 dark:border-ink-800">
                <div className="mb-6 flex items-center justify-between">
                  <div>
                    <h2 className="text-lg font-bold text-zinc-900 dark:text-zinc-100">
                      Discovered externally
                    </h2>
                    <p className="mt-1 text-sm text-zinc-500">
                      We searched beyond our catalog based on your location.
                    </p>
                  </div>
                  <span className="flex items-center gap-1.5 rounded-full border border-orange-200/60 bg-orange-50 px-3 py-1 text-xs font-semibold text-orange-700 dark:border-orange-900/50 dark:bg-orange-950/30 dark:text-orange-400">
                    <Globe2 className="h-3.5 w-3.5" />
                    Web Results
                  </span>
                </div>
                <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                  {extLeads.map((lead) => (
                    <ExternalVenueCard key={lead.id} lead={lead} />
                  ))}
                </div>
              </div>
            ) : extStatus === 'completed' && extLeads.length === 0 ? (
              <div className="mt-8 flex flex-col items-center gap-3 rounded-2xl border border-dashed border-zinc-200 py-10 text-center dark:border-ink-700">
                 <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-zinc-100 text-zinc-400 dark:bg-ink-800">
                  <SearchX className="h-5 w-5" />
                </span>
                <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">No external venues found</p>
                <p className="max-w-xs text-xs text-zinc-400">
                  We searched near you but couldn't find any unlisted venues matching your criteria.
                </p>
              </div>
            ) : (
              <div className="mt-8 flex flex-col items-center gap-2 rounded-2xl border border-zinc-100 bg-zinc-50/60 p-6 text-center transition-all dark:border-ink-800 dark:bg-ink-900/40">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-zinc-400 ring-1 ring-zinc-100 dark:bg-ink-800 dark:ring-ink-700">
                  <Globe2 className={`h-4 w-4 ${['locating', 'loading'].includes(extStatus) ? 'animate-pulse text-brand dark:text-brand-secondary' : ''}`} />
                </span>
                <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                  {extStatus === 'locating' ? 'Getting your location...'
                    : extStatus === 'loading' ? 'Searching externally...'
                    : 'Still not finding the right fit?'}
                </p>
                <p className="max-w-sm text-xs leading-relaxed text-zinc-400">
                  {extError || "We can search beyond our marketplace and find venues that aren't listed anywhere else yet."}
                </p>
                {extStatus === 'idle' || extStatus === 'failed' ? (
                  <button
                    type="button"
                    onClick={handleTriggerExternal}
                    className="mt-2 inline-flex items-center gap-2 rounded-xl bg-white px-5 py-2.5 text-sm font-semibold text-zinc-700 shadow-sm ring-1 ring-inset ring-zinc-300 hover:bg-zinc-50 transition-all hover:text-zinc-900 dark:bg-ink-800 dark:text-zinc-300 dark:ring-ink-700 dark:hover:bg-ink-700 dark:hover:text-zinc-100"
                  >
                    Search externally
                  </button>
                ) : (
                  <div className="mt-4 flex items-center gap-2 text-xs font-semibold text-brand dark:text-brand-secondary animate-pulse">
                    Searching the web — this usually takes ~5 seconds...
                  </div>
                )}
              </div>
            )}
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
    <div className="flex items-start gap-3 rounded-xl border border-zinc-100 bg-zinc-50/60 p-3.5 dark:border-ink-800 dark:bg-ink-900/40">
      <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-white text-zinc-400 ring-1 ring-zinc-100 dark:bg-ink-800 dark:ring-ink-700">
        <Icon className="h-3.5 w-3.5" />
      </span>
      <div className="min-w-0">
        <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">{label}</p>
        <p className="mt-0.5 truncate text-sm font-medium text-zinc-900 dark:text-zinc-100">{value ?? '—'}</p>
      </div>
    </div>
  )
}
