import { useState } from 'react'
import { Card, EmptyState, Skeleton } from '@venue404/ui'
import { IndianRupee, TrendingDown, ArrowUpRight, ArrowDownRight, Building2, User, FileText, ArrowRightLeft } from 'lucide-react'
import { createClient } from '@venue404/api-client'
import { paymentEndpoints } from '@venue404/api-client/src/endpoints/payments'
import { Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { Pagination } from '../components/Pagination'

function formatDateTime(isoString: string): string {
  if (!isoString) return '—'
  const date = new Date(isoString)
  return date.toLocaleDateString('en-IN', {
    day: 'numeric', month: 'short', year: 'numeric',
    hour: 'numeric', minute: '2-digit'
  })
}

function inr(paise: number): string {
  return '₹' + (paise / 100).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}

const COL = 'px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-zinc-400 dark:text-zinc-400'
const CELL = 'px-4 py-4 text-sm text-zinc-700 dark:text-zinc-300 align-middle'

export default function Financials() {
  const [tab, setTab] = useState('all')
  const [page, setPage] = useState(1)

  const { data: stats = {
    gross_volume_paise: 0,
    platform_fees_paise: 0,
    refunds_issued_paise: 0,
    net_revenue_paise: 0,
    payouts_completed_paise: 0,
    available_balance_paise: 0,
  }, isLoading: loadingStats } = useQuery({
    queryKey: ['financial-stats'],
    queryFn: async () => {
      const data = await paymentEndpoints(createClient()).getOwnerStats()
      return data || {
        gross_volume_paise: 0,
        platform_fees_paise: 0,
        refunds_issued_paise: 0,
        net_revenue_paise: 0,
        payouts_completed_paise: 0,
        available_balance_paise: 0,
      }
    }
  })

  const { data: ledgerResponse, isLoading: loadingLedger } = useQuery({
    queryKey: ['financial-ledger', tab, page],
    queryFn: async () => {
      const apiTab = tab === 'all' ? undefined : tab
      const data = await paymentEndpoints(createClient()).getOwnerLedger({ entry_type: apiTab, page, per_page: 25 })
      return data
    }
  })

  const entries = ledgerResponse?.items || []
  const totalPages = ledgerResponse?.total_pages || 1

  const TABS = [
    { id: 'all', label: 'All Transactions' },
    { id: 'charge', label: 'Charges' },
    { id: 'platform_fee', label: 'Platform Fees' },
    { id: 'refund', label: 'Refunds' },
  ]

  const getEntryTypeConfig = (type: string, direction: string) => {
    if (type === 'charge' && direction === 'credit') return { bg: 'bg-emerald-50 text-emerald-700 ring-emerald-600/20', label: 'Charge' }
    if (type === 'platform_fee' && direction === 'debit') return { bg: 'bg-amber-50 text-amber-700 ring-amber-600/20', label: 'Platform Fee' }
    if (type === 'platform_fee_reversal' && direction === 'credit') return { bg: 'bg-emerald-50 text-emerald-700 ring-emerald-600/20', label: 'Fee Reversed' }
    if (type === 'refund' && direction === 'debit') return { bg: 'bg-red-50 text-red-700 ring-red-600/10', label: 'Refund' }
    if (type === 'payout' && direction === 'debit') return { bg: 'bg-blue-50 text-blue-700 ring-blue-600/20', label: 'Payout' }
    return { bg: 'bg-zinc-100 dark:bg-ink-800 text-zinc-700 dark:text-zinc-300 ring-zinc-500/10', label: type }
  }

  return (
    <div className="space-y-8 pb-12 max-w-[1400px] mx-auto">
      {/* Industrial Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Main Metric: Net Earnings */}
        <Card className="lg:col-span-2 relative overflow-hidden p-5 border-zinc-200/60 shadow-sm bg-zinc-950 text-white">
          <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
            <IndianRupee className="w-40 h-40" />
          </div>
          <div className="flex items-center gap-3 mb-4 relative z-10">
            <div className="w-9 h-9 rounded-full bg-zinc-800 flex items-center justify-center text-zinc-300 shrink-0">
              <IndianRupee className="h-4 w-4" />
            </div>
            <div>
              <h3 className="text-zinc-400 font-medium text-[10px] uppercase tracking-wider">Net Earnings</h3>
              <p className="text-[10px] text-zinc-500 mt-0.5">Total earnings after deductions</p>
            </div>
          </div>
          <div className="text-3xl md:text-4xl font-light tracking-tight relative z-10 mb-2">
            {loadingStats ? <Skeleton className="h-10 w-40 bg-zinc-800" /> : inr(stats.net_revenue_paise)}
          </div>
        </Card>

        {/* Gross Sales */}
        <Card className="relative overflow-hidden p-5 border-zinc-200/60 shadow-sm flex flex-col">
          <div className="absolute -bottom-4 -right-4 p-4 opacity-[0.03] pointer-events-none text-zinc-900 dark:text-zinc-100">
            <ArrowUpRight className="w-32 h-32" />
          </div>
          <div className="flex items-center gap-3 mb-4 relative z-10">
            <div className="w-9 h-9 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-600 shadow-inner shrink-0">
              <ArrowUpRight className="h-4 w-4" />
            </div>
            <div>
              <h3 className="text-zinc-500 dark:text-zinc-400 font-medium text-[10px] uppercase tracking-wider">Gross Sales</h3>
              <p className="text-[10px] text-zinc-400 mt-0.5">Total booking value</p>
            </div>
          </div>
          <div className="text-2xl font-semibold text-zinc-900 dark:text-zinc-100 tracking-tight relative z-10">
            {loadingStats ? <Skeleton className="h-7 w-28" /> : inr(stats.gross_volume_paise)}
          </div>
        </Card>

        {/* Deductions Stack */}
        <div className="grid grid-rows-2 gap-4 col-span-1">
             {/* Platform Fees */}
            <Card className="relative p-4 border-zinc-200/60 shadow-sm flex items-center justify-between">
                <div>
                    <h3 className="text-zinc-500 dark:text-zinc-400 font-medium text-[10px] uppercase tracking-wider flex items-center gap-1.5">
                        <ArrowDownRight className="w-3 h-3 text-amber-500" /> Service Fees
                    </h3>
                    <div className="text-lg font-semibold text-zinc-800 dark:text-zinc-200 tracking-tight mt-1">
                        {loadingStats ? <Skeleton className="h-6 w-24" /> : inr(stats.platform_fees_paise)}
                    </div>
                </div>
            </Card>

             {/* Refunds */}
             <Card className="relative p-4 border-zinc-200/60 shadow-sm flex items-center justify-between">
                <div>
                    <h3 className="text-zinc-500 dark:text-zinc-400 font-medium text-[10px] uppercase tracking-wider flex items-center gap-1.5">
                        <TrendingDown className="w-3 h-3 text-red-500" /> Refunds Issued
                    </h3>
                    <div className="text-lg font-semibold text-zinc-800 dark:text-zinc-200 tracking-tight mt-1">
                        {loadingStats ? <Skeleton className="h-6 w-24" /> : inr(stats.refunds_issued_paise)}
                    </div>
                </div>
            </Card>
        </div>

      </div>

      {/* Ledger Section */}
      <div className="space-y-6">
        
        {/* Tabs */}
        <div className="border-b border-zinc-200 dark:border-ink-700">
          <nav className="-mb-px flex w-full overflow-x-auto no-scrollbar" aria-label="Tabs">
            {TABS.map(t => (
              <button
                key={t.id}
                onClick={() => {
              setTab(t.id)
              setPage(1)
            }}
                className={`flex-1 whitespace-nowrap py-3 border-b-2 font-medium text-sm transition-all ${
                  tab === t.id
                    ? 'border-brand-500 text-brand-600'
                    : 'border-transparent text-zinc-500 dark:text-zinc-400 hover:text-zinc-700 dark:text-zinc-300 hover:border-zinc-300 dark:border-ink-700 dark:hover:border-ink-700'
                }`}
              >
                {t.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Table */}
        {loadingLedger ? (
          <div className="rounded-xl border border-zinc-200 dark:border-ink-700 bg-white dark:bg-ink-900 shadow-sm overflow-hidden">
            <table className="w-full text-left">
                <thead className="bg-zinc-50 dark:bg-ink-800 border-b border-zinc-200 dark:border-ink-700">
                <tr>
                    {['Date / ID', 'Type', 'Description', 'Reference', 'Amount'].map(h => (
                    <th key={h} className={COL}>{h}</th>
                    ))}
                </tr>
                </thead>
                <tbody className="divide-y divide-zinc-100 dark:divide-ink-800">
                {[1, 2, 3, 4, 5].map(i => (
                    <tr key={i}>
                    <td className={CELL}><Skeleton className="h-4 w-32 mb-2" /><Skeleton className="h-3 w-24" /></td>
                    <td className={CELL}><Skeleton className="h-6 w-24 rounded-full" /></td>
                    <td className={CELL}><Skeleton className="h-4 w-40 mb-2" /><Skeleton className="h-3 w-32" /></td>
                    <td className={CELL}><Skeleton className="h-4 w-24" /></td>
                    <td className={CELL}><Skeleton className="h-5 w-20" /></td>
                    </tr>
                ))}
                </tbody>
            </table>
          </div>
        ) : entries.length === 0 ? (
          <EmptyState
              icon={<ArrowRightLeft className="h-10 w-10 text-zinc-300 dark:text-zinc-600" />}
              title="No transactions found"
              description={`There are no ${tab !== 'all' ? tab : 'ledger'} entries to display.`}
          />
        ) : (
          <div className="rounded-xl border border-zinc-200 dark:border-ink-700 bg-white dark:bg-ink-900 shadow-sm overflow-x-auto">
            <table className="w-full text-left min-w-[720px]">
                <thead className="bg-zinc-50 dark:bg-ink-800 border-b border-zinc-200 dark:border-ink-700">
                <tr>
                    <th className={COL}>Date & Time</th>
                    <th className={COL}>Type</th>
                    <th className={COL}>Description</th>
                    <th className={COL}>Reference</th>
                    <th className={`${COL} text-right`}>Amount</th>
                </tr>
                </thead>
                <tbody className="divide-y divide-zinc-100 dark:divide-ink-800">
                {entries.map(entry => {
                    const isCredit = entry.direction === 'credit'
                    const config = getEntryTypeConfig(entry.entry_type, entry.direction)
                    
                    return (
                    <tr key={entry.id} className="hover:bg-zinc-50/50 dark:hover:bg-ink-800/50 transition-colors group">
                        
                        {/* Date & ID */}
                        <td className={CELL}>
                            <div className="font-medium text-zinc-900 dark:text-zinc-100">{formatDateTime(entry.created_at)}</div>
                            <div className="text-[11px] text-zinc-400 dark:text-zinc-400 font-mono mt-1 flex items-center gap-1 opacity-70 group-hover:opacity-100 transition-opacity">
                                <FileText className="w-3 h-3" />
                                {entry.id.split('-')[0]}...
                            </div>
                        </td>

                        {/* Type */}
                        <td className={CELL}>
                            <span className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset ${config.bg}`}>
                                {config.label}
                            </span>
                        </td>

                        {/* Description (Venue & User) */}
                        <td className={CELL}>
                            {entry.venue_name && (
                                <div className="flex items-center gap-1.5 text-zinc-900 dark:text-zinc-100 font-medium">
                                    <Building2 className="w-3.5 h-3.5 text-zinc-400 dark:text-zinc-400" />
                                    {entry.venue_name}
                                </div>
                            )}
                            {entry.user_full_name && (
                                <div className="flex items-center gap-1.5 text-zinc-500 dark:text-zinc-400 text-xs mt-1">
                                    <User className="w-3 h-3" />
                                    {entry.user_full_name}
                                </div>
                            )}
                        </td>

                        {/* Reference (Booking link + Stripe Ref) */}
                        <td className={CELL}>
                            <Link 
                                to={`/bookings/${entry.booking_id}`}
                                className="text-brand-600 hover:text-brand-700 hover:underline text-xs font-medium transition-colors"
                            >
                                View Booking
                            </Link>
                            {entry.stripe_pi_ref && (
                                <div className="text-[11px] text-zinc-400 dark:text-zinc-400 font-mono mt-1">
                                    {entry.stripe_pi_ref.startsWith('pi_') ? 'Stripe PI' : 'Stripe Ref'}: {entry.stripe_pi_ref.substring(0, 10)}...
                                </div>
                            )}
                        </td>

                        {/* Amount */}
                        <td className={`${CELL} text-right`}>
                            <div className={`font-semibold tracking-tight ${isCredit ? 'text-emerald-600' : 'text-zinc-900 dark:text-zinc-100'}`}>
                                {isCredit ? '+' : '-'}{inr(entry.amount_paise)}
                            </div>
                            <div className="text-[10px] text-zinc-400 dark:text-zinc-400 uppercase tracking-wider mt-0.5">
                                {entry.direction}
                            </div>
                        </td>

                    </tr>
                    )
                })}
                </tbody>
            </table>
            {/* Pagination Controls */}
            <Pagination
              page={page}
              perPage={25}
              total={ledgerResponse?.total || 0}
              totalPages={totalPages}
              setPage={setPage}
            />
          </div>
        )}
      </div>
    </div>
  )
}
