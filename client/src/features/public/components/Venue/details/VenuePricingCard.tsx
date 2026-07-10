import { Users, Building2, Calendar, Share2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';

interface VenuePricingCardProps {
  venueId: string;
  pricePerHour: number;
  capacity: number;
  categoryName: string;
  formattedDate: string;
}

export default function VenuePricingCard({
  venueId,
  pricePerHour,
  capacity,
  categoryName,
  formattedDate,
}: VenuePricingCardProps) {
  const handleShare = () => {
    const url = window.location.href;
    navigator.clipboard
      .writeText(url)
      .then(() => {
        toast.success('Venue listing link copied to clipboard!');
      })
      .catch((err) => {
        console.error('Could not copy URL: ', err);
        toast.error('Failed to copy link to clipboard.');
      });
  };

  return (
    <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
      <div className="flex items-baseline gap-1 mb-4">
        <span className="text-3xl font-extrabold text-foreground">
          ₹{pricePerHour.toLocaleString()}
        </span>
        <span className="text-sm text-muted font-medium">/ hour</span>
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between py-2.5 border-b border-border">
          <div className="flex items-center gap-2 text-xs text-muted font-medium">
            <Users size={14} /> Capacity
          </div>
          <span className="text-sm font-bold text-foreground">{capacity} guests max</span>
        </div>

        <div className="flex items-center justify-between py-2.5 border-b border-border">
          <div className="flex items-center gap-2 text-xs text-muted font-medium">
            <Building2 size={14} /> Category
          </div>
          <span className="text-sm font-bold text-foreground">{categoryName}</span>
        </div>

        <div className="flex items-center justify-between py-2.5">
          <div className="flex items-center gap-2 text-xs text-muted font-medium">
            <Calendar size={14} /> Listed
          </div>
          <span className="text-sm font-bold text-foreground">{formattedDate}</span>
        </div>
      </div>

      <div className="mt-6 space-y-2.5">
        <Link
          to={`/bookings/${venueId}`}
          className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-4 py-3 text-sm font-semibold text-white hover:bg-primary/90 transition-all shadow-md shadow-primary/10"
        >
          Book Venue
        </Link>

        <button
          onClick={handleShare}
          className="w-full inline-flex items-center justify-center gap-2 rounded-xl border border-border bg-background px-4 py-2.5 text-xs font-semibold text-foreground hover:bg-surface transition-all active:scale-[0.98] cursor-pointer"
        >
          <Share2 size={14} /> Share Space
        </button>
      </div>
    </div>
  );
}
