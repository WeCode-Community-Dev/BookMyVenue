import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuthStore } from "@/stores/authStore";
import { Button } from "@/components/ui/Button";
import { authApi } from "@/api/auth";

export function Navbar() {
  const { isAuthenticated, user, logout } = useAuthStore();
  const navigate = useNavigate();

  const linkClass = ({ isActive }: { isActive: boolean }) =>
    `text-sm font-medium hover:text-brand-600 ${
      isActive ? "text-brand-600" : "text-gray-600"
    }`;

  const handleLogout = async () => {
    try {
      await authApi.logout();
    } catch {
      // ignore network errors; clear local state regardless
    }
    logout();
    navigate("/");
  };

  return (
    <header className="sticky top-0 z-30 border-b border-gray-200 bg-white">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
        <Link to="/" className="flex items-center gap-2">
          <span className="flex h-8 w-8 items-center justify-center rounded-md bg-brand-600 text-sm font-bold text-white">
            B
          </span>
          <span className="text-lg font-bold text-gray-900">
            Book<span className="text-brand-600">MyVenue</span>
          </span>
        </Link>

        <nav className="flex items-center gap-6">
          <NavLink to="/venues" className={linkClass}>
            Explore
          </NavLink>
          {isAuthenticated && (user?.role === "user" || user?.role === "admin") && (
            <NavLink to="/bookings" className={linkClass}>
              My Bookings
            </NavLink>
          )}
          {isAuthenticated && (user?.role === "owner" || user?.role === "admin") && (
            <NavLink to="/owner" className={linkClass}>
              Owner
            </NavLink>
          )}
          {isAuthenticated && user?.role === "admin" && (
            <NavLink to="/admin" className={linkClass}>
              Admin
            </NavLink>
          )}
        </nav>

        <div className="flex items-center gap-3">
          {isAuthenticated && user ? (
            <>
              <span className="hidden text-sm text-gray-600 sm:inline">
                {user.name}{" "}
                <span className="text-brand-600">({user.role})</span>
              </span>
              <Button variant="outline" size="sm" onClick={handleLogout}>
                Logout
              </Button>
            </>
          ) : (
            <>
              <Link to="/login">
                <Button variant="ghost" size="sm">
                  Login
                </Button>
              </Link>
              <Link to="/signup">
                <Button size="sm">Sign up</Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}

export function Footer() {
  return (
    <footer className="border-t border-gray-200 bg-white py-6">
      <div className="mx-auto max-w-6xl px-4 text-center text-sm text-gray-500">
        BookMyVenue &copy; {new Date().getFullYear()} &middot; Find & book the perfect nearby space.
      </div>
    </footer>
  );
}
