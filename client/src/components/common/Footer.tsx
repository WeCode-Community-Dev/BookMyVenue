import { Link, useLocation } from 'react-router';
import { IoLogoFacebook, IoLogoTwitter, IoLogoInstagram, IoLogoLinkedin } from 'react-icons/io5';
import bmvLogo from '@/assets/bmv-logo.png';

const Footer = () => {
  const location = useLocation();
  const isHomePage = location.pathname === '/';

  if (isHomePage) {
    return (
      <footer className="z-50 bg-[var(--bg-tertiary)] border-t border-[var(--bg-grey)] pt-16 pb-8 px-6 mt-auto">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
            {/* Column 1: Brand */}
            <div>
              <Link to="/" className="block mb-6">
                <img src={bmvLogo} alt="BookMyVenue" className="h-9 w-auto" />
              </Link>
              <p className="text-[var(--text-secondary)] text-sm leading-relaxed mb-6">
                Your premier destination for discovering and booking the perfect venues for any
                occasion. From weddings to corporate retreats, we make event planning seamless.
              </p>
              <div className="flex items-center gap-4 text-[var(--text-secondary)]">
                <a href="#" className="hover:text-[var(--bg-green)] transition">
                  <IoLogoFacebook size={22} />
                </a>
                <a href="#" className="hover:text-[var(--bg-green)] transition">
                  <IoLogoTwitter size={22} />
                </a>
                <a href="#" className="hover:text-[var(--bg-green)] transition">
                  <IoLogoInstagram size={22} />
                </a>
                <a href="#" className="hover:text-[var(--bg-green)] transition">
                  <IoLogoLinkedin size={22} />
                </a>
              </div>
            </div>

            {/* Column 2: Company */}
            <div>
              <h3 className="font-bold text-[var(--text-primary)] mb-6 uppercase tracking-wider text-sm">
                Company
              </h3>
              <ul className="space-y-4">
                <li>
                  <Link
                    to="#"
                    className="text-[var(--text-secondary)] hover:text-[var(--bg-green)] transition text-sm"
                  >
                    About Us
                  </Link>
                </li>
                <li>
                  <Link
                    to="#"
                    className="text-[var(--text-secondary)] hover:text-[var(--bg-green)] transition text-sm"
                  >
                    Legal Information
                  </Link>
                </li>
                <li>
                  <Link
                    to="#"
                    className="text-[var(--text-secondary)] hover:text-[var(--bg-green)] transition text-sm"
                  >
                    Contact Us
                  </Link>
                </li>
                <li>
                  <Link
                    to="#"
                    className="text-[var(--text-secondary)] hover:text-[var(--bg-green)] transition text-sm"
                  >
                    Blogs
                  </Link>
                </li>
              </ul>
            </div>

            {/* Column 3: Help Center */}
            <div>
              <h3 className="font-bold text-[var(--text-primary)] mb-6 uppercase tracking-wider text-sm">
                Help Center
              </h3>
              <ul className="space-y-4">
                <li>
                  <Link
                    to="/explore"
                    className="text-[var(--text-secondary)] hover:text-[var(--bg-green)] transition text-sm"
                  >
                    Find a Property
                  </Link>
                </li>
                <li>
                  <Link
                    to="/list-venue"
                    className="text-[var(--text-secondary)] hover:text-[var(--bg-green)] transition text-sm"
                  >
                    How To Host?
                  </Link>
                </li>
                <li>
                  <Link
                    to="#"
                    className="text-[var(--text-secondary)] hover:text-[var(--bg-green)] transition text-sm"
                  >
                    Why Us?
                  </Link>
                </li>
                <li>
                  <Link
                    to="#"
                    className="text-[var(--text-secondary)] hover:text-[var(--bg-green)] transition text-sm"
                  >
                    FAQs
                  </Link>
                </li>
              </ul>
            </div>

            {/* Column 4: Contact Info */}
            <div>
              <h3 className="font-bold text-[var(--text-primary)] mb-6 uppercase tracking-wider text-sm">
                Contact Info
              </h3>
              <ul className="space-y-4">
                <li className="text-[var(--text-secondary)] text-sm">
                  <span className="block text-[var(--text-primary)] font-medium mb-1">Phone:</span>
                  1-800-BOOK-VENUE
                </li>
                <li className="text-[var(--text-secondary)] text-sm">
                  <span className="block text-[var(--text-primary)] font-medium mb-1">Email:</span>
                  support@bookmyvenue.com
                </li>
                <li className="text-[var(--text-secondary)] text-sm">
                  <span className="block text-[var(--text-primary)] font-medium mb-1">
                    Location:
                  </span>
                  Kochi, Kerala, India
                </li>
              </ul>
            </div>
          </div>

          <div className="pt-8 border-t border-[var(--bg-grey)] flex justify-center text-center">
            <p className="text-[var(--text-secondary)] text-sm">
              © {new Date().getFullYear()} BookMyVenue. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    );
  }

  // Regular footer for other pages
  return (
    <div>
      <footer className="z-50 bg-[var(--bg-tertiary)] border-t border-[var(--bg-grey)] px-6 py-10">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:justify-between gap-8">
          {/* Brand */}
          <div className="max-w-sm">
            <img src={bmvLogo} alt="BookMyVenue" className="h-8 w-auto" />

            <p className="mt-2 text-sm text-[var(--text-secondary)] leading-relaxed">
              Find and book the perfect venue for your events.
            </p>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-[var(--text-primary)] mb-3">Quick Links</h3>

            <div className="flex flex-col gap-2 text-sm text-[var(--text-secondary)]">
              <Link to="/explore" className="hover:text-[var(--bg-green)] transition-colors">
                Explore Venues
              </Link>

              <Link to="/my-bookings" className="hover:text-[var(--bg-green)] transition-colors">
                My Bookings
              </Link>

              <Link to="/list-venue" className="hover:text-[var(--bg-green)] transition-colors">
                List Your Venue
              </Link>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-[var(--text-primary)] mb-3">Legal</h3>

            <div className="flex flex-col gap-2 text-sm text-[var(--text-secondary)]">
              <Link to="/privacy" className="hover:text-[var(--bg-green)] transition-colors">
                Privacy Policy
              </Link>

              <Link to="/terms" className="hover:text-[var(--bg-green)] transition-colors">
                Terms & Conditions
              </Link>
            </div>
          </div>
        </div>

        <div className="w-full border-t border-[var(--bg-grey)] mt-8 pt-5 text-center text-sm text-[var(--bg-green)]">
          © {new Date().getFullYear()} BookMyVenue. All rights reserved.
        </div>
      </footer>
    </div>
  );
};

export default Footer;
