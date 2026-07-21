import { useQuery } from '@tanstack/react-query'
import { useAuth } from '../lib/AuthContext'
import {
  MetricCard, ActivityItem,
  SectionHeader, StatusBadge, EmptyState,
  type DashboardMetric,
} from '@venue404/ui'
import {
  Building2, UserCheck,
  CalendarDays, ClipboardList,
  CheckCircle2, XCircle, Clock,
  RefreshCw,
} from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { AdminLayout } from '../components/AdminLayout'
import { createClient, ApiError } from '@venue404/api-client'
import { adminActionEndpoints, adminUserEndpoints, adminBookingEndpoints, adminVenueEndpoints } from '@venue404/api-client'
import { GrowthChart } from '../components/GrowthChart'

const actionsApi = adminActionEndpoints(createClient())
const usersApi = adminUserEndpoints(createClient())
const bookingsApi = adminBookingEndpoints(createClient())
const venuesApi = adminVenueEndpoints(createClient())

const METRIC_TEMPLATES: DashboardMetric[] = [
  {
    label: 'Pending Approvals',
    value: '—',
    description: 'Venues awaiting approval',
    icon: <Building2 className="h-4 w-4" />,
    accent: 'amber',
  },
  {
    label: 'Active Bookings',
    value: '—',
    description: 'Confirmed this month',
    icon: <CalendarDays className="h-4 w-4" />,
    accent: 'brand',
  },
  {
    label: 'Venue Owners',
    value: '—',
    description: 'Registered on platform',
    icon: <UserCheck className="h-4 w-4" />,
    accent: 'emerald',
  },
  {
    label: 'Open Actions',
    value: '—',
    description: 'Total admin actions logged',
    icon: <ClipboardList className="h-4 w-4" />,
    accent: 'violet',
  },
]

const today = new Date().toLocaleDateString('en-IN', {
  weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
})

function actionLabel(type: string): string {
  return type.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())
}

function actionIcon(type: string) {
  if (type.endsWith('approved') || type.endsWith('reactivated') || type.endsWith('completed'))
    return <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
  if (type.endsWith('rejected') || type.endsWith('suspended') || type.endsWith('deleted'))
    return <XCircle className="h-3.5 w-3.5 text-red-400" />
  return <CheckCircle2 className="h-3.5 w-3.5 text-brand-secondary" />
}

function actionBadge(type: string) {
  if (type.includes('suspend')) return <StatusBadge label="Suspended" variant="danger" dot={false} />
  if (type.includes('reactivat')) return <StatusBadge label="Reactivated" variant="success" dot={false} />
  if (type.includes('approved')) return <StatusBadge label="Approved" variant="success" dot={false} />
  if (type.includes('rejected')) return <StatusBadge label="Rejected" variant="warning" dot={false} />
  return null
}

function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime()
  const mins = Math.floor(diff / 60_000)
  if (mins < 1) return 'just now'
  if (mins < 60) return `${mins}m ago`
  const hrs = Math.floor(mins / 60)
  if (hrs < 24) return `${hrs}h ago`
  return `${Math.floor(hrs / 24)}d ago`
}

function suppressAuthErrors(e: unknown) {
  if (e instanceof ApiError && (e.status === 401 || e.status === 403)) throw e
  return null
}

export default function Dashboard() {
  const { user } = useAuth()
  const navigate = useNavigate()

  const { data: actionsData, isLoading: actionsLoading } = useQuery({
    queryKey: ['admin', 'dashboard', 'actions'],
    queryFn: () => actionsApi.listActions({ limit: 4 }).catch(suppressAuthErrors),
  })

  const { data: ownerStats } = useQuery({
    queryKey: ['admin', 'dashboard', 'owner-stats'],
    queryFn: () => usersApi.getOwnerStats().catch(suppressAuthErrors),
  })

  const { data: bookingStats } = useQuery({
    queryKey: ['admin', 'dashboard', 'booking-stats'],
    queryFn: () => bookingsApi.getStats().catch(suppressAuthErrors),
  })

  const { data: venueStats } = useQuery({
    queryKey: ['admin', 'dashboard', 'venue-stats'],
    queryFn: () => venuesApi.getVenueStats().catch(suppressAuthErrors),
  })


  const recentActions = actionsData?.items ?? []
  const actionsTotal = actionsData?.total ?? null

  const metrics = METRIC_TEMPLATES.map((m) => {
    if (m.label === 'Pending Approvals') return { ...m, value: venueStats ? String(venueStats.pending_approval) : '—' }
    if (m.label === 'Active Bookings') return { ...m, value: bookingStats ? String(bookingStats.confirmed) : '—' }
    if (m.label === 'Venue Owners') return { ...m, value: ownerStats ? String(ownerStats.total) : '—' }
    if (m.label === 'Open Actions') return { ...m, value: actionsTotal !== null ? String(actionsTotal) : '—' }
    return m
  })

  const firstName = user?.profile.full_name?.split(' ')[0] ?? null

  return (
    <AdminLayout pageTitle="Dashboard" pageSubtitle={today}>
      {/* Welcome */}
      <div className="mb-6">
        <h2 className="text-lg font-semibold tracking-tight text-zinc-900">
          {firstName ? `Good to see you, ${firstName}` : 'Welcome back'}
        </h2>
        <p className="mt-0.5 text-sm text-zinc-500">
          Here is what needs your attention today.
        </p>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {metrics.map((m, i) => (
          <div key={m.label} className="card-enter" style={{ '--index': i } as React.CSSProperties}>
            <MetricCard {...m} />
          </div>
        ))}
      </div>

      {/* Content grid */}
      <div className="mt-5 grid grid-cols-1 gap-5 lg:grid-cols-3">

        {/* Platform growth chart */}
        <div className="card-enter lg:col-span-2 rounded-xl border border-zinc-200 bg-white shadow-sm" style={{ minHeight: 320 }}>
          <GrowthChart />
        </div>

        {/* Recent audit actions */}
        <div className="card-enter rounded-xl border border-zinc-200 bg-white shadow-sm">
          <div className="border-b border-zinc-100 px-5 py-4">
            <SectionHeader
              title="Recent Admin Actions"
              action={
                <button
                  type="button"
                  onClick={() => navigate('/audit-log')}
                  className="press text-xs font-medium text-brand transition-colors hover:text-brand"
                >
                  Full log
                </button>
              }
            />
          </div>

          {actionsLoading && (
            <div className="flex items-center justify-center py-8">
              <RefreshCw className="h-4 w-4 animate-spin text-zinc-300" />
            </div>
          )}

          {!actionsLoading && recentActions.length === 0 && (
            <div className="px-5 py-4">
              <EmptyState
                icon={<ClipboardList className="h-4 w-4" />}
                title="No actions yet"
                description="Admin actions will appear here."
              />
            </div>
          )}

          {!actionsLoading && recentActions.length > 0 && (
            <ul className="divide-y divide-zinc-100 px-5">
              {recentActions.map((a) => (
                <li key={a.id}>
                  <ActivityItem
                    title={actionLabel(a.action_type)}
                    description={a.reason ?? a.target_type}
                    timestamp={timeAgo(a.created_at)}
                    icon={actionIcon(a.action_type)}
                    badge={actionBadge(a.action_type) ?? undefined}
                  />
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {/* Quick actions */}
      <div className="card-enter mt-5 rounded-xl border border-zinc-200 bg-white px-5 py-4 shadow-sm">
        <SectionHeader title="Quick actions" className="mb-3" />
        <div className="flex flex-wrap gap-2">
          {[
            { label: 'Review pending venues', href: '/venues/pending', icon: <Building2 className="h-3.5 w-3.5" /> },
            { label: 'Manage users', href: '/users', icon: <UserCheck className="h-3.5 w-3.5" /> },
            { label: 'Open audit log', href: '/audit-log', icon: <ClipboardList className="h-3.5 w-3.5" /> },
            { label: 'Active bookings', href: '/bookings', icon: <Clock className="h-3.5 w-3.5" /> },
          ].map((a) => (
            <button
              key={a.href}
              type="button"
              onClick={() => navigate(a.href)}
              className="press flex items-center gap-2 rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-2 text-xs font-medium text-zinc-700 transition-colors duration-150 hover:border-zinc-300 hover:bg-zinc-100"
            >
              <span className="text-zinc-400" aria-hidden="true">{a.icon}</span>
              {a.label}
            </button>
          ))}
        </div>
      </div>
    </AdminLayout>
  )
}
