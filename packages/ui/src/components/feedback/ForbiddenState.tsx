import { cn } from '../../lib/utils'

type ForbiddenStateProps = {
  title?: string
  message?: string
  action?: React.ReactNode
  className?: string
}

export function ForbiddenState({
  title = 'Access Denied',
  message = 'You do not have permission to view this page. Admin access is required.',
  action,
  className,
}: ForbiddenStateProps) {
  return (
    <div
      className={cn(
        'flex min-h-[100dvh] flex-col items-center justify-center bg-zinc-50 dark:bg-ink-800 px-4',
        className,
      )}
    >
      {/* Icon */}
      <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-zinc-200 dark:border-ink-800 bg-white dark:bg-ink-900 shadow-sm">
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
            d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z"
          />
        </svg>
      </div>

      <div className="mt-5 text-center">
        <p className="text-[11px] font-semibold uppercase tracking-widest text-zinc-400 dark:text-zinc-500">
          403 Forbidden
        </p>
        <h1 className="mt-2 text-xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-100">{title}</h1>
        <p className="mx-auto mt-2 max-w-sm text-sm leading-relaxed text-zinc-500 dark:text-zinc-400 dark:text-zinc-500">{message}</p>
      </div>

      {action && <div className="mt-7">{action}</div>}
    </div>
  )
}
