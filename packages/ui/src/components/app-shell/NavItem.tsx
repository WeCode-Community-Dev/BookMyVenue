import { cn } from '../../lib/utils'

export type NavItemConfig = {
  label: string
  href: string
  icon?: React.ReactNode
}

type NavItemProps = NavItemConfig & {
  active?: boolean
  onClick?: () => void
}

export function NavItem({ label, href, icon, active, onClick }: NavItemProps) {
  return (
    <a
      href={href}
      onClick={(e) => {
        if (onClick) {
          e.preventDefault()
          onClick()
        }
      }}
      className={cn(
        'group relative flex items-center gap-2.5 rounded-md px-2.5 py-2 text-sm font-medium transition-colors duration-150',
        active
          ? 'bg-zinc-800 text-white'
          : 'text-zinc-400 dark:text-zinc-500 hover:bg-zinc-800/60 hover:text-zinc-100',
      )}
      aria-current={active ? 'page' : undefined}
    >
      {/* Left accent bar for active state */}
      {active && (
        <span
          aria-hidden="true"
          className="absolute inset-y-1 left-0 w-0.5 rounded-r-full bg-brand-secondary"
        />
      )}

      {icon && (
        <span
          className={cn(
            'flex h-[18px] w-[18px] shrink-0 items-center justify-center',
            active ? 'text-brand-secondary' : 'text-zinc-500 dark:text-zinc-400 dark:text-zinc-500 group-hover:text-zinc-300 dark:text-zinc-600',
          )}
        >
          {icon}
        </span>
      )}

      <span className="truncate">{label}</span>
    </a>
  )
}
