import { Footer, ProtectedNavbar, PublicNavbar } from '@/shared/components/layout';
import { Outlet, Navigate } from 'react-router-dom';
import { ThemeProvider } from '@/shared/providers/ThemeProvider';
import { useAppStore } from '@/store/app.store';
import { Toaster } from 'sonner';

export default function MainLayout() {
  const { isAuthenticated, user } = useAppStore();

  if (isAuthenticated && user?.role === 'admin') {
    return <Navigate to="/admin/dashboard" replace />;
  }

  return (
    <>
      <ThemeProvider>
        <Toaster richColors position="top-right" />
        {isAuthenticated ? <ProtectedNavbar /> : <PublicNavbar />}

        <main>
          <Outlet />
        </main>

        <Footer />
      </ThemeProvider>
    </>
  );
}
