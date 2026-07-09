import { cn } from '../../lib/utils'

type FeaturePill = {
  label: string
  icon?: React.ReactNode
}

type AuthStatusPanelProps = {
  title: string
  description: string
  features?: FeaturePill[]
  tagline?: string
  footnote?: string
  className?: string
}

export function AuthStatusPanel({ title, description, features, tagline = 'Venue404 Admin', footnote = 'Restricted access. All sessions are logged.', className }: AuthStatusPanelProps) {
  return (
    <div className={cn('relative flex h-full flex-col justify-between p-12', className)}>
      {/* Subtle dot-grid pattern */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage:
            'radial-gradient(circle, rgba(255,255,255,0.06) 1px, transparent 1px)',
          backgroundSize: '28px 28px',
        }}
      />

      {/* Top: brand name */}
      <div className="relative">
        <span className="text-xs font-medium tracking-widest text-zinc-500 dark:text-zinc-400 dark:text-zinc-500 uppercase">
          {tagline}
        </span>
      </div>

      {/* Centre: headline */}
      <div className="relative space-y-4">
        <h2 className="text-3xl font-semibold leading-snug tracking-tight text-white">
          {title}
        </h2>
        <p className="max-w-xs text-sm leading-relaxed text-zinc-400 dark:text-zinc-500">{description}</p>

        {features && features.length > 0 && (
          <div className="mt-8 grid grid-cols-2 gap-2.5 pt-2">
            {features.map((f) => (
              <div
                key={f.label}
                className="flex items-center gap-2.5 rounded-lg border border-zinc-800 bg-zinc-900/60 px-3.5 py-2.5"
              >
                {f.icon && (
                  <span className="shrink-0 text-brand-secondary">{f.icon}</span>
                )}
                <span className="text-sm font-medium text-zinc-300 dark:text-zinc-600">{f.label}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Bottom: fine print */}
      <div className="relative">
        <p className="text-xs text-zinc-600 dark:text-zinc-400 dark:text-zinc-500">{footnote}</p>
      </div>
    </div>
  )
}
