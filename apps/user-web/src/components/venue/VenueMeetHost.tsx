import type { VenueResponse } from '../../types'

type Props = { venue: VenueResponse }

function getInitials(name: string) {
  const parts = name.trim().split(/\s+/)
  return parts.length >= 2
    ? (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
    : name.slice(0, 2).toUpperCase()
}

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div className="text-center">
      <p className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">{value}</p>
      <p className="mt-0.5 text-xs text-zinc-500">{label}</p>
    </div>
  )
}

export function VenueMeetHost({ venue }: Props) {
  const memberYear  = new Date(venue.created_at).getFullYear()
  const responseStr = venue.owner_action_window_hours < 24
    ? `Within ${venue.owner_action_window_hours} hours`
    : `Within ${venue.owner_action_window_hours / 24} day${venue.owner_action_window_hours / 24 > 1 ? 's' : ''}`

  return (
    <div>
      <h2 className="mb-6 text-xl font-semibold text-zinc-900 dark:text-zinc-100">Meet your host</h2>

      <div className="flex flex-col gap-6 sm:flex-row">
        {/* Host card */}
        <div className="flex-1 rounded-2xl border border-zinc-100 bg-zinc-50 p-6 dark:border-ink-800 dark:bg-ink-900">
          <div className="flex items-start gap-4">
            {/* Avatar */}
            <div className="relative shrink-0">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-brand to-brand-hover text-xl font-bold text-white shadow">
                {getInitials(venue.name)}
              </div>
              {/* Verified check */}
              <div className="absolute -bottom-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full bg-brand shadow-sm">
                <svg className="h-3.5 w-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                </svg>
              </div>
            </div>

            <div>
              <p className="text-lg font-bold text-zinc-900 dark:text-zinc-100">{venue.name}</p>
              <p className="text-sm text-zinc-500">Host · Member since {memberYear}</p>
              <div className="mt-2 flex items-center gap-1.5">
                <div className="flex items-center gap-0.5">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <svg key={i} className="h-3 w-3 text-zinc-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                    </svg>
                  ))}
                </div>
                <span className="text-xs text-zinc-400">No reviews yet</span>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="mt-6 grid grid-cols-3 gap-4 border-t border-zinc-200 pt-6 dark:border-ink-700">
            <Stat value="0" label="Reviews" />
            <Stat value={String(new Date().getFullYear() - memberYear || 1)} label="Year hosting" />
            <Stat value="Verified" label="ID status" />
          </div>
        </div>

        {/* Info panel */}
        <div className="flex-1 space-y-5">
          <div>
            <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">Response rate</p>
            <p className="text-sm text-zinc-500">Not yet rated · new host</p>
          </div>
          <div>
            <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">Response time</p>
            <p className="text-sm text-zinc-500">{responseStr}</p>
          </div>
          <div>
            <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">Languages</p>
            <p className="text-sm text-zinc-500">Contact the host for details</p>
          </div>

          <div className="rounded-xl border border-zinc-100 bg-zinc-50 p-4 dark:border-ink-800 dark:bg-ink-900">
            <div className="flex gap-2.5">
              <svg className="h-4 w-4 shrink-0 mt-0.5 text-zinc-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-xs text-zinc-500 leading-relaxed">
                To protect your payment, never transfer money or communicate outside the Venue404 platform.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
