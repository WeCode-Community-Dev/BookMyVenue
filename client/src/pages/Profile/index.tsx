import { Link } from 'react-router';
import { LuCalendarDays } from 'react-icons/lu';
import { MdOutlineMeetingRoom } from 'react-icons/md';
import { FiPlusCircle } from 'react-icons/fi';
import IdentityCard from './IdentityCard';
import SecurityCard from './SecurityCard';
import DevicesCard from './DevicesCard';

const quickLinks = [
  { to: '/my-bookings', label: 'My Bookings', icon: LuCalendarDays },
  { to: '/list-venue/my-venues', label: 'My Venues', icon: MdOutlineMeetingRoom },
  { to: '/list-venue/add-venue', label: 'Add a Venue', icon: FiPlusCircle },
];

const ProfilePage = () => {
  return (
    <div className="min-h-screen bg-[var(--bg-primary)] pt-28 pb-16 px-6">
      <div className="max-w-xl mx-auto space-y-5">
        <h1 className="text-2xl font-bold text-[var(--text-primary)]">Profile</h1>

        <div className="flex flex-wrap gap-2">
          {quickLinks.map(({ to, label, icon: Icon }) => (
            <Link
              key={to}
              to={to}
              className="flex items-center gap-2 px-3.5 py-2 rounded-xl border border-[var(--bg-grey)] bg-[var(--bg-tertiary)] text-sm font-medium text-[var(--text-primary)] hover:bg-[var(--bg-grey)] transition"
            >
              <Icon className="text-base" />
              {label}
            </Link>
          ))}
        </div>

        <IdentityCard />
        <SecurityCard />
        <DevicesCard />
      </div>
    </div>
  );
};

export default ProfilePage;
