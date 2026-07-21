import { useState, useEffect, useCallback, useRef } from 'react'
import {
  ShieldOff, ShieldCheck, UserCheck, Search,
  Clock, CheckCircle2, XCircle, Users as UsersIcon,
  PhoneCall, BadgeCheck,
} from 'lucide-react'
import { createClient, adminUserEndpoints } from '@venue404/api-client'
import type { AdminUserSummary, AdminUserListResponse, AdminUserStatus, OwnerStats } from '@venue404/api-client'
import { AdminLayout } from '../components/AdminLayout'
import {
  MetricCard, StatusBadge, SectionHeader, EmptyState,
  LoadingScreen, ErrorState, Button, Modal,
} from '@venue404/ui'

const api = adminUserEndpoints(createClient())

const DEBOUNCE_MS = 350

type TabStatus = 'pending' | 'active' | 'rejected' | 'suspended' | ''

const TABS: { label: string; value: TabStatus }[] = [
  { label: 'All',       value: '' },
  { label: 'Pending',   value: 'pending' },
  { label: 'Active',    value: 'active' },
  { label: 'Rejected',  value: 'rejected' },
  { label: 'Suspended', value: 'suspended' },
]

function statusVariant(s: AdminUserStatus): 'success' | 'danger' | 'pending' | 'neutral' {
  if (s === 'active')    return 'success'
  if (s === 'suspended') return 'danger'
  if (s === 'pending')   return 'pending'
  return 'neutral'
}

function initials(u: AdminUserSummary): string {
  if (u.full_name) {
    const parts = u.full_name.trim().split(/\s+/)
    return parts.length >= 2
      ? (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
      : parts[0].slice(0, 2).toUpperCase()
  }
  return u.email?.[0]?.toUpperCase() ?? '?'
}

const AVATAR_COLORS = [
  'bg-brand-light-strong text-brand',
  'bg-violet-100 text-violet-700',
  'bg-amber-100 text-amber-700',
  'bg-emerald-100 text-emerald-700',
  'bg-rose-100 text-rose-700',
  'bg-teal-100 text-teal-700',
]

function avatarColor(id: string): string {
  let hash = 0
  for (const ch of id) hash = (hash * 31 + ch.charCodeAt(0)) >>> 0
  return AVATAR_COLORS[hash % AVATAR_COLORS.length]
}

export default function VenueOwners() {
  const [stats, setStats] = useState<OwnerStats | null>(null)
  const [response, setResponse] = useState<AdminUserListResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const [searchInput, setSearchInput] = useState('')
  const [search, setSearch] = useState('')
  const [activeTab, setActiveTab] = useState<TabStatus>('pending')
  const [page, setPage] = useState(1)

  // Approve
  const [approveTarget, setApproveTarget] = useState<AdminUserSummary | null>(null)
  const [approveLoading, setApproveLoading] = useState(false)
  const [approveError, setApproveError] = useState<string | null>(null)

  // Reject
  const [rejectTarget, setRejectTarget] = useState<AdminUserSummary | null>(null)
  const [rejectReason, setRejectReason] = useState('')
  const [rejectLoading, setRejectLoading] = useState(false)
  const [rejectError, setRejectError] = useState<string | null>(null)

  // Suspend
  const [suspendTarget, setSuspendTarget] = useState<AdminUserSummary | null>(null)
  const [suspendReason, setSuspendReason] = useState('')
  const [suspendLoading, setSuspendLoading] = useState(false)
  const [suspendError, setSuspendError] = useState<string | null>(null)

  // Reactivate
  const [reactivateTarget, setReactivateTarget] = useState<AdminUserSummary | null>(null)
  const [reactivateLoading, setReactivateLoading] = useState(false)
  const [reactivateError, setReactivateError] = useState<string | null>(null)

  // Debounce
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  function handleSearchChange(value: string) {
    setSearchInput(value)
    if (debounceRef.current) clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => {
      setSearch(value)
      setPage(1)
    }, DEBOUNCE_MS)
  }
  useEffect(() => () => { if (debounceRef.current) clearTimeout(debounceRef.current) }, [])

  // Load stats once on mount
  useEffect(() => {
    api.getOwnerStats().then(setStats).catch(() => {})
  }, [])

  const fetchOwners = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await api.listUsers({
        page,
        page_size: 20,
        search: search.trim() || undefined,
        status: activeTab || undefined,
        role: 'venue_owner',
      })
      setResponse(data)
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Failed to load venue owners')
    } finally {
      setLoading(false)
    }
  }, [page, search, activeTab])

  useEffect(() => { fetchOwners() }, [fetchOwners])

  function refreshAll() {
    fetchOwners()
    api.getOwnerStats().then(setStats).catch(() => {})
  }

  // --- Modal helpers ---
  function closeApprove() { setApproveTarget(null); setApproveError(null); setApproveLoading(false) }
  function closeReject()  { setRejectTarget(null); setRejectReason(''); setRejectError(null); setRejectLoading(false) }
  function closeSuspend() { setSuspendTarget(null); setSuspendReason(''); setSuspendError(null); setSuspendLoading(false) }
  function closeReactivate() { setReactivateTarget(null); setReactivateError(null); setReactivateLoading(false) }

  async function handleApprove() {
    if (!approveTarget) return
    setApproveLoading(true); setApproveError(null)
    try {
      await api.approveOwner(approveTarget.id)
      closeApprove(); refreshAll()
    } catch (e: unknown) {
      setApproveError(e instanceof Error ? e.message : 'Failed to approve owner')
    } finally { setApproveLoading(false) }
  }

  async function handleReject() {
    if (!rejectTarget) return
    setRejectLoading(true); setRejectError(null)
    try {
      await api.rejectOwner(rejectTarget.id, { reason: rejectReason.trim() || undefined })
      closeReject(); refreshAll()
    } catch (e: unknown) {
      setRejectError(e instanceof Error ? e.message : 'Failed to reject application')
    } finally { setRejectLoading(false) }
  }

  async function handleSuspend() {
    if (!suspendTarget) return
    if (!suspendReason.trim()) { setSuspendError('A reason is required'); return }
    setSuspendLoading(true); setSuspendError(null)
    try {
      await api.suspendUser(suspendTarget.id, { reason: suspendReason.trim() })
      closeSuspend(); refreshAll()
    } catch (e: unknown) {
      setSuspendError(e instanceof Error ? e.message : 'Failed to suspend account')
    } finally { setSuspendLoading(false) }
  }

  async function handleReactivate() {
    if (!reactivateTarget) return
    setReactivateLoading(true); setReactivateError(null)
    try {
      await api.reactivateUser(reactivateTarget.id)
      closeReactivate(); refreshAll()
    } catch (e: unknown) {
      setReactivateError(e instanceof Error ? e.message : 'Failed to reactivate account')
    } finally { setReactivateLoading(false) }
  }

  const pageSize = response?.page_size ?? 20
  const hasFilters = !!(searchInput)

  return (
    <AdminLayout pageTitle="Venue Owners" pageSubtitle="Review applications and manage owner accounts">

      {/* Metric strip */}
      <div className="mb-5 grid grid-cols-2 gap-4 sm:grid-cols-4">
        <div className="card-enter" style={{ '--index': 0 } as React.CSSProperties}>
          <MetricCard
            label="Total Owners"
            value={stats ? String(stats.total) : '—'}
            description="All registered venue owners"
            icon={<UserCheck className="h-4 w-4" />}
            accent="brand"
          />
        </div>
        <div className="card-enter" style={{ '--index': 1 } as React.CSSProperties}>
          <MetricCard
            label="Pending"
            value={stats ? String(stats.pending) : '—'}
            description="Awaiting admin review"
            icon={<Clock className="h-4 w-4" />}
            accent="amber"
          />
        </div>
        <div className="card-enter" style={{ '--index': 2 } as React.CSSProperties}>
          <MetricCard
            label="Active"
            value={stats ? String(stats.active) : '—'}
            description="Approved and operational"
            icon={<BadgeCheck className="h-4 w-4" />}
            accent="emerald"
          />
        </div>
        <div className="card-enter" style={{ '--index': 3 } as React.CSSProperties}>
          <MetricCard
            label="Rejected"
            value={stats ? String(stats.rejected) : '—'}
            description="Application not approved"
            icon={<XCircle className="h-4 w-4" />}
            accent="rose"
          />
        </div>
      </div>

      {/* Table card */}
      <div className="card-enter rounded-xl border border-zinc-200 bg-white shadow-sm" style={{ '--index': 3 } as React.CSSProperties}>

        {/* Header */}
        <div className="border-b border-zinc-100 px-5 pt-4">
          <SectionHeader
            title="Venue owner accounts"
            description={
              !loading && response
                ? `${response.total} ${response.total === 1 ? 'owner' : 'owners'}${hasFilters ? ' matching search' : ''}`
                : undefined
            }
          />

          {/* Status tabs */}
          <div className="mt-3 flex items-center gap-0.5 border-b border-zinc-100 -mx-5 px-5">
            {TABS.map((tab) => {
              const isActive = activeTab === tab.value
              const isPending = tab.value === 'pending'
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
                  {isPending && stats && stats.pending > 0 && (
                    <span className={[
                      'ml-1.5 inline-flex items-center rounded-full px-1.5 py-0.5 text-xs font-semibold tabular-nums',
                      isActive ? 'bg-amber-100 text-amber-700' : 'bg-zinc-100 text-zinc-500',
                    ].join(' ')}>
                      {stats.pending}
                    </span>
                  )}
                </button>
              )
            })}
          </div>

          {/* Search row */}
          <div className="mt-3 mb-4 flex items-center gap-2">
            <div className="relative flex-1 max-w-xs">
              <Search
                className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-zinc-400"
                aria-hidden="true"
              />
              <input
                type="search"
                placeholder="Search by name or email…"
                value={searchInput}
                onChange={(e) => handleSearchChange(e.target.value)}
                style={{ paddingLeft: '2.25rem' }}
              />
            </div>
          </div>
        </div>

        {/* Content states */}
        {loading && (
          <div className="px-5 py-10">
            <LoadingScreen message="Loading venue owners…" fullScreen={false} />
          </div>
        )}

        {!loading && error && (
          <div className="px-5 py-10">
            <ErrorState
              title="Could not load venue owners"
              message={error}
              fullScreen={false}
              action={<Button variant="secondary" onClick={fetchOwners}>Retry</Button>}
            />
          </div>
        )}

        {!loading && !error && response && response.items.length === 0 && (
          <div className="px-5 py-10">
            <EmptyState
              icon={<UsersIcon className="h-4 w-4" />}
              title={activeTab === 'pending' ? 'No pending applications' : 'No venue owners found'}
              description={
                activeTab === 'pending'
                  ? 'All applications have been reviewed.'
                  : hasFilters
                    ? 'Try adjusting the search.'
                    : 'No venue owners have registered yet.'
              }
            />
          </div>
        )}

        {!loading && !error && response && response.items.length > 0 && (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="border-b border-zinc-100 bg-zinc-50/60">
                  <tr>
                    <th className="px-5 py-3 text-left text-xs font-medium uppercase tracking-wide text-zinc-400">Owner</th>
                    <th className="px-5 py-3 text-left text-xs font-medium uppercase tracking-wide text-zinc-400">Phone</th>
                    <th className="px-5 py-3 text-left text-xs font-medium uppercase tracking-wide text-zinc-400">Status</th>
                    <th className="px-5 py-3 text-left text-xs font-medium uppercase tracking-wide text-zinc-400">Applied</th>
                    <th className="px-5 py-3 text-right text-xs font-medium uppercase tracking-wide text-zinc-400">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-50">
                  {response.items.map((user) => (
                    <tr key={user.id} className="transition-colors hover:bg-zinc-50/70">

                      {/* Owner */}
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-3">
                          <span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-semibold ${avatarColor(user.id)}`}>
                            {initials(user)}
                          </span>
                          <div className="min-w-0">
                            <div className="truncate font-medium text-zinc-900">{user.full_name ?? '—'}</div>
                            <div className="truncate text-xs text-zinc-400">{user.email ?? '—'}</div>
                          </div>
                        </div>
                      </td>

                      {/* Phone */}
                      <td className="px-5 py-3.5">
                        {user.phone ? (
                          <span className="flex items-center gap-1.5 text-xs text-zinc-600">
                            <PhoneCall className="h-3 w-3 shrink-0 text-zinc-400" aria-hidden="true" />
                            {user.phone}
                          </span>
                        ) : (
                          <span className="text-xs text-zinc-300">—</span>
                        )}
                      </td>

                      {/* Status */}
                      <td className="px-5 py-3.5">
                        <StatusBadge label={user.status} variant={statusVariant(user.status)} />
                      </td>

                      {/* Applied date */}
                      <td className="px-5 py-3.5 text-xs text-zinc-400">
                        {new Date(user.created_at).toLocaleDateString('en-IN', {
                          year: 'numeric', month: 'short', day: 'numeric',
                        })}
                      </td>

                      {/* Actions */}
                      <td className="px-5 py-3.5 text-right">
                        {user.is_super_admin ? (
                          <StatusBadge label="Protected" variant="neutral" dot={false} />
                        ) : user.status === 'pending' ? (
                          <div className="flex items-center justify-end gap-1">
                            <button
                              type="button"
                              onClick={() => setApproveTarget(user)}
                              className="press inline-flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-xs font-medium text-emerald-600 transition-colors hover:bg-emerald-50"
                            >
                              <CheckCircle2 className="h-3.5 w-3.5" aria-hidden="true" />
                              Approve
                            </button>
                            <button
                              type="button"
                              onClick={() => setRejectTarget(user)}
                              className="press inline-flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-xs font-medium text-red-600 transition-colors hover:bg-red-50"
                            >
                              <XCircle className="h-3.5 w-3.5" aria-hidden="true" />
                              Reject
                            </button>
                          </div>
                        ) : user.status === 'active' ? (
                          <button
                            type="button"
                            onClick={() => setSuspendTarget(user)}
                            className="press inline-flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-xs font-medium text-red-600 transition-colors hover:bg-red-50"
                          >
                            <ShieldOff className="h-3.5 w-3.5" aria-hidden="true" />
                            Suspend
                          </button>
                        ) : user.status === 'suspended' || user.status === 'rejected' ? (
                          <button
                            type="button"
                            onClick={() => setReactivateTarget(user)}
                            className="press inline-flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-xs font-medium text-emerald-600 transition-colors hover:bg-emerald-50"
                          >
                            <ShieldCheck className="h-3.5 w-3.5" aria-hidden="true" />
                            Reactivate
                          </button>
                        ) : null}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {response.total_pages > 1 && (
              <div className="flex items-center justify-between border-t border-zinc-100 px-5 py-3 text-xs text-zinc-500">
                <span>
                  {((page - 1) * pageSize) + 1}–{Math.min(page * pageSize, response.total)} of {response.total}
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
                  <span className="tabular-nums">Page {page} of {response.total_pages}</span>
                  <button
                    type="button"
                    disabled={page >= response.total_pages}
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

      {/* Approve Modal */}
      <Modal open={approveTarget !== null} onClose={closeApprove} className="max-w-md">
        <div className="p-6">
            <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-full bg-emerald-50">
              <CheckCircle2 className="h-5 w-5 text-emerald-600" aria-hidden="true" />
            </div>
            <h3 className="mb-1 text-base font-semibold text-zinc-900">Approve venue owner</h3>
            <p className="mb-5 text-sm text-zinc-500">
              <span className="font-medium text-zinc-800">
                {approveTarget?.full_name ?? approveTarget?.email ?? 'This applicant'}
              </span>{' '}
              will be granted full venue owner access and can start listing venues immediately.
            </p>
            {approveError && (
              <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-2.5 text-sm text-red-700">
                {approveError}
              </div>
            )}
            <div className="flex justify-end gap-2">
              <Button variant="secondary" onClick={closeApprove} disabled={approveLoading}>Cancel</Button>
              <button
                type="button"
                onClick={handleApprove}
                disabled={approveLoading}
                className="press rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition-colors hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {approveLoading ? 'Approving…' : 'Approve owner'}
              </button>
            </div>
          </div>
      </Modal>

      {/* Reject Modal */}
      <Modal open={rejectTarget !== null} onClose={closeReject} className="max-w-md">
        <div className="p-6">
            <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-full bg-red-50">
              <XCircle className="h-5 w-5 text-red-600" aria-hidden="true" />
            </div>
            <h3 className="mb-1 text-base font-semibold text-zinc-900">Reject application</h3>
            <p className="mb-5 text-sm text-zinc-500">
              <span className="font-medium text-zinc-800">
                {rejectTarget?.full_name ?? rejectTarget?.email ?? 'This applicant'}
              </span>{' '}
              will be notified their application was not approved. They can re-apply after reviewing the feedback.
            </p>
            <div>
              <label htmlFor="reject-reason">
                Reason{' '}
                <span className="font-normal text-zinc-400 text-xs">(optional)</span>
              </label>
              <input
                id="reject-reason"
                type="text"
                placeholder="e.g. Incomplete information provided"
                value={rejectReason}
                onChange={(e) => { setRejectReason(e.target.value); setRejectError(null) }}
                autoFocus
              />
              {rejectError && (
                <p className="mt-1.5 text-xs font-medium text-red-500">{rejectError}</p>
              )}
            </div>
            <div className="mt-5 flex justify-end gap-2">
              <Button variant="secondary" onClick={closeReject} disabled={rejectLoading}>Cancel</Button>
              <button
                type="button"
                onClick={handleReject}
                disabled={rejectLoading}
                className="press rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition-colors hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {rejectLoading ? 'Rejecting…' : 'Reject application'}
              </button>
            </div>
          </div>
      </Modal>

      {/* Suspend Modal */}
      <Modal open={suspendTarget !== null} onClose={closeSuspend} className="max-w-md">
        <div className="p-6">
            <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-full bg-red-50">
              <ShieldOff className="h-5 w-5 text-red-600" aria-hidden="true" />
            </div>
            <h3 className="mb-1 text-base font-semibold text-zinc-900">Suspend account</h3>
            <p className="mb-5 text-sm text-zinc-500">
              <span className="font-medium text-zinc-800">
                {suspendTarget?.full_name ?? suspendTarget?.email ?? 'This owner'}
              </span>{' '}
              will immediately lose platform access. Their active venues will be hidden until the account is reactivated.
            </p>
            <div>
              <label htmlFor="suspend-reason">Reason <span className="text-red-500">*</span></label>
              <input
                id="suspend-reason"
                type="text"
                placeholder="e.g. Violation of platform terms"
                value={suspendReason}
                onChange={(e) => { setSuspendReason(e.target.value); setSuspendError(null) }}
                autoFocus
              />
              {suspendError && (
                <p className="mt-1.5 text-xs font-medium text-red-500">{suspendError}</p>
              )}
            </div>
            <div className="mt-5 flex justify-end gap-2">
              <Button variant="secondary" onClick={closeSuspend} disabled={suspendLoading}>Cancel</Button>
              <button
                type="button"
                onClick={handleSuspend}
                disabled={suspendLoading || !suspendReason.trim()}
                className="press rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition-colors hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {suspendLoading ? 'Suspending…' : 'Suspend account'}
              </button>
            </div>
          </div>
      </Modal>

      {/* Reactivate Modal */}
      <Modal open={reactivateTarget !== null} onClose={closeReactivate} className="max-w-md">
        <div className="p-6">
            <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-full bg-emerald-50">
              <ShieldCheck className="h-5 w-5 text-emerald-600" aria-hidden="true" />
            </div>
            <h3 className="mb-1 text-base font-semibold text-zinc-900">Reactivate account</h3>
            <p className="mb-5 text-sm text-zinc-500">
              <span className="font-medium text-zinc-800">
                {reactivateTarget?.full_name ?? reactivateTarget?.email ?? 'This owner'}
              </span>{' '}
              will regain full venue owner access immediately.
            </p>
            {reactivateError && (
              <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-2.5 text-sm text-red-700">
                {reactivateError}
              </div>
            )}
            <div className="flex justify-end gap-2">
              <Button variant="secondary" onClick={closeReactivate} disabled={reactivateLoading}>Cancel</Button>
              <button
                type="button"
                onClick={handleReactivate}
                disabled={reactivateLoading}
                className="press rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition-colors hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {reactivateLoading ? 'Reactivating…' : 'Reactivate account'}
              </button>
            </div>
          </div>
      </Modal>

    </AdminLayout>
  )
}
