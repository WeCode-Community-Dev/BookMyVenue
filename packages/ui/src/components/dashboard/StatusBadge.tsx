import { cn } from '../../lib/utils'

type StatusVariant = 'success' | 'warning' | 'danger' | 'info' | 'neutral' | 'pending'

const variants: Record<StatusVariant, string> = {
  success: 'bg-emerald-50 text-emerald-700 ring-emerald-200/60',
  warning: 'bg-amber-50 text-amber-700 ring-amber-200/60',
  danger:  'bg-red-50 text-red-700 ring-red-200/60',
  info:    'bg-brand-light text-brand ring-brand-muted/60',
  neutral: 'bg-zinc-100 text-zinc-600 ring-zinc-200/60',
  pending: 'bg-violet-50 text-violet-700 ring-violet-200/60',
}

type StatusBadgeProps = {
  label: string
  variant?: StatusVariant
  dot?: boolean
  className?: string
}

export function StatusBadge({ label, variant = 'neutral', dot = true, className }: StatusBadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex shrink-0 items-center gap-1.5 whitespace-nowrap rounded-full px-2 py-0.5 text-[11px] font-medium ring-1 ring-inset',
        variants[variant],
        className,
      )}
    >
      {dot && <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-current opacity-60" aria-hidden="true" />}
      {label}
    </span>
  )
}
