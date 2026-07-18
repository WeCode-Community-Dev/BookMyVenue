import { useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../lib/AuthContext'
import { AppShell, Logo, type NavItemConfig, Button, ThemeToggle } from '@venue404/ui'
import {
  LayoutDashboard, Building2, CalendarDays, Wallet, Plus, MessageSquare, Star
} from 'lucide-react'
import { NotificationDropdown } from './NotificationDropdown'

const NAV: NavItemConfig[] = [
  { label: 'Dashboard',  href: '/',           icon: <LayoutDashboard className="h-4 w-4" /> },
  { label: 'My Venues',  href: '/venues',     icon: <Building2 className="h-4 w-4" /> },
  { label: 'Bookings',   href: '/bookings',   icon: <CalendarDays className="h-4 w-4" /> },
  { label: 'Messages',   href: '/messages',   icon: <MessageSquare className="h-4 w-4" /> },
  { label: 'Reviews',    href: '/reviews',    icon: <Star className="h-4 w-4" /> },
  { label: 'Financials', href: '/financials', icon: <Wallet className="h-4 w-4" /> },
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
      <div id="topbar-portal-target" className="flex items-center gap-3 mr-auto"></div>
      <NotificationDropdown />
      <ThemeToggle className="mr-1" />
    </div>
  )

  if (location.pathname === '/venues' || location.pathname === '/venues/') {
    displayTitle = 'My Venues'
    displaySubtitle = 'Manage your listed properties and their settings.'
    topbarActions = (
      <div className="flex items-center gap-3">
        <Button variant="primary" onClick={() => navigate('/venues/new')} className="gap-2 h-9 px-4 text-sm font-medium rounded-md flex items-center mr-2">
          <Plus className="h-4 w-4" /> Add New Venue
        </Button>
        <NotificationDropdown />
        <ThemeToggle className="mr-1" />
      </div>
    )
  } else if (location.pathname.endsWith('/overview')) {
    displayTitle = 'Venue Overview'
    displaySubtitle = "Manage your venue's performance and settings."
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
  } else if (location.pathname === '/reviews' || location.pathname === '/reviews/') {
    displayTitle = 'Reviews'
    displaySubtitle = 'All guest reviews across your venues.'
  } else if (location.pathname.startsWith('/reviews/')) {
    displayTitle = 'Review Detail'
    displaySubtitle = 'Full review from your guest.'
  } else if (location.pathname.startsWith('/bookings')) {
    displayTitle = 'All Bookings'
    displaySubtitle = 'View and manage all booking requests across your venues.'
  } else if (location.pathname.startsWith('/financials')) {
    displayTitle = 'Financial Ledger'
    displaySubtitle = 'Real-time transaction history and financial metrics.'
  } else if (location.pathname === '/messages') {
    displayTitle = 'Messages'
    displaySubtitle = 'Chat with customers about their bookings.'
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
