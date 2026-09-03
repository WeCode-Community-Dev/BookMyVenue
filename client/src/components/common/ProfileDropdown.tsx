import { useRef, useEffect, useState, type RefObject } from 'react';
import { Link, useNavigate } from 'react-router';
import { motion } from 'framer-motion';
import { FiLogOut, FiUser, FiX, FiHeart } from 'react-icons/fi';
import { LuCalendarDays } from 'react-icons/lu';
import { MdOutlineMeetingRoom } from 'react-icons/md';
import { useAuth } from '@/hooks/useAuth';

type ProfileDropdownProps = {
  onClose: () => void;
  triggerRef?: RefObject<HTMLElement | null>;
};

// Mobile slides in as a full-height tray; desktop drops down from the avatar.
const desktopVariants = {
  initial: { opacity: 0, y: -8, scale: 0.97 },
  animate: { opacity: 1, y: 0, scale: 1 },
  exit: { opacity: 0, y: -8, scale: 0.97 },
};

const mobileVariants = {
  initial: { opacity: 0, x: '100%' },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: '100%' },
};

const useIsDesktop = () => {
  const [isDesktop, setIsDesktop] = useState(() => window.matchMedia('(min-width: 768px)').matches);

  useEffect(() => {
    const mql = window.matchMedia('(min-width: 768px)');
    const handleChange = (e: MediaQueryListEvent) => setIsDesktop(e.matches);
    mql.addEventListener('change', handleChange);
    return () => mql.removeEventListener('change', handleChange);
  }, []);

  return isDesktop;
};

const ProfileDropdown = ({ onClose, triggerRef }: ProfileDropdownProps) => {
  const { user, logout } = useAuth();
  const dropdownRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const isDesktop = useIsDesktop();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      if (dropdownRef.current && dropdownRef.current.contains(target)) return;
      if (triggerRef?.current && triggerRef.current.contains(target)) return;
      onClose();
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [onClose, triggerRef]);

  const handleLogout = async () => {
    await logout();
    onClose();
    navigate('/login');
  };

  return (
    <>
      {/* Mobile Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
        className="fixed inset-0 bg-black/40 z-[998] md:hidden"
        onClick={onClose}
      />
      <motion.div
        ref={dropdownRef}
        variants={isDesktop ? desktopVariants : mobileVariants}
        initial="initial"
        animate="animate"
        exit="exit"
        transition={{ duration: isDesktop ? 0.2 : 0.3, ease: [0.16, 1, 0.3, 1] }}
        style={{ transformOrigin: 'top right' }}
        className="fixed top-0 right-0 h-screen w-[80vw] max-w-xs z-[999] bg-[var(--bg-tertiary)] shadow-2xl flex flex-col md:absolute md:top-full md:right-0 md:mt-2 md:h-auto md:w-72 md:rounded-2xl md:border md:border-[var(--bg-grey)] md:shadow-xl"
      >
        {/* Header */}
        <div className="px-4 pt-5 pb-4 border-b border-[var(--bg-grey)] flex items-center gap-3 bg-[var(--bg-tertiary)] rounded-t-2xl">
          {/* Avatar */}
          <div className="w-10 h-10 rounded-full border-2 border-[var(--bg-grey)] bg-[var(--bg-grey)] flex items-center justify-center text-[var(--text-secondary)] shrink-0">
            <FiUser className="text-xl" />
          </div>

          {/* User info */}
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-[var(--text-primary)] truncate">
              {user?.username || 'User'}
            </h3>
            <p className="text-sm text-[var(--text-secondary)] truncate">
              {user?.email || 'user@example.com'}
            </p>
          </div>

          {/* Close button — mobile only */}
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center text-[var(--text-secondary)] hover:bg-[var(--bg-grey)] hover:text-[var(--text-primary)] transition cursor-pointer shrink-0 md:hidden"
          >
            <FiX className="text-lg" />
          </button>
        </div>

        {/* Menu items */}
        <div className="py-2">
          <Link
            to="/profile"
            onClick={onClose}
            className="flex items-center gap-3 px-5 py-3 text-[var(--text-primary)] border border-transparent hover:border-[var(--bg-grey)] hover:bg-[var(--bg-grey)]/30 transition"
          >
            <FiUser className="text-base" />
            Profile
          </Link>

          <Link
            to="/my-bookings"
            onClick={onClose}
            className="flex md:hidden items-center gap-3 px-5 py-3 text-[var(--text-primary)] border border-transparent hover:border-[var(--bg-grey)] hover:bg-[var(--bg-grey)]/30 transition"
          >
            <LuCalendarDays className="text-base" />
            My Bookings
          </Link>

          <Link
            to="/wishlist"
            onClick={onClose}
            className="flex items-center gap-3 px-5 py-3 text-[var(--text-primary)] border border-transparent hover:border-[var(--bg-grey)] hover:bg-[var(--bg-grey)]/30 transition"
          >
            <FiHeart className="text-base" />
            My Wishlist
          </Link>

          <Link
            to="/list-venue/my-venues"
            onClick={onClose}
            className="flex md:hidden items-center gap-3 px-5 py-3 text-[var(--text-primary)] border border-transparent hover:border-[var(--bg-grey)] hover:bg-[var(--bg-grey)]/30 transition"
          >
            <MdOutlineMeetingRoom className="text-base" />
            My Venues
          </Link>

          <div className="mt-1 border-t border-[var(--bg-grey)] pt-1">
            <button
              type="button"
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-5 py-3 text-left text-red-500 border border-transparent hover:border-red-500/20 hover:bg-red-500/10 transition cursor-pointer rounded-b-2xl"
            >
              <FiLogOut className="text-base" />
              Logout
            </button>
          </div>
        </div>
      </motion.div>
    </>
  );
};

export default ProfileDropdown;
