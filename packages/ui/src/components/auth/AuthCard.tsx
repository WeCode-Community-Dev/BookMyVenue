import { cn } from '../../lib/utils'

type AuthCardProps = {
  title: string
  subtitle?: string
  children: React.ReactNode
  footer?: React.ReactNode
  className?: string
}

export function AuthCard({ title, subtitle, children, footer, className }: AuthCardProps) {
  return (
    <div className={cn('w-full', className)}>
      <div className="mb-8">
        <h1 className="text-2xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-100">{title}</h1>
        {subtitle && (
          <p className="mt-1.5 text-sm leading-relaxed text-zinc-500 dark:text-zinc-400 dark:text-zinc-500">{subtitle}</p>
        )}
      </div>
      <div>{children}</div>
      {footer && (
        <p className="mt-8 text-center text-xs text-zinc-400 dark:text-zinc-500">{footer}</p>
      )}
    </div>
  )
}
