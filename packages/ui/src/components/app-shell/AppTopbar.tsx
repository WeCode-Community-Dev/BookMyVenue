import { cn } from '../../lib/utils'

type AppTopbarProps = {
  title: string
  subtitle?: string
  onMenuToggle?: () => void
  actions?: React.ReactNode
  className?: string
}

export function AppTopbar({ title, subtitle, onMenuToggle, actions, className }: AppTopbarProps) {
  return (
    <header
      className={cn(
        'flex h-[60px] shrink-0 items-center gap-3 border-b border-zinc-200 dark:border-ink-800 bg-white dark:bg-ink-900 px-4 lg:px-6 dark:border-ink-800 dark:bg-ink-950/95',
        className,
      )}
    >
      {/* Mobile menu toggle */}
      {onMenuToggle && (
        <button
          type="button"
          onClick={onMenuToggle}
          className="flex h-8 w-8 items-center justify-center rounded-lg text-zinc-500 dark:text-zinc-400 dark:text-zinc-500 transition-colors hover:bg-zinc-100 dark:hover:bg-ink-800 dark:bg-ink-800 dark:text-zinc-400 dark:text-zinc-500 dark:hover:bg-ink-800 lg:hidden"
          aria-label="Open navigation"
        >
          <svg className="h-4.5 w-4.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      )}

      <div className="min-w-0 flex-1">
        <h1 className="text-[15px] font-semibold tracking-tight text-zinc-900 dark:text-zinc-100 truncate">{title}</h1>
        {subtitle && (
          <p className="text-xs text-zinc-400 dark:text-zinc-500 dark:text-zinc-400 dark:text-zinc-500 truncate">{subtitle}</p>
        )}
      </div>

      {actions && (
        <div className="flex shrink-0 items-center gap-2">{actions}</div>
      )}
    </header>
  )
}
