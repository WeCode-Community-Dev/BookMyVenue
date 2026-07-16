import { useState } from 'react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import {
  CheckCircle2, XCircle, ShieldOff, ShieldAlert,
  Sparkles, User, Building2, CalendarDays, ClipboardList,
} from 'lucide-react'
import { createClient, adminActionEndpoints } from '@venue404/api-client'
import type { AdminAction } from '@venue404/api-client'
import { AdminLayout } from '../components/AdminLayout'
import {
  SectionHeader, EmptyState, LoadingScreen, ErrorState, Button,
} from '@venue404/ui'

const api = adminActionEndpoints(createClient())

type TargetTab = 'user' | 'venue' | 'amenity' | ''

const TABS: { label: string; value: TargetTab; icon: React.ReactNode }[] = [
  { label: 'All',       value: '',        icon: <ClipboardList className="h-3.5 w-3.5" /> },
  { label: 'Users',     value: 'user',    icon: <User className="h-3.5 w-3.5" /> },
  { label: 'Venues',    value: 'venue',   icon: <Building2 className="h-3.5 w-3.5" /> },
  { label: 'Amenities', value: 'amenity', icon: <Sparkles className="h-3.5 w-3.5" /> },
]

// ── Action display metadata ───────────────────────────────────────────────────

type ActionMeta = {
  label: string
  icon: React.ReactNode
  color: string
  bg: string
}

function getActionMeta(type: string): ActionMeta {
  if (type === 'admin_password_reset_requested')
    return { label: fmtType(type), icon: <ShieldAlert className="h-3.5 w-3.5" />, color: 'text-red-600', bg: 'bg-red-50' }
  if (type.endsWith('approved') || type.endsWith('reactivated'))
    return { label: fmtType(type), icon: <CheckCircle2 className="h-3.5 w-3.5" />, color: 'text-emerald-700', bg: 'bg-emerald-50' }
  if (type.endsWith('rejected') || type.endsWith('deleted'))
    return { label: fmtType(type), icon: <XCircle className="h-3.5 w-3.5" />, color: 'text-red-600', bg: 'bg-red-50' }
  if (type.endsWith('suspended'))
    return { label: fmtType(type), icon: <ShieldOff className="h-3.5 w-3.5" />, color: 'text-orange-600', bg: 'bg-orange-50' }
  if (type.includes('created') || type.includes('updated'))
    return { label: fmtType(type), icon: <Sparkles className="h-3.5 w-3.5" />, color: 'text-brand', bg: 'bg-brand-light' }
  return { label: fmtType(type), icon: <ClipboardList className="h-3.5 w-3.5" />, color: 'text-zinc-600', bg: 'bg-zinc-100' }
}

function fmtType(type: string): string {
  return type.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())
}

function fmtTargetType(t: string): string {
  if (t === 'user') return 'User'
  if (t === 'venue') return 'Venue'
  if (t === 'amenity') return 'Amenity'
  if (t === 'booking') return 'Booking'
  return t.charAt(0).toUpperCase() + t.slice(1)
}

function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime()
  const mins = Math.floor(diff / 60_000)
  if (mins < 1) return 'just now'
  if (mins < 60) return `${mins}m ago`
  const hrs = Math.floor(mins / 60)
  if (hrs < 24) return `${hrs}h ago`
  const days = Math.floor(hrs / 24)
  if (days < 7) return `${days}d ago`
  return new Date(iso).toLocaleDateString('en-IN', { year: 'numeric', month: 'short', day: 'numeric' })
}

function fmtDate(iso: string): string {
  return new Date(iso).toLocaleString('en-IN', {
    year: 'numeric', month: 'short', day: 'numeric',
    hour: '2-digit', minute: '2-digit',
  })
}

// ── Component ─────────────────────────────────────────────────────────────────

const PAGE_SIZE = 25

export default function AuditLog() {
  const qc = useQueryClient()
  const [activeTab, setActiveTab] = useState<TargetTab>('')
  const [page, setPage] = useState(1)

  const { data, isLoading, error } = useQuery({
    queryKey: ['admin', 'audit-log', { page, target_type: activeTab }],
    queryFn: () => api.listActions({
      page,
      page_size: PAGE_SIZE,
      target_type: activeTab || undefined,
    }),
  })

  const total = data?.total ?? 0
  const totalPages = data?.total_pages ?? 1

  return (
    <AdminLayout
      pageTitle="Audit Log"
      pageSubtitle="Immutable history of all admin actions"
    >
      <div className="card-enter rounded-xl border border-zinc-200 bg-white shadow-sm">

        {/* Header + tabs */}
        <div className="border-b border-zinc-100 px-5 pt-4">
          <SectionHeader
            title="Admin actions"
            description={
              !isLoading && data
                ? `${total.toLocaleString()} ${total === 1 ? 'entry' : 'entries'}`
                : undefined
            }
          />

          <div className="mt-3 flex items-center gap-0.5 border-b border-zinc-100 -mx-5 px-5">
            {TABS.map((tab) => {
              const isActive = activeTab === tab.value
              return (
                <button
                  key={tab.value}
                  type="button"
                  onClick={() => { setActiveTab(tab.value); setPage(1) }}
                  className={[
                    'relative flex items-center gap-1.5 px-3.5 py-2.5 text-sm font-medium transition-colors focus:outline-none',
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
        </div>

        {/* States */}
        {isLoading && (
          <div className="px-5 py-12">
            <LoadingScreen message="Loading audit log…" fullScreen={false} />
          </div>
        )}

        {!isLoading && error && (
          <div className="px-5 py-12">
            <ErrorState
              title="Could not load audit log"
              message={error instanceof Error ? error.message : 'Failed to load audit log'}
              fullScreen={false}
              action={
                <Button variant="secondary" onClick={() => qc.invalidateQueries({ queryKey: ['admin', 'audit-log'] })}>
                  Retry
                </Button>
              }
            />
          </div>
        )}

        {!isLoading && !error && data?.items.length === 0 && (
          <div className="px-5 py-12">
            <EmptyState
              icon={<ClipboardList className="h-4 w-4" />}
              title="No actions yet"
              description={
                activeTab
                  ? `No admin actions recorded for ${fmtTargetType(activeTab).toLowerCase()}s.`
                  : 'Admin actions will appear here once recorded.'
              }
            />
          </div>
        )}

        {!isLoading && !error && data && data.items.length > 0 && (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="border-b border-zinc-100 bg-zinc-50/60">
                  <tr>
                    <th className="px-5 py-3 text-left text-xs font-medium uppercase tracking-wide text-zinc-400">Action</th>
                    <th className="px-5 py-3 text-left text-xs font-medium uppercase tracking-wide text-zinc-400">Target</th>
                    <th className="px-5 py-3 text-left text-xs font-medium uppercase tracking-wide text-zinc-400">Admin</th>
                    <th className="px-5 py-3 text-left text-xs font-medium uppercase tracking-wide text-zinc-400">Reason</th>
                    <th className="px-5 py-3 text-left text-xs font-medium uppercase tracking-wide text-zinc-400">Time</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-50">
                  {data.items.map((action) => (
                    <ActionRow key={action.id} action={action} />
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

// ── Row component ─────────────────────────────────────────────────────────────

function ActionRow({ action }: { action: AdminAction }) {
  const meta = getActionMeta(action.action_type)
  return (
    <tr className="transition-colors hover:bg-zinc-50/60">

      {/* Action */}
      <td className="px-5 py-3.5">
        <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${meta.color} ${meta.bg}`}>
          {meta.icon}
          {meta.label}
        </span>
      </td>

      {/* Target */}
      <td className="px-5 py-3.5">
        <div className="flex items-start gap-1.5">
          <TargetIcon type={action.target_type} />
          <div className="min-w-0">
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="text-xs font-medium text-zinc-500 capitalize">{action.target_type}</span>
              {action.target_name && (
                <span className="text-xs font-medium text-zinc-800">({action.target_name})</span>
              )}
            </div>
            <span
              className="font-mono text-xs text-zinc-400 select-all cursor-text"
              title="Click to select — copy for DB lookup"
            >
              {action.target_id}
            </span>
          </div>
        </div>
      </td>

      {/* Admin */}
      <td className="px-5 py-3.5">
        <span className="text-sm text-zinc-700">
          {action.admin_name ?? <span className="text-zinc-300">—</span>}
        </span>
      </td>

      {/* Reason */}
      <td className="px-5 py-3.5 max-w-sm">
        {action.reason ? (
          <span className="text-sm text-zinc-600 whitespace-normal break-words">
            {action.reason}
          </span>
        ) : (
          <span className="text-xs text-zinc-300">No reason provided</span>
        )}
      </td>

      {/* Time */}
      <td className="px-5 py-3.5">
        <span className="text-xs text-zinc-400" title={fmtDate(action.created_at)}>
          {timeAgo(action.created_at)}
        </span>
      </td>
    </tr>
  )
}

function TargetIcon({ type }: { type: string }) {
  const cls = 'h-3.5 w-3.5 text-zinc-400'
  if (type === 'user')    return <User className={cls} />
  if (type === 'venue')   return <Building2 className={cls} />
  if (type === 'amenity') return <Sparkles className={cls} />
  if (type === 'booking') return <CalendarDays className={cls} />
  return <ClipboardList className={cls} />
}
