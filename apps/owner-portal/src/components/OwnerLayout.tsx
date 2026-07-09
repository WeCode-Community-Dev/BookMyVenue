import { useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../lib/AuthContext'
import { AppShell, Logo, type NavItemConfig, Button, ThemeToggle } from '@venue404/ui'
import {
  LayoutDashboard, Building2, CalendarDays, Wallet, Plus
} from 'lucide-react'

const NAV: NavItemConfig[] = [
  { label: 'Dashboard',        href: '/',                  icon: <LayoutDashboard className="h-4 w-4" /> },
  { label: 'My Venues',        href: '/venues',            icon: <Building2 className="h-4 w-4" /> },
  { label: 'Bookings',         href: '/bookings',          icon: <CalendarDays className="h-4 w-4" /> },
  { label: 'Financials',       href: '/financials',        icon: <Wallet className="h-4 w-4" /> },
]

type OwnerLayoutProps = {
  pageTitle: string
  pageSubtitle?: string
  children: React.ReactNode
}

export function OwnerLayout({ pageTitle, pageSubtitle, children }: OwnerLayoutProps) {
  const { user, signOut } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  async function handleSignOut() {
    await signOut()
    navigate('/login', { replace: true })
  }

  let displayTitle = pageTitle
  let displaySubtitle = pageSubtitle
  let topbarActions: React.ReactNode = (
    <div className="flex items-center gap-3 h-full w-full justify-end">
      <ThemeToggle className="mr-1" />
      <div id="topbar-portal-target" className="flex items-center gap-3"></div>
    </div>
  )

  if (location.pathname === '/venues' || location.pathname === '/venues/') {
    displayTitle = 'My Venues'
    displaySubtitle = 'Manage your listed properties and their settings.'
    topbarActions = (
      <div className="flex items-center gap-3">
        <ThemeToggle className="mr-1" />
        <Button variant="primary" onClick={() => navigate('/venues/new')} className="gap-2 h-9 px-4 text-sm font-medium bg-[#2d6a4f] hover:bg-[#1b4332] border-none text-white shadow-sm rounded-md flex items-center">
          <Plus className="h-4 w-4" /> Add New Venue
        </Button>
      </div>
    )
  } else if (location.pathname.endsWith('/overview')) {
    displayTitle = 'Venue Overview'
    displaySubtitle = 'Manage your venue\'s performance and settings.'
  } else if (location.pathname.includes('/edit/')) {
    const editSection = location.pathname.split('/').pop() || 'details'
    const titleMap: Record<string, string> = {
      'details': 'Basic Details',
      'photos': 'Manage Photos',
      'amenities': 'Amenities',
      'operating-hours': 'Operating Hours',
      'booking-settings': 'Booking Settings',
      'pricing': 'Pricing',
      'policies': 'Cancellation Policies'
    }
    displayTitle = `Edit ${titleMap[editSection] || 'Venue'}`
    displaySubtitle = 'Update your venue settings below. Changes take effect immediately.'
  } else if (location.pathname === '/') {
    displayTitle = 'Dashboard'
  } else if (location.pathname.startsWith('/bookings')) {
    displayTitle = 'All Bookings'
    displaySubtitle = 'View and manage all booking requests across your venues.'
  } else if (location.pathname.startsWith('/financials')) {
    displayTitle = 'Financial Ledger'
    displaySubtitle = 'Real-time transaction history and financial metrics.'
  } else if (location.pathname.endsWith('/calendar')) {
    displayTitle = 'Calendar & Availability'
    displaySubtitle = 'Manage your regular weekly hours and set specific dates when your venue is unavailable.'
  } else if (location.pathname.endsWith('/pricing-rules')) {
    displayTitle = 'Dynamic Pricing'
    displaySubtitle = 'Set percentage rules for weekends, peak hours, and special dates. The highest-priority matching rule wins.'
  }

  return (
    <AppShell
      navItems={NAV}
      activePath={location.pathname}
      onNavigate={navigate}
      pageTitle={displayTitle}
      pageSubtitle={displaySubtitle}
      brand={<Logo variant="dark" />}
      user={user ? {
        name: user.profile.full_name ?? user.email ?? 'Owner',
        email: user.email ?? '',
        role: 'Venue Owner',
      } : undefined}
      onSignOut={handleSignOut}
      topbarActions={topbarActions}
    >
      {children}
    </AppShell>
  )
}
