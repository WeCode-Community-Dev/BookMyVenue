import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Button, Skeleton, EmptyState } from '@venue404/ui'
import {
  MapPin,
  Users,
  Calendar,
  Settings,
  Image as ImageIcon,
  ArrowRight,
  AlertCircle,
  Building2,
} from 'lucide-react'
import { createClient, venueEndpoints } from '@venue404/api-client'
import { useQuery } from '@tanstack/react-query'

// ─── constants ────────────────────────────────────────────────────────────────

const TOTAL_STEPS = 8

type StatusKey = 'approved' | 'pending_approval' | 'draft' | 'rejected' | 'suspended'

const STATUS: Record<StatusKey, { label: string; dot: string; pill: string }> = {
  approved:         { label: 'Live',          dot: 'bg-emerald-500', pill: 'bg-emerald-500/10 text-emerald-700 ring-emerald-500/20' },
  pending_approval: { label: 'Under Review',  dot: 'bg-amber-400',   pill: 'bg-amber-400/10  text-amber-700   ring-amber-400/20'   },
  draft:            { label: 'Draft',         dot: 'bg-zinc-400',    pill: 'bg-zinc-100      text-zinc-600     ring-zinc-300/40'    },
  rejected:         { label: 'Rejected',      dot: 'bg-red-500',     pill: 'bg-red-500/10    text-red-700      ring-red-500/20'     },
  suspended:        { label: 'Suspended',     dot: 'bg-orange-400',  pill: 'bg-orange-400/10 text-orange-700   ring-orange-400/20'  },
}

const TABS = [
  { id: 'all',              label: 'All Venues' },
  { id: 'approved',         label: 'Live' },
  { id: 'pending_approval', label: 'Under Review' },
  { id: 'draft',            label: 'Draft' },
  { id: 'rejected',         label: 'Rejected' },
  { id: 'suspended',        label: 'Suspended' },
]

// ─── component ────────────────────────────────────────────────────────────────

export default function ManageVenues() {
  const [filter, setFilter] = useState('all')

  const { data: venues = [], isLoading: loading } = useQuery({
    queryKey: ['my-venues'],
    queryFn: async () => {
      const data = await venueEndpoints(createClient()).getMyVenues()
      return data || []
    }
  })

  const filteredVenues =
    filter === 'all' ? venues : venues.filter(v => v.status === filter)

  const counts: Record<string, number> = {
    all:              venues.length,
    approved:         venues.filter(v => v.status === 'approved').length,
    pending_approval: venues.filter(v => v.status === 'pending_approval').length,
    draft:            venues.filter(v => v.status === 'draft').length,
    rejected:         venues.filter(v => v.status === 'rejected').length,
    suspended:        venues.filter(v => v.status === 'suspended').length,
  }

  return (
    <div className="space-y-6 pb-10">

      {/* ── Tabs ── */}
      <div className="border-b border-zinc-200">
        <nav className="-mb-px flex w-full overflow-x-auto no-scrollbar">
          {TABS.map(t => (
            <button
              key={t.id}
              onClick={() => setFilter(t.id)}
              className={`flex-1 whitespace-nowrap py-3 border-b-2 font-medium text-sm transition-all flex items-center justify-center gap-1.5 ${
                filter === t.id
                  ? 'border-brand-500 text-brand-600'
                  : 'border-transparent text-zinc-500 hover:text-zinc-700 hover:border-zinc-300'
              }`}
            >
              {t.label}
              {counts[t.id] > 0 && (
                <span className={`text-[11px] font-semibold rounded-full px-1.5 py-0.5 leading-none tabular-nums ${
                  filter === t.id ? 'bg-brand-100 text-brand-700' : 'bg-zinc-100 text-zinc-500'
                }`}>
                  {counts[t.id]}
                </span>
              )}
            </button>
          ))}
        </nav>
      </div>

      {/* ── Grid ── */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {[1, 2, 3, 4, 5, 6].map(i => (
            <div key={i} className="rounded-xl overflow-hidden border border-zinc-200 bg-white">
              <Skeleton className="h-[200px] w-full rounded-none" />
              <div className="p-4 space-y-3">
                <Skeleton className="h-5 w-1/2" />
                <div className="flex gap-3">
                  <Skeleton className="h-3.5 w-20" />
                  <Skeleton className="h-3.5 w-16" />
                </div>
              </div>
              <div className="px-4 pb-4 flex gap-2">
                <Skeleton className="h-9 flex-1 rounded-lg" />
                <Skeleton className="h-9 flex-1 rounded-lg" />
              </div>
            </div>
          ))}
        </div>

      ) : filteredVenues.length === 0 ? (
        <EmptyState
          icon={<Building2 className="h-10 w-10 text-zinc-300" />}
          title={filter === 'all' ? 'No venues yet' : `No ${TABS.find(t => t.id === filter)?.label} venues`}
          description={filter === 'all' ? 'Create your first venue to start accepting bookings.' : 'Try a different filter to see your venues.'}
        />

      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {filteredVenues.map(venue => {
            const s = STATUS[venue.status as StatusKey] ?? STATUS.draft
            const coverPhoto = venue.cover_photo_url
            const step             = venue.last_completed_step || 0
            const isDraftIncomplete = venue.status === 'draft' && step < TOTAL_STEPS
            const continueUrl      = `/venues/new?id=${venue.id}&step=${step + 1}`
            const isApproved       = venue.status === 'approved'

            return (
              <div
                key={venue.id}
                className="card-enter group flex flex-col rounded-xl border border-zinc-200 bg-white overflow-hidden shadow-sm hover:shadow-md hover:border-zinc-300 transition-all duration-200"
              >

                {/* ── Photo ── */}
                <Link
                  to={isDraftIncomplete ? continueUrl : `/venues/${venue.id}/overview`}
                  className="block relative h-[200px] bg-zinc-100 overflow-hidden shrink-0"
                  tabIndex={-1}
                >
                  {coverPhoto ? (
                    <img
                      src={coverPhoto}
                      alt={venue.name}
                      className="w-full h-full object-cover group-hover:scale-[1.04] transition-transform duration-500 ease-out"
                    />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center gap-2 bg-zinc-50">
                      <ImageIcon className="h-8 w-8 text-zinc-300" />
                      <span className="text-xs text-zinc-400">No photos yet</span>
                    </div>
                  )}

                  {/* Status pill — top-right, frosted */}
                  <div className="absolute top-3 right-3">
                    <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold ring-1 backdrop-blur-sm ${s.pill}`}>
                      <span className={`h-1.5 w-1.5 rounded-full shrink-0 ${s.dot} ${isApproved ? 'animate-pulse' : ''}`} />
                      {s.label}
                    </span>
                  </div>

                  {/* Category — top-left */}
                  {venue.category_name && (
                    <div className="absolute top-3 left-3">
                      <span className="inline-flex items-center rounded-full bg-black/40 backdrop-blur-sm px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-white">
                        {venue.category_name}
                      </span>
                    </div>
                  )}
                </Link>

                {/* ── Content ── */}
                <div className="flex flex-col flex-1 p-4 gap-3">

                  {/* Name + meta */}
                  <div>
                    <h3 className="font-semibold text-zinc-900 text-[15px] leading-snug truncate">
                      {venue.name}
                    </h3>
                    <div className="mt-1.5 flex items-center gap-3 text-xs text-zinc-400">
                      <span className="flex items-center gap-1">
                        <MapPin className="h-3 w-3 shrink-0" />
                        {venue.city}
                      </span>
                      <span className="flex items-center gap-1">
                        <Users className="h-3 w-3 shrink-0" />
                        Up to {venue.max_capacity}
                      </span>
                    </div>
                  </div>

                  {/* Draft progress bar */}
                  {isDraftIncomplete && (
                    <div className="space-y-1">
                      <div className="flex justify-between text-xs text-zinc-400">
                        <span>Setup progress</span>
                        <span className="font-medium text-zinc-600">
                          {Math.round((step / TOTAL_STEPS) * 100)}%
                        </span>
                      </div>
                      <div className="h-1 w-full rounded-full bg-zinc-100 overflow-hidden">
                        <div
                          className="h-full rounded-full bg-amber-400"
                          style={{ width: `${Math.min((step / TOTAL_STEPS) * 100, 100)}%` }}
                        />
                      </div>
                    </div>
                  )}

                  {/* Rejection reason */}
                  {venue.status === 'rejected' && venue.rejection_reason && (
                    <div className="flex items-start gap-2 rounded-lg bg-red-50 border border-red-100 px-3 py-2">
                      <AlertCircle className="h-3.5 w-3.5 text-red-400 shrink-0 mt-px" />
                      <p className="text-xs text-red-600 leading-relaxed">
                        {venue.rejection_reason}
                      </p>
                    </div>
                  )}

                  {/* Spacer pushes buttons to bottom */}
                  <div className="flex-1" />

                  {/* Actions */}
                  <div className="flex items-center gap-2 pt-1 border-t border-zinc-100">
                    {isDraftIncomplete ? (
                      <Link to={continueUrl} className="flex-1">
                        <Button variant="primary" className="w-full gap-1.5 text-sm">
                          Continue Setup
                          <ArrowRight className="h-3.5 w-3.5" />
                        </Button>
                      </Link>
                    ) : (
                      <>
                        <Link to={`/venues/${venue.id}/overview`} className="flex-1">
                          <Button variant="secondary" className="w-full gap-1.5 text-sm">
                            <Settings className="h-3.5 w-3.5" />
                            Manage
                          </Button>
                        </Link>
                        {isApproved && (
                          <Link to={`/bookings?venue_id=${venue.id}`} className="flex-1">
                            <Button variant="primary" className="w-full gap-1.5 text-sm">
                              <Calendar className="h-3.5 w-3.5" />
                              Bookings
                            </Button>
                          </Link>
                        )}
                      </>
                    )}
                  </div>

                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
