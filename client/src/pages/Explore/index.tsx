import { useState, useRef, useCallback, useEffect } from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { useExploreVenues } from '@/hooks/useExploreVenues';
import { useDebounce } from '@/hooks/useDebounce';
import { useToggleWishlist, useWishlistSync } from '@/hooks/useWishlist';
import type { VenueFilters } from '@/types/venue.types';
import { FILTER_PRICE_STEPS } from '@/constants';
import { Filter } from 'lucide-react';
import { ExploreFilters } from '@/components/explore/ExploreFilters';
import { VenueGrid } from '@/components/explore/VenueGrid';

const ExplorePage = () => {
  const [filters, setFilters] = useState<VenueFilters>({});
  const [searchTerm, setSearchTerm] = useState('');
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);
  const [priceRangeIndex, setPriceRangeIndex] = useState<[number, number]>([
    0,
    FILTER_PRICE_STEPS.length - 1,
  ]);
  const [isScrolled, setIsScrolled] = useState(false);
  const [togglingVenues, setTogglingVenues] = useState<Set<string>>(new Set());

  const { toggleWishlist: toggleWishlistFn } = useToggleWishlist();
  useWishlistSync();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 200);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const debouncedSearchTerm = useDebounce(searchTerm, 400);
  const debouncedPriceRangeIndex = useDebounce(priceRangeIndex, 400);

  const { data, isLoading, isError, hasNextPage, fetchNextPage, isFetchingNextPage, isFetching } =
    useExploreVenues({
      ...filters,
      searchTerm: debouncedSearchTerm || undefined,
      minPrice: FILTER_PRICE_STEPS[debouncedPriceRangeIndex[0]],
      maxPrice: FILTER_PRICE_STEPS[debouncedPriceRangeIndex[1]],
    });

  const handleToggleWishlist = useCallback(
    async (venueId: string, e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setTogglingVenues((prev) => new Set([...prev, venueId]));
      try {
        await toggleWishlistFn(venueId);
      } finally {
        setTogglingVenues((prev) => {
          const next = new Set(prev);
          next.delete(venueId);
          return next;
        });
      }
    },
    [toggleWishlistFn]
  );

  const observerRef = useRef<IntersectionObserver | null>(null);
  const lastVenueElementRef = useCallback(
    (node: HTMLDivElement | null) => {
      if (isLoading || isFetchingNextPage) return;
      if (observerRef.current) observerRef.current.disconnect();
      observerRef.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasNextPage) {
          fetchNextPage();
        }
      });
      if (node) observerRef.current.observe(node);
    },
    [isLoading, isFetchingNextPage, hasNextPage, fetchNextPage]
  );

  const handleClearFilters = () => {
    setFilters({});
    setSearchTerm('');
    setPriceRangeIndex([0, FILTER_PRICE_STEPS.length - 1]);
  };

  const venues = data?.pages.flatMap((page) => page.venues) || [];
  const totalVenues = data?.pages[0]?.pagination?.total || 0;

  return (
    <section className="px-8 pt-24 mb-20 mx-auto">
      <div className="flex flex-col lg:grid lg:grid-cols-[300px_1fr] gap-6 p-2 items-start">
        <ExploreFilters
          isMobileFiltersOpen={isMobileFiltersOpen}
          setIsMobileFiltersOpen={setIsMobileFiltersOpen}
          filters={filters}
          setFilters={setFilters}
          priceRangeIndex={priceRangeIndex}
          setPriceRangeIndex={setPriceRangeIndex}
          handleClearFilters={handleClearFilters}
          isFetching={isFetching}
          isLoading={isLoading}
        />

        <main>
          <div className="mb-8 mt-0 lg:pl-6 lg:pt-2">
            <div
              className={`sticky top-18 z-20 bg-[var(--bg-primary)] transition-all duration-300 ${isScrolled ? 'pt-2 pb-3' : 'pt-4 pb-5'}`}
            >
              <h1
                className={`font-bold text-[var(--text-primary)] transition-all duration-300 ${isScrolled ? 'text-2xl' : 'text-4xl'}`}
              >
                Find Your Perfect Venue
              </h1>
              <div
                className={`transition-all duration-300 overflow-hidden ${isScrolled ? 'max-h-0 opacity-0' : 'max-h-20 opacity-100'}`}
              >
                <p className="mt-2 mb-5 text-[var(--text-secondary)]">
                  Discover halls, resorts, auditoriums, turfs and more for every occasion.
                </p>
              </div>

              <div
                className={`flex items-center gap-3 transition-all duration-300 ${isScrolled ? 'mt-3' : ''}`}
              >
                <Button
                  variant="outline"
                  className={`lg:hidden rounded-2xl border border-[var(--bg-grey)] bg-[var(--bg-tertiary)] px-5 flex items-center justify-center gap-2 shrink-0 text-xs lg:text-sm text-[var(--text-primary)] transition-all duration-300 h-auto ${isScrolled ? 'py-3' : 'py-4'}`}
                  onClick={() => setIsMobileFiltersOpen(true)}
                >
                  <Filter size={isScrolled ? 18 : 20} />
                  Filters
                </Button>
                <input
                  type="text"
                  placeholder="Search venues, cities, or event types..."
                  className={`w-full rounded-2xl border border-[var(--bg-grey)] bg-[var(--bg-tertiary)] px-5 outline-none text-xs lg:text-sm text-[var(--text-primary)] placeholder:text-[var(--text-secondary)] transition-all duration-300 ${isScrolled ? 'py-3' : 'py-4'}`}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>

            <div className="mb-6 flex items-center justify-between gap-4 flex-wrap">
              <h2 className="text-lg font-semibold text-[var(--text-primary)]">
                {totalVenues} Venues Found
              </h2>
              <Select
                value={filters.sortBy || ''}
                onValueChange={(value) =>
                  setFilters((prev) => ({ ...prev, sortBy: value as VenueFilters['sortBy'] }))
                }
              >
                <SelectTrigger className="w-[220px] rounded-2xl h-12">
                  <SelectValue placeholder="Sort By" />
                </SelectTrigger>
                <SelectContent position="popper" sideOffset={6}>
                  <SelectItem value="price-low">Price: Low to High</SelectItem>
                  <SelectItem value="price-high">Price: High to Low</SelectItem>
                  <SelectItem value="rating">Highest Rated</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <VenueGrid
              venues={venues}
              isFetching={isFetching}
              isLoading={isLoading}
              isFetchingNextPage={isFetchingNextPage}
              isError={isError}
              togglingVenues={togglingVenues}
              handleToggleWishlist={handleToggleWishlist}
              handleClearFilters={handleClearFilters}
              lastVenueElementRef={lastVenueElementRef}
            />

            {isFetchingNextPage && (
              <div className="mt-8 flex justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[var(--bg-green)]"></div>
              </div>
            )}
          </div>
        </main>
      </div>
    </section>
  );
};

export default ExplorePage;
