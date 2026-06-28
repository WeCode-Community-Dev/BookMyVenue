import { Link } from "react-router-dom";
import { MapPin } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import BrandName from "./BrandName";

const footerLinkClass =
  "text-sm text-gray-600 transition-colors duration-200 hover:text-red-600";

const footerHeadingClass =
  "text-xs font-semibold uppercase tracking-[0.14em] text-gray-900";

const scrollToProviderCta = (event) => {
  if (window.location.pathname !== "/") return;

  event.preventDefault();

  document.getElementById("provider-cta")?.scrollIntoView({
    behavior: "smooth",
    block: "start",
  });

  window.history.replaceState(null, "", "/#provider-cta");
};

const Footer = () => {
  const { loading, authReady, isAuthenticated, isProvider } = useAuth();
  const authSettled = !loading && authReady;

  return (
    <footer className="relative overflow-hidden border-t border-red-100/70 bg-gradient-to-b from-white via-stone-50/80 to-red-50/35">
      <div
        className="pointer-events-none absolute inset-0 overflow-hidden"
        aria-hidden="true"
      >
        <div className="absolute -left-20 top-0 h-56 w-56 rounded-full bg-red-100/20 blur-3xl" />
        <div className="absolute -right-16 bottom-0 h-48 w-48 rounded-full bg-rose-100/20 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-7xl px-6">
        <div className="grid gap-10 py-12 sm:grid-cols-2 sm:gap-8 lg:grid-cols-12 lg:gap-10 lg:py-14">
          <div className="sm:col-span-2 lg:col-span-5">
            <Link
              to="/"
              className="inline-flex transition-opacity duration-200 hover:opacity-90"
            >
              <BrandName variant="heading" />
            </Link>

            <p className="mt-4 max-w-sm text-sm leading-relaxed text-gray-600">
              Discover and book venues for weddings, parties, and celebrations
              across India, browse spaces, pick a slot, and confirm online.
            </p>

          </div>

          <div className="lg:col-span-2">
            <h3 className={footerHeadingClass}>Explore</h3>
            <ul className="mt-4 space-y-3">
              <li>
                <Link to="/" className={footerLinkClass}>
                  Home
                </Link>
              </li>
              <li>
                <Link to="/venues" className={footerLinkClass}>
                  Browse venues
                </Link>
              </li>
            </ul>
          </div>

          <div className="lg:col-span-2">
            <h3 className={footerHeadingClass}>Account</h3>
            <ul className="mt-4 space-y-3">
              {authSettled && isAuthenticated ? (
                <>
                  <li>
                    <Link to="/my-bookings" className={footerLinkClass}>
                      My bookings
                    </Link>
                  </li>
                  <li>
                    <Link to="/profile" className={footerLinkClass}>
                      Profile
                    </Link>
                  </li>
                </>
              ) : (
                <>
                  <li>
                    <Link to="/login" className={footerLinkClass}>
                      Sign in
                    </Link>
                  </li>
                  <li>
                    <Link to="/register" className={footerLinkClass}>
                      Create account
                    </Link>
                  </li>
                </>
              )}
            </ul>
          </div>

          <div className="lg:col-span-3">
            <h3 className={footerHeadingClass}>For venue owners</h3>
            <ul className="mt-4 space-y-3">
              <li>
                <Link
                  to={{ pathname: "/", hash: "#provider-cta" }}
                  onClick={scrollToProviderCta}
                  className={footerLinkClass}
                >
                  List your venue
                </Link>
              </li>
              {authSettled && isProvider && (
                <li>
                  <Link
                    to="/provider/dashboard"
                    className={footerLinkClass}
                  >
                    Provider dashboard
                  </Link>
                </li>
              )}
            </ul>

            <p className="mt-5 text-sm leading-relaxed text-gray-500">
              Manage availability, accept bookings, and track reservations from
              one dashboard.
            </p>
          </div>
        </div>

        <div className="flex flex-col items-center justify-center gap-4 border-t border-red-100/60 py-6 sm:flex-row">
          <p className="text-sm text-gray-500">
            © {new Date().getFullYear()} Book My Venue. All rights reserved.
          </p>

         
        </div>
      </div>
    </footer>
  );
};

export default Footer;
