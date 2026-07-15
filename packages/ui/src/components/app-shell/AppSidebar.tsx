import { cn } from '../../lib/utils'
import { NavItem, type NavItemConfig } from './NavItem'
import { UserMenu } from './UserMenu'
import { X } from 'lucide-react'

type AppSidebarProps = {
  navItems: NavItemConfig[]
  activePath: string
  onNavigate: (href: string) => void
  brand?: React.ReactNode
  user?: { name: string; email: string; role?: string }
  onSignOut?: () => void
  className?: string
  mobileOpen?: boolean
  onMobileClose?: () => void
  secondaryNavItems?: NavItemConfig[]
  secondaryNavLabel?: string
}

export function AppSidebar({
  navItems,
  activePath,
  onNavigate,
  brand,
  user,
  onSignOut,
  className,
  mobileOpen,
  onMobileClose,
  secondaryNavItems,
  secondaryNavLabel,
}: AppSidebarProps) {
  const sidebar = (
    <aside
      className={cn(
        'flex h-full w-[var(--sidebar-width,248px)] flex-col bg-brand-black',
        className,
      )}
    >
      {/* Brand */}
      {brand && (
        <div className="flex h-[60px] shrink-0 items-center justify-between border-b border-zinc-800/60 px-4">
          {brand}
          <button 
            type="button" 
            onClick={onMobileClose} 
            className="lg:hidden text-zinc-400 dark:text-zinc-500 hover:text-white transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
      )}

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto px-2 py-3" aria-label="Main navigation">
        {/* Primary nav group */}
        <p className="mb-1.5 px-2.5 text-[10.5px] font-semibold uppercase tracking-widest text-zinc-600 dark:text-zinc-400 dark:text-zinc-500">
          Management
        </p>
        <ul className="space-y-0.5">
          {navItems.map((item) => (
            <li key={item.href}>
              <NavItem
                {...item}
                active={
                  item.href === '/'
                    ? activePath === item.href
                    : activePath === item.href || activePath.startsWith(item.href + '/')
                }
                onClick={() => {
                  onNavigate(item.href)
                  onMobileClose?.()
                }}
              />
            </li>
          ))}
        </ul>

        {/* Secondary / contextual nav group */}
        {secondaryNavItems && secondaryNavItems.length > 0 && (
          <div className="mt-5">
            <div className="mb-1.5 flex items-center gap-2 px-2.5">
              <div className="h-px flex-1 bg-zinc-800/60" />
              <p className="text-[10.5px] font-semibold uppercase tracking-widest text-zinc-600">
                {secondaryNavLabel ?? 'This Venue'}
              </p>
              <div className="h-px flex-1 bg-zinc-800/60" />
            </div>
            <ul className="space-y-0.5">
              {secondaryNavItems.map((item) => (
                <li key={item.href}>
                  <NavItem
                    {...item}
                    active={activePath === item.href || activePath.startsWith(item.href + '/')}
                    onClick={() => {
                      onNavigate(item.href)
                      onMobileClose?.()
                    }}
                  />
                </li>
              ))}
            </ul>
          </div>
        )}
      </nav>

      {/* User */}
      {user && (
        <div className="shrink-0 border-t border-zinc-800/60 p-2">
          <UserMenu {...user} onSignOut={onSignOut} />
        </div>
      )}
    </aside>
  )

  return (
    <>
      {/* Desktop: fixed sidebar */}
      <div className="hidden lg:flex lg:flex-col lg:fixed lg:inset-y-0 lg:z-20">{sidebar}</div>

      {/* Mobile: drawer */}
      {mobileOpen && (
        <>
          <div
            className="fixed inset-0 z-30 bg-black/60 backdrop-blur-sm lg:hidden"
            onClick={onMobileClose}
            aria-hidden="true"
          />
          <div className="fixed inset-y-0 left-0 z-40 flex lg:hidden">{sidebar}</div>
        </>
      )}
    </>
  )
}
