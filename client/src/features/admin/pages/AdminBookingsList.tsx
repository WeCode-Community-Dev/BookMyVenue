import Pagination from '@/shared/components/ui/Pagination';
import { Loading } from '@/shared/components/ui';
import { FileText } from 'lucide-react';
import { useAdminBookings } from '../hooks/useAdminBookings';
import BookingsStats from '../components/BookingsStats';
import BookingsToolbar from '../components/BookingsToolbar';
import BookingsTable from '../components/BookingsTable';

const AdminBookingsList = () => {
  const {
    loading,
    bookings,
    pagination,
    categories,
    stats,
    controls,
  } = useAdminBookings();

  return (
    <div className="space-y-6">
      {/* ── Header ─────────────────────────────────────────────── */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-foreground">
            Bookings Overview
          </h1>
          <p className="text-sm text-muted mt-1">
            Monitor and manage all venue bookings across the platform.
          </p>
        </div>
      </div>

      {/* ── Stats Cards ────────────────────────────────────────── */}
      <BookingsStats stats={stats} loading={loading} />

      {/* ── Toolbar ────────────────────────────────────────────── */}
      <BookingsToolbar
        search={controls.search}
        setSearch={controls.setSearch}
        statusFilter={controls.statusFilter}
        setStatusFilter={controls.setStatusFilter}
        categoryFilter={controls.categoryFilter}
        setCategoryFilter={controls.setCategoryFilter}
        sortBy={controls.sortBy}
        setSortBy={controls.setSortBy}
        categories={categories}
      />

      {/* ── Content ────────────────────────────────────────────── */}
      {loading ? (
        <Loading />
      ) : bookings.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div className="rounded-full bg-background border border-border p-4 text-muted mb-4">
            <FileText size={32} className="stroke-[1.2]" />
          </div>
          <h3 className="text-lg font-bold text-foreground">No bookings found</h3>
          <p className="text-sm text-muted mt-1 max-w-sm">
            No bookings match your current filters.
          </p>
        </div>
      ) : (
        <>
          <BookingsTable bookings={bookings} />
          <Pagination pagination={pagination} onPageChange={controls.setPage} itemName="booking" />
        </>
      )}
    </div>
  );
};

export default AdminBookingsList;
