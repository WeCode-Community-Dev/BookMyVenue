import { useState } from 'react'
import { cn } from '../../lib/utils'
import { AppSidebar } from './AppSidebar'
import { AppTopbar } from './AppTopbar'
import type { NavItemConfig } from './NavItem'

type AppShellProps = {
  navItems: NavItemConfig[]
  activePath: string
  onNavigate: (href: string) => void
  pageTitle: string
  pageSubtitle?: string
  brand?: React.ReactNode
  user?: { name: string; email: string; role?: string }
  onSignOut?: () => void
  topbarActions?: React.ReactNode
  children: React.ReactNode
  className?: string
}

export function AppShell({
  navItems,
  activePath,
  onNavigate,
  pageTitle,
  pageSubtitle,
  brand,
  user,
  onSignOut,
  topbarActions,
  children,
  className,
}: AppShellProps) {
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <div className={cn('min-h-[100dvh] bg-zinc-50 dark:bg-ink-950', className)}>
      <AppSidebar
        navItems={navItems}
        activePath={activePath}
        onNavigate={onNavigate}
        brand={brand}
        user={user}
        onSignOut={onSignOut}
        mobileOpen={mobileOpen}
        onMobileClose={() => setMobileOpen(false)}
      />

      <div className="flex flex-col lg:pl-[var(--sidebar-width,248px)]">
        <AppTopbar
          title={pageTitle}
          subtitle={pageSubtitle}
          onMenuToggle={() => setMobileOpen(true)}
          actions={topbarActions}
        />
        <main className="flex-1 p-4 lg:p-6 page-enter">
          {children}
        </main>
      </div>
    </div>
  )
}
