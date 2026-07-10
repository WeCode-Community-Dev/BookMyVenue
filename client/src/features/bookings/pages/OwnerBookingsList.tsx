import { useEffect, useState, useCallback } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Loader2, Calendar, Eye, CheckCircle2, Clock } from 'lucide-react';
import { bookingsApi } from '../services/bookings.api';
import BookingFilters from '@/features/users/components/ui/BookingFilters';
import { Table, type Column } from '@/shared/components/ui';
import type { Booking } from '@/features/users/types';

export default function OwnerBookingsList() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const selectedFilter = searchParams.get('status') || 'ALL';
  const page = Number(searchParams.get('page')) || 1;
  const limit = Number(searchParams.get('limit')) || 10;

  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState<any>(null);
  const [stats, setStats] = useState({ total: 0, confirmed: 0, pending: 0 });

  const updateParams = (updates: Record<string, string | number | undefined>) => {
    setSearchParams(
      (prev) => {
        const newParams = new URLSearchParams(prev);
        Object.entries(updates).forEach(([key, value]) => {
          if (value === undefined || value === '') {
            newParams.delete(key);
          } else {
            newParams.set(key, String(value));
          }
        });
        return newParams;
      },
      { replace: true }
    );
  };

  const fetchBookings = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // Maps UI filter to backend API status param
      let apiStatus: string | undefined;
      if (selectedFilter === 'PENDING_PAYMENT') {
        apiStatus = 'reserved'; // Reserved bookings that are pending payment
      } else if (selectedFilter === 'CANCELLED') {
        apiStatus = 'cancelled';
      } else if (selectedFilter === 'COMPLETED') {
        apiStatus = 'completed';
      } else if (selectedFilter === 'UPCOMING') {
        apiStatus = 'confirmed';
      }

      const res = await bookingsApi.getOwnerBookings(page, limit, apiStatus);
      if (res.success && res.data) {
        setBookings(res.data.bookings || []);
        setPagination(res.data.pagination || null);
        setStats(res.data.stats || { total: 0, confirmed: 0, pending: 0 });
      } else {
        setError(res.message || 'Failed to fetch bookings.');
      }
    } catch (err: any) {
      setError(err?.response?.data?.message || err.message || 'Failed to load bookings.');
    } finally {
      setLoading(false);
    }
  }, [selectedFilter, page, limit]);

  useEffect(() => {
    fetchBookings();
  }, [fetchBookings]);

  // When filter changes, reset page back to 1
  const handleFilterChange = (filter: string) => {
    updateParams({ status: filter, page: 1 });
  };

  const handlePageChange = (newPage: number) => {
    updateParams({ page: newPage });
  };

  const getStatusStyle = (status: string, paymentStatus: string) => {
    if (status === 'reserved' && paymentStatus === 'pending') {
      return 'bg-warning/10 text-warning border-warning/20';
    }
    if (status === 'reserved' && paymentStatus === 'partial') {
      return 'bg-indigo-500/10 text-indigo-500 border-indigo-500/20';
    }
    if (paymentStatus === 'overdue') {
      return 'bg-error/10 text-error border-error/20';
    }
    switch (status) {
      case 'confirmed':
        return 'bg-success/10 text-success border-success/20';
      case 'completed':
        return 'bg-info/10 text-info border-info/20';
      case 'cancelled':
      case 'expired':
        return 'bg-error/10 text-error border-error/20';
      default:
        return 'bg-muted/10 text-foreground/75 border-border';
    }
  };

  const formatStatus = (status: string, paymentStatus: string) => {
    if (status === 'reserved' && paymentStatus === 'pending') {
      return 'PENDING PAYMENT';
    }
    if (status === 'reserved' && paymentStatus === 'partial') {
      return 'DEPOSIT PAID';
    }
    if (paymentStatus === 'overdue') {
      return 'OVERDUE';
    }
    return status.toUpperCase();
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  // Columns definition for the reusable Table component
  const columns: Column<Booking>[] = [
    {
      header: 'Booking ID',
      accessor: (b) => (
        <span className="font-mono font-bold text-foreground">
          {b.bookingId || b.id.substring(0, 8).toUpperCase()}
        </span>
      ),
      className: 'whitespace-nowrap',
    },
    {
      header: 'Venue',
      accessor: (b) => (
        <div>
          <p className="font-bold text-foreground line-clamp-1">{b.venue.name}</p>
          <p className="text-xs text-foreground/50 line-clamp-1">{b.venue.location}</p>
        </div>
      ),
    },
    {
      header: 'Customer',
      accessor: (b) => (
        <div>
          <p className="font-semibold text-foreground">{b.contactName}</p>
          <p className="text-xs text-foreground/50">{b.contactEmail}</p>
        </div>
      ),
    },
    {
      header: 'Schedule',
      accessor: (b) => (
        <div className="text-xs space-y-0.5">
          <p>
            <span className="text-foreground/45">In:</span> {formatDate(b.startDateTime)}
          </p>
          <p>
            <span className="text-foreground/45">Out:</span> {formatDate(b.endDateTime)}
          </p>
        </div>
      ),
      className: 'whitespace-nowrap',
    },
    {
      header: 'Pricing & Status',
      accessor: (b) => (
        <div>
          <p className="font-bold text-primary">₹{b.totalAmount.toLocaleString('en-IN')}</p>
          <span
            className={`inline-flex items-center px-2 py-0.5 rounded-full text-[9px] font-bold border mt-1 ${getStatusStyle(b.bookingStatus, b.paymentStatus)}`}
          >
            {formatStatus(b.bookingStatus, b.paymentStatus)}
          </span>
        </div>
      ),
      className: 'whitespace-nowrap',
    },
    {
      header: 'Action',
      accessor: (b) => (
        <button
          onClick={() => navigate(`/owner/bookings/${b.id}`)}
          className="p-2 border border-border/80 hover:bg-primary/5 hover:border-primary/30 text-foreground/60 hover:text-primary rounded-xl transition-all cursor-pointer flex items-center justify-center"
          title="View Details"
        >
          <Eye className="w-4 h-4" />
        </button>
      ),
      className: 'w-10 text-center',
    },
  ];

  return (
    <div className="w-full max-w-7xl mx-auto py-10 px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-10">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-foreground tracking-tight">
          Venue Bookings
        </h1>
        <p className="mt-2 text-sm sm:text-base text-foreground/60">
          Manage bookings, track payments, and view customer requests for all your venues.
        </p>
      </div>

      {/* Statistics Cards */}
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-3 mb-8">
        {/* Total Bookings Card */}
        <div className="flex items-center gap-4 rounded-2xl border border-border bg-card p-5 shadow-sm">
          <div className="rounded-xl bg-primary/10 p-3 text-primary">
            <Calendar size={22} className="stroke-[1.5]" />
          </div>
          <div>
            <p className="text-xs font-semibold text-muted uppercase tracking-wider">
              Total Bookings
            </p>
            <p className="text-2xl font-bold text-foreground mt-0.5">
              {loading ? '...' : stats.total}
            </p>
          </div>
        </div>

        {/* Confirmed Bookings Card */}
        <div className="flex items-center gap-4 rounded-2xl border border-border bg-card p-5 shadow-sm">
          <div className="rounded-xl bg-success/10 p-3 text-success">
            <CheckCircle2 size={22} className="stroke-[1.5]" />
          </div>
          <div>
            <p className="text-xs font-semibold text-muted uppercase tracking-wider">
              Confirmed Bookings
            </p>
            <p className="text-2xl font-bold text-foreground mt-0.5">
              {loading ? '...' : stats.confirmed}
            </p>
          </div>
        </div>

        {/* Pending Bookings Card */}
        <div className="flex items-center gap-4 rounded-2xl border border-border bg-card p-5 shadow-sm">
          <div className="rounded-xl bg-warning/10 p-3 text-warning">
            <Clock size={22} className="stroke-[1.5]" />
          </div>
          <div>
            <p className="text-xs font-semibold text-muted uppercase tracking-wider">
              Pending / Reserved
            </p>
            <p className="text-2xl font-bold text-foreground mt-0.5">
              {loading ? '...' : stats.pending}
            </p>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="mb-8">
        <BookingFilters selected={selectedFilter} onChange={handleFilterChange} />
      </div>

      {/* Table & Empty state handling */}
      {error ? (
        <div className="flex flex-col items-center justify-center min-h-[30vh] text-center p-8 bg-surface border border-border rounded-3xl shadow-sm">
          <p className="text-error font-semibold text-lg mb-2">Failed to load bookings</p>
          <p className="text-foreground/60 text-sm max-w-md mb-6">{error}</p>
          <button
            onClick={fetchBookings}
            className="px-6 py-2.5 bg-primary hover:bg-accent text-white font-bold rounded-xl text-sm transition-colors cursor-pointer"
          >
            Try Again
          </button>
        </div>
      ) : (
        <Table<Booking>
          columns={columns}
          data={bookings}
          loading={loading}
          pagination={pagination}
          onPageChange={handlePageChange}
          itemName="booking"
          emptyState={
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <Calendar className="w-12 h-12 text-foreground/30 stroke-[1.2] mb-3" />
              <p className="font-bold text-foreground">No Bookings Found</p>
              <p className="text-xs text-foreground/60 mt-1 max-w-xs leading-relaxed">
                {selectedFilter === 'ALL'
                  ? 'No reservations have been made for your venues yet.'
                  : 'You do not have any matching results for this filter.'}
              </p>
            </div>
          }
        />
      )}
    </div>
  );
}
