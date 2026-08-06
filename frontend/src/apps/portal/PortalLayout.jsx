import { Link, Outlet, useNavigate } from "react-router-dom"
import {
  LayoutDashboard,
  Building2,
  CalendarDays,
  IndianRupee,
  LogOut,
} from "lucide-react"
import { useAuth } from "../../contexts/AuthContext"

export default function PortalLayout({
  title = "Venue Owner Portal",
  loginPath = "/venue/auth",
}) {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate(loginPath, { replace: true })
  }

  const userInitial =
    user?.full_name?.charAt(0)?.toUpperCase() ||
    user?.email?.charAt(0)?.toUpperCase() ||
    "V"

  const userLabel = user?.full_name?.trim() || user?.email || "Venue owner"
  const menuItems = [
    {
      label: "Dashboard",
      icon: LayoutDashboard,
      path: "/venue",
    },
    {
      label: "Venues",
      icon: Building2,
      path: "/venue/venues",
    },
    {
      label: "Bookings",
      icon: CalendarDays,
      path: "/venue/bookings",
    },
    {
      label: "Transactions",
      icon: IndianRupee,
      path: "/venue/transactions",
    },
  ]

  return (
    <div className="flex min-h-screen bg-slate-50">
      {/* Sidebar */}
      <aside className="flex w-64 flex-col border-r bg-white">
        <div className="border-b p-5">
          <div className="flex items-center gap-3">
            <div className="grid h-10 w-10 place-items-center rounded-xl bg-primary text-white font-bold">
              BM
            </div>

            <div>
              <h2 className="font-semibold">BookMyVenue</h2>
              <p className="text-sm text-muted-foreground">
                Venue Owner
              </p>
            </div>
          </div>
        </div>

        <nav className="flex-1 p-3">
          <div className="space-y-1">
            {menuItems.map((item) => {
              const Icon = item.icon

              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition hover:bg-muted"
                >
                  <Icon size={18} />
                  {item.label}
                </Link>
              )
            })}
          </div>
        </nav>

        <div className="border-t p-3">
          <div className="mb-3 flex items-center gap-3 rounded-lg px-3 py-2">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-semibold text-white">
              {userInitial}
            </div>
            <div className="min-w-0">
              <p className="truncate text-sm font-medium text-foreground">
                {userLabel}
              </p>
              {user?.email && user?.full_name && (
                <p className="truncate text-xs text-muted-foreground">
                  {user.email}
                </p>
              )}
            </div>
          </div>
          <button
            type="button"
            onClick={handleLogout}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition hover:bg-red-50 hover:text-red-600 cursor-pointer"
          >
            <LogOut size={18} />
            Logout
          </button>
        </div>
      </aside>

      {/* Right Section */}
      <div className="flex flex-1 flex-col">
        {/* Navbar */}
        <header className="sticky top-0 z-10 border-b bg-white">
          <div className="flex h-16 items-center justify-between px-6">
            <h1 className="text-lg font-semibold">{title}</h1>

            <div className="flex items-center gap-4">
              <Link
                to="/"
                className="rounded-lg border px-3 py-2 text-sm hover:bg-muted"
              >
                View Website
              </Link>

              <div
                className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-sm font-semibold text-white"
                title={userLabel}
              >
                {userInitial}
              </div>
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 p-6 overflow-auto">
          <Outlet />
        </main>

        {/* Footer */}
        <footer className="border-t bg-white px-6 py-3 text-sm text-muted-foreground">
          © 2026 BookMyVenue. All rights reserved.
        </footer>
      </div>
    </div>
  )
}