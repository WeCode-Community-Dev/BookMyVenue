import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

interface BookingHeaderProps {
  venueId?: string;
}

export default function BookingHeader({ venueId }: BookingHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-border pb-5 sm:pb-6 gap-3 sm:gap-4">
      <div>
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-foreground tracking-tight">
          Secure Checkout
        </h1>
        <p className="text-xs sm:text-sm text-muted mt-1">
          Complete your venue reservation details and proceed to confirmation
        </p>
      </div>
      <Link
        to={venueId ? `/venues/${venueId}` : '/venues'}
        className="inline-flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm font-semibold text-primary hover:text-primary/80 transition-colors shrink-0"
      >
        <ArrowLeft size={14} className="sm:w-4 sm:h-4" /> Back to Venue Details
      </Link>
    </div>
  );
}
