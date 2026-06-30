import { Link, useNavigate } from "@tanstack/react-router";
import { useAuth, useUserRoles } from "@/hooks/use-auth";
import { authProvider } from "@/infrastructure/providers";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { User as UserIcon } from "lucide-react";

export function SiteNav() {
  const { user, loading } = useAuth();
  const { isHost, isAdmin } = useUserRoles();
  const navigate = useNavigate();

  async function signOut() {
    await authProvider.signOut();
    navigate({ to: "/" });
  }

  return (
    <nav className="sticky top-0 z-50 bg-surface/80 backdrop-blur-md ring-1 ring-black/5">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link to="/" className="font-serif text-2xl tracking-tight">
          Book My Venue
        </Link>
        <div className="flex items-center gap-8 text-sm font-medium text-lead/70">
          <Link to="/venues" className="hover:text-brand transition-colors hidden sm:inline">
            Browse Venues
          </Link>
          {user && isHost && (
            <Link to="/host" className="hover:text-brand transition-colors hidden sm:inline">
              Host
            </Link>
          )}
          {user && isAdmin && (
            <Link to="/admin" className="hover:text-brand transition-colors hidden sm:inline">
              Admin
            </Link>
          )}
          {loading ? null : user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="bg-lead text-surface py-2 pr-3 pl-2 rounded-full flex items-center gap-2 ring-1 ring-lead">
                  <span className="size-6 rounded-full bg-surface/15 grid place-items-center">
                    <UserIcon className="size-3.5" />
                  </span>
                  <span className="text-xs">Account</span>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem onClick={() => navigate({ to: "/account/bookings" })}>
                  My bookings
                </DropdownMenuItem>
                {isHost ? (
                  <DropdownMenuItem onClick={() => navigate({ to: "/host" })}>
                    Host dashboard
                  </DropdownMenuItem>
                ) : (
                  <DropdownMenuItem onClick={() => navigate({ to: "/host" })}>
                    Become a host
                  </DropdownMenuItem>
                )}
                {isAdmin && (
                  <DropdownMenuItem onClick={() => navigate({ to: "/admin" })}>
                    Admin console
                  </DropdownMenuItem>
                )}
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={signOut}>Sign out</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="flex items-center gap-3">
              <Link to="/login" className="text-sm hover:text-brand">
                Sign in
              </Link>
              <Button
                asChild
                size="sm"
                className="rounded-full bg-lead text-surface hover:bg-lead/90"
              >
                <Link to="/signup">Get started</Link>
              </Button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}

export function SiteFooter() {
  return (
    <footer className="py-12 border-t border-zinc-950/5 mt-16">
      <div className="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row justify-between items-center gap-4 text-sm text-lead/40">
        <p>&copy; {new Date().getFullYear()} Book My Venue Spaces.</p>
        <div className="flex gap-8">
          <a href="#" className="hover:text-lead transition-colors">
            Terms
          </a>
          <a href="#" className="hover:text-lead transition-colors">
            Privacy
          </a>
          <a href="#" className="hover:text-lead transition-colors">
            Support
          </a>
        </div>
      </div>
    </footer>
  );
}
