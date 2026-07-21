import { cn } from '../../lib/utils'

type NotFoundStateProps = {
  title?: string
  message?: string
  action?: React.ReactNode
  className?: string
}

export function NotFoundState({
  title = 'Page not found',
  message = 'The page you are looking for does not exist or has been moved.',
  action,
  className,
}: NotFoundStateProps) {
  return (
    <div
      className={cn(
        'relative flex min-h-[100dvh] flex-col items-center justify-center overflow-hidden bg-zinc-50 dark:bg-ink-800 px-4',
        className,
      )}
    >
      {/* Subtle grid background */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage:
            'linear-gradient(rgba(0,0,0,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.03) 1px, transparent 1px)',
          backgroundSize: '40px 40px',
        }}
      />

      {/* Radial fade over grid */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background: 'radial-gradient(ellipse 70% 50% at 50% 50%, transparent 0%, #fafafa 100%)',
        }}
      />

      <div className="relative flex flex-col items-center text-center">
        {/* Large 404 numerals */}
        <div className="relative select-none">
          <span
            className="block font-semibold leading-none tracking-tighter text-zinc-100"
            style={{ fontSize: 'clamp(120px, 20vw, 200px)' }}
            aria-hidden="true"
          >
            404
          </span>
          {/* Floating icon centred over the numerals */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-zinc-200 dark:border-ink-800 bg-white dark:bg-ink-900 shadow-sm ring-1 ring-zinc-100">
              <svg
                className="h-6 w-6 text-zinc-400 dark:text-zinc-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z"
                />
              </svg>
            </div>
          </div>
        </div>

        {/* Text block */}
        <div className="mt-1">
          <p className="text-[11px] font-semibold uppercase tracking-widest text-zinc-400 dark:text-zinc-500">
            404 Not Found
          </p>
          <h1 className="mt-2 text-xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-100">{title}</h1>
          <p className="mx-auto mt-2 max-w-sm text-sm leading-relaxed text-zinc-500 dark:text-zinc-400 dark:text-zinc-500">{message}</p>
        </div>

        {action && <div className="mt-8">{action}</div>}
      </div>
    </div>
  )
}
