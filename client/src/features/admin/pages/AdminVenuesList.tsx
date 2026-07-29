import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { adminVenuesApi } from '../services/admin-venues.api';
import { publicVenuesApi } from '@/features/public/services/public-venues.api';
import type { Category } from '@/features/categories/types';
import { useAsyncFetch } from '@/shared/hooks/useAsyncFetch';
import { useDebounce } from '@/shared/hooks/useDebounce';
import Pagination, { type PaginationInfo } from '@/shared/components/ui/Pagination';
import type { VenueListResponse, ApiResponse } from '@/features/venues/types/venues.types';
import { Loading } from '@/shared/components/ui';
import {
  Search,
  Building2,
  Clock,
  CheckCircle2,
  XCircle,
  Eye,
  MapPin,
  Users,
  IndianRupee,
  SlidersHorizontal,
  Crown,
  Star,
} from 'lucide-react';

const statusStyles: Record<string, string> = {
  pending: 'border-warning/20 bg-warning/10 text-warning',
  approved: 'border-success/20 bg-success/10 text-success',
  rejected: 'border-error/20 bg-error/10 text-error',
};

const AdminVenuesList = () => {
  const navigate = useNavigate();

  // Query state
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>(
    'all'
  );
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [categories, setCategories] = useState<Category[]>([]);
  const [sortBy, setSortBy] = useState<'asc' | 'desc'>('desc');

  // Fetch hooks
  const {
    data: listResponse,
    loading,
    execute: fetchVenues,
  } = useAsyncFetch<ApiResponse<VenueListResponse>>();

  // Extract data
  const venues = listResponse?.data?.venues || [];
  const pagination: PaginationInfo = listResponse?.data?.pagination || {
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 1,
  };

  const debouncedSearch = useDebounce(search, 400);

  const loadVenues = () => {
    fetchVenues(() =>
      adminVenuesApi.getAll({
        page,
        limit: 10,
        search: debouncedSearch,
        status: statusFilter,
        sort: sortBy,
        category: categoryFilter !== 'all' ? categoryFilter : undefined,
      })
    );
  };

  useEffect(() => {
    publicVenuesApi.getCategoreis().then((res) => setCategories(res?.data?.categories || [])).catch(console.error);
  }, []);

  useEffect(() => {
    loadVenues();
  }, [page, debouncedSearch, statusFilter, sortBy, categoryFilter]);

  useEffect(() => {
    setPage(1);
  }, [debouncedSearch, statusFilter, sortBy, categoryFilter]);

  // Stats (computed from current page data)
  const pendingCount = venues.filter((v) => v.verificationStatus === 'pending').length;
  const approvedCount = venues.filter((v) => v.verificationStatus === 'approved').length;
  const rejectedCount = venues.filter((v) => v.verificationStatus === 'rejected').length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-foreground">
            Venue Management
          </h1>
          <p className="text-sm text-muted mt-1">
            Review, approve, or reject venue listings from all owners.
          </p>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        <div className="flex items-center gap-4 rounded-2xl border border-border bg-card p-5 shadow-sm">
          <div className="rounded-xl bg-primary/10 p-3 text-primary">
            <Building2 size={22} className="stroke-[1.5]" />
          </div>
          <div>
            <p className="text-xs font-semibold text-muted uppercase tracking-wider">
              Total Venues
            </p>
            <p className="text-2xl font-bold text-foreground mt-0.5">
              {loading ? '...' : pagination.total}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4 rounded-2xl border border-border bg-card p-5 shadow-sm">
          <div className="rounded-xl bg-warning/10 p-3 text-warning">
            <Clock size={22} className="stroke-[1.5]" />
          </div>
          <div>
            <p className="text-xs font-semibold text-muted uppercase tracking-wider">Pending</p>
            <p className="text-2xl font-bold text-foreground mt-0.5">
              {loading ? '...' : pendingCount}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4 rounded-2xl border border-border bg-card p-5 shadow-sm">
          <div className="rounded-xl bg-success/10 p-3 text-success">
            <CheckCircle2 size={22} className="stroke-[1.5]" />
          </div>
          <div>
            <p className="text-xs font-semibold text-muted uppercase tracking-wider">Approved</p>
            <p className="text-2xl font-bold text-foreground mt-0.5">
              {loading ? '...' : approvedCount}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4 rounded-2xl border border-border bg-card p-5 shadow-sm">
          <div className="rounded-xl bg-error/10 p-3 text-error">
            <XCircle size={22} className="stroke-[1.5]" />
          </div>
          <div>
            <p className="text-xs font-semibold text-muted uppercase tracking-wider">Rejected</p>
            <p className="text-2xl font-bold text-foreground mt-0.5">
              {loading ? '...' : rejectedCount}
            </p>
          </div>
        </div>
      </div>

      {/* Toolbar */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-muted pointer-events-none"
          />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search venues..."
            className="w-full rounded-xl border border-border bg-background pl-10 pr-4 py-2.5 text-sm text-foreground placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
          />
        </div>

        {/* Filters */}
        <div className="flex items-center gap-2">
          <div className="relative">
            <SlidersHorizontal
              size={14}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-muted pointer-events-none"
            />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
              className="appearance-none rounded-xl border border-border bg-background pl-9 pr-8 py-2.5 text-xs font-semibold text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary cursor-pointer transition-all"
            >
              <option value="all">All Statuses</option>
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>

          <div className="relative">
            <SlidersHorizontal
              size={14}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-muted pointer-events-none"
            />
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="appearance-none rounded-xl border border-border bg-background pl-9 pr-8 py-2.5 text-xs font-semibold text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary cursor-pointer transition-all max-w-[150px] truncate"
            >
              <option value="all">All Categories</option>
              {categories.map((cat) => (
                <option key={cat._id || cat.id} value={cat._id || cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as 'asc' | 'desc')}
            className="appearance-none rounded-xl border border-border bg-background px-4 py-2.5 text-xs font-semibold text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary cursor-pointer transition-all"
          >
            <option value="desc">Newest First</option>
            <option value="asc">Oldest First</option>
          </select>
        </div>
      </div>

      {/* Content */}
      {loading ? (
        <Loading />
      ) : venues.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div className="rounded-full bg-background border border-border p-4 text-muted mb-4">
            <Building2 size={32} className="stroke-[1.2]" />
          </div>
          <h3 className="text-lg font-bold text-foreground">No venues found</h3>
          <p className="text-sm text-muted mt-1 max-w-sm">No venues match your current filters.</p>
        </div>
      ) : (
        <>
          {/* Venue Cards Grid */}
          <div className="grid gap-5 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            {venues.map((venue) => {
              const categoryName =
                venue.categoryId && typeof venue.categoryId === 'object'
                  ? venue.categoryId.name
                  : 'Uncategorized';
              const statusClass = statusStyles[venue.verificationStatus] || statusStyles.pending;

              // Owner info from populated field
              const ownerInfo = venue.ownerId as any;
              const ownerName =
                ownerInfo && typeof ownerInfo === 'object' ? ownerInfo.fullName : 'Unknown';

              return (
                <div
                  key={venue._id}
                  className="group rounded-2xl border border-border bg-card shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden"
                >
                  {/* Image */}
                  <div className="relative h-44 overflow-hidden bg-background">
                    {venue.images.length > 0 ? (
                      <img
                        src={venue.images[0]}
                        alt={venue.name}
                        className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center text-muted">
                        <MapPin size={32} className="stroke-[1.2]" />
                      </div>
                    )}

                    {/* Elite/Featured Badges */}
                    <div className="absolute top-3 left-3 flex flex-col gap-1 z-10">
                      {venue.isElite && (
                        <span className="inline-flex items-center gap-0.5 rounded-lg bg-amber-500 text-white px-2 py-0.5 text-[9px] font-extrabold uppercase tracking-wide shadow-sm border border-amber-400">
                          <Crown size={9} className="fill-current" /> Elite
                        </span>
                      )}
                      {venue.isFeatured && (
                        <span className="inline-flex items-center gap-0.5 rounded-lg bg-blue-500 text-white px-2 py-0.5 text-[9px] font-extrabold uppercase tracking-wide shadow-sm border border-blue-400">
                          <Star size={9} className="fill-current" /> Featured
                        </span>
                      )}
                    </div>

                    {/* Active/Inactive Badge */}
                    <div className="absolute bottom-3 left-3 z-10">
                      <span
                        className={`inline-flex items-center rounded-lg px-2 py-0.5 text-[9px] font-extrabold uppercase tracking-wide border shadow-sm ${
                          venue.isActive
                            ? 'bg-emerald-500 border-emerald-400 text-white'
                            : 'bg-zinc-500 border-zinc-400 text-white'
                        }`}
                      >
                        {venue.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </div>

                    <span
                      className={`absolute top-3 right-3 inline-flex items-center rounded-lg border px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider ${statusClass}`}
                    >
                      {venue.verificationStatus}
                    </span>
                  </div>

                  {/* Content */}
                  <div className="p-4 space-y-3">
                    <div>
                      <h3 className="text-base font-bold text-foreground truncate">{venue.name}</h3>
                      <p className="text-xs text-muted mt-0.5">{categoryName}</p>
                    </div>

                    <div className="flex items-center gap-1.5 text-xs text-muted">
                      <MapPin size={13} className="shrink-0" />
                      <span className="truncate">
                        {venue.address.city}, {venue.address.state}
                      </span>
                    </div>

                    {/* Owner */}
                    <div className="flex items-center gap-1.5 text-xs text-muted">
                      <Users size={13} className="shrink-0" />
                      <span className="truncate font-medium">Owner: {ownerName}</span>
                    </div>

                    {/* Stats */}
                    <div className="flex items-center gap-4 text-xs text-foreground">
                      <div className="flex items-center gap-1.5">
                        <Users size={13} className="text-muted" />
                        <span className="font-semibold">{venue.capacity}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <IndianRupee size={13} className="text-muted" />
                        <span className="font-semibold">
                          {venue.isAvailabilityConfigured && venue.availability
                            ? `₹${venue.availability.pricePerHour}/hr`
                            : 'N/A'}
                        </span>
                      </div>
                    </div>

                    {/* Action */}
                    <div className="pt-2 border-t border-border">
                      <button
                        onClick={() => navigate(`/admin/venues/${venue._id}`)}
                        className="
                          w-full inline-flex items-center justify-center gap-1.5
                          rounded-lg border border-border bg-background
                          py-2 text-xs font-semibold text-foreground
                          hover:bg-surface transition-all active:scale-95 cursor-pointer
                        "
                      >
                        <Eye size={14} />
                        View Details
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <Pagination pagination={pagination} onPageChange={setPage} itemName="venue" />
        </>
      )}
    </div>
  );
};

export default AdminVenuesList;
