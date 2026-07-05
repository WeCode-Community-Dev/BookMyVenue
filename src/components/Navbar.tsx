import { useState, useEffect } from "react";
import { LogIn, UserPlus, Menu, X, LogOut } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (e) {
        setUser(null);
      }
    } else {
      setUser(null);
    }
  }, [location]);

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    setUser(null);
    setMenuOpen(false);
    navigate("/");
  };

  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  const navLinks = !user
    ? [
        { href: "/", label: "Home" },
        { href: "/venues", label: "Venues" },
        { href: "/contact", label: "Contact" },
      ]
    : user.role === "admin"
    ? [
        { href: "/admin", label: "Admin Panel" },
      ]
    : user.role === "venue_owner"
    ? [
        { href: "/", label: "Home" },
        { href: "/my-venues", label: "My Venues" },
        { href: "/bookings", label: "Bookings" },
        { href: "/contact", label: "Contact" },
      ]
    : [
        { href: "/", label: "Home" },
        { href: "/venues", label: "Venues" },
        { href: "/mybooking", label: "Bookings" },
        { href: "/contact", label: "Contact" },
      ];

  return (
    <>
      {/* Navigation */}
      <nav className="absolute top-0 left-0 right-0 z-30 flex items-center justify-between px-4 sm:px-6 md:px-10 py-4 sm:py-6">
        <div className="flex items-center gap-2 text-white">
          <Link
            to="/"
            className="text-lg sm:text-xl md:text-2xl font-bold tracking-tight"
          >
            BookMyVenue
          </Link>
        </div>

        <div className="hidden lg:flex items-center gap-1 bg-black/60 backdrop-blur-md rounded-full pl-6 pr-1 py-1 shadow-sm border border-white/10">
          {navLinks.map((link) => {
            const isActive = location.pathname === link.href;
            return (
              <Link
                key={link.href}
                to={link.href}
                className={`text-sm px-3 py-2 transition-colors ${isActive
                    ? "font-semibold text-[#c5a059]"
                    : "font-medium text-white/70 hover:text-[#c5a059]"
                  }`}
              >
                {link.label}
              </Link>
            );
          })}
          <Link
            to={user?.role === "admin" ? "/admin" : user?.role === "venue_owner" ? "/dashboard" : "/venues"}
            className="ml-2 bg-[#c5a059] hover:bg-[#ab8237] text-white text-sm font-medium px-5 py-2.5 rounded-full transition-colors"
          >
            {user?.role === "admin" ? "Admin Panel" : user?.role === "venue_owner" ? "Dashboard" : "Book Your Venue"}
          </Link>
        </div>

        <div className="flex items-center gap-3 sm:gap-6 text-white/95">
          {user ? (
            <>
              {/* Profile Icon and Username */}
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10">
                <div className="w-7 h-7 rounded-full bg-[#c5a059] flex items-center justify-center text-black font-bold text-xs uppercase select-none">
                  {user.name ? user.name.charAt(0) : "U"}
                </div>
                <span className="hidden md:inline text-sm font-medium text-white/90">
                  {user.name}
                </span>
              </div>
              {/* Logout Button */}
              <button
                onClick={handleLogout}
                className="hidden sm:flex items-center gap-2 text-sm font-medium hover:text-[#c5a059] transition-colors"
              >
                <LogOut className="w-4 h-4" />
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                to="/signup"
                className="hidden sm:flex items-center gap-2 text-sm font-medium hover:text-[#c5a059] transition-colors"
              >
                <UserPlus className="w-4 h-4" />
                Sign Me Up!
              </Link>
              <Link
                to="/login"
                className="hidden sm:flex items-center gap-2 text-sm font-medium hover:text-[#c5a059] transition-colors"
              >
                <LogIn className="w-4 h-4" />
                Login
              </Link>
            </>
          )}
          <button
            onClick={() => setMenuOpen((v) => !v)}
            className="lg:hidden relative flex items-center justify-center w-10 h-10 rounded-full bg-black/60 backdrop-blur-md border border-white/10 text-white transition-all duration-300 hover:bg-black/80"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
          >
            <Menu
              className={`w-5 h-5 absolute transition-all duration-300 ${menuOpen
                  ? "opacity-0 rotate-90 scale-50"
                  : "opacity-100 rotate-0 scale-100"
                }`}
            />
            <X
              className={`w-5 h-5 absolute transition-all duration-300 ${menuOpen
                  ? "opacity-100 rotate-0 scale-100"
                  : "opacity-0 -rotate-90 scale-50"
                }`}
            />
          </button>
        </div>
      </nav>

      {/* Mobile menu overlay */}
      <div
        className={`lg:hidden fixed inset-0 z-20 transition-opacity duration-300 ${menuOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
          }`}
        onClick={() => setMenuOpen(false)}
      >
        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
      </div>

      {/* Mobile menu drawer */}
      <div
        className={`lg:hidden fixed top-0 right-0 bottom-0 z-20 w-[85%] max-w-sm bg-black/95 backdrop-blur-xl shadow-2xl transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${menuOpen ? "translate-x-0" : "translate-x-full"
          }`}
      >
        <div className="flex flex-col h-full pt-24 px-8 pb-8">
          <div className="flex flex-col gap-1">
            {navLinks.map((link, i) => {
              const isActive = location.pathname === link.href;
              return (
                <Link
                  key={link.href}
                  to={link.href}
                  onClick={() => setMenuOpen(false)}
                  className={`text-2xl font-semibold py-4 border-b border-white/10 transition-all duration-500 ${isActive ? "text-[#c5a059]" : "text-white"
                    } ${menuOpen ? "translate-x-0 opacity-100" : "translate-x-8 opacity-0"}`}
                  style={{
                    transitionDelay: menuOpen ? `${150 + i * 70}ms` : "0ms",
                  }}
                >
                  {link.label}
                </Link>
              );
            })}
          </div>

          <div
            className={`mt-8 flex flex-col gap-4 transition-all duration-500 ${menuOpen ? "translate-x-0 opacity-100" : "translate-x-8 opacity-0"
              }`}
            style={{ transitionDelay: menuOpen ? "400ms" : "0ms" }}
          >
            {user ? (
              <>
                <div className="flex items-center gap-3 py-3 border-b border-white/10 sm:hidden">
                  <div className="w-10 h-10 rounded-full bg-[#c5a059] flex items-center justify-center text-black font-bold text-sm uppercase">
                    {user.name ? user.name.charAt(0) : "U"}
                  </div>
                  <div className="flex flex-col">
                    <span className="text-white font-semibold text-base">
                      {user.name}
                    </span>
                    <span className="text-white/40 text-xs">{user.email}</span>
                  </div>
                </div>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 text-sm font-medium text-white/80 sm:hidden py-2"
                >
                  <LogOut className="w-4 h-4" />
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/signup"
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center gap-2 text-sm font-medium text-white/80 sm:hidden"
                >
                  <UserPlus className="w-4 h-4" />
                  Sign Me Up!
                </Link>
                <Link
                  to="/login"
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center gap-2 text-sm font-medium text-white/80 sm:hidden"
                >
                  <LogIn className="w-4 h-4" />
                  Login
                </Link>
              </>
            )}
            <Link
              to={user?.role === "admin" ? "/admin" : user?.role === "venue_owner" ? "/dashboard" : "/venues"}
              onClick={() => setMenuOpen(false)}
              className="mt-2 text-center bg-[#c5a059] hover:bg-[#ab8237] text-white text-sm font-semibold px-5 py-3 rounded-full transition-colors"
            >
              {user?.role === "admin" ? "Admin Panel" : user?.role === "venue_owner" ? "Dashboard" : "Book Your Venue"}
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
