import { lazy, Suspense } from 'react'
import { Navigate } from 'react-router-dom'
import { PageLoader } from '../components/ui/LoadingSkeleton'

const AdminApp       = lazy(() => import('../features/admin/AdminApp.jsx'))
const AdminLogin     = lazy(() => import('../features/admin/pages/AdminLogin'))
const AdminLayout    = lazy(() => import('../features/admin/components/AdminLayout'))
const AdminDashboard = lazy(() => import('../features/admin/pages/AdminDashboard'))
const AdminVenueQueue  = lazy(() => import('../features/admin/pages/AdminVenueQueue'))
const AdminVenueDetail = lazy(() => import('../features/admin/pages/AdminVenueDetails'))

const AdminSuspense = ({ children }) => (
  <Suspense fallback={<PageLoader label="Loading admin..." />}>
    {children}
  </Suspense>
)

export const adminRoutes = [
  {
    path: '/admin/login',
    element: <AdminSuspense><AdminLogin /></AdminSuspense>,
  },
  {
    path: '/admin',
    element: (
      <AdminSuspense>
        <AdminApp />   {/* admin auth init shell — mirrors App.jsx */}
      </AdminSuspense>
    ),
    children: [
      {
        element: <AdminLayout />,  // sidebar layout wraps all below
        children: [
          { index: true, element: <Navigate to="dashboard" replace /> },
          { path: 'dashboard', element: <AdminDashboard /> },
          { path: 'venue-approvals', element: <AdminVenueQueue /> },
          { path: 'venue-approvals/:id', element: <AdminVenueDetail /> },
        ]
      }
    ]
  }
]