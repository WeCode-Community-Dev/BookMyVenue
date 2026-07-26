import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/useToast';
import * as wishlistService from '@/services/wishlistService';
import { Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface WishlistVenue {
  _id: string;
  name: string;
  city: string;
  district: string;
  coverImage: string;
  maxCapacity?: number;
  avgRating: number;
  reviewCount: number;
}

interface PaginationMeta {
  total: number;
  page: number;
  totalPages: number;
  hasMore: boolean;
}

export default function WishlistPage() {
  const [venues, setVenues] = useState<WishlistVenue[]>([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState<PaginationMeta | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  const navigate = useNavigate();
  const { user } = useAuth();
  const { error: showError } = useToast();

  useEffect(() => {
    if (!user) {
      navigate('/auth/login');
      return;
    }

    const fetchWishlist = async () => {
      try {
        setLoading(true);
        const response = await wishlistService.getMyWishlist(currentPage, 20);
        setVenues(response.data?.venues || []);
        setPagination(response.data?.pagination || null);
      } catch (err) {
        const errorMsg = err instanceof Error ? err.message : 'Failed to load wishlist';
        showError(errorMsg);
      } finally {
        setLoading(false);
      }
    };

    fetchWishlist();
  }, [user, currentPage, navigate, showError]);

  const handleViewVenue = (venueId: string) => {
    navigate(`/venue/${venueId}`);
  };

  const handleRemoveWishlist = async (venueId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await wishlistService.toggleWishlist(venueId);
      setVenues((prev) => prev.filter((v) => v._id !== venueId));
      setPagination((prev) => (prev ? { ...prev, total: Math.max(0, prev.total - 1) } : null));
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Failed to remove from wishlist';
      showError(errorMsg);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--bg-primary)]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--bg-green)]"></div>
      </div>
    );
  }

  if (!venues.length) {
    return (
      <div className="min-h-screen bg-[var(--bg-primary)] py-12 mt-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <Heart className="mx-auto h-12 w-12 text-[var(--text-secondary)]" />
            <h1 className="mt-4 text-2xl font-bold text-[var(--text-primary)]">
              Your wishlist is empty
            </h1>
            <p className="mt-2 text-[var(--text-secondary)]">
              Start adding venues to your wishlist to save them for later
            </p>
            <Button onClick={() => navigate('/explore')} className="mt-6">
              Explore Venues
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] py-12 mt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[var(--text-primary)]">My Wishlist</h1>
          <p className="mt-2 text-[var(--text-secondary)]">
            {pagination?.total} venue{pagination?.total !== 1 ? 's' : ''} saved
          </p>
        </div>

        {/* Venues Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {venues.map((venue) => (
            <div
              key={venue._id}
              className="bg-[var(--bg-tertiary)] rounded-lg shadow-md hover:shadow-lg transition-shadow overflow-hidden cursor-pointer"
              onClick={() => handleViewVenue(venue._id)}
            >
              {/* Image */}
              <div className="relative h-48 bg-[var(--bg-grey)] overflow-hidden">
                {venue.coverImage && venue.coverImage.startsWith('https://') ? (
                  <img
                    src={venue.coverImage}
                    alt={venue.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-[var(--bg-grey)]" />
                )}
                <button
                  onClick={(e) => handleRemoveWishlist(venue._id, e)}
                  className="absolute top-3 right-3 p-2 bg-[var(--bg-tertiary)]/80 hover:bg-[var(--bg-tertiary)] rounded-full transition z-10"
                  title="Remove from wishlist"
                >
                  <Heart
                    size={20}
                    className="fill-red-500 text-red-500 dark:fill-red-400 dark:text-red-400"
                  />
                </button>
              </div>

              {/* Content */}
              <div className="p-4">
                <h3 className="text-lg font-semibold text-[var(--text-primary)] truncate">
                  {venue.name}
                </h3>
                <p className="text-sm text-[var(--text-secondary)] mt-1">
                  {venue.city}
                  {venue.district && `, ${venue.district}`}
                </p>

                {/* Rating */}
                <div className="flex items-center mt-3 gap-2">
                  <span className="text-sm font-medium text-[var(--text-primary)]">
                    ⭐ {(venue.avgRating || 0).toFixed(1)}
                  </span>
                  <span className="text-xs text-[var(--text-secondary)]">
                    ({venue.reviewCount || 0} reviews)
                  </span>
                </div>

                {/* Capacity */}
                {venue.maxCapacity && (
                  <p className="text-xs text-[var(--text-secondary)] mt-2">
                    Capacity: {venue.maxCapacity} guests
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Pagination */}
        {pagination && pagination.totalPages > 1 && (
          <div className="flex justify-center items-center gap-4">
            <Button
              variant={currentPage === 1 ? 'outline' : 'default'}
              onClick={() => setCurrentPage(currentPage - 1)}
              disabled={currentPage === 1}
            >
              Previous
            </Button>

            <div className="text-sm text-[var(--text-secondary)]">
              Page {pagination.page} of {pagination.totalPages}
            </div>

            <Button
              variant={!pagination.hasMore ? 'outline' : 'default'}
              onClick={() => setCurrentPage(currentPage + 1)}
              disabled={!pagination.hasMore}
            >
              Next
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
