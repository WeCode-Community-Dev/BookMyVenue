import { useState, useEffect, useRef } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { ShieldOff, ShieldCheck, Users as UsersIcon, Search, UserCheck, UserX, Clock, CheckCircle2, XCircle } from 'lucide-react'
import { createClient } from '@venue404/api-client'
import { adminUserEndpoints } from '@venue404/api-client'
import type { AdminUserSummary, AdminUserStatus, AdminUserRole } from '@venue404/api-client'
import { AdminLayout } from '../components/AdminLayout'
import {
  MetricCard, StatusBadge, SectionHeader, EmptyState,
  LoadingScreen, ErrorState, Button, Modal,
} from '@venue404/ui'

const api = adminUserEndpoints(createClient())

const DEBOUNCE_MS = 350

function statusVariant(s: AdminUserStatus): 'success' | 'danger' | 'pending' | 'neutral' {
  if (s === 'active') return 'success'
  if (s === 'suspended') return 'danger'
  if (s === 'pending') return 'pending'
  return 'neutral'
}

function roleVariant(r: string): 'info' | 'pending' | 'neutral' {
  if (r === 'super_admin') return 'info'
  if (r === 'venue_owner') return 'pending'
  return 'neutral'
}

function roleLabel(r: string) {
  return r.replace(/_/g, ' ')
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

export default function Users() {
  const qc = useQueryClient()

  const [searchInput, setSearchInput] = useState('')
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<AdminUserStatus | ''>('')
  const [roleFilter, setRoleFilter] = useState<AdminUserRole | ''>('')
  const [page, setPage] = useState(1)

  const [suspendTarget, setSuspendTarget] = useState<AdminUserSummary | null>(null)
  const [suspendReason, setSuspendReason] = useState('')

  const [reactivateTarget, setReactivateTarget] = useState<AdminUserSummary | null>(null)
  const [approveTarget, setApproveTarget] = useState<AdminUserSummary | null>(null)
  const [rejectTarget, setRejectTarget] = useState<AdminUserSummary | null>(null)
  const [rejectReason, setRejectReason] = useState('')

  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  function handleSearchChange(value: string) {
    setSearchInput(value)
    if (debounceRef.current) clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => { setSearch(value); setPage(1) }, DEBOUNCE_MS)
  }
  useEffect(() => () => { if (debounceRef.current) clearTimeout(debounceRef.current) }, [])

  // ── Query ───────────────────────────────────────────────────────────────────

  const { data: response, isLoading, error } = useQuery({
    queryKey: ['admin', 'users', { page, search, status: statusFilter, role: roleFilter }],
    queryFn: () => api.listUsers({
      page,
      page_size: 20,
      search: search.trim() || undefined,
      status: statusFilter || undefined,
      role: roleFilter || undefined,
    }),
  })

  const invalidateUsers = () => qc.invalidateQueries({ queryKey: ['admin', 'users'] })

  // ── Mutations ───────────────────────────────────────────────────────────────

  const suspendMutation = useMutation({
    mutationFn: ({ id, reason }: { id: string; reason: string }) =>
      api.suspendUser(id, { reason }),
    onSuccess: () => { invalidateUsers(); closeSuspendModal() },
  })

  const reactivateMutation = useMutation({
    mutationFn: (id: string) => api.reactivateUser(id),
    onSuccess: () => { invalidateUsers(); closeReactivateModal() },
  })

  const approveMutation = useMutation({
    mutationFn: (id: string) => api.approveOwner(id),
    onSuccess: () => { invalidateUsers(); closeApproveModal() },
  })

  const rejectMutation = useMutation({
    mutationFn: ({ id, reason }: { id: string; reason?: string }) =>
      api.rejectOwner(id, { reason }),
    onSuccess: () => { invalidateUsers(); closeRejectModal() },
  })

  // ── Modal helpers ───────────────────────────────────────────────────────────

  function closeSuspendModal() {
    setSuspendTarget(null)
    setSuspendReason('')
    suspendMutation.reset()
  }

  function closeReactivateModal() {
    setReactivateTarget(null)
    reactivateMutation.reset()
  }

  function closeApproveModal() {
    setApproveTarget(null)
    approveMutation.reset()
  }

  function closeRejectModal() {
    setRejectTarget(null)
    setRejectReason('')
    rejectMutation.reset()
  }

  // ── Handlers ────────────────────────────────────────────────────────────────

  function handleSuspend() {
    if (!suspendTarget || !suspendReason.trim()) return
    suspendMutation.mutate({ id: suspendTarget.id, reason: suspendReason.trim() })
  }

  function handleReactivate() {
    if (!reactivateTarget) return
    reactivateMutation.mutate(reactivateTarget.id)
  }

  function handleApprove() {
    if (!approveTarget) return
    approveMutation.mutate(approveTarget.id)
  }

  function handleReject() {
    if (!rejectTarget) return
    rejectMutation.mutate({ id: rejectTarget.id, reason: rejectReason.trim() || undefined })
  }

  const stats = response?.stats
  const pageSize = response?.page_size ?? 20
  const hasFilters = !!(searchInput || statusFilter || roleFilter)

  return (
    <AdminLayout pageTitle="Users" pageSubtitle="Manage customer and venue owner accounts">

      {/* Metric strip */}
      <div className="mb-5 grid grid-cols-1 gap-4 sm:grid-cols-4">
        <div className="card-enter" style={{ '--index': 0 } as React.CSSProperties}>
          <MetricCard
            label="Total Users"
            value={stats ? String(stats.total) : '—'}
            description="Non-deleted accounts"
            icon={<UsersIcon className="h-4 w-4" />}
            accent="brand"
          />
        </div>
        <div className="card-enter" style={{ '--index': 1 } as React.CSSProperties}>
          <MetricCard
            label="Active"
            value={stats ? String(stats.active) : '—'}
            description="Currently able to log in"
            icon={<UserCheck className="h-4 w-4" />}
            accent="emerald"
          />
        </div>
        <div className="card-enter" style={{ '--index': 2 } as React.CSSProperties}>
          <MetricCard
            label="Pending Owners"
            value={stats ? String(stats.pending) : '—'}
            description="Awaiting admin approval"
            icon={<Clock className="h-4 w-4" />}
            accent="amber"
          />
        </div>
        <div className="card-enter" style={{ '--index': 3 } as React.CSSProperties}>
          <MetricCard
            label="Suspended"
            value={stats ? String(stats.suspended) : '—'}
            description="Locked from platform access"
            icon={<UserX className="h-4 w-4" />}
            accent="rose"
          />
        </div>
      </div>

      {/* Table card */}
      <div className="card-enter rounded-xl border border-zinc-200 bg-white shadow-sm" style={{ '--index': 3 } as React.CSSProperties}>

        {/* Card header: title + filters */}
        <div className="border-b border-zinc-100 px-5 py-4">
          <SectionHeader
            title="All users"
            description={
              !isLoading && response
                ? `${response.total} ${response.total === 1 ? 'user' : 'users'}${hasFilters ? ' matching filters' : ''}`
                : undefined
            }
          />

          <div className="mt-3 flex flex-wrap items-end gap-2">
            {/* Search */}
            <div className="relative min-w-[200px] flex-1">
              <Search
                className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-zinc-400"
                aria-hidden="true"
              />
              <input
                type="search"
                placeholder="Search by name…"
                value={searchInput}
                onChange={(e) => handleSearchChange(e.target.value)}
                style={{ paddingLeft: '2.25rem' }}
              />
            </div>

            {/* Status filter */}
            <div className="min-w-[140px]">
              <select
                value={statusFilter}
                onChange={(e) => { setStatusFilter(e.target.value as AdminUserStatus | ''); setPage(1) }}
              >
                <option value="">All statuses</option>
                <option value="active">Active</option>
                <option value="pending">Pending</option>
                <option value="rejected">Rejected</option>
                <option value="suspended">Suspended</option>
              </select>
            </div>

            {/* Role filter */}
            <div className="min-w-[160px]">
              <select
                value={roleFilter}
                onChange={(e) => { setRoleFilter(e.target.value as AdminUserRole | ''); setPage(1) }}
              >
                <option value="">All roles</option>
                <option value="customer">Customer</option>
                <option value="venue_owner">Venue Owner</option>
                <option value="super_admin">Super Admin</option>
              </select>
            </div>
          </div>
        </div>

        {/* Content states */}
        {isLoading && (
          <div className="px-5 py-10">
            <LoadingScreen message="Loading users…" fullScreen={false} />
          </div>
        )}

        {!isLoading && error && (
          <div className="px-5 py-10">
            <ErrorState
              title="Could not load users"
              message={error instanceof Error ? error.message : 'Failed to load users'}
              fullScreen={false}
              action={<Button variant="secondary" onClick={invalidateUsers}>Retry</Button>}
            />
          </div>
        )}

        {!isLoading && !error && response && response.items.length === 0 && (
          <div className="px-5 py-10">
            <EmptyState
              icon={<UsersIcon className="h-4 w-4" />}
              title="No users found"
              description={
                hasFilters
                  ? 'Try adjusting the search or filters.'
                  : 'No users have registered yet.'
              }
            />
          </div>
        )}

        {!isLoading && !error && response && response.items.length > 0 && (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="border-b border-zinc-100 bg-zinc-50/60">
                  <tr>
                    <th className="px-5 py-3 text-left text-xs font-medium uppercase tracking-wide text-zinc-400">User</th>
                    <th className="px-5 py-3 text-left text-xs font-medium uppercase tracking-wide text-zinc-400">Roles</th>
                    <th className="px-5 py-3 text-left text-xs font-medium uppercase tracking-wide text-zinc-400">Status</th>
                    <th className="px-5 py-3 text-left text-xs font-medium uppercase tracking-wide text-zinc-400">Joined</th>
                    <th className="px-5 py-3 text-right text-xs font-medium uppercase tracking-wide text-zinc-400">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-50">
                  {response.items.map((user) => (
                    <tr key={user.id} className="transition-colors hover:bg-zinc-50/70">
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-3">
                          <span
                            className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-semibold ${avatarColor(user.id)}`}
                          >
                            {initials(user)}
                          </span>
                          <div className="min-w-0">
                            <div className="truncate font-medium text-zinc-900">{user.full_name ?? '—'}</div>
                            <div className="truncate text-xs text-zinc-400">{user.email ?? '—'}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-3.5">
                        <div className="flex flex-wrap gap-1">
                          {user.roles.map((r) => (
                            <StatusBadge
                              key={r}
                              label={roleLabel(r)}
                              variant={roleVariant(r)}
                              dot={false}
                            />
                          ))}
                        </div>
                      </td>
                      <td className="px-5 py-3.5">
                        <StatusBadge label={user.status} variant={statusVariant(user.status)} />
                      </td>
                      <td className="px-5 py-3.5 text-xs text-zinc-400">
                        {new Date(user.created_at).toLocaleDateString('en-IN', {
                          year: 'numeric', month: 'short', day: 'numeric',
                        })}
                      </td>
                      <td className="px-5 py-3.5 text-right">
                        {user.is_super_admin ? (
                          <StatusBadge label="Protected" variant="neutral" dot={false} />
                        ) : user.status === 'pending' && user.roles.includes('venue_owner') ? (
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

      {/* Suspend Modal */}
      <Modal open={suspendTarget !== null} onClose={closeSuspendModal} className="max-w-md">
        <div className="p-6">
            <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-full bg-red-50">
              <ShieldOff className="h-5 w-5 text-red-600" aria-hidden="true" />
            </div>
            <h3 className="mb-1 text-base font-semibold text-zinc-900">Suspend account</h3>
            <p className="mb-5 text-sm text-zinc-500">
              <span className="font-medium text-zinc-800">
                {suspendTarget?.full_name ?? suspendTarget?.email ?? 'This user'}
              </span>{' '}
              will immediately lose platform access and cannot log in until reactivated.
            </p>

            <div>
              <label htmlFor="suspend-reason">Reason <span className="text-red-500">*</span></label>
              <input
                id="suspend-reason"
                type="text"
                placeholder="e.g. Violation of terms of service"
                value={suspendReason}
                onChange={(e) => { setSuspendReason(e.target.value); suspendMutation.reset() }}
                autoFocus
              />
              {suspendMutation.error && (
                <p className="mt-1.5 text-xs font-medium text-red-500">
                  {suspendMutation.error instanceof Error ? suspendMutation.error.message : 'Failed to suspend user'}
                </p>
              )}
            </div>

            <div className="mt-5 flex justify-end gap-2">
              <Button variant="secondary" onClick={closeSuspendModal} disabled={suspendMutation.isPending}>
                Cancel
              </Button>
              <button
                type="button"
                onClick={handleSuspend}
                disabled={suspendMutation.isPending || !suspendReason.trim()}
                className="press rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition-colors hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {suspendMutation.isPending ? 'Suspending…' : 'Suspend account'}
              </button>
            </div>
          </div>
      </Modal>

      {/* Reactivate Modal */}
      <Modal open={reactivateTarget !== null} onClose={closeReactivateModal} className="max-w-md">
        <div className="p-6">
            <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-full bg-emerald-50">
              <ShieldCheck className="h-5 w-5 text-emerald-600" aria-hidden="true" />
            </div>
            <h3 className="mb-1 text-base font-semibold text-zinc-900">Reactivate account</h3>
            <p className="mb-5 text-sm text-zinc-500">
              <span className="font-medium text-zinc-800">
                {reactivateTarget?.full_name ?? reactivateTarget?.email ?? 'This user'}
              </span>{' '}
              will immediately regain full platform access.
            </p>
            {reactivateMutation.error && (
              <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-2.5 text-sm text-red-700">
                {reactivateMutation.error instanceof Error ? reactivateMutation.error.message : 'Failed to reactivate user'}
              </div>
            )}
            <div className="flex justify-end gap-2">
              <Button variant="secondary" onClick={closeReactivateModal} disabled={reactivateMutation.isPending}>
                Cancel
              </Button>
              <button
                type="button"
                onClick={handleReactivate}
                disabled={reactivateMutation.isPending}
                className="press rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition-colors hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {reactivateMutation.isPending ? 'Reactivating…' : 'Reactivate account'}
              </button>
            </div>
          </div>
      </Modal>

      {/* Approve Modal */}
      <Modal open={approveTarget !== null} onClose={closeApproveModal} className="max-w-md">
        <div className="p-6">
            <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-full bg-emerald-50">
              <CheckCircle2 className="h-5 w-5 text-emerald-600" aria-hidden="true" />
            </div>
            <h3 className="mb-1 text-base font-semibold text-zinc-900">Approve venue owner</h3>
            <p className="mb-5 text-sm text-zinc-500">
              <span className="font-medium text-zinc-800">
                {approveTarget?.full_name ?? approveTarget?.email ?? 'This user'}
              </span>{' '}
              will be granted full venue owner access immediately.
            </p>
            {approveMutation.error && (
              <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-2.5 text-sm text-red-700">
                {approveMutation.error instanceof Error ? approveMutation.error.message : 'Failed to approve owner'}
              </div>
            )}
            <div className="flex justify-end gap-2">
              <Button variant="secondary" onClick={closeApproveModal} disabled={approveMutation.isPending}>
                Cancel
              </Button>
              <button
                type="button"
                onClick={handleApprove}
                disabled={approveMutation.isPending}
                className="press rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition-colors hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {approveMutation.isPending ? 'Approving…' : 'Approve owner'}
              </button>
            </div>
          </div>
      </Modal>

      {/* Reject Modal */}
      <Modal open={rejectTarget !== null} onClose={closeRejectModal} className="max-w-md">
        <div className="p-6">
            <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-full bg-red-50">
              <XCircle className="h-5 w-5 text-red-600" aria-hidden="true" />
            </div>
            <h3 className="mb-1 text-base font-semibold text-zinc-900">Reject venue owner</h3>
            <p className="mb-5 text-sm text-zinc-500">
              <span className="font-medium text-zinc-800">
                {rejectTarget?.full_name ?? rejectTarget?.email ?? 'This user'}
              </span>{' '}
              will be notified their application was not approved. They can re-apply later.
            </p>
            <div>
              <label htmlFor="reject-reason">Reason <span className="text-zinc-400 font-normal text-xs">(optional)</span></label>
              <input
                id="reject-reason"
                type="text"
                placeholder="e.g. Incomplete information"
                value={rejectReason}
                onChange={(e) => { setRejectReason(e.target.value); rejectMutation.reset() }}
                autoFocus
              />
              {rejectMutation.error && (
                <p className="mt-1.5 text-xs font-medium text-red-500">
                  {rejectMutation.error instanceof Error ? rejectMutation.error.message : 'Failed to reject owner'}
                </p>
              )}
            </div>
            <div className="mt-5 flex justify-end gap-2">
              <Button variant="secondary" onClick={closeRejectModal} disabled={rejectMutation.isPending}>
                Cancel
              </Button>
              <button
                type="button"
                onClick={handleReject}
                disabled={rejectMutation.isPending}
                className="press rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition-colors hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {rejectMutation.isPending ? 'Rejecting…' : 'Reject application'}
              </button>
            </div>
          </div>
      </Modal>

    </AdminLayout>
  )
}
