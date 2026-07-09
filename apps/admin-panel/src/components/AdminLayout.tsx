import { useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../lib/AuthContext'
import { AppShell, Logo, type NavItemConfig } from '@venue404/ui'
import {
  LayoutDashboard, Building2, Users, UserCheck,
  CalendarDays, ClipboardList, Settings, Sparkles, LayoutGrid, Search, PhoneCall,
} from 'lucide-react'

const NAV: NavItemConfig[] = [
  { label: 'Dashboard',       href: '/dashboard',      icon: <LayoutDashboard className="h-4 w-4" /> },
  { label: 'Venue Approvals', href: '/venues/pending', icon: <Building2 className="h-4 w-4" /> },
  { label: 'Users',           href: '/users',          icon: <Users className="h-4 w-4" /> },
  { label: 'Venue Owners',    href: '/owners',         icon: <UserCheck className="h-4 w-4" /> },
  { label: 'Amenities',       href: '/amenities',      icon: <Sparkles className="h-4 w-4" /> },
  { label: 'Categories',      href: '/categories',     icon: <LayoutGrid className="h-4 w-4" /> },
  { label: 'Bookings',        href: '/bookings',       icon: <CalendarDays className="h-4 w-4" /> },
  { label: 'External Reservations', href: '/external-reservations', icon: <PhoneCall className="h-4 w-4" /> },
  { label: 'Deep Research',   href: '/deep-research-insights', icon: <Search className="h-4 w-4" /> },
  { label: 'Audit Log',       href: '/audit-log',      icon: <ClipboardList className="h-4 w-4" /> },
  { label: 'Settings',        href: '/settings',       icon: <Settings className="h-4 w-4" /> },
]

type AdminLayoutProps = {
  pageTitle: string
  pageSubtitle?: string
  children: React.ReactNode
}

export function AdminLayout({ pageTitle, pageSubtitle, children }: AdminLayoutProps) {
  const { user, signOut } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  async function handleSignOut() {
    await signOut()
    navigate('/login', { replace: true })
  }

  return (
    <AppShell
      navItems={NAV}
      activePath={location.pathname}
      onNavigate={navigate}
      pageTitle={pageTitle}
      pageSubtitle={pageSubtitle}
      brand={<Logo variant="dark" />}
      user={user ? {
        name: user.profile.full_name ?? user.email ?? 'Admin',
        email: user.email ?? '',
        role: 'Super Admin',
      } : undefined}
      onSignOut={handleSignOut}
    >
      {children}
    </AppShell>
  )
}
