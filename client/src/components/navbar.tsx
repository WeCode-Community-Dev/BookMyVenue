import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/store/store";
import { useLogout } from "@/hooks/use-auth";
import {
  AUTH_ROUTES,
  CUSTOMER_ROUTES,
  PUBLIC_ROUTES,
  getRoleLandingPath,
} from "@/routes/common/route-path";

const Navbar = () => {
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);
  const logout = useLogout();

  const handleLogout = () => {
    logout.mutate(undefined, {
      onSuccess: () => navigate(PUBLIC_ROUTES.HOME),
    });
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur">
      <nav className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4">
        <Link to={PUBLIC_ROUTES.HOME} className="text-lg font-semibold">
          BookMyVenue
        </Link>

        <div className="flex items-center gap-2">
          <Button asChild variant="ghost" size="sm">
            <Link to={PUBLIC_ROUTES.VENUES}>Venues</Link>
          </Button>

          {user ? (
            <>
              <Button asChild variant="ghost" size="sm">
                <Link
                  to={
                    user.role === "CUSTOMER"
                      ? CUSTOMER_ROUTES.MY_BOOKINGS
                      : getRoleLandingPath(user.role)
                  }>
                  {user.name}
                </Link>
              </Button>
              <Button size="sm" onClick={handleLogout} disabled={logout.isPending}>
                {logout.isPending ? "Logging out..." : "Logout"}
              </Button>
            </>
          ) : (
            <>
              <Button asChild variant="ghost" size="sm">
                <Link to={AUTH_ROUTES.SIGN_IN}>Sign in</Link>
              </Button>
              <Button asChild size="sm">
                <Link to={AUTH_ROUTES.SIGN_UP}>Sign up</Link>
              </Button>
            </>
          )}
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
