import { Outlet, ScrollRestoration } from 'react-router-dom'

// Data routers don't reset scroll position on navigation by default —
// without this, pushing a new route keeps whatever scrollY the previous
// page was left at (e.g. landing on a venue page mid-scroll).
export function RootLayout() {
  return (
    <>
      <Outlet />
      <ScrollRestoration />
    </>
  )
}
