import { Outlet } from 'react-router';
import ListSidebar from '@/components/common/ListSidebar';

const ListVenueLayout = () => {
  return (
    <div className="flex min-h-screen bg-[var(--bg-primary)]">
      {/* Sidebar */}
      <ListSidebar />

      {/* Right Content */}
      <main className="flex-1 md:ml-72 p-4 md:p-8 w-full max-w-full pb-24 md:pb-8">
        <Outlet />
      </main>
    </div>
  );
};

export default ListVenueLayout;
