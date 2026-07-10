import { Link } from 'react-router-dom';
import { ChevronLeft, Building2 } from 'lucide-react';

export default function VenueNotFound() {
  return (
    <div className="flex flex-col items-center justify-center py-24 text-center max-w-7xl mx-auto px-4">
      <div className="rounded-full bg-error/10 border border-error/20 p-5 text-error mb-4">
        <Building2 size={36} />
      </div>
      <h2 className="text-2xl font-bold text-foreground">Venue Not Found</h2>
      <p className="text-sm text-muted mt-2 max-w-md">
        The venue you are looking for doesn't exist or is not currently available.
      </p>
      <Link
        to="/venues"
        className="mt-6 inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-white hover:bg-accent transition-all"
      >
        <ChevronLeft size={16} /> Browse All Venues
      </Link>
    </div>
  );
}
