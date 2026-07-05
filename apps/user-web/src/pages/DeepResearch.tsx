import { useEffect, useRef, useState } from 'react'
import { useMutation } from '@tanstack/react-query'
import { createClient, deepResearchEndpoints } from '@venue404/api-client'
import type { QueryUnderstanding } from '@venue404/api-client'
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
} from 'lucide-react'
import { AppNavbar } from '../components/shared/AppNavbar'
import { StageProgress, type ResearchStage } from '../components/deepResearch/StageProgress'

const EXAMPLE_PROMPTS = [
  'Wedding hall in Bangalore for 300 guests, under 5 lakhs',
  'Pet-friendly rooftop for a birthday this weekend in Chennai',
  'Corporate offsite conference room for 40 people in Hyderabad',
]

// Stages 2 & 3 are a visual choreography, not real backend work yet — only
// query understanding is implemented. This anticipates the pipeline in
// docs/deep-research-architecture.md (internal retrieval + ranking land in
// later phases) so the reveal feels earned rather than instant.
const MATCHING_DELAY_MS = 700
const RANKING_DELAY_MS = 1300

export default function DeepResearch() {
  const client = createClient()
  const [query, setQuery] = useState('')
  const [stage, setStage] = useState<ResearchStage>('understanding')
  const timers = useRef<ReturnType<typeof setTimeout>[]>([])

  useEffect(() => {
    return () => {
      timers.current.forEach(clearTimeout)
    }
  }, [])

  const understandMutation = useMutation({
    mutationFn: (q: string) => deepResearchEndpoints(client).understandQuery(q),
    onSuccess: () => {
      timers.current.push(setTimeout(() => setStage('ranking'), MATCHING_DELAY_MS))
      timers.current.push(setTimeout(() => setStage('done'), RANKING_DELAY_MS))
    },
  })

  function runSearch() {
    if (!query.trim() || understandMutation.isPending) return
    timers.current.forEach(clearTimeout)
    timers.current = []
    setStage('understanding')
    understandMutation.mutate(query.trim())
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    runSearch()
  }

  const breakdown: QueryUnderstanding | undefined = understandMutation.data
  const isProcessing = understandMutation.isPending || (understandMutation.isSuccess && stage !== 'done')
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

          {understandMutation.isError && (
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

      {showResults && (
        <section className="mx-auto max-w-2xl px-6 py-12">
          <div className="card-enter rounded-2xl border border-zinc-100 bg-white p-7 shadow-[0_1px_3px_rgba(0,0,0,0.05)] ring-1 ring-zinc-100">
            <div className="mb-6 flex items-center gap-2.5">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand/10 text-brand">
                <ShieldCheck className="h-4 w-4" />
              </span>
              <div>
                <p className="text-sm font-semibold text-zinc-900">Here's what we understood</p>
                <p className="text-xs text-zinc-400">Review before we search the catalog</p>
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
