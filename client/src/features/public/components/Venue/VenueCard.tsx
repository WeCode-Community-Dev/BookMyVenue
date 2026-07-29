import { useNavigate } from 'react-router-dom';
import { Building2, MapPin, Users, Clock, Heart, ArrowUpRight } from 'lucide-react';
import type { Venue } from '@/features/venues/types/venues.types';
import { useAppStore } from '@/store/app.store';
import { wishlistApi } from '@/features/profile/services/wishlist.api';
import { toast } from 'sonner';

interface VenueCardProps {
  venue: Venue;
}

export default function VenueCard({ venue }: VenueCardProps) {
  const navigate = useNavigate();
  const { wishlist, setWishlist, isAuthenticated } = useAppStore();

  const categoryName =
    venue.categoryId && typeof venue.categoryId === 'object'
      ? venue.categoryId.name
      : 'Uncategorized';

  const isWishlisted = wishlist.includes(venue._id);

  const price = venue.availability?.pricePerHour ?? venue.pricing?.amount ?? 0;

  const handleWishlistToggle = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!isAuthenticated) {
      toast.error('Please sign in to add to wishlist');
      navigate('/signin');
      return;
    }

    // Optimistic UI update
    const previousWishlist = [...wishlist];
    if (isWishlisted) {
      setWishlist(wishlist.filter((id) => id !== venue._id));
      toast.success('Removed from wishlist');
    } else {
      setWishlist([...wishlist, venue._id]);
      toast.success('Added to wishlist');
    }

    try {
      const res = await wishlistApi.toggleWishlist(venue._id);
      if (res.success) {
        setWishlist(res.data.wishlist);
      }
    } catch (err: any) {
      setWishlist(previousWishlist);
      toast.error(err.response?.data?.message || 'Failed to update wishlist');
    }
  };

  return (
    <div
      onClick={() => navigate(`/venues/${venue._id}`)}
      className="group rounded-3xl border border-border/60 bg-card p-3.5 space-y-4 shadow-sm hover:shadow-2xl hover:border-primary/40 transition-all duration-300 overflow-hidden cursor-pointer flex flex-col justify-between"
    >
      {/* Media Header */}
      <div className="relative h-60 sm:h-64 w-full rounded-2xl overflow-hidden bg-black/40">
        {venue.images && venue.images.length > 0 ? (
          <img
            src={venue.images[0]}
            alt={venue.name}
            className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-muted-foreground/40">
            <Building2 size={48} className="stroke-[1.2]" />
          </div>
        )}

        {/* Category Pill */}
        <span className="absolute top-3 left-3 inline-flex items-center rounded-full bg-black/50 backdrop-blur-md border border-white/20 px-3.5 py-1 text-[11px] font-extrabold text-white uppercase tracking-wider shadow-md">
          {categoryName}
        </span>

        {/* Wishlist Heart */}
        <button
          type="button"
          onClick={handleWishlistToggle}
          className="absolute top-3 right-3 w-10 h-10 rounded-full bg-black/40 backdrop-blur-md border border-white/20 flex items-center justify-center text-white hover:bg-black/70 hover:scale-110 active:scale-95 transition-all shadow-md cursor-pointer z-10"
        >
          <Heart
            size={18}
            className={`transition-colors duration-300 ${
              isWishlisted ? 'fill-primary text-primary' : 'text-white'
            }`}
          />
        </button>

        {/* Price tag overlay at bottom of image */}
        <div className="absolute bottom-3 left-3 rounded-xl bg-black/60 backdrop-blur-md px-3 py-1.5 border border-white/10 flex items-baseline gap-1 text-white">
          <span className="text-xl font-black">₹{price.toLocaleString()}</span>
          <span className="text-xs text-white/70 font-medium">/ hr</span>
        </div>
      </div>

      {/* Card Body */}
      <div className="px-1.5 space-y-3 flex-1 flex flex-col justify-between">
        <div className="space-y-1.5">
          <div className="flex items-start justify-between gap-2">
            <h3 className="text-xl font-black text-foreground group-hover:text-primary transition-colors tracking-tight line-clamp-1">
              {venue.name}
            </h3>
            <div className="w-8 h-8 rounded-full bg-surface border border-border/40 flex items-center justify-center shrink-0 group-hover:bg-primary group-hover:text-white transition-all">
              <ArrowUpRight size={16} />
            </div>
          </div>

          <div className="flex items-center gap-1.5 text-sm text-muted-foreground font-medium">
            <MapPin size={15} className="shrink-0 text-primary" />
            <span className="truncate">
              {venue.address.city}, {venue.address.state}
            </span>
          </div>
        </div>

        {/* Feature Badges Row */}
        <div className="pt-3 border-t border-border/40 flex items-center justify-between gap-2 text-xs font-semibold text-muted-foreground">
          <div className="flex items-center gap-1.5 bg-surface/70 border border-border/40 px-3 py-1.5 rounded-xl">
            <Users size={14} className="text-primary" />
            <span>{venue.capacity.toLocaleString()} Max</span>
          </div>

          {venue.availability ? (
            <div className="flex items-center gap-1.5 bg-surface/70 border border-border/40 px-3 py-1.5 rounded-xl">
              <Clock size={14} className="text-primary" />
              <span>
                {venue.availability.openingTime} - {venue.availability.closingTime}
              </span>
            </div>
          ) : (
            <div className="flex items-center gap-1.5 bg-surface/70 border border-border/40 px-3 py-1.5 rounded-xl">
              <span>Standard Hours</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
