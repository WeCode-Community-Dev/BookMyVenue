const STATS = [
  {
    stat: '500+',
    label: 'Verified venues',
    icon: (
      <svg className="h-5 w-5 text-brand-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
      </svg>
    ),
  },
  {
    stat: '12,000+',
    label: 'Bookings completed',
    icon: (
      <svg className="h-5 w-5 text-brand-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
    ),
  },
  {
    stat: '4.8 ★',
    label: 'Average rating',
    icon: (
      <svg className="h-5 w-5 text-brand-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
      </svg>
    ),
  },
  {
    stat: '24h',
    label: 'Support response',
    icon: (
      <svg className="h-5 w-5 text-brand-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
      </svg>
    ),
  },
]

export function TrustStrip() {
  return (
    <section className="border-t border-zinc-100 bg-zinc-50/50 py-12 dark:border-ink-800 dark:bg-ink-900/40">
      <div className="mx-auto max-w-6xl px-6">
        <p className="mb-8 text-center text-xs font-semibold uppercase tracking-wider text-zinc-400">
          Trusted by event planners across India
        </p>
        <div className="grid grid-cols-2 gap-6 sm:grid-cols-4">
          {STATS.map(({ stat, label, icon }) => (
            <div
              key={label}
              className="flex flex-col items-center gap-2 rounded-2xl border border-zinc-100 bg-white px-4 py-6 shadow-sm text-center dark:border-ink-800 dark:bg-ink-900"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-light dark:bg-brand/15">
                {icon}
              </div>
              <p className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">{stat}</p>
              <p className="text-xs text-zinc-400 leading-snug">{label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
