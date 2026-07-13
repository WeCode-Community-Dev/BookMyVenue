import { useState, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { useAuth } from '../lib/AuthContext'
import { MetricCard, StatusBadge, Card, Skeleton } from '@venue404/ui'
import { CalendarDays, Clock, FileEdit, Calendar, Wallet, Store } from 'lucide-react'
import { Link } from 'react-router-dom'
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { createClient, ownerEndpoints } from '@venue404/api-client'
import { useQuery } from '@tanstack/react-query'

function formatPaise(paise: number): string {
  const rupees = paise / 100
  if (rupees >= 100000) return `₹${(rupees / 100000).toFixed(1)}L`
  if (rupees >= 1000) return `₹${(rupees / 1000).toFixed(1)}K`
  return `₹${rupees.toLocaleString('en-IN')}`
}

function formatEventDate(isoString: string | null): string {
  if (!isoString) return '—'
  const d = new Date(isoString)
  const now = new Date()
  const tomorrow = new Date(now)
  tomorrow.setDate(now.getDate() + 1)

  if (d.toDateString() === now.toDateString()) return 'Today, ' + d.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })
  if (d.toDateString() === tomorrow.toDateString()) return 'Tomorrow, ' + d.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })
  return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }) + ', ' + d.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })
}

function eventTypeLabel(type: string | null): string {
  if (!type) return 'Event'
  return type.charAt(0).toUpperCase() + type.slice(1).replace(/_/g, ' ')
}

export default function Dashboard() {
  const { user } = useAuth()
  const userName = user?.profile?.full_name?.split(' ')[0] || 'Owner'
  const [timeRange, setTimeRange] = useState('6M')
  const [portalTarget, setPortalTarget] = useState<Element | null>(null)

  useEffect(() => {
    setPortalTarget(document.getElementById('topbar-portal-target'))
  }, [])

  const { data: stats, isLoading: statsLoading, error: statsError } = useQuery({
    queryKey: ['dashboard-stats'],
    queryFn: () => ownerEndpoints(createClient()).getDashboardStats()
  })

  const { data: upcomingEvents = [], isLoading: eventsLoading } = useQuery({
    queryKey: ['upcoming-events'],
    queryFn: () => ownerEndpoints(createClient()).getUpcomingEvents()
  })

  const { data: chartData = [], isLoading: chartLoading } = useQuery({
    queryKey: ['dashboard-chart', timeRange],
    queryFn: () => ownerEndpoints(createClient()).getDashboardChart(timeRange)
  })

  const initialLoad = statsLoading || eventsLoading
  const error = statsError ? 'Failed to load dashboard data.' : null

  const quickActions = [
    { label: 'Create new venue', icon: FileEdit, link: '/venues/new' },
    { label: 'Pending bookings', icon: Clock, link: '/bookings?tab=requested' },
  ]

  if (initialLoad) {
    return (
      <div className="space-y-6 pb-8 pt-4">
        <section>
          <Skeleton className="h-8 w-64 mb-2" />
          <Skeleton className="h-5 w-96" />
        </section>
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1,2,3,4].map(i => <Skeleton key={i} className="h-28 w-full rounded-xl" />)}
        </section>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Skeleton className="h-[400px] lg:col-span-2 rounded-xl" />
          <Skeleton className="h-[400px] rounded-xl" />
        </div>
      </div>
    )
  }



  // Summary numbers shown in chart header
  const chartTotals = chartData.reduce(
    (acc, curr) => ({
      enquiries: acc.enquiries + (curr.enquiries || 0),
      completed: acc.completed + (curr.completed || 0),
      cancelled: acc.cancelled + (curr.cancelled || 0),
    }),
    { enquiries: 0, completed: 0, cancelled: 0 }
  )

  return (
    <div className="space-y-6 pb-8">
      {/* Quick Actions (teleported to topbar) */}
      {portalTarget && createPortal(
        <div className="flex flex-wrap gap-3">
          {quickActions.map((action, i) => (
            <Link
              key={i}
              to={action.link}
              className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-zinc-700 dark:text-zinc-300 bg-white dark:bg-ink-900 border border-zinc-200 dark:border-ink-700 rounded-lg hover:bg-zinc-50 dark:hover:bg-ink-800 transition-colors shadow-sm"
            >
              <action.icon className="h-4 w-4 text-zinc-500 dark:text-zinc-400" />
              {action.label}
            </Link>
          ))}
        </div>,
        portalTarget
      )}

      {/* Header Strip */}
      <section>
        <h1 className="text-xl font-bold text-zinc-900 dark:text-zinc-100 tracking-tight">Hello, {userName}!</h1>
        <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">Track your venue performance and upcoming bookings.</p>
      </section>

      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>
      )}

      {/* KPI Stats */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          label="Pending Approvals"
          value={(stats?.pending_requests ?? 0).toString()}
          icon={<Clock className="h-5 w-5" />}
          accent="amber"
          description="Inquiries awaiting response"
        />
        <MetricCard
          label="Active Bookings"
          value={(stats?.active_bookings ?? 0).toString()}
          icon={<CalendarDays className="h-5 w-5" />}
          accent="emerald"
          description="Currently confirmed"
        />
        <MetricCard
          label="Active Venues"
          value={(stats?.active_venues ?? 0).toString()}
          icon={<Store className="h-5 w-5" />}
          accent="brand"
          description="Currently published"
        />
        <MetricCard
          label="Net Earnings"
          value={stats ? formatPaise(stats.net_revenue_paise) : '₹0'}
          icon={<Wallet className="h-5 w-5" />}
          accent="violet"
          description="After platform fees"
        />
      </section>

      {/* Main Content Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Performance Chart */}
        <Card className="lg:col-span-2 p-5 flex flex-col border-zinc-200 dark:border-ink-700 shadow-sm rounded-xl">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-base font-semibold text-zinc-900 dark:text-zinc-100">Performance Trends</h3>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
                Last {timeRange === '7D' ? '7 days — daily' : timeRange === '30D' ? '30 days — daily' : timeRange === '3M' ? '3 months — monthly' : timeRange === '12M' ? '12 months — monthly' : '6 months — monthly'}
              </p>
            </div>
            <div className="flex bg-zinc-100 dark:bg-ink-800 p-1 rounded-lg border border-zinc-200 dark:border-ink-700">
              {['7D', '30D', '3M', '6M', '12M'].map(p => (
                <button
                  key={p}
                  onClick={() => setTimeRange(p)}
                  className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${
                    p === timeRange ? "bg-white dark:bg-ink-900 shadow-sm text-zinc-900 dark:text-zinc-100" : "text-zinc-500 dark:text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-300"
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4 mb-8 px-2">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <div className="w-2 h-2 rounded-full bg-amber-500"></div>
                <span className="text-xs text-zinc-500 dark:text-zinc-400">Enquiries</span>
              </div>
              <p className="font-semibold text-base">{chartTotals.enquiries}</p>
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                <span className="text-xs text-zinc-500 dark:text-zinc-400">Completed</span>
              </div>
              <p className="font-semibold text-base">{chartTotals.completed}</p>
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <div className="w-2 h-2 rounded-full bg-rose-500"></div>
                <span className="text-xs text-zinc-500 dark:text-zinc-400">Cancelled</span>
              </div>
              <p className="font-semibold text-base">{chartTotals.cancelled}</p>
            </div>
          </div>

          <div className="flex-1 min-h-[200px] w-full mt-2">
            {chartLoading ? (
              <Skeleton className="w-full h-full min-h-[200px] rounded-xl" />
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorRequests" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.25}/>
                      <stop offset="95%" stopColor="#f59e0b" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorCompleted" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.25}/>
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorCancelled" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.25}/>
                      <stop offset="95%" stopColor="#f43f5e" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid vertical={false} stroke="#f4f4f5" strokeDasharray="4 4" />
                  <XAxis
                    dataKey="month"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: '#a1a1aa', fontSize: 12, fontWeight: 500 }}
                    dy={10}
                  />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: '#a1a1aa', fontSize: 12, fontWeight: 500 }}
                    dx={-10}
                    allowDecimals={false}
                  />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#18181b', borderRadius: '12px', border: 'none', color: '#fff', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)' }}
                    itemStyle={{ color: '#e4e4e7', fontSize: '13px', fontWeight: 500, padding: '2px 0' }}
                    labelStyle={{ color: '#a1a1aa', fontSize: '12px', marginBottom: '8px' }}
                    cursor={{ stroke: '#d4d4d8', strokeWidth: 1, strokeDasharray: '4 4' }}
                  />
                  <Area type="monotone" dataKey="enquiries" name="Enquiries" stroke="#f59e0b" strokeWidth={3} fillOpacity={1} fill="url(#colorRequests)" activeDot={{ r: 5, strokeWidth: 0, fill: '#f59e0b' }} />
                  <Area type="monotone" dataKey="completed" name="Completed" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#colorCompleted)" activeDot={{ r: 5, strokeWidth: 0, fill: '#10b981' }} />
                  <Area type="monotone" dataKey="cancelled" name="Cancelled" stroke="#f43f5e" strokeWidth={3} fillOpacity={1} fill="url(#colorCancelled)" activeDot={{ r: 5, strokeWidth: 0, fill: '#f43f5e' }} />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </div>
        </Card>

        {/* Upcoming Events */}
        <Card className="p-6 flex flex-col border-zinc-200 dark:border-ink-700 shadow-sm rounded-xl">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-semibold text-zinc-900 dark:text-zinc-100">Upcoming Events</h3>
            <Link to="/bookings" className="text-sm text-brand-600 hover:text-brand-700 font-medium">View all</Link>
          </div>
          <div className="flex-1 space-y-5 overflow-y-auto">
            {upcomingEvents.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full py-8 text-center">
                <Calendar className="h-8 w-8 text-zinc-300 dark:text-zinc-400 mb-2" />
                <p className="text-sm text-zinc-500 dark:text-zinc-400">No upcoming events</p>
                <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">Confirmed bookings will appear here</p>
              </div>
            ) : (
              upcomingEvents.map((event) => (
                <div key={event.booking_id} className="flex items-start gap-4">
                  <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-blue-50">
                    <Calendar className="h-4 w-4 text-blue-500" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100 truncate">{eventTypeLabel(event.event_type)}</p>
                      <StatusBadge label="Confirmed" variant="success" className="text-[10px] px-1.5 py-0" />
                    </div>
                    <div className="flex items-center justify-between gap-2 mt-1">
                      <p className="text-xs text-zinc-500 dark:text-zinc-400 truncate">{event.venue_name}</p>
                      <p className="text-xs text-zinc-500 dark:text-zinc-400 whitespace-nowrap">{formatEventDate(event.starts_at)}</p>
                    </div>
                    <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">{event.guest_count} guests</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </Card>

      </div>

    </div>
  )
}
