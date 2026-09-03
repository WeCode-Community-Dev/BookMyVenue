import { Link, useLocation } from 'react-router';
import { MdOutlineMeetingRoom } from 'react-icons/md';
import { IoAddCircleOutline } from 'react-icons/io5';
import bmvLogo from '@/assets/bmv-logo.png';

const ListSidebar = () => {
  const location = useLocation();

  const isActive = (path: string) => location.pathname.includes(path);

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex flex-col fixed left-0 top-0 h-screen w-72 border-r border-[var(--bg-grey)] bg-[var(--bg-tertiary)] p-6 z-40">
        <Link to="/" className="mb-10">
          <img src={bmvLogo} alt="BookMyVenue" className="h-8 w-auto" />
        </Link>

        <nav className="flex flex-col gap-3 mt-10">
          <Link
            to="/list-venue/add-venue"
            className={`flex items-center gap-3 rounded-xl px-4 py-3 transition ${
              isActive('add-venue')
                ? 'bg-[var(--bg-green)] text-white shadow-md'
                : 'text-[var(--text-primary)] hover:bg-[var(--bg-grey)]/30'
            }`}
          >
            <IoAddCircleOutline size={20} />
            <span className="font-medium">Add Venue</span>
          </Link>

          <Link
            to="/list-venue/my-venues"
            className={`flex items-center gap-3 rounded-xl px-4 py-3 transition ${
              isActive('my-venues') || location.pathname === '/list-venue'
                ? 'bg-[var(--bg-green)] text-white shadow-md'
                : 'text-[var(--text-primary)] hover:bg-[var(--bg-grey)]/30'
            }`}
          >
            <MdOutlineMeetingRoom size={20} />
            <span className="font-medium">My Venues</span>
          </Link>
        </nav>
      </aside>

      {/* Mobile Bottom Nav */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-[var(--bg-tertiary)] border-t border-[var(--bg-grey)] flex items-center justify-around p-2 z-50 pb-safe shadow-[0_-4px_20px_rgba(0,0,0,0.05)]">
        <Link
          to="/list-venue/add-venue"
          className={`flex flex-col items-center gap-1 p-2 rounded-lg transition-colors w-24 ${
            isActive('add-venue')
              ? 'text-[var(--bg-green)]'
              : 'text-[var(--text-secondary)] hover:bg-[var(--bg-grey)]/30'
          }`}
        >
          <IoAddCircleOutline size={22} />
          <span className="text-[10px] font-medium">Add Venue</span>
        </Link>

        <Link
          to="/list-venue/my-venues"
          className={`flex flex-col items-center gap-1 p-2 rounded-lg transition-colors w-24 ${
            isActive('my-venues') || location.pathname === '/list-venue'
              ? 'text-[var(--bg-green)]'
              : 'text-[var(--text-secondary)] hover:bg-[var(--bg-grey)]/30'
          }`}
        >
          <MdOutlineMeetingRoom size={22} />
          <span className="text-[10px] font-medium">My Venues</span>
        </Link>
      </nav>
    </>
  );
};

export default ListSidebar;
