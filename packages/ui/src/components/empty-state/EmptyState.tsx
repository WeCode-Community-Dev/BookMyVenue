import { cn } from '../../lib/utils'

type EmptyStateProps = {
  icon?: React.ReactNode
  title: string
  description?: string
  action?: React.ReactNode
  className?: string
}

export function EmptyState({ icon, title, description, action, className }: EmptyStateProps) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-zinc-200 dark:border-ink-800 bg-zinc-50/60 px-8 py-14 text-center dark:border-ink-700 dark:bg-ink-900/40',
        className,
      )}
    >
      {icon && (
        <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-zinc-200 dark:border-ink-800 bg-white dark:bg-ink-900 text-zinc-400 dark:text-zinc-500 shadow-sm dark:border-ink-700 dark:bg-ink-800">
          {icon}
        </div>
      )}
      <div className="max-w-xs">
        <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100">{title}</p>
        {description && (
          <p className="mt-1 text-xs leading-relaxed text-zinc-500 dark:text-zinc-400 dark:text-zinc-500">{description}</p>
        )}
      </div>
      {action && <div className="mt-1">{action}</div>}
    </div>
  )
}
