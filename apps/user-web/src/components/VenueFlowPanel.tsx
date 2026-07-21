export function VenueFlowPanel() {
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
        <span className="text-xs font-medium uppercase tracking-widest text-zinc-500">
          Venue404
        </span>
      </div>

      {/* Headline */}
      <div className="relative shrink-0">
        <h2 className="text-[1.6rem] font-bold leading-snug tracking-tight text-white">
          500+ spaces for<br />every occasion
        </h2>
        <p className="mt-1.5 text-sm text-zinc-400">
          From intimate studios to grand banquet halls
        </p>
      </div>

      {/* Bento grid */}
      <div className="relative grid flex-1 grid-cols-3 grid-rows-3 gap-3">

        {/* ── Feature: Party Spaces (2×2) ── */}
        <div
          className="col-start-1 col-span-2 row-start-1 row-span-2 relative flex flex-col justify-between overflow-hidden rounded-2xl p-6"
          style={{
            background: 'rgba(40,90,72,0.22)',
            border: '1px solid rgba(64,138,113,0.28)',
          }}
        >
          {/* Subtle inner glow top-right */}
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
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M5.8 11.3 2 22l10.7-3.79" />
                <path d="M4 3h.01M22 8h.01M15 2h.01M22 20h.01" />
                <path d="m22 2-2.24.75a2.9 2.9 0 0 0-1.96 3.12c.1.86-.57 1.63-1.45 1.63h-.38c-.86 0-1.6.6-1.76 1.44L14 10" />
                <path d="m22 13-.82-.33c-.86-.34-1.82.2-1.98 1.11-.11.7-.72 1.22-1.43 1.22H17" />
                <path d="m11 2 .33.82c.34.86-.2 1.82-1.11 1.98C9.52 4.9 9 5.52 9 6.23V7" />
                <path d="M11 13c1.93 1.93 2.83 4.17 2 5-.83.83-3.07-.07-5-2-1.93-1.93-2.83-4.17-2-5 .83-.83 3.07.07 5 2z" />
              </svg>
            </div>
            <p className="mt-4 text-base font-bold text-white">Party Spaces</p>
            <p className="mt-1 text-xs leading-relaxed text-zinc-400">
              Birthdays, reunions &amp; celebrations
            </p>
          </div>

          <div>
            <span className="text-4xl font-black tracking-tight text-white">120+</span>
            <p className="mt-0.5 text-xs text-brand-secondary">available spaces</p>
          </div>
        </div>

        {/* ── Photo Studios ── */}
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
              <path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z" />
              <circle cx="12" cy="13" r="3" />
            </svg>
          </div>
          <div>
            <p className="text-xs font-semibold text-zinc-300">Photo Studios</p>
            <p className="mt-0.5 text-2xl font-black text-white">45+</p>
          </div>
        </div>

        {/* ── Banquet Halls ── */}
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
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
              <polyline points="9 22 9 12 15 12 15 22" />
            </svg>
          </div>
          <div>
            <p className="text-xs font-semibold text-zinc-300">Banquet Halls</p>
            <p className="mt-0.5 text-2xl font-black text-white">80+</p>
          </div>
        </div>

        {/* ── Rooftop Venues (full-width bottom) ── */}
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
              <path d="M12 2v1M4.93 4.93l.7.7M2 12h1M4.93 19.07l.7-.7M12 23v-1M19.07 19.07l-.7-.7M23 12h-1M19.07 4.93l-.7.7" />
              <circle cx="12" cy="12" r="4" />
            </svg>
          </div>
          <div className="flex-1">
            <p className="text-sm font-bold text-white">Rooftop Venues</p>
            <p className="text-xs text-zinc-400">Sunset views &amp; open-air events</p>
          </div>
          <div className="text-right">
            <span className="text-2xl font-black text-white">30+</span>
            <p className="text-xs text-brand-secondary">spaces</p>
          </div>
        </div>
      </div>

      {/* Bottom */}
      <div className="relative shrink-0 flex items-center gap-4">
        <p className="text-xs text-zinc-600">Secure payments</p>
        <span className="h-3 w-px bg-zinc-800" aria-hidden="true" />
        <p className="text-xs text-zinc-600">Easy refunds</p>
        <span className="h-3 w-px bg-zinc-800" aria-hidden="true" />
        <p className="text-xs text-zinc-600">Real spaces</p>
      </div>
    </div>
  )
}
