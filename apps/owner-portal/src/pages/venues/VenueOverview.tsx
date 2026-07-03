import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { Card, StatusBadge, Button, MetricCard, Skeleton } from '@venue404/ui'
import { Users, IndianRupee, CalendarDays, ArrowLeft, Info, Loader2, Tag } from 'lucide-react'
import { createClient, venueEndpoints } from '@venue404/api-client'
import type { Venue } from '@venue404/api-client'

export default function VenueOverview() {
  const { venueId } = useParams()
  const [venue, setVenue] = useState<Venue | null>(null)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function loadVenue() {
      if (!venueId) return
      try {
        const client = createClient()
        const data = await venueEndpoints(client).getMyVenue(venueId)
        setVenue(data)
      } catch (err) {
        console.error("Failed to fetch venue overview", err)
      } finally {
        setLoading(false)
      }
    }
    loadVenue()
  }, [venueId])

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
          <Skeleton className="h-24 w-full rounded-xl" />
          <Skeleton className="h-24 w-full rounded-xl" />
          <Skeleton className="h-24 w-full rounded-xl" />
        </div>
        <Card className="p-6 mt-6">
           <Skeleton className="h-6 w-48 mb-2" />
           <Skeleton className="h-4 w-full max-w-md" />
        </Card>
      </div>
    )
  }

  if (!venue) {
    return <div className="text-center py-12 text-zinc-500">Venue not found.</div>
  }

  return (
    <div className="space-y-6 pb-8">
      <Link to="/venues" className="inline-flex items-center gap-2 text-sm font-medium text-zinc-500 hover:text-zinc-900 transition-colors">
        <ArrowLeft className="h-4 w-4" />
        Back to Venues
      </Link>

      {error && (
        <div className="p-4 rounded-md bg-red-50 border border-red-200 text-red-700 text-sm">
          {error}
        </div>
      )}

      {/* Banner */}
      {venue.status === 'draft' && (
        <div className="bg-blue-50 border border-blue-200 p-4 rounded-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex gap-3 text-blue-800">
            <Info className="h-5 w-5 shrink-0 mt-0.5" />
            <div>
              <h4 className="font-semibold text-sm">Your venue is not live</h4>
              <p className="text-sm mt-1">Your workspace has been created. Take your time to add photos, configure pricing, and review your policies. When you are fully satisfied, submit it for review to make it visible to customers.</p>
            </div>
          </div>
          <Button 
            variant="primary" 
            onClick={async () => {
              if (!venueId || !window.confirm("Our team will review your venue within 24-48 hours. Are you sure you're ready?")) return
              setSubmitting(true)
              setError(null)
              try {
                const client = createClient()
                const data = await venueEndpoints(client).submitVenue(venueId)
                setVenue(data)
              } catch (err: unknown) {
                setError(err instanceof Error ? err.message : "Failed to submit venue")
              } finally {
                setSubmitting(false)
              }
            }}
            disabled={submitting}
            className="shrink-0 whitespace-nowrap bg-blue-600 hover:bg-blue-700"
          >
            {submitting ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
            {submitting ? "Submitting..." : "Submit for Review"}
          </Button>
        </div>
      )}
      {venue.status === 'approved' && (
        <div className="bg-emerald-50 border border-emerald-200 p-4 rounded-xl flex items-center justify-between">
          <div className="flex items-center gap-3">
            <StatusBadge label="APPROVED" variant="success" />
            <span className="text-sm font-medium text-emerald-800">Live — accepting bookings</span>
          </div>
        </div>
      )}
      {venue.status === 'pending_approval' && (
        <div className="bg-amber-50 border border-amber-200 p-4 rounded-xl flex items-center justify-between">
          <div className="flex items-center gap-3">
            <StatusBadge label="PENDING APPROVAL" variant="pending" />
            <span className="text-sm font-medium text-amber-800">Your venue is under review.</span>
          </div>
        </div>
      )}

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900">{venue.name}</h1>
          <p className="mt-1 text-sm text-zinc-500">{venue.city}, {venue.state}</p>
        </div>
        {venue.status === 'approved' && (
          <Link to={`/bookings?venue_id=${venueId}`} className="shrink-0 w-full sm:w-auto">
            <Button variant="primary" className="bg-zinc-900 hover:bg-zinc-800 text-white w-full sm:w-auto flex items-center justify-center gap-2">
              <CalendarDays className="h-4 w-4" />
              Manage Bookings
            </Button>
          </Link>
        )}
      </div>

      {/* Quick Stats */}
      {venue.status === 'approved' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <MetricCard label="Bookings this month" value="0" icon={<CalendarDays className="h-4 w-4"/>} accent="brand" />
          <MetricCard label="Revenue this month" value="₹0" icon={<IndianRupee className="h-4 w-4"/>} accent="emerald" />
          <MetricCard label="Max Capacity" value={venue.max_capacity?.toString() || '0'} icon={<Users className="h-4 w-4"/>} accent="violet" />
        </div>
      )}

      {/* Calendar & Availability */}
      {venue.status === 'approved' && (
        <Card className="p-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-lg font-medium text-zinc-900">Calendar & Availability</h3>
              <p className="text-sm text-zinc-500 mt-1">Manage your regular weekly hours and block off dates for maintenance or private events.</p>
            </div>
            <Link to={`/venues/${venueId}/calendar`}>
              <Button variant="primary">
                <CalendarDays className="h-4 w-4 mr-2" />
                Manage Calendar
              </Button>
            </Link>
          </div>
        </Card>
      )}

      {/* Dynamic Pricing */}
      {venue.status === 'approved' && (
        <Card className="p-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-lg font-medium text-zinc-900">Dynamic Pricing</h3>
              <p className="text-sm text-zinc-500 mt-1">Set weekend, peak-hour, and special-date percentage rules on top of your base price.</p>
            </div>
            <Link to={`/venues/${venueId}/pricing-rules`}>
              <Button variant="primary">
                <Tag className="h-4 w-4 mr-2" />
                Manage Pricing Rules
              </Button>
            </Link>
          </div>
        </Card>
      )}

      {/* Quick Edit Links */}
      <Card className="p-6">
        <h3 className="text-lg font-medium text-zinc-900 mb-4">Management Links</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {[
            { label: 'Details', path: 'details' },
            { label: 'Photos', path: 'photos' },
            { label: 'Amenities', path: 'amenities' },
            { label: 'Operating Hours', path: 'operating-hours' },
            { label: 'Booking Settings', path: 'booking-settings' },
            { label: 'Pricing', path: 'pricing' },
            { label: 'Policies', path: 'policies' }
          ].map(link => (
            <Link key={link.path} to={`/venues/${venueId}/edit/${link.path}`}>
              <div className="p-4 rounded-lg border border-zinc-200 hover:border-brand hover:bg-brand-light/30 transition-colors cursor-pointer text-sm font-medium text-zinc-700 hover:text-brand">
                {link.label}
              </div>
            </Link>
          ))}
        </div>
      </Card>
    </div>
  )
}
