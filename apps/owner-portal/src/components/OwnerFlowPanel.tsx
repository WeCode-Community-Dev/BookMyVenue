export function OwnerFlowPanel() {
  return (
    <div className="relative flex h-full flex-col gap-5 p-10">
      {/* Dot-grid */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage: 'radial-gradient(circle, rgba(64,138,113,0.07) 1px, transparent 1px)',
          backgroundSize: '28px 28px',
        }}
      />

      {/* Ambient brand glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute"
        style={{
          top: '15%',
          left: '5%',
          width: '55%',
          height: '50%',
          borderRadius: '50%',
          background: 'radial-gradient(ellipse, rgba(40,90,72,0.22) 0%, transparent 70%)',
          filter: 'blur(40px)',
        }}
      />

      {/* Brand tag */}
      <div className="relative shrink-0">
        <span className="text-xs font-medium uppercase tracking-widest text-zinc-500 dark:text-zinc-400 dark:text-zinc-500">
          Venue404 · Owner Portal
        </span>
      </div>

      {/* Headline */}
      <div className="relative shrink-0">
        <h2 className="text-[1.6rem] font-bold leading-snug tracking-tight text-white">
          Your venue.<br />Your dashboard.
        </h2>
        <p className="mt-1.5 text-sm text-zinc-400 dark:text-zinc-500">
          Everything you need to run and grow your space
        </p>
      </div>

      {/* Bento grid */}
      <div className="relative grid flex-1 grid-cols-3 grid-rows-3 gap-3">

        {/* ── Feature: List & Manage Venues (2×2) ── */}
        <div
          className="col-start-1 col-span-2 row-start-1 row-span-2 relative flex flex-col justify-between overflow-hidden rounded-2xl p-6"
          style={{
            background: 'rgba(40,90,72,0.22)',
            border: '1px solid rgba(64,138,113,0.28)',
          }}
        >
          {/* Inner glow */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute"
            style={{
              top: '-40px',
              right: '-40px',
              width: '180px',
              height: '180px',
              borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(64,138,113,0.18) 0%, transparent 70%)',
            }}
          />

          <div>
            <div
              className="flex items-center justify-center rounded-xl text-brand-secondary"
              style={{ width: 48, height: 48, background: 'rgba(64,138,113,0.15)', border: '1px solid rgba(64,138,113,0.25)' }}
            >
              {/* Building / venue icon */}
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M6 22V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18Z" />
                <path d="M6 12H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h2" />
                <path d="M18 9h2a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-2" />
                <path d="M10 6h4" />
                <path d="M10 10h4" />
                <path d="M10 14h4" />
                <path d="M10 18h4" />
              </svg>
            </div>
            <p className="mt-4 text-base font-bold text-white">List &amp; Manage Venues</p>
            <p className="mt-1 text-xs leading-relaxed text-zinc-400 dark:text-zinc-500">
              Publish your space, set availability, and control every detail
            </p>
          </div>

          <div>
            <span className="text-4xl font-black tracking-tight text-white">200+</span>
            <p className="mt-0.5 text-xs text-brand-secondary">owners already listed</p>
          </div>
        </div>

        {/* ── Accept Bookings ── */}
        <div
          className="col-start-3 row-start-1 flex flex-col justify-between rounded-2xl p-4"
          style={{
            background: 'rgba(255,255,255,0.04)',
            border: '1px solid rgba(255,255,255,0.07)',
          }}
        >
          <div
            className="flex items-center justify-center rounded-lg text-brand-secondary"
            style={{ width: 36, height: 36, background: 'rgba(64,138,113,0.12)', border: '1px solid rgba(64,138,113,0.2)' }}
          >
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <rect x="3" y="4" width="18" height="18" rx="2" />
              <path d="M16 2v4M8 2v4M3 10h18" />
              <path d="m9 16 2 2 4-4" />
            </svg>
          </div>
          <div>
            <p className="text-xs font-semibold text-zinc-300 dark:text-zinc-600">Accept Bookings</p>
            <p className="mt-0.5 text-2xl font-black text-white">Live</p>
          </div>
        </div>

        {/* ── Track Revenue ── */}
        <div
          className="col-start-3 row-start-2 flex flex-col justify-between rounded-2xl p-4"
          style={{
            background: 'rgba(255,255,255,0.04)',
            border: '1px solid rgba(255,255,255,0.07)',
          }}
        >
          <div
            className="flex items-center justify-center rounded-lg text-brand-secondary"
            style={{ width: 36, height: 36, background: 'rgba(64,138,113,0.12)', border: '1px solid rgba(64,138,113,0.2)' }}
          >
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M3 3v18h18" />
              <path d="m19 9-5 5-4-4-3 3" />
            </svg>
          </div>
          <div>
            <p className="text-xs font-semibold text-zinc-300 dark:text-zinc-600">Track Revenue</p>
            <p className="mt-0.5 text-2xl font-black text-white">₹∞</p>
          </div>
        </div>

        {/* ── Get Discovered (full-width bottom) ── */}
        <div
          className="col-start-1 col-span-3 row-start-3 flex items-center gap-4 rounded-2xl p-4"
          style={{
            background: 'rgba(40,90,72,0.15)',
            border: '1px solid rgba(64,138,113,0.2)',
          }}
        >
          <div
            className="flex shrink-0 items-center justify-center rounded-lg text-brand-secondary"
            style={{ width: 38, height: 38, background: 'rgba(64,138,113,0.12)', border: '1px solid rgba(64,138,113,0.2)' }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.35-4.35" />
            </svg>
          </div>
          <div className="flex-1">
            <p className="text-sm font-bold text-white">Get Discovered</p>
            <p className="text-xs text-zinc-400 dark:text-zinc-500">Reach customers actively searching for your type of space</p>
          </div>
          <div className="text-right">
            <span className="text-2xl font-black text-white">10k+</span>
            <p className="text-xs text-brand-secondary">monthly searches</p>
          </div>
        </div>
      </div>

      {/* Bottom */}
      <div className="relative shrink-0 flex items-center gap-4">
        <p className="text-xs text-zinc-600 dark:text-zinc-400 dark:text-zinc-500">Admin-reviewed access</p>
        <span className="h-3 w-px bg-zinc-800" aria-hidden="true" />
        <p className="text-xs text-zinc-600 dark:text-zinc-400 dark:text-zinc-500">Secure payouts</p>
        <span className="h-3 w-px bg-zinc-800" aria-hidden="true" />
        <p className="text-xs text-zinc-600 dark:text-zinc-400 dark:text-zinc-500">Full booking control</p>
      </div>
    </div>
  )
}
