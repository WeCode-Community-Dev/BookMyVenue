import { Outlet } from 'react-router';
import Navbar from '@/components/common/Navbar';
import Footer from '@/components/common/Footer';

const MainLayout = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      {/* Page Content */}
      <main className="flex-grow">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default MainLayout;
