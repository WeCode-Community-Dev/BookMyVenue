import { useState, useEffect, useRef } from 'react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import {
  IndianRupee, TrendingUp, Undo2, Wallet, Search, Building2, User,
} from 'lucide-react'
import { createClient, adminFinancialsEndpoints } from '@venue404/api-client'
import type { PlatformLedgerEntry } from '@venue404/api-client'
import { AdminLayout } from '../components/AdminLayout'
import {
  MetricCard, SectionHeader, StatusBadge, EmptyState,
  LoadingScreen, ErrorState, Button,
} from '@venue404/ui'

const api = adminFinancialsEndpoints(createClient())

const PAGE_SIZE = 25
const DEBOUNCE_MS = 350

type TabValue = '' | 'charge' | 'platform_fee' | 'refund' | 'payout'

const TABS: { label: string; value: TabValue }[] = [
  { label: 'All',            value: '' },
  { label: 'Charges',        value: 'charge' },
  { label: 'Platform Fees',  value: 'platform_fee' },
  { label: 'Refunds',        value: 'refund' },
  { label: 'Payouts',        value: 'payout' },
]

function inr(paise: number): string {
  return '₹' + (paise / 100).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}

function entryTypeMeta(type: string, direction: string): { label: string; variant: 'success' | 'warning' | 'danger' | 'info' | 'neutral' } {
  if (type === 'charge' && direction === 'credit')       return { label: 'Charge',       variant: 'success' }
  if (type === 'platform_fee' && direction === 'debit')  return { label: 'Platform Fee', variant: 'warning' }
  if (type === 'refund' && direction === 'debit')        return { label: 'Refund',       variant: 'danger' }
  if (type === 'payout' && direction === 'debit')        return { label: 'Payout',       variant: 'info' }
  return { label: type.replace(/_/g, ' '), variant: 'neutral' }
}

function fmtDateTime(iso: string): string {
  return new Date(iso).toLocaleString('en-IN', {
    year: 'numeric', month: 'short', day: 'numeric',
    hour: '2-digit', minute: '2-digit',
  })
}

export default function Financials() {
  const qc = useQueryClient()

  const [activeTab, setActiveTab]     = useState<TabValue>('')
  const [searchInput, setSearchInput] = useState('')
  const [search, setSearch]           = useState('')
  const [page, setPage]               = useState(1)

  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  function handleSearchChange(value: string) {
    setSearchInput(value)
    if (debounceRef.current) clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => { setSearch(value); setPage(1) }, DEBOUNCE_MS)
  }
  useEffect(() => () => { if (debounceRef.current) clearTimeout(debounceRef.current) }, [])

  const { data: stats } = useQuery({
    queryKey: ['admin', 'financials', 'stats'],
    queryFn: () => api.getStats(),
  })

  const { data, isLoading, error } = useQuery({
    queryKey: ['admin', 'financials', 'ledger', { page, entry_type: activeTab, search }],
    queryFn: () => api.listLedger({
      page,
      page_size: PAGE_SIZE,
      entry_type: activeTab || undefined,
      search: search.trim() || undefined,
    }),
  })

  const items      = data?.items ?? []
  const total      = data?.total ?? 0
  const totalPages = data?.total_pages ?? 1
  const hasFilters = !!(searchInput || activeTab)

  const invalidateLedger = () => qc.invalidateQueries({ queryKey: ['admin', 'financials'] })

  return (
    <AdminLayout pageTitle="Financials" pageSubtitle="Platform revenue, fees, and money movement across the marketplace">

      {/* Metric strip */}
      <div className="mb-5 grid grid-cols-2 gap-4 sm:grid-cols-4">
        {[
          { label: 'Gross Volume',       value: stats ? inr(stats.gross_volume_paise) : undefined,     accent: 'brand'   as const, icon: <TrendingUp className="h-4 w-4" />,   description: 'Total charged' },
          { label: 'Platform Revenue',   value: stats ? inr(stats.platform_fees_paise) : undefined,     accent: 'emerald' as const, icon: <IndianRupee className="h-4 w-4" />,  description: 'Commission earned' },
          { label: 'Refunds Issued',     value: stats ? inr(stats.refunds_issued_paise) : undefined,    accent: 'rose'    as const, icon: <Undo2 className="h-4 w-4" />,        description: 'Returned to customers' },
          { label: 'Payouts Completed',  value: stats ? inr(stats.payouts_completed_paise) : undefined, accent: 'violet'  as const, icon: <Wallet className="h-4 w-4" />,       description: 'Paid out to owners' },
        ].map((m, i) => (
          <div key={m.label} className="card-enter" style={{ '--index': i } as React.CSSProperties}>
            <MetricCard
              label={m.label}
              value={m.value ?? '—'}
              description={m.description}
              icon={m.icon}
              accent={m.accent}
            />
          </div>
        ))}
      </div>

      {/* Main card */}
      <div className="card-enter rounded-xl border border-zinc-200 bg-white shadow-sm" style={{ '--index': 4 } as React.CSSProperties}>

        {/* Header + tabs */}
        <div className="border-b border-zinc-100 px-5 pt-4">
          <SectionHeader
            title="Ledger"
            description={
              !isLoading && data
                ? `${total.toLocaleString()} ${total === 1 ? 'entry' : 'entries'}${hasFilters ? ' matching filters' : ''}`
                : undefined
            }
          />

          {/* Tabs */}
          <div className="mt-3 flex items-center gap-0.5 border-b border-zinc-100 -mx-5 px-5">
            {TABS.map((tab) => {
              const isActive = activeTab === tab.value
              return (
                <button
                  key={tab.value}
                  type="button"
                  onClick={() => { setActiveTab(tab.value); setPage(1) }}
                  className={[
                    'relative px-3.5 py-2.5 text-sm font-medium transition-colors focus:outline-none',
                    isActive
                      ? 'text-zinc-900 after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:rounded-full after:bg-brand'
                      : 'text-zinc-400 hover:text-zinc-600',
                  ].join(' ')}
                >
                  {tab.label}
                </button>
              )
            })}
          </div>

          {/* Search */}
          <div className="mt-3 mb-4">
            <div className="relative max-w-xs">
              <Search
                className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-zinc-400"
                aria-hidden="true"
              />
              <input
                type="search"
                placeholder="Search by venue or owner…"
                value={searchInput}
                onChange={(e) => handleSearchChange(e.target.value)}
                style={{ paddingLeft: '2.25rem' }}
              />
            </div>
          </div>
        </div>

        {/* Content states */}
        {isLoading && (
          <div className="px-5 py-10">
            <LoadingScreen message="Loading ledger…" fullScreen={false} />
          </div>
        )}

        {!isLoading && error && (
          <div className="px-5 py-10">
            <ErrorState
              title="Could not load financials"
              message={error instanceof Error ? error.message : 'Failed to load ledger'}
              fullScreen={false}
              action={<Button variant="secondary" onClick={invalidateLedger}>Retry</Button>}
            />
          </div>
        )}

        {!isLoading && !error && items.length === 0 && (
          <div className="px-5 py-10">
            <EmptyState
              icon={<IndianRupee className="h-4 w-4" />}
              title="No ledger entries found"
              description={
                hasFilters
                  ? 'Try adjusting the search or filters.'
                  : 'Ledger entries will appear here once bookings start generating payments.'
              }
            />
          </div>
        )}

        {!isLoading && !error && items.length > 0 && (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="border-b border-zinc-100 bg-zinc-50/60">
                  <tr>
                    <th className="px-5 py-3 text-left text-xs font-medium uppercase tracking-wide text-zinc-400">Date</th>
                    <th className="px-5 py-3 text-left text-xs font-medium uppercase tracking-wide text-zinc-400">Type</th>
                    <th className="px-5 py-3 text-left text-xs font-medium uppercase tracking-wide text-zinc-400">Venue</th>
                    <th className="px-5 py-3 text-left text-xs font-medium uppercase tracking-wide text-zinc-400">Owner</th>
                    <th className="px-5 py-3 text-left text-xs font-medium uppercase tracking-wide text-zinc-400">Customer</th>
                    <th className="px-5 py-3 text-right text-xs font-medium uppercase tracking-wide text-zinc-400">Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-50">
                  {items.map((entry) => (
                    <LedgerRow key={entry.id} entry={entry} />
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between border-t border-zinc-100 px-5 py-3 text-xs text-zinc-500">
                <span>
                  {((page - 1) * PAGE_SIZE) + 1}–{Math.min(page * PAGE_SIZE, total)} of {total.toLocaleString()}
                </span>
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

    </AdminLayout>
  )
}

// ── Row ───────────────────────────────────────────────────────────────────────

function LedgerRow({ entry }: { entry: PlatformLedgerEntry }) {
  const meta = entryTypeMeta(entry.entry_type, entry.direction)
  const isCredit = entry.direction === 'credit'
  return (
    <tr className="transition-colors hover:bg-zinc-50/70">
      <td className="px-5 py-3.5">
        <span className="text-xs text-zinc-400">{fmtDateTime(entry.created_at)}</span>
      </td>
      <td className="px-5 py-3.5">
        <StatusBadge label={meta.label} variant={meta.variant} dot={false} />
      </td>
      <td className="px-5 py-3.5">
        <div className="flex items-center gap-2">
          <Building2 className="h-3.5 w-3.5 shrink-0 text-zinc-300" />
          <span className="truncate text-zinc-800">{entry.venue_name ?? '—'}</span>
        </div>
      </td>
      <td className="px-5 py-3.5">
        <div className="flex items-center gap-2">
          <User className="h-3.5 w-3.5 shrink-0 text-zinc-300" />
          <span className="truncate text-zinc-600">{entry.owner_name ?? '—'}</span>
        </div>
      </td>
      <td className="px-5 py-3.5">
        <span className="truncate text-zinc-600">{entry.user_full_name ?? '—'}</span>
      </td>
      <td className="px-5 py-3.5 text-right">
        <span className={`font-medium tabular-nums ${isCredit ? 'text-emerald-600' : 'text-zinc-900'}`}>
          {isCredit ? '+' : '−'}{inr(entry.amount_paise)}
        </span>
      </td>
    </tr>
  )
}
