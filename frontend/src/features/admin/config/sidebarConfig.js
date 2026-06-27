import {
  FiGrid,
  FiCheckCircle,
  FiLogOut,
  FiBell,
  FiChevronDown
} from 'react-icons/fi'

export const ADMIN_SIDEBAR_CONFIG = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    path: '/admin/dashboard',
    icon: FiGrid,
    default: true
  },
  {
    id: 'venue-approvals',
    label: 'Venue Approvals',
    path: '/admin/venue-approvals',
    icon: FiCheckCircle
  }
]
