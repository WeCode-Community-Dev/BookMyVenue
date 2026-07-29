import { Suspense } from 'react';
import { ProtectedNavbar, AdminSidebar } from '@/shared/components/layout';
import { ThemeProvider } from '@/shared/providers/ThemeProvider';
import { Outlet } from 'react-router-dom';
import { Toaster } from 'sonner';
import SuspenseLoader from '@/shared/components/ui/SuspenseLoader';

export default function AdminLayout() {
  return (
    <ThemeProvider>
      <div className="flex min-h-screen">
        <AdminSidebar />

        {/* Content panel */}
        <div className="flex flex-1 flex-col lg:pl-64">
          <ProtectedNavbar />

          <main className="flex-1 p-6">
            <Suspense fallback={<SuspenseLoader />}>
              <Outlet />
            </Suspense>
          </main>
        </div>
      </div>
      <Toaster position="top-right" richColors />
    </ThemeProvider>
  );
}
