import { cn } from '../../lib/utils'

type ErrorStateProps = {
  title?: string
  message?: string
  action?: React.ReactNode
  fullScreen?: boolean
  className?: string
}

export function ErrorState({
  title = 'Something went wrong',
  message = 'An unexpected error occurred. Please try again.',
  action,
  fullScreen = true,
  className,
}: ErrorStateProps) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center px-4 text-center',
        fullScreen && 'min-h-[100dvh] bg-zinc-50 dark:bg-ink-950',
        !fullScreen && 'py-16',
        className,
      )}
    >
      <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-red-100 bg-red-50 dark:border-red-900/50 dark:bg-red-950/30">
        <svg className="h-5 w-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z"
          />
        </svg>
      </div>
      <h3 className="mt-4 text-base font-semibold text-zinc-900 dark:text-zinc-100">{title}</h3>
      <p className="mt-1 max-w-xs text-sm text-zinc-500 dark:text-zinc-400 dark:text-zinc-500">{message}</p>
      {action && <div className="mt-5">{action}</div>}
    </div>
  )
}
