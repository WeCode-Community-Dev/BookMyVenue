import { useNavigate } from 'react-router-dom';
import { Building2, MapPin, Users, IndianRupee, Clock, Heart } from 'lucide-react';
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

  const handleWishlistToggle = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!isAuthenticated) {
      toast.error('Please login to add to wishlist');
      navigate('/login');
      return;
    }
    
    // Optimistic UI update
    const previousWishlist = [...wishlist];
    if (isWishlisted) {
      setWishlist(wishlist.filter(id => id !== venue._id));
      toast.success('Removed from wishlist');
    } else {
      setWishlist([...wishlist, venue._id]);
      toast.success('Added to wishlist');
    }

    try {
      const res = await wishlistApi.toggleWishlist(venue._id);
      if (res.success) {
        setWishlist(res.data.wishlist); // sync with server
      }
    } catch (err: any) {
      // Revert on failure
      setWishlist(previousWishlist);
      toast.error(err.response?.data?.message || 'Failed to update wishlist');
    }
  };

  return (
    <div
      onClick={() => navigate(`/venues/${venue._id}`)}
      className="group rounded-2xl border border-border bg-card shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden cursor-pointer"
    >
      {/* Image */}
      <div className="relative h-48 overflow-hidden bg-background">
        {venue.images.length > 0 ? (
          <img
            src={venue.images[0]}
            alt={venue.name}
            className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-muted">
            <Building2 size={36} className="stroke-[1.2]" />
          </div>
        )}

        {/* Category Badge */}
        <span className="absolute top-3 left-3 inline-flex items-center rounded-lg bg-black/60 backdrop-blur-sm px-2.5 py-1 text-[10px] font-bold text-white uppercase tracking-wider">
          {categoryName}
        </span>

        {/* Wishlist Heart */}
        <button
          type="button"
          onClick={handleWishlistToggle}
          className="absolute top-3 right-3 p-2 rounded-full bg-white/80 backdrop-blur-md shadow-sm hover:bg-white hover:scale-110 transition-all duration-300 z-10"
        >
          <Heart 
            size={18} 
            className={`transition-colors duration-300 ${isWishlisted ? 'fill-primary text-primary' : 'text-foreground/70'}`} 
          />
        </button>
      </div>

      {/* Content */}
      <div className="p-4 space-y-3">
        <div>
          <h3 className="text-base font-bold text-foreground truncate group-hover:text-primary transition-colors">
            {venue.name}
          </h3>
          <div className="flex items-center gap-1.5 text-xs text-muted mt-1">
            <MapPin size={12} className="shrink-0" />
            <span className="truncate">
              {venue.address.city}, {venue.address.state}
            </span>
          </div>
        </div>
        {/* Stats */}
        <div className="border-t border-border pt-4 space-y-3">
          {/* Capacity */}
          <div className="flex items-center gap-2 text-sm">
            <Users size={16} className="text-muted shrink-0" />
            <span className="font-medium">
              {venue.capacity.toLocaleString()} Guests
            </span>
          </div>

          {/* Price & Time */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-primary">
              <IndianRupee size={17} />
              <span className="text-lg font-bold">
                {venue.availability?.pricePerHour ?? venue.pricing?.amount}
              </span>
              <span className="text-sm text-muted">/ Hour</span>
            </div>

            {venue.availability && (
              <div className="flex items-center gap-2 text-sm text-muted">
                <Clock size={15} />
                <span>
                  {venue.availability.openingTime} - {venue.availability.closingTime}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
