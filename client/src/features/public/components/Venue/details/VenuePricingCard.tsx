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
    <div className="rounded-3xl border border-border/60 bg-card p-6 sm:p-8 shadow-xl shadow-black/5 space-y-6">
      <div className="space-y-1">
        <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
          Rate
        </span>
        <div className="flex items-baseline gap-1.5">
          <span className="text-4xl font-black tracking-tight text-foreground">
            ₹{pricePerHour.toLocaleString()}
          </span>
          <span className="text-base text-muted-foreground font-medium">/ hour</span>
        </div>
      </div>

      <div className="space-y-3.5 pt-2">
        <div className="flex items-center justify-between py-2 border-b border-border/40 text-sm">
          <div className="flex items-center gap-2 text-muted-foreground font-medium">
            <Users size={16} /> Guest Capacity
          </div>
          <span className="font-bold text-foreground">{capacity} max</span>
        </div>

        <div className="flex items-center justify-between py-2 border-b border-border/40 text-sm">
          <div className="flex items-center gap-2 text-muted-foreground font-medium">
            <Building2 size={16} /> Category
          </div>
          <span className="font-bold text-foreground">{categoryName}</span>
        </div>

        <div className="flex items-center justify-between py-2 text-sm">
          <div className="flex items-center gap-2 text-muted-foreground font-medium">
            <Calendar size={16} /> Listed Date
          </div>
          <span className="font-bold text-foreground">{formattedDate}</span>
        </div>
      </div>

      <div className="space-y-3 pt-2">
        <Link
          to={`/bookings/${venueId}`}
          className="w-full inline-flex items-center justify-center gap-2 rounded-2xl bg-primary px-6 py-4 text-base font-extrabold text-white hover:bg-primary/95 transition-all shadow-lg shadow-primary/20 active:scale-[0.99]"
        >
          Book Venue
        </Link>

        <button
          onClick={handleShare}
          className="w-full inline-flex items-center justify-center gap-2 rounded-2xl border border-border/50 bg-background px-4 py-3 text-sm font-bold text-foreground hover:bg-surface transition-all active:scale-[0.98] cursor-pointer"
        >
          <Share2 size={16} /> Share Space
        </button>
      </div>
    </div>
  );
}
