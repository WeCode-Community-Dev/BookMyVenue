import { Link } from 'react-router-dom';
import {
  User as UserIcon,
  Calendar,
  Heart,
  LogOut,
  Building,
  Wallet,
} from 'lucide-react';
import { useAppStore } from '@/store/app.store';
import { useLogout } from '@/features/auth/hooks/useLogout';

interface ProfileListProps {
  onClose: () => void;
}

const ProfileList = ({ onClose }: ProfileListProps) => {
  const user = useAppStore((state) => state.user);
  const handleLogout = useLogout();

  return (
    <div className="absolute right-0 mt-2 w-56 rounded-xl border border-border bg-surface shadow-lg py-1.5 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
      <div className="px-4 py-2 border-b border-border flex flex-col gap-0.5">
        <p className="text-[13px] font-semibold text-foreground">{user?.fullName || 'User'}</p>
        {user?.email && <p className="text-[11px] text-foreground/60">{user.email}</p>}
      </div>
      <div className="py-1">
        {user?.role === 'owner' ? (
          <Link
            to="/owner/dashboard"
            onClick={onClose}
            className="flex items-center gap-2.5 px-4 py-2 text-[12px] text-foreground/80 hover:bg-muted/30 hover:text-primary transition-all duration-150 font-semibold"
          >
            <Building size={14} className="text-foreground/50" />
            Owner Dashboard
          </Link>
        ) : user?.role === 'admin' ? (
          <Link
            to="/admin/dashboard"
            onClick={onClose}
            className="flex items-center gap-2.5 px-4 py-2 text-[12px] text-foreground/80 hover:bg-muted/30 hover:text-primary transition-all duration-150 font-semibold"
          >
            <Building size={14} className="text-foreground/50" />
            Admin Dashboard
          </Link>
        ) : (
          <Link
            to="/owner/onboarding"
            onClick={onClose}
            className="flex items-center gap-2.5 px-4 py-2 text-[12px] text-primary hover:bg-primary/10 transition-all duration-150 font-semibold"
          >
            <Building size={14} className="text-primary" />
            List Your Venue
          </Link>
        )}

        <div className="h-px bg-border my-1" />

        <Link
          to="/account/profile"
          onClick={onClose}
          className="flex items-center gap-2.5 px-4 py-2 text-[12px] text-foreground/80 hover:bg-muted/30 hover:text-primary transition-all duration-150"
        >
          <UserIcon size={14} className="text-foreground/50" />
          My Profile
        </Link>
        <Link
          to="/account/bookings"
          onClick={onClose}
          className="flex items-center gap-2.5 px-4 py-2 text-[12px] text-foreground/80 hover:bg-muted/30 hover:text-primary transition-all duration-150"
        >
          <Calendar size={14} className="text-foreground/50" />
          My Bookings
        </Link>
        <Link
          to="/account/wallet"
          onClick={onClose}
          className="flex items-center gap-2.5 px-4 py-2 text-[12px] text-foreground/80 hover:bg-muted/30 hover:text-primary transition-all duration-150"
        >
          <Wallet size={14} className="text-foreground/50" />
          My Wallet
        </Link>
        <Link
          to="/account/payment-history"
          onClick={onClose}
          className="flex items-center gap-2.5 px-4 py-2 text-[12px] text-foreground/80 hover:bg-muted/30 hover:text-primary transition-all duration-150"
        >
          <Wallet size={14} className="text-foreground/50" />
          Payment History
        </Link>
        <Link
          to="/favorites"
          onClick={onClose}
          className="flex items-center gap-2.5 px-4 py-2 text-[12px] text-foreground/80 hover:bg-muted/30 hover:text-primary transition-all duration-150"
        >
          <Heart size={14} className="text-foreground/50" />
          Favorites
        </Link>

      </div>
      <div className="border-t border-border pt-1 mt-1">
        <button
          onClick={() => {
            onClose();
            handleLogout();
          }}
          className="flex items-center gap-2.5 w-full text-left px-4 py-2 text-[12px] text-foreground/85 hover:bg-primary/10 hover:text-primary transition-all duration-150 font-medium cursor-pointer"
        >
          <LogOut size={14} />
          Log out
        </button>
      </div>
    </div>
  );
};

export default ProfileList;
