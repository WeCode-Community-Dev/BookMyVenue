import { useEffect, useState } from 'react';
import { publicVenuesApi, type PublicVenueQuery } from '../services/public-venues.api';
import { useAsyncFetch } from '@/shared/hooks/useAsyncFetch';
import { useDebounce } from '@/shared/hooks/useDebounce';
import Pagination, { type PaginationInfo } from '@/shared/components/ui/Pagination';
import type { VenueListResponse, ApiResponse } from '@/features/venues/types/venues.types';
import type { Category } from '@/features/categories/types';

import VenueHeader from '../components/Venue/VenueHeader';
import VenueSearchBar from '../components/Venue/VenueSearchBar';
import VenueFilters from '../components/Venue/VenueFilters';
import VenueGrid from '../components/Venue/VenueGrid';
import VenueEmptyState from '../components/Venue/VenueEmptyState';
import VenueLoading from '../components/Venue/VenueLoading';
import { venueFilterSchema } from '../components/Venue/schemas/venueFilter.schema';

export default function VenueListPage() {
  // Query state
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [sortBy, setSortBy] = useState<PublicVenueQuery['sort']>('newest');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [minCapacity, setMinCapacity] = useState('');
  const [maxCapacity, setMaxCapacity] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  const [categories, setCategories] = useState<Category[]>([]);

  const {
    data: listResponse,
    loading,
    execute: fetchVenues,
  } = useAsyncFetch<ApiResponse<VenueListResponse>>();

  const venues = listResponse?.data?.venues || [];
  const pagination: PaginationInfo = listResponse?.data?.pagination || {
    total: 0,
    page: 1,
    limit: 12,
    totalPages: 1,
  };

  const debouncedSearch = useDebounce(search, 400);
  const debouncedMinPrice = useDebounce(minPrice, 400);
  const debouncedMaxPrice = useDebounce(maxPrice, 400);
  const debouncedMinCapacity = useDebounce(minCapacity, 400);
  const debouncedMaxCapacity = useDebounce(maxCapacity, 400);

  const [errors, setErrors] = useState<{
    minPrice?: string;
    maxPrice?: string;
    minCapacity?: string;
    maxCapacity?: string;
  }>({});

  useEffect(() => {
    const result = venueFilterSchema.safeParse({
      minPrice,
      maxPrice,
      minCapacity,
      maxCapacity,
    });

    if (result.success) {
      setErrors({});
      return;
    }

    const fieldErrors: Record<string, string> = {};
    result.error.issues.forEach((issue) => {
      const field = issue.path[0] as string;
      if (!fieldErrors[field]) {
        fieldErrors[field] = issue.message;
      }
    });
    setErrors(fieldErrors);
  }, [minPrice, maxPrice, minCapacity, maxCapacity]);

  useEffect(() => {
    publicVenuesApi
      .getCategoreis({ status: 'active', limit: 100 })
      .then((res) => setCategories(res.data.categories))
      .catch(() => {});
  }, []);

  const loadVenues = () => {
    const validationResult = venueFilterSchema.safeParse({
      minPrice: debouncedMinPrice,
      maxPrice: debouncedMaxPrice,
      minCapacity: debouncedMinCapacity,
      maxCapacity: debouncedMaxCapacity,
    });

    if (!validationResult.success) {
      return;
    }

    const query: PublicVenueQuery = {
      page,
      limit: 12,
      search: debouncedSearch || undefined,
      category: categoryFilter || undefined,
      sort: sortBy,
      minPrice: debouncedMinPrice ? Number(debouncedMinPrice) : undefined,
      maxPrice: debouncedMaxPrice ? Number(debouncedMaxPrice) : undefined,
      minCapacity: debouncedMinCapacity ? Number(debouncedMinCapacity) : undefined,
      maxCapacity: debouncedMaxCapacity ? Number(debouncedMaxCapacity) : undefined,
    };
    fetchVenues(() => publicVenuesApi.getAll(query));
  };

  useEffect(() => {
    loadVenues();
  }, [
    page,
    debouncedSearch,
    categoryFilter,
    sortBy,
    debouncedMinPrice,
    debouncedMaxPrice,
    debouncedMinCapacity,
    debouncedMaxCapacity,
  ]);

  useEffect(() => {
    setPage(1);
  }, [
    debouncedSearch,
    categoryFilter,
    sortBy,
    debouncedMinPrice,
    debouncedMaxPrice,
    debouncedMinCapacity,
    debouncedMaxCapacity,
  ]);

  const activeFilterCount = [categoryFilter, minPrice, maxPrice, minCapacity, maxCapacity].filter(
    Boolean
  ).length;

  const clearAllFilters = () => {
    setCategoryFilter('');
    setMinPrice('');
    setMaxPrice('');
    setMinCapacity('');
    setMaxCapacity('');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <VenueHeader />

      <div className="flex flex-wrap gap-y-4 items-center justify-between">
        <VenueSearchBar value={search} onChange={setSearch} />
        <VenueFilters
          categories={categories}
          showFilters={showFilters}
          onToggleFilters={() => setShowFilters(!showFilters)}
          sortBy={sortBy}
          onSortChange={setSortBy}
          categoryFilter={categoryFilter}
          onCategoryChange={setCategoryFilter}
          minPrice={minPrice}
          maxPrice={maxPrice}
          onMinPriceChange={setMinPrice}
          onMaxPriceChange={setMaxPrice}
          minCapacity={minCapacity}
          maxCapacity={maxCapacity}
          onMinCapacityChange={setMinCapacity}
          onMaxCapacityChange={setMaxCapacity}
          activeFilterCount={activeFilterCount}
          onClearAll={clearAllFilters}
          errors={errors}
        />
      </div>

      {!loading && (
        <p className="text-xs text-muted font-medium">
          {pagination.total} venue{pagination.total !== 1 ? 's' : ''} found
        </p>
      )}

      {loading ? (
        <VenueLoading />
      ) : venues.length === 0 ? (
        <VenueEmptyState
          hasActiveFilters={activeFilterCount > 0}
          onClearFilters={clearAllFilters}
        />
      ) : (
        <>
          <VenueGrid venues={venues} />
          <Pagination pagination={pagination} onPageChange={setPage} itemName="venue" />
        </>
      )}
    </div>
  );
}
