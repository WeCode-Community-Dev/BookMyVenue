import { useState, useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import { useQuery } from '@tanstack/react-query'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts'
import {
  Sparkles, Search, TrendingUp, Target, X, MapPin, Users, Wallet, CalendarDays, Tag,
} from 'lucide-react'
import { createClient, adminDeepResearchEndpoints } from '@venue404/api-client'
import type { DeepResearchQuerySummary, DeepResearchQueryDetail } from '@venue404/api-client'
import { AdminLayout } from '../components/AdminLayout'
import {
  MetricCard, SectionHeader, EmptyState, LoadingScreen, ErrorState, Button,
} from '@venue404/ui'

const api = adminDeepResearchEndpoints(createClient())
const PAGE_SIZE = 20
const DEBOUNCE_MS = 350

type QueryBreakdown = {
  intent?: string
  city?: string | null
  venue_type?: string | null
  capacity?: number | null
  budget_hint?: string | null
  date_hint?: string | null
  required_amenities?: string[]
  special_requirements?: string[]
}

function pct(value: number | null | undefined) {
  if (value == null) return '—'
  return `${Math.round(Math.max(0, Math.min(1, value)) * 100)}%`
}

function fmtDateTime(iso: string): string {
  return new Date(iso).toLocaleString('en-IN', {
    year: 'numeric', month: 'short', day: 'numeric',
    hour: '2-digit', minute: '2-digit',
  })
}

function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime()
  const mins = Math.floor(diff / 60_000)
  if (mins < 1) return 'just now'
  if (mins < 60) return `${mins}m ago`
  const hrs = Math.floor(mins / 60)
  if (hrs < 24) return `${hrs}h ago`
  const days = Math.floor(hrs / 24)
  return `${days}d ago`
}

export default function DeepResearchInsights() {
  const [searchInput, setSearchInput] = useState('')
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const [detailId, setDetailId] = useState<string | null>(null)

  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  function handleSearchChange(value: string) {
    setSearchInput(value)
    if (debounceRef.current) clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => { setSearch(value); setPage(1) }, DEBOUNCE_MS)
  }
  useEffect(() => () => { if (debounceRef.current) clearTimeout(debounceRef.current) }, [])

  const statsQuery = useQuery({
    queryKey: ['admin', 'deep-research', 'stats'],
    queryFn: () => api.getStats(30),
  })

  const listQuery = useQuery({
    queryKey: ['admin', 'deep-research', 'queries', { page, search }],
    queryFn: () => api.listQueries({ page, page_size: PAGE_SIZE, search: search.trim() || undefined }),
  })

  const stats = statsQuery.data
  const chartData = stats
    ? stats.labels.map((label, i) => ({ label, count: stats.query_counts[i] }))
    : []

  const items = listQuery.data?.items ?? []
  const total = listQuery.data?.total ?? 0
  const totalPages = Math.ceil(total / PAGE_SIZE) || 1

  return (
    <AdminLayout
      pageTitle="Deep Research Insights"
      pageSubtitle="What people are searching, how the model broke it down, and how well it matched"
    >
      {/* Metric strip */}
      <div className="mb-5 grid grid-cols-2 gap-4 sm:grid-cols-4">
        {[
          { label: 'Total queries', value: stats?.total_queries, icon: <Search className="h-4 w-4" />, accent: 'brand' as const, description: 'All time' },
          { label: 'Avg results / query', value: stats ? stats.avg_result_count.toFixed(1) : undefined, icon: <TrendingUp className="h-4 w-4" />, accent: 'emerald' as const, description: 'Internal catalog matches' },
          { label: 'Avg match score', value: stats ? pct(stats.avg_match_score_overall) : undefined, icon: <Target className="h-4 w-4" />, accent: 'violet' as const, description: 'Blended relevance, all-time' },
          { label: 'Last 30 days', value: stats?.query_counts.reduce((a, b) => a + b, 0), icon: <Sparkles className="h-4 w-4" />, accent: 'amber' as const, description: 'Queries this period' },
        ].map((m) => (
          <MetricCard
            key={m.label}
            label={m.label}
            value={m.value !== undefined ? String(m.value) : '—'}
            description={m.description}
            icon={m.icon}
            accent={m.accent}
          />
        ))}
      </div>

      {/* Chart */}
      <div className="mb-5 rounded-xl border border-zinc-200 bg-white shadow-sm">
        <div className="border-b border-zinc-100 px-5 py-4">
          <SectionHeader title="Query volume" description="Last 30 days — daily" />
        </div>
        <div className="h-56 px-2 pb-4 pt-3">
          {statsQuery.isLoading || !stats ? (
            <div className="flex h-full items-center justify-center text-sm text-zinc-400">Loading…</div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 4, right: 16, bottom: 0, left: -8 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f4f4f5" vertical={false} />
                <XAxis dataKey="label" tick={{ fontSize: 10, fill: '#a1a1aa' }} axisLine={false} tickLine={false} interval="preserveStartEnd" />
                <YAxis tick={{ fontSize: 10, fill: '#a1a1aa' }} axisLine={false} tickLine={false} width={28} allowDecimals={false} />
                <Tooltip
                  contentStyle={{ borderRadius: '0.75rem', border: '1px solid #e4e4e7', boxShadow: '0 4px 16px 0 rgba(0,0,0,0.08)', fontSize: 12, padding: '8px 12px' }}
                  labelStyle={{ fontWeight: 600, color: '#18181b', marginBottom: 4 }}
                />
                <Bar dataKey="count" name="Queries" fill="#285A48" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      {/* Recent queries table */}
      <div className="rounded-xl border border-zinc-200 bg-white shadow-sm">
        <div className="border-b border-zinc-100 px-5 pt-4 pb-4">
          <SectionHeader
            title="Recent queries"
            description={!listQuery.isLoading && listQuery.data ? `${total.toLocaleString()} ${total === 1 ? 'query' : 'queries'}` : undefined}
          />
          <div className="relative mt-3 max-w-xs">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-zinc-400" aria-hidden="true" />
            <input
              type="search"
              placeholder="Search query text…"
              value={searchInput}
              onChange={(e) => handleSearchChange(e.target.value)}
              style={{ paddingLeft: '2.25rem' }}
            />
          </div>
        </div>

        {listQuery.isLoading && (
          <div className="px-5 py-10"><LoadingScreen message="Loading queries…" fullScreen={false} /></div>
        )}

        {!listQuery.isLoading && listQuery.error && (
          <div className="px-5 py-10">
            <ErrorState
              title="Could not load queries"
              message={listQuery.error instanceof Error ? listQuery.error.message : 'Failed to load'}
              fullScreen={false}
              action={<Button variant="secondary" onClick={() => listQuery.refetch()}>Retry</Button>}
            />
          </div>
        )}

        {!listQuery.isLoading && !listQuery.error && items.length === 0 && (
          <div className="px-5 py-10">
            <EmptyState
              icon={<Search className="h-4 w-4" />}
              title="No queries found"
              description={search ? 'Try a different search term.' : 'Deep Research queries will appear here once users start searching.'}
            />
          </div>
        )}

        {!listQuery.isLoading && !listQuery.error && items.length > 0 && (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="border-b border-zinc-100 bg-zinc-50/60">
                  <tr>
                    <th className="px-5 py-3 text-left text-xs font-medium uppercase tracking-wide text-zinc-400">Query</th>
                    <th className="px-5 py-3 text-left text-xs font-medium uppercase tracking-wide text-zinc-400">City</th>
                    <th className="px-5 py-3 text-left text-xs font-medium uppercase tracking-wide text-zinc-400">Results</th>
                    <th className="px-5 py-3 text-left text-xs font-medium uppercase tracking-wide text-zinc-400">Match score</th>
                    <th className="px-5 py-3 text-left text-xs font-medium uppercase tracking-wide text-zinc-400">When</th>
                    <th className="px-5 py-3" />
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-50">
                  {items.map((q) => (
                    <QueryRow key={q.id} query={q} onViewDetails={() => setDetailId(q.id)} />
                  ))}
                </tbody>
              </table>
            </div>

            {totalPages > 1 && (
              <div className="flex items-center justify-between border-t border-zinc-100 px-5 py-3 text-xs text-zinc-500">
                <span>{((page - 1) * PAGE_SIZE) + 1}–{Math.min(page * PAGE_SIZE, total)} of {total.toLocaleString()}</span>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    disabled={page <= 1}
                    onClick={() => setPage((p) => p - 1)}
                    className="press rounded-lg border border-zinc-200 bg-white px-3 py-1.5 text-xs font-medium text-zinc-700 transition-colors hover:bg-zinc-50 disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    Previous
                  </button>
                  <span className="tabular-nums">Page {page} of {totalPages}</span>
                  <button
                    type="button"
                    disabled={page >= totalPages}
                    onClick={() => setPage((p) => p + 1)}
                    className="press rounded-lg border border-zinc-200 bg-white px-3 py-1.5 text-xs font-medium text-zinc-700 transition-colors hover:bg-zinc-50 disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {detailId && <QueryDetailModal queryId={detailId} onClose={() => setDetailId(null)} />}
    </AdminLayout>
  )
}

function QueryRow({ query: q, onViewDetails }: { query: DeepResearchQuerySummary; onViewDetails: () => void }) {
  return (
    <tr className="transition-colors hover:bg-zinc-50/70">
      <td className="px-5 py-3.5 max-w-xs">
        <span className="truncate block font-medium text-zinc-900" title={q.query_text}>{q.query_text}</span>
      </td>
      <td className="px-5 py-3.5 text-zinc-600">{q.city_filter ?? '—'}</td>
      <td className="px-5 py-3.5 tabular-nums text-zinc-600">{q.result_count}</td>
      <td className="px-5 py-3.5 tabular-nums text-zinc-600">{pct(q.avg_match_score)}</td>
      <td className="px-5 py-3.5">
        <span className="text-xs text-zinc-400" title={fmtDateTime(q.created_at)}>{timeAgo(q.created_at)}</span>
      </td>
      <td className="px-5 py-3.5 text-right">
        <button
          type="button"
          onClick={onViewDetails}
          className="press text-xs text-zinc-400 underline underline-offset-2 hover:text-zinc-700 transition-colors"
        >
          Details
        </button>
      </td>
    </tr>
  )
}

function DetailField({ icon: Icon, label, value }: { icon: typeof Sparkles; label: string; value: string | null | undefined }) {
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

function QueryDetailModal({ queryId, onClose }: { queryId: string; onClose: () => void }) {
  const detailQuery = useQuery({
    queryKey: ['admin', 'deep-research', 'query', queryId],
    queryFn: () => api.getQuery(queryId),
  })

  const detail: DeepResearchQueryDetail | undefined = detailQuery.data
  const breakdown = (detail?.understanding_json ?? null) as QueryBreakdown | null

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />

      <div className="relative max-h-[85vh] w-full max-w-lg overflow-y-auto rounded-2xl bg-white shadow-2xl ring-1 ring-zinc-900/5">
        <div className="flex items-start justify-between border-b border-zinc-100 px-6 py-5">
          <div>
            <h3 className="text-base font-semibold text-zinc-900">Query details</h3>
            {detail && <p className="mt-0.5 text-xs text-zinc-500">{fmtDateTime(detail.created_at)}</p>}
          </div>
          <button
            type="button"
            onClick={onClose}
            className="press -mr-1 flex h-8 w-8 items-center justify-center rounded-lg text-zinc-400 transition-colors hover:bg-zinc-100 hover:text-zinc-700"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="space-y-5 px-6 py-5">
          {detailQuery.isLoading && <p className="text-sm text-zinc-400">Loading…</p>}

          {detail && (
            <>
              <div className="rounded-xl border border-zinc-100 bg-zinc-50 px-4 py-3">
                <p className="mb-1 text-[10px] font-semibold uppercase tracking-widest text-zinc-400">Raw query</p>
                <p className="font-medium text-zinc-900">{detail.query_text}</p>
              </div>

              {breakdown && (
                <div>
                  <p className="mb-2.5 text-[11px] font-bold uppercase tracking-widest text-zinc-400">Model breakdown</p>
                  <div className="grid grid-cols-2 gap-3">
                    <DetailField icon={Sparkles} label="Intent" value={breakdown.intent} />
                    <DetailField icon={MapPin} label="City" value={breakdown.city} />
                    <DetailField icon={Tag} label="Venue type" value={breakdown.venue_type} />
                    <DetailField icon={Users} label="Capacity" value={breakdown.capacity != null ? `${breakdown.capacity} guests` : null} />
                    <DetailField icon={Wallet} label="Budget" value={breakdown.budget_hint} />
                    <DetailField icon={CalendarDays} label="Date" value={breakdown.date_hint} />
                  </div>

                  <div className="mt-3 rounded-xl border border-zinc-100 bg-zinc-50/60 p-3.5">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">Required amenities</p>
                    {(breakdown.required_amenities?.length ?? 0) > 0 ? (
                      <div className="mt-2 flex flex-wrap gap-2">
                        {breakdown.required_amenities!.map((tag) => (
                          <span key={tag} className="rounded-full border border-brand/15 bg-brand/5 px-2.5 py-1 text-xs font-medium capitalize text-brand">
                            {tag.replace(/_/g, ' ')}
                          </span>
                        ))}
                      </div>
                    ) : (
                      <p className="mt-1 text-sm text-zinc-400">None detected</p>
                    )}
                  </div>

                  <div className="mt-3 rounded-xl border border-zinc-100 bg-zinc-50/60 p-3.5">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">Special requirements</p>
                    {(breakdown.special_requirements?.length ?? 0) > 0 ? (
                      <ul className="mt-2 space-y-1">
                        {breakdown.special_requirements!.map((req) => (
                          <li key={req} className="flex items-start gap-2 text-sm text-zinc-700">
                            <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-zinc-400" />
                            {req}
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="mt-1 text-sm text-zinc-400">None detected</p>
                    )}
                  </div>
                </div>
              )}

              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-xl border border-zinc-100 px-4 py-3">
                  <p className="text-[10px] font-semibold uppercase tracking-widest text-zinc-400">Results found</p>
                  <p className="mt-1 text-sm font-medium text-zinc-900">{detail.result_count}</p>
                </div>
                <div className="rounded-xl border border-zinc-100 px-4 py-3">
                  <p className="text-[10px] font-semibold uppercase tracking-widest text-zinc-400">Avg match score</p>
                  <p className="mt-1 text-sm font-medium text-zinc-900">{pct(detail.avg_match_score)}</p>
                </div>
              </div>

              {detail.top_results_json && detail.top_results_json.length > 0 && (
                <div>
                  <p className="mb-2.5 text-[11px] font-bold uppercase tracking-widest text-zinc-400">Top results</p>
                  <div className="space-y-2">
                    {detail.top_results_json.map((r) => (
                      <div key={r.id} className="flex items-center justify-between rounded-xl border border-zinc-100 px-4 py-2.5">
                        <span className="truncate text-sm font-medium text-zinc-900">{r.name}</span>
                        <div className="flex shrink-0 items-center gap-2">
                          {r.match_source && (
                            <span className="rounded-full bg-zinc-100 px-2 py-0.5 text-[10px] font-medium capitalize text-zinc-500">
                              {r.match_source}
                            </span>
                          )}
                          <span className="text-xs font-semibold tabular-nums text-zinc-700">{pct(r.match_score)}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>,
    document.body,
  )
}
