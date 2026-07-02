import { useState } from 'react'
import { createPortal } from 'react-dom'
import { useParams, Link } from 'react-router-dom'
import { Card, Button, Skeleton } from '@venue404/ui'
import { 
  Users, IndianRupee, CalendarDays, ArrowLeft, Info, Loader2,
  FileText, Image as ImageIcon, MapPin, Clock, ShieldCheck, Banknote, ShieldAlert,
  ChevronRight, TrendingUp
} from 'lucide-react'
import { createClient, venueEndpoints } from '@venue404/api-client'

import { useQuery } from '@tanstack/react-query'
import { confirmAction } from '../../lib/confirm'
import toast from 'react-hot-toast'

export default function VenueOverview() {
  const { venueId } = useParams()
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const { data: venue, isLoading: venueLoading, refetch: refetchVenue } = useQuery({
    queryKey: ['venue', venueId],
    queryFn: async () => {
      if (!venueId) return null
      return venueEndpoints(createClient()).getMyVenue(venueId)
    },
    enabled: !!venueId,
  })

  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ['venue-stats', venueId],
    queryFn: async () => {
      if (!venueId) return null
      return venueEndpoints(createClient()).getVenueStats(venueId).catch(() => null)
    },
    enabled: !!venueId,
  })

  const loading = venueLoading || statsLoading

  const portalTarget = typeof document !== 'undefined' ? document.getElementById('topbar-portal-target') : null;

  if (loading) {
    return (
      <div className="space-y-6 pb-8 pt-4">
        <Skeleton className="h-4 w-32 mb-6" />
        <Skeleton className="h-16 w-full rounded-xl" />
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mt-6">
          <div className="space-y-2">
            <Skeleton className="h-8 w-64" />
            <Skeleton className="h-4 w-40" />
          </div>
          <Skeleton className="h-10 w-40 rounded-lg" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
          <Skeleton className="h-28 w-full rounded-2xl" />
          <Skeleton className="h-28 w-full rounded-2xl" />
          <Skeleton className="h-28 w-full rounded-2xl" />
        </div>
        <Card className="p-6 mt-8 rounded-2xl">
           <Skeleton className="h-6 w-48 mb-6" />
           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
             <Skeleton className="h-24 w-full rounded-xl" />
             <Skeleton className="h-24 w-full rounded-xl" />
             <Skeleton className="h-24 w-full rounded-xl" />
           </div>
        </Card>
      </div>
    )
  }

  if (!venue) {
    return (
      <div className="min-h-[400px] flex flex-col items-center justify-center text-center">
        <div className="w-16 h-16 bg-zinc-100 rounded-full flex items-center justify-center mb-4">
          <MapPin className="w-8 h-8 text-zinc-400" />
        </div>
        <h3 className="text-lg font-bold text-zinc-900">Venue not found</h3>
        <p className="text-zinc-500 mt-1">This venue may have been deleted or doesn't exist.</p>
        <Link to="/venues" className="mt-6">
          <Button variant="secondary">Go back to Venues</Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="space-y-8 pb-12 max-w-6xl mx-auto">
      {/* Topbar Actions Portal */}
      {portalTarget && createPortal(
        <Link to="/venues" className="text-sm font-medium text-zinc-500 hover:text-zinc-900 transition-colors flex items-center gap-1.5 bg-white border border-zinc-200 px-3 py-1.5 rounded-md shadow-sm hover:bg-zinc-50">
          <ArrowLeft className="h-4 w-4" />
          Back to Venues
        </Link>,
        portalTarget
      )}

      {error && (
        <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-sm flex items-start gap-3">
          <ShieldAlert className="w-5 h-5 shrink-0 mt-0.5" />
          <p>{error}</p>
        </div>
      )}

      {/* Draft Banner */}
      {venue.status === 'draft' && (
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200/60 p-6 rounded-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-sm">
          <div className="flex gap-4 text-blue-900">
            <div className="w-10 h-10 rounded-full bg-blue-100/80 flex items-center justify-center shrink-0">
              <Info className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <h4 className="font-bold text-base">Your venue is in Draft mode</h4>
              <p className="text-sm mt-1 text-blue-800/80 leading-relaxed max-w-2xl">Take your time to add photos, configure pricing, and review your policies. When you are fully satisfied and ready to accept bookings, submit it for review to make it live.</p>
            </div>
          </div>
          <Button 
            variant="primary" 
            onClick={async () => {
              if (!venueId || !(await confirmAction("Our team will review your venue within 24-48 hours. Are you sure you're ready?"))) return
              setSubmitting(true)
              setError(null)
              try {
                const client = createClient()
                await venueEndpoints(client).submitVenue(venueId)
                await refetchVenue()
              } catch (err: unknown) {
                toast.error(err instanceof Error ? err.message : "Failed to submit venue")
                setError(err instanceof Error ? err.message : "Failed to submit venue")
              } finally {
                setSubmitting(false)
              }
            }}
            disabled={submitting}
            className="shrink-0 whitespace-nowrap bg-blue-600 hover:bg-blue-700 shadow-md shadow-blue-500/20 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300"
          >
            {submitting ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
            {submitting ? "Submitting..." : "Submit for Review"}
          </Button>
        </div>
      )}

      {/* Hero Section */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6">
        <div>
          <div className="flex flex-wrap items-center gap-3 mb-2">
            <h1 className="text-3xl md:text-4xl font-black text-zinc-900 tracking-tight">{venue.name}</h1>
            {venue.status === 'approved' && (
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 border border-emerald-200/60 text-emerald-700 text-xs font-bold tracking-wide shadow-sm mt-1">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                LIVE
              </div>
            )}
            {venue.status === 'pending_approval' && (
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-50 border border-amber-200/60 text-amber-700 text-xs font-bold tracking-wide shadow-sm mt-1">
                <Clock className="w-3 h-3" />
                PENDING REVIEW
              </div>
            )}
          </div>
          <div className="flex items-center gap-2 text-zinc-500 font-medium">
            <MapPin className="w-4 h-4" />
            <span>{venue.city}, {venue.state}</span>
          </div>
        </div>

        {venue.status === 'approved' && (
          <div className="flex items-center gap-3 shrink-0 w-full sm:w-auto">
            <Link to={`/venues/${venueId}/calendar`} className="w-full sm:w-auto">
              <Button variant="primary" className="bg-white hover:bg-emerald-50 text-emerald-700 border border-emerald-200 w-full flex items-center justify-center gap-2 shadow-sm hover:shadow hover:-translate-y-0.5 transition-all duration-300">
                <CalendarDays className="h-4 w-4" />
                Manage Calendar
              </Button>
            </Link>
            <Link to={`/bookings?venue_id=${venueId}`} className="w-full sm:w-auto">
              <Button variant="primary" className="bg-zinc-900 hover:bg-zinc-800 text-white w-full flex items-center justify-center gap-2 shadow-md shadow-zinc-900/20 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300">
                <CalendarDays className="h-4 w-4" />
                Manage Bookings
              </Button>
            </Link>
          </div>
        )}
      </div>

      {/* Premium Quick Stats */}
      {venue.status === 'approved' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-6">
          {/* Revenue Card */}
          <div className="bg-white rounded-2xl border border-zinc-200/80 p-5 shadow-sm hover:shadow-md transition-all duration-300 group">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-semibold text-zinc-500 uppercase tracking-wider mb-1">Monthly Revenue</p>
                <h3 className="text-3xl font-black text-zinc-900 tracking-tight">
                  ₹{((stats?.revenue_this_month_paise || 0) / 100).toLocaleString('en-IN')}
                </h3>
              </div>
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-100 to-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform duration-300">
                <IndianRupee className="w-6 h-6" />
              </div>
            </div>
            <div className="mt-4 flex items-center gap-1.5 text-xs font-medium text-emerald-600 bg-emerald-50 w-fit px-2 py-1 rounded-md">
              <TrendingUp className="w-3 h-3" />
              <span>Performance metric</span>
            </div>
          </div>

          {/* Bookings Card */}
          <div className="bg-white rounded-2xl border border-zinc-200/80 p-5 shadow-sm hover:shadow-md transition-all duration-300 group">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-semibold text-zinc-500 uppercase tracking-wider mb-1">Active Bookings</p>
                <h3 className="text-3xl font-black text-zinc-900 tracking-tight">
                  {stats?.active_bookings?.toString() || '0'}
                </h3>
              </div>
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-100 to-blue-50 text-blue-600 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform duration-300">
                <CalendarDays className="w-6 h-6" />
              </div>
            </div>
            <div className="mt-4 text-xs font-medium text-zinc-400 px-1">
              Active confirmed events
            </div>
          </div>

          {/* Capacity Card */}
          <div className="bg-white rounded-2xl border border-zinc-200/80 p-5 shadow-sm hover:shadow-md transition-all duration-300 group">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-semibold text-zinc-500 uppercase tracking-wider mb-1">Max Capacity</p>
                <h3 className="text-3xl font-black text-zinc-900 tracking-tight">
                  {venue.max_capacity?.toString() || '0'}
                </h3>
              </div>
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-violet-100 to-violet-50 text-violet-600 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform duration-300">
                <Users className="w-6 h-6" />
              </div>
            </div>
            <div className="mt-4 text-xs font-medium text-zinc-400 px-1">
              Registered maximum limits
            </div>
          </div>
        </div>
      )}

      {/* Management Modules Grid */}
      <div className="bg-white rounded-2xl border border-zinc-200/80 p-6 lg:p-8 shadow-sm">
        <div className="mb-6">
          <h2 className="text-xl font-bold text-zinc-900">Venue Modules</h2>
          <p className="text-sm text-zinc-500 mt-1">Configure all aspects of your venue's listing and operations.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {[
            { 
              id: 'details', 
              label: 'Basic Details', 
              desc: 'Name, location, capacity, and core info.',
              icon: FileText, 
              color: 'text-blue-600', 
              bg: 'bg-blue-50 group-hover:bg-blue-100' 
            },
            { 
              id: 'photos', 
              label: 'Photo Gallery', 
              desc: 'Manage your cover photo and gallery.',
              icon: ImageIcon, 
              color: 'text-pink-600', 
              bg: 'bg-pink-50 group-hover:bg-pink-100' 
            },
            { 
              id: 'amenities', 
              label: 'Amenities', 
              desc: 'List the features your venue offers.',
              icon: MapPin, 
              color: 'text-amber-600', 
              bg: 'bg-amber-50 group-hover:bg-amber-100' 
            },
            { 
              id: 'operating-hours', 
              label: 'Operating Hours', 
              desc: 'Set standard weekly availability.',
              icon: Clock, 
              color: 'text-emerald-600', 
              bg: 'bg-emerald-50 group-hover:bg-emerald-100' 
            },
            { 
              id: 'booking-settings', 
              label: 'Booking Settings', 
              desc: 'Notice periods, limits, and approvals.',
              icon: ShieldCheck, 
              color: 'text-indigo-600', 
              bg: 'bg-indigo-50 group-hover:bg-indigo-100' 
            },
            { 
              id: 'pricing', 
              label: 'Pricing & Rates', 
              desc: 'Set hourly rates, daily rates, deposits.',
              icon: Banknote, 
              color: 'text-teal-600', 
              bg: 'bg-teal-50 group-hover:bg-teal-100' 
            },
            { 
              id: 'policies', 
              label: 'Policies', 
              desc: 'Define your cancellation terms.',
              icon: ShieldAlert, 
              color: 'text-rose-600', 
              bg: 'bg-rose-50 group-hover:bg-rose-100' 
            }
          ].map(module => (
            <Link key={module.id} to={`/venues/${venueId}/edit/${module.id}`}>
              <div className="group h-full p-5 rounded-xl border border-zinc-200/80 hover:border-zinc-300 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 bg-white cursor-pointer relative overflow-hidden flex flex-col justify-between">
                <div className="flex items-start gap-4">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 transition-colors duration-300 ${module.bg} ${module.color}`}>
                    <module.icon className="w-5 h-5" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-bold text-zinc-900 group-hover:text-black transition-colors">{module.label}</h4>
                    <p className="text-xs text-zinc-500 mt-1 leading-relaxed line-clamp-2">{module.desc}</p>
                  </div>
                </div>
                <div className="absolute right-4 bottom-4 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 text-zinc-400">
                  <ChevronRight className="w-4 h-4" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
