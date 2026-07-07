import { ReactNode } from 'react'
import { cn } from './lib/utils'

type Variant = 'success' | 'destructive' | 'warning' | 'info'

interface AlertProps {
  children: ReactNode
  variant?: Variant
  className?: string
}

const variantStyles: Record<Variant, string> = {
  success: 'bg-emerald-50 border-emerald-100 text-emerald-700 dark:bg-emerald-950/30 dark:border-emerald-900/50 dark:text-emerald-400',
  destructive: 'bg-red-50 border-red-100 text-red-700 dark:bg-red-950/30 dark:border-red-900/50 dark:text-red-400',
  warning: 'bg-amber-50 border-amber-100 text-amber-700 dark:bg-amber-950/30 dark:border-amber-900/50 dark:text-amber-400',
  info: 'bg-zinc-50 border-zinc-100 text-zinc-700 dark:bg-ink-800 dark:border-ink-700 dark:text-zinc-300',
}

export default function Alert({ children, variant = 'info', className = '' }: AlertProps) {
  return (
    <div className={cn('rounded-xl border px-4 py-4 text-sm', variantStyles[variant], className)}>
      {children}
    </div>
  )
}
