import { useState, useEffect, useRef } from 'react';

import { Link, useLocation } from 'react-router';
import bmvLogo from '@/assets/bmv-logo.png';
import { AnimatePresence, motion } from 'framer-motion';
import ProfileDropdown from './ProfileDropdown';
import ThemeToggle from './ThemeToggle';
import { useAuth } from '@/hooks/useAuth';
import { FiUser } from 'react-icons/fi';
import { hasPlayedProfileGreeting, markProfileGreetingPlayed } from '@/utils/profileGreeting';

// Greet returning users on load so the profile icon reads as clickable:
// icon-only -> pill expands with "Hi there" -> swaps to the user's name -> converges back to the icon.
const GREETING_DELAY_MS = 3500;
const HI_HOLD_MS = 3000;
const NAME_HOLD_MS = 3200;
const PILL_FADE_MS = 750;
const PILL_WIDTH = 70;

type GreetingStage = 'idle' | 'hi' | 'name' | 'done';

const Navbar = () => {
  const [openProfile, setOpenProfile] = useState(false);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const { isAuthenticated, loading, user } = useAuth();
  const location = useLocation();
  const profileButtonRef = useRef<HTMLButtonElement>(null);

  const isActive = (path: string) => location.pathname === path;

  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const [greetingStage, setGreetingStage] = useState<GreetingStage>(() =>
    hasPlayedProfileGreeting() ? 'done' : 'idle'
  );
  const greetingStarted = useRef(false);

  useEffect(() => {
    if (!isAuthenticated || greetingStarted.current || hasPlayedProfileGreeting()) return;
    greetingStarted.current = true;

    const timer = setTimeout(() => {
      markProfileGreetingPlayed();
      setGreetingStage('hi');
    }, GREETING_DELAY_MS);
    return () => clearTimeout(timer);
  }, [isAuthenticated]);

  useEffect(() => {
    if (greetingStage === 'hi') {
      const timer = setTimeout(() => setGreetingStage('name'), HI_HOLD_MS);
      return () => clearTimeout(timer);
    }
    if (greetingStage === 'name') {
      const timer = setTimeout(() => setGreetingStage('done'), NAME_HOLD_MS);
      return () => clearTimeout(timer);
    }
  }, [greetingStage]);

  const showGreetingPill = greetingStage === 'hi' || greetingStage === 'name';
  const firstName = user?.username?.split(' ')[0] || 'there';

  // On mobile: toggle the nav tray. On desktop: toggle the profile dropdown.
  const handleProfileClick = () => {
    if (window.innerWidth < 768) {
      setMobileNavOpen((prev) => !prev);
    } else {
      setOpenProfile((prev) => !prev);
    }
  };

  return (
    <header
      className={`fixed top-0 left-0 z-50 w-full bg-[var(--bg-primary)] transition-all duration-300 ${
        scrolled
          ? 'border-b border-[var(--bg-grey)] shadow-sm'
          : 'border-b border-transparent shadow-none'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between bg-[var(--bg-primary)] relative z-20">
        {/* left - logo */}
        <Link to="/" className="flex items-center gap-2">
          <img src={bmvLogo} alt="BookMyVenue" className="h-8 w-auto" />
        </Link>

        {/* center nav */}
        <nav className="hidden md:flex items-center gap-8 font-medium">
          <Link
            to="/explore"
            className="relative after:absolute after:left-0 after:-bottom-1 
            after:h-[2px] after:w-0 after:bg-[var(--bg-green)] 
            after:transition-all after:duration-300 
            hover:after:w-full"
          >
            Explore
          </Link>

          <Link
            to="/list-venue"
            className="relative after:absolute after:left-0 after:-bottom-1 
            after:h-0.5 after:w-0 after:bg-(--bg-green) 
            after:transition-all after:duration-300 
            hover:after:w-full"
          >
            List Your Venue
          </Link>

          <Link
            to="/my-bookings"
            className="relative after:absolute after:left-0 after:-bottom-1 
            after:h-0.5 after:w-0 after:bg-(--bg-green) 
            after:transition-all after:duration-300 
            hover:after:w-full"
          >
            My Bookings
          </Link>
        </nav>

        {/* profile / login */}
        <div className="flex items-center gap-4">
          <ThemeToggle />
          {!loading &&
            (isAuthenticated ? (
              <div className="relative">
                <button
                  ref={profileButtonRef}
                  type="button"
                  onClick={handleProfileClick}
                  aria-label="Open profile menu"
                  className="flex items-center h-10 rounded-full border-2 border-[var(--bg-grey)] bg-[var(--bg-grey)] hover:scale-105 transition-transform cursor-pointer text-[var(--text-secondary)]"
                >
                  <div
                    className="overflow-hidden"
                    style={{
                      width: showGreetingPill ? PILL_WIDTH : 0,
                      transitionProperty: 'width',
                      transitionDuration: '0ms',
                      transitionDelay: showGreetingPill ? '9ms' : `${PILL_FADE_MS}ms`,
                    }}
                  >
                    <AnimatePresence initial={false}>
                      {showGreetingPill && (
                        <motion.div
                          key="greeting-pill"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          transition={{ duration: PILL_FADE_MS / 1000, ease: [0.16, 1, 0.3, 1] }}
                          className="relative h-10"
                          style={{ width: PILL_WIDTH }}
                        >
                          <AnimatePresence initial={false}>
                            <motion.span
                              key={greetingStage}
                              initial={{ y: -10, opacity: 0 }}
                              animate={{ y: 0, opacity: 1 }}
                              exit={{ y: 10, opacity: 0 }}
                              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                              className="absolute inset-0 flex items-center truncate pl-4 pr-1 text-sm font-medium text-[var(--text-primary)]"
                            >
                              {greetingStage === 'hi' ? 'Hi there' : `Hi, ${firstName}`}
                            </motion.span>
                          </AnimatePresence>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                  <span className="flex items-center justify-center w-10 h-10 shrink-0">
                    <FiUser className="text-lg" />
                  </span>
                </button>
                {/* ProfileDropdown only appears on desktop click */}
                <AnimatePresence>
                  {openProfile && (
                    <ProfileDropdown
                      onClose={() => setOpenProfile(false)}
                      triggerRef={profileButtonRef}
                    />
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <Link
                to="/login"
                onClick={() => {
                  if (window.innerWidth < 768) {
                    setMobileNavOpen((prev) => !prev);
                  }
                }}
                className="px-5 py-2 rounded-xl bg-[var(--bg-secondary)] border-2 border-transparent hover:bg-[var(--bg-primary)] hover:border-2 hover:text-[var(--text-primary)] hover:border-[var(--bg-secondary)] transition-all font-medium text-white text-sm"
              >
                Login
              </Link>
            ))}
        </div>
      </div>

      {/* Mobile Nav Tray (Horizontal Slide Down) */}
      <div
        className="md:hidden grid transition-all duration-300 ease-in-out bg-[var(--bg-tertiary)] border-b border-[var(--bg-grey)]"
        style={{ gridTemplateRows: mobileNavOpen ? '1fr' : '0fr' }}
      >
        <div className="overflow-hidden">
          <div className="flex items-center justify-around px-2 py-4">
            <Link
              to="/explore"
              onClick={() => setMobileNavOpen(false)}
              className={`text-sm font-medium transition-colors ${
                isActive('/explore')
                  ? 'text-[var(--bg-green)] border-b-2 border-[var(--bg-green)]'
                  : 'text-[var(--text-secondary)] hover:text-[var(--bg-green)]'
              }`}
            >
              Explore
            </Link>
            <Link
              to="/list-venue"
              onClick={() => setMobileNavOpen(false)}
              className={`text-sm font-medium transition-colors ${
                isActive('/list-venue')
                  ? 'text-[var(--bg-green)] border-b-2 border-[var(--bg-green)]'
                  : 'text-[var(--text-secondary)] hover:text-[var(--bg-green)]'
              }`}
            >
              List Venue
            </Link>
            <Link
              to="/my-bookings"
              onClick={() => setMobileNavOpen(false)}
              className={`text-sm font-medium transition-colors ${
                isActive('/my-bookings')
                  ? 'text-[var(--bg-green)] border-b-2 border-[var(--bg-green)]'
                  : 'text-[var(--text-secondary)] hover:text-[var(--bg-green)]'
              }`}
            >
              My Bookings
            </Link>
            {isAuthenticated && (
              <Link
                to="/profile"
                onClick={() => setMobileNavOpen(false)}
                className={`text-sm font-medium transition-colors ${
                  isActive('/profile')
                    ? 'text-[var(--bg-green)] border-b-2 border-[var(--bg-green)]'
                    : 'text-[var(--text-secondary)] hover:text-[var(--bg-green)]'
                }`}
              >
                Profile
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
