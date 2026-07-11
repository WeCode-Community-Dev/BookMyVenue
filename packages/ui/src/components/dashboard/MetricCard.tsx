import { cn } from '../../lib/utils'

export type MetricCardAccent = 'brand' | 'amber' | 'emerald' | 'violet' | 'rose'

const accentMap: Record<MetricCardAccent, { icon: string; value: string; badge: string }> = {
  brand:   { icon: 'bg-brand-light dark:bg-brand-secondary/20 text-brand dark:text-brand-secondary',   value: 'text-zinc-900 dark:text-zinc-100', badge: 'bg-brand-light dark:bg-brand-secondary/20 text-brand dark:text-brand-secondary' },
  amber:   { icon: 'bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400',  value: 'text-zinc-900 dark:text-zinc-100', badge: 'bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400' },
  emerald: { icon: 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400', value: 'text-zinc-900 dark:text-zinc-100', badge: 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400' },
  violet:  { icon: 'bg-violet-50 dark:bg-violet-500/10 text-violet-600 dark:text-violet-400', value: 'text-zinc-900 dark:text-zinc-100', badge: 'bg-violet-50 dark:bg-violet-500/10 text-violet-600 dark:text-violet-400' },
  rose:    { icon: 'bg-rose-50 dark:bg-rose-500/10 text-rose-600 dark:text-rose-400',    value: 'text-zinc-900 dark:text-zinc-100', badge: 'bg-rose-50 dark:bg-rose-500/10 text-rose-600 dark:text-rose-400' },
}

export type DashboardMetric = {
  label: string
  value: string
  description?: string
  trend?: string
  trendUp?: boolean
  icon?: React.ReactNode
  accent?: MetricCardAccent
}

type MetricCardProps = DashboardMetric & {
  className?: string
  onClick?: () => void
}

export function MetricCard({
  label,
  value,
  description,
  trend,
  trendUp,
  icon,
  accent = 'brand',
  className,
  onClick,
}: MetricCardProps) {
  const colors = accentMap[accent]

  return (
    <div
      className={cn(
        'rounded-xl border border-zinc-200 dark:border-ink-800 bg-white dark:bg-ink-900 p-4 shadow-sm',
        onClick && 'cursor-pointer transition-shadow duration-150 hover:shadow-md press',
        className,
      )}
      onClick={onClick}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-xs font-medium text-zinc-500 dark:text-zinc-400 dark:text-zinc-500">{label}</p>
          <p className={cn('mt-2 text-2xl font-semibold tabular-nums tracking-tight', colors.value)}>
            {value}
          </p>
          {description && (
            <p className="mt-0.5 text-xs text-zinc-400 dark:text-zinc-500 truncate">{description}</p>
          )}
        </div>

        {icon && (
          <div className={cn('flex h-9 w-9 shrink-0 items-center justify-center rounded-lg', colors.icon)}>
            {icon}
          </div>
        )}
      </div>

      {trend && (
        <div className="mt-3 flex items-center gap-1.5">
          <svg
            className={cn('h-3.5 w-3.5', trendUp ? 'text-emerald-500' : 'text-red-500', !trendUp && 'rotate-180')}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 10l7-7m0 0l7 7m-7-7v18" />
          </svg>
          <span className={cn('text-xs font-medium', trendUp ? 'text-emerald-600' : 'text-red-600')}>
            {trend}
          </span>
        </div>
      )}
    </div>
  )
}
