
import { useEffect, useState } from 'react';
import { adminBookingsApi } from '../services/admin-bookings.api';
import { publicVenuesApi } from '@/features/public/services/public-venues.api';
import type { Category } from '@/features/categories/types';
import { useAsyncFetch } from '@/shared/hooks/useAsyncFetch';
import { useDebounce } from '@/shared/hooks/useDebounce';
import type { PaginationInfo } from '@/shared/components/ui/Pagination';
import type { AdminBookingStats } from '../types/bookings/AdminBookings.types';


export const useAdminBookings = () => {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [categories, setCategories] = useState<Category[]>([]);
  const [sortBy, setSortBy] = useState<string>('new-old');

  const {
    data: listResponse,
    loading,
    execute: fetchBookings,
  } = useAsyncFetch<any>();


  const bookings = listResponse?.data?.bookings || [];
  const pagination: PaginationInfo = listResponse?.data?.pagination || {
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 1,
  };

  const debouncedSearch = useDebounce(search, 400);

  // Load categories once
  useEffect(() => {
    publicVenuesApi
      .getCategoreis()
      .then((res) => setCategories(res?.data?.categories || []))
      .catch(console.error);
  }, []);

  // Refetch when query params change
  useEffect(() => {
    fetchBookings(() =>
      adminBookingsApi.getAll({
        page,
        limit: 10,
        search: debouncedSearch,
        status: statusFilter,
        sort: sortBy,
        category: categoryFilter !== 'all' ? categoryFilter : undefined,
      })
    );
  }, [page, debouncedSearch, statusFilter, sortBy, categoryFilter]);

  // Reset to page 1 when filters change
  useEffect(() => {
    setPage(1);
  }, [debouncedSearch, statusFilter, sortBy, categoryFilter]);

  const stats: AdminBookingStats = {
    total: pagination.total,
    confirmedCount: bookings.filter((b: any) => b.bookingStatus === 'CONFIRMED').length,
    completedCount: bookings.filter((b: any) => b.bookingStatus === 'COMPLETED').length,
    cancelledCount: bookings.filter((b: any) => b.bookingStatus === 'CANCELLED').length,
  };

  return {
    loading,
    bookings,
    pagination,
    categories,
    stats,
    controls: {
      page,
      setPage,
      search,
      setSearch,
      statusFilter,
      setStatusFilter,
      categoryFilter,
      setCategoryFilter,
      sortBy,
      setSortBy,
    },
  };
};