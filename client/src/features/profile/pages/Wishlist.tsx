import { useEffect, useState } from 'react';
import { Heart, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { wishlistApi } from '../services/wishlist.api';
import VenueCard from '@/features/public/components/Venue/VenueCard';
import type { Venue } from '@/features/venues/types/venues.types';
import { useAppStore } from '@/store/app.store';

export default function Wishlist() {
  const [loading, setLoading] = useState(true);
  const [venues, setVenues] = useState<Venue[]>([]);
  const { wishlist } = useAppStore();

  const fetchWishlist = async () => {
    try {
      setLoading(true);
      const res = await wishlistApi.getWishlist();
      if (res.success && res.data) {
        setVenues(res.data);
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to load wishlist');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWishlist();
  }, []);

  // Filter out venues that might have been removed via VenueCard optimistic updates
  const displayVenues = venues.filter((venue) => wishlist.includes(venue._id));

  return (
    <div className="w-full max-w-7xl mx-auto py-10 px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground flex items-center gap-3">
          <Heart className="w-8 h-8 text-primary fill-primary" />
          My Wishlist
        </h1>
        <p className="text-sm sm:text-base text-foreground/60 mt-2">
          Your saved venues for easy access and booking.
        </p>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center min-h-[50vh] gap-3">
          <Loader2 className="w-8 h-8 text-primary animate-spin" />
          <p className="text-foreground/70 font-medium">Loading your favorites...</p>
        </div>
      ) : displayVenues.length === 0 ? (
        <div className="flex flex-col items-center justify-center min-h-[50vh] text-center p-8 bg-surface rounded-3xl border border-border shadow-sm">
          <div className="rounded-full bg-primary/10 p-5 mb-4">
            <Heart className="w-12 h-12 text-primary" />
          </div>
          <h3 className="text-xl font-bold text-foreground">Your wishlist is empty</h3>
          <p className="text-foreground/60 mt-2 max-w-md">
            Looks like you haven't saved any venues yet. Explore our venues and click the heart icon to save them here!
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {displayVenues.map((venue) => (
            <VenueCard key={venue._id} venue={venue} />
          ))}
        </div>
      )}
    </div>
  );
}
