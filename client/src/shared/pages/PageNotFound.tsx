import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Home, Search, ArrowLeft } from 'lucide-react';
import { toast, Toaster } from 'sonner';

const PageNotFound = () => {
  useEffect(() => {
    toast.error('Page not found: The path you entered does not exist.', { id: 'page-not-found' });
  }, []);

  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-6">
      <Toaster richColors position="top-right" />
      <div className="max-w-xl text-center">
        <div className="mb-6">
          <span className="text-primary text-8xl font-bold">404</span>
        </div>

        <h1 className="text-foreground mb-4 text-3xl font-bold">Page Not Found</h1>

        <p className="text-muted mb-8 text-lg">
          The page you're looking for doesn't exist, may have been moved, or the link might be
          incorrect.
        </p>

        <div className="flex flex-col justify-center gap-4 sm:flex-row">
          <Link
            to="/"
            className="
              bg-primary
              text-white
              hover:opacity-90
              inline-flex
              items-center
              justify-center
              gap-2
              rounded-lg
              px-5
              py-3
              font-medium
              transition
            "
          >
            <Home size={18} />
            Back to Home
          </Link>

          <button
            onClick={() => window.history.back()}
            className="
              border-border
              text-foreground
              hover:bg-surface
              inline-flex
              items-center
              justify-center
              gap-2
              rounded-lg
              border
              px-5
              py-3
              font-medium
              transition
            "
          >
            <ArrowLeft size={18} />
            Go Back
          </button>
        </div>

        <div className="border-border bg-card mt-12 rounded-2xl border p-6">
          <div className="mb-3 flex justify-center">
            <Search size={32} className="text-primary" />
          </div>

          <h2 className="text-foreground mb-2 font-semibold">Looking for a venue?</h2>

          <p className="text-muted text-sm">
            Browse venues, manage bookings, or return to the dashboard using the navigation menu.
          </p>
        </div>
      </div>
    </main>
  );
};

export default PageNotFound;
