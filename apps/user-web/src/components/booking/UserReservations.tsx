import { useQuery } from '@tanstack/react-query'
import { createClient, deepResearchEndpoints } from '@venue404/api-client'
import { LoadingScreen, ErrorState, EmptyState } from '@venue404/ui'
import { CheckCircle2, Clock, Globe2, Building2, Calendar, FileText, Users } from 'lucide-react'
import { formatDate } from '../../utils'
import type { UserReservationResponse } from '@venue404/api-client'

export function UserReservations() {
  const client = createClient()

  const {
    data: reservations = [],
    isLoading,
    isError,
    refetch,
  } = useQuery<UserReservationResponse[]>({
    queryKey: ['my-external-reservations'],
    queryFn: () => deepResearchEndpoints(client).getMyReservations(),
  })

  if (isLoading) {
    return (
      <div className="py-20">
        <LoadingScreen fullScreen={false} />
      </div>
    )
  }

  if (isError) {
    return (
      <div className="py-10">
        <ErrorState
          title="Unable to load venue requests"
          message="Failed to load your external venue requests."
          action={
            <button
              onClick={() => void refetch()}
              className="press rounded-lg bg-brand px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-brand-hover"
            >
              Retry
            </button>
          }
        />
      </div>
    )
  }

  if (reservations.length === 0) {
    return (
      <div className="py-10">
        <EmptyState
          title="No venue requests"
          description="You haven't made any external venue requests through Deep Research yet."
        />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {reservations.map((res) => (
        <ReservationCard key={res.id} reservation={res} />
      ))}
    </div>
  )
}

function getStatusDetails(status: string) {
  switch (status) {
    case 'new':
      return {
        stage: 1,
        label: 'Request Sent',
        desc: 'We received your request.',
        color: 'text-blue-600 dark:text-blue-400',
        bg: 'bg-blue-50 dark:bg-blue-950/30',
        border: 'border-blue-200 dark:border-blue-900/50',
      }
    case 'contacted':
    case 'owner_interested':
    case 'owner_invited':
      return {
        stage: 2,
        label: 'Contacting Venue',
        desc: 'We are negotiating with the venue owner.',
        color: 'text-amber-600 dark:text-amber-400',
        bg: 'bg-amber-50 dark:bg-amber-950/30',
        border: 'border-amber-200 dark:border-amber-900/50',
      }
    case 'owner_onboarded':
    case 'venue_draft_created':
    case 'venue_pending_approval':
    case 'venue_approved':
      return {
        stage: 3,
        label: 'Venue Onboarding',
        desc: 'The venue is joining our platform!',
        color: 'text-indigo-600 dark:text-indigo-400',
        bg: 'bg-indigo-50 dark:bg-indigo-950/30',
        border: 'border-indigo-200 dark:border-indigo-900/50',
      }
    case 'booking_created':
      return {
        stage: 4,
        label: 'Booking Ready',
        desc: 'Your booking has been created.',
        color: 'text-emerald-600 dark:text-emerald-400',
        bg: 'bg-emerald-50 dark:bg-emerald-950/30',
        border: 'border-emerald-200 dark:border-emerald-900/50',
      }
    case 'closed':
      return {
        stage: 4,
        label: 'Completed',
        desc: 'Request finished.',
        color: 'text-zinc-600 dark:text-zinc-400',
        bg: 'bg-zinc-100 dark:bg-ink-800',
        border: 'border-zinc-200 dark:border-ink-700',
      }
    case 'cancelled':
    case 'rejected':
      return {
        stage: 0,
        label: 'Declined',
        desc: 'Venue is unavailable.',
        color: 'text-red-600 dark:text-red-400',
        bg: 'bg-red-50 dark:bg-red-950/30',
        border: 'border-red-200 dark:border-red-900/50',
      }
    default:
      return {
        stage: 1,
        label: 'Processing',
        desc: 'Request is active.',
        color: 'text-zinc-600 dark:text-zinc-400',
        bg: 'bg-zinc-50 dark:bg-ink-800',
        border: 'border-zinc-200 dark:border-ink-700',
      }
  }
}

function ReservationCard({ reservation: res }: { reservation: UserReservationResponse }) {
  const statusInfo = getStatusDetails(res.status)

  return (
    <div className="flex flex-col gap-5 rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm transition-shadow hover:shadow-md md:flex-row md:p-6 dark:border-ink-800 dark:bg-ink-900">
      {/* Image */}
      <div className="h-40 w-full shrink-0 overflow-hidden rounded-xl bg-zinc-100 md:w-56 dark:bg-ink-800">
        {res.lead.cover_photo_url ? (
          <img
            src={res.lead.cover_photo_url}
            alt={res.lead.name}
            loading="lazy"
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-zinc-300">
            <Building2 className="h-10 w-10" />
          </div>
        )}
      </div>

      {/* Details */}
      <div className="flex flex-1 flex-col justify-between">
        <div>
          <div className="mb-2 flex items-center justify-between">
            <span
              className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium ${statusInfo.bg} ${statusInfo.color} ${statusInfo.border}`}
            >
              {statusInfo.stage === 4 ? (
                <CheckCircle2 className="h-3.5 w-3.5" />
              ) : (
                <Clock className="h-3.5 w-3.5" />
              )}
              {statusInfo.label}
            </span>
            <span className="flex items-center gap-1 text-xs font-medium text-zinc-400">
              <Globe2 className="h-3.5 w-3.5" />
              External Venue
            </span>
          </div>

          <h3 className="text-lg font-semibold tracking-tight text-zinc-900 dark:text-zinc-100">
            {res.lead.name}
          </h3>
          <p className="mt-0.5 text-sm text-zinc-500">
            {res.lead.formatted_address || res.lead.city || 'Location unknown'}
          </p>

          <div className="mt-3 flex flex-wrap gap-x-4 gap-y-2 text-sm text-zinc-600 dark:text-zinc-400">
            {res.event_date && (
              <div className="flex items-center gap-1.5">
                <Calendar className="h-4 w-4 text-zinc-400" />
                <span>
                  <span className="font-medium">Date:</span> {formatDate(res.event_date)}
                </span>
              </div>
            )}
            {res.guest_count && (
              <div className="flex items-center gap-1.5">
                <Users className="h-4 w-4 text-zinc-400" />
                <span>
                  <span className="font-medium">Guests:</span> {res.guest_count}
                </span>
              </div>
            )}
            {res.notes && (
              <div className="flex items-center gap-1.5">
                <FileText className="h-4 w-4 text-zinc-400" />
                <span>
                  <span className="font-medium">Notes:</span> {res.notes}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Status Tracker */}
        <div className="mt-5 border-t border-zinc-100 pt-4 dark:border-ink-800">
          <div className="mb-2 flex items-center justify-between text-xs font-medium text-zinc-500">
            <span className={statusInfo.stage >= 1 ? 'text-zinc-900 dark:text-zinc-100' : ''}>
              Requested
            </span>
            <span className={statusInfo.stage >= 2 ? 'text-zinc-900 dark:text-zinc-100' : ''}>
              Contacting
            </span>
            <span className={statusInfo.stage >= 3 ? 'text-zinc-900 dark:text-zinc-100' : ''}>
              Onboarding
            </span>
            <span className={statusInfo.stage >= 4 ? 'text-zinc-900 dark:text-zinc-100' : ''}>
              Ready
            </span>
          </div>
          <div className="relative h-1.5 w-full overflow-hidden rounded-full bg-zinc-100 dark:bg-ink-800">
            <div
              className={`absolute left-0 top-0 h-full rounded-full transition-all duration-1000 ${statusInfo.stage === 0 ? 'w-full bg-red-500' : 'bg-brand'}`}
              style={{
                width: statusInfo.stage === 0 ? '100%' : `${(statusInfo.stage / 4) * 100}%`,
              }}
            />
          </div>
          <p className="mt-3 text-center text-xs text-zinc-400">{statusInfo.desc}</p>
        </div>
      </div>
    </div>
  )
}
