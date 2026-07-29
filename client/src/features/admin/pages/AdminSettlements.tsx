import { useEffect, useState, useCallback } from 'react';
import {
  IndianRupee,
  Clock,
  CheckCircle2,
  Building2,
  Users,
  Calendar,
  ArrowRight,
  Loader2,
  AlertCircle,
} from 'lucide-react';
import { toast } from 'sonner';
import { adminSettlementsApi } from '../services/admin-settlements.api';
import Pagination, { type PaginationInfo } from '@/shared/components/ui/Pagination';
import { Loading } from '@/shared/components/ui';

export default function AdminSettlements() {
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [releasingId, setReleasingId] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState<PaginationInfo>({
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 1,
  });

  const fetchPending = useCallback(async () => {
    try {
      setLoading(true);
      const res = await adminSettlementsApi.getPending(page, 10);
      if (res.success && res.data) {
        setBookings(res.data.bookings || []);
        setPagination(res.data.pagination || { total: 0, page: 1, limit: 10, totalPages: 1 });
      }
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Failed to fetch settlements');
    } finally {
      setLoading(false);
    }
  }, [page]);

  useEffect(() => {
    fetchPending();
  }, [fetchPending]);

  const handleRelease = async (bookingId: string) => {
    try {
      setReleasingId(bookingId);
      const res = await adminSettlementsApi.release(bookingId);
      if (res.success) {
        toast.success('Settlement released successfully!');
        fetchPending();
      } else {
        toast.error(res.message || 'Failed to release settlement.');
      }
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Failed to release settlement.');
    } finally {
      setReleasingId(null);
    }
  };

  const formatDate = (d: string) =>
    new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });

  const formatTime = (d: string) =>
    new Date(d).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });

  const FEE_RATE = 0.12;

  const totalPendingAmount = bookings.reduce((s, b) => s + (b.totalAmount || 0), 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-extrabold tracking-tight text-foreground">
          Settlement Management
        </h1>
        <p className="text-sm text-muted mt-1">
          Review and release payments to venue owners for completed bookings.
        </p>
      </div>

      {/* Stats */}
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-3">
        <div className="flex items-center gap-4 rounded-2xl border border-border bg-card p-5 shadow-sm">
          <div className="rounded-xl bg-warning/10 p-3 text-warning">
            <Clock size={22} className="stroke-[1.5]" />
          </div>
          <div>
            <p className="text-xs font-semibold text-muted uppercase tracking-wider">Pending Settlements</p>
            <p className="text-2xl font-bold text-foreground mt-0.5">
              {loading ? '...' : pagination.total}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4 rounded-2xl border border-border bg-card p-5 shadow-sm">
          <div className="rounded-xl bg-primary/10 p-3 text-primary">
            <IndianRupee size={22} className="stroke-[1.5]" />
          </div>
          <div>
            <p className="text-xs font-semibold text-muted uppercase tracking-wider">Total Pending Amount</p>
            <p className="text-2xl font-bold text-foreground mt-0.5">
              {loading ? '...' : `₹${totalPendingAmount.toLocaleString()}`}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4 rounded-2xl border border-border bg-card p-5 shadow-sm">
          <div className="rounded-xl bg-success/10 p-3 text-success">
            <CheckCircle2 size={22} className="stroke-[1.5]" />
          </div>
          <div>
            <p className="text-xs font-semibold text-muted uppercase tracking-wider">Platform Fees (this page)</p>
            <p className="text-2xl font-bold text-foreground mt-0.5">
              {loading ? '...' : `₹${Math.round(totalPendingAmount * FEE_RATE).toLocaleString()}`}
            </p>
          </div>
        </div>
      </div>

      {/* Content */}
      {loading ? (
        <Loading />
      ) : bookings.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div className="rounded-full bg-background border border-border p-4 text-muted mb-4">
            <CheckCircle2 size={32} className="stroke-[1.2]" />
          </div>
          <h3 className="text-lg font-bold text-foreground">All caught up!</h3>
          <p className="text-sm text-muted mt-1 max-w-sm">
            There are no pending settlements to process right now.
          </p>
        </div>
      ) : (
        <>
          <div className="overflow-hidden bg-card shadow-sm rounded-2xl border border-border">
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-left">
                <thead className="bg-background text-xs font-bold text-muted uppercase tracking-wider border-b border-border">
                  <tr>
                    <th className="p-4">Booking</th>
                    <th className="p-4">Venue</th>
                    <th className="p-4">Owner</th>
                    <th className="p-4">Event Date</th>
                    <th className="p-4 text-right">Total</th>
                    <th className="p-4 text-right">Platform Fee</th>
                    <th className="p-4 text-right">Owner Earnings</th>
                    <th className="p-4 text-center">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {bookings.map((booking) => {
                    const venue = booking.venue || {};
                    const owner = typeof venue.ownerId === 'object' ? venue.ownerId : {};
                    const total = booking.totalAmount || 0;
                    const fee = Math.round(total * FEE_RATE * 100) / 100;
                    const earnings = Math.round((total - fee) * 100) / 100;
                    const isReleasing = releasingId === booking._id;

                    return (
                      <tr
                        key={booking._id}
                        className="border-b border-border last:border-0 hover:bg-background/50 transition-colors"
                      >
                        <td className="p-4">
                          <span className="font-mono font-bold text-foreground text-sm">
                            {booking.bookingId || booking._id?.substring(0, 8).toUpperCase()}
                          </span>
                        </td>
                        <td className="p-4">
                          <div className="flex items-center gap-2">
                            <Building2 size={14} className="text-muted shrink-0" />
                            <span className="text-sm font-semibold text-foreground truncate max-w-[140px]">
                              {venue.name || 'N/A'}
                            </span>
                          </div>
                        </td>
                        <td className="p-4">
                          <div className="flex items-center gap-2">
                            <Users size={14} className="text-muted shrink-0" />
                            <span className="text-sm text-foreground truncate max-w-[120px]">
                              {owner.fullName || 'N/A'}
                            </span>
                          </div>
                        </td>
                        <td className="p-4">
                          <div className="flex items-center gap-2 text-sm text-foreground">
                            <Calendar size={14} className="text-muted shrink-0" />
                            <div>
                              <div>{formatDate(booking.startDateTime)}</div>
                              <div className="text-xs text-muted">
                                {formatTime(booking.startDateTime)} – {formatTime(booking.endDateTime)}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="p-4 text-right">
                          <span className="text-sm font-bold text-foreground">₹{total.toLocaleString()}</span>
                        </td>
                        <td className="p-4 text-right">
                          <span className="text-sm font-semibold text-error">-₹{fee.toLocaleString()}</span>
                        </td>
                        <td className="p-4 text-right">
                          <span className="text-sm font-bold text-success">₹{earnings.toLocaleString()}</span>
                        </td>
                        <td className="p-4 text-center">
                          <button
                            id={`release-${booking._id}`}
                            onClick={() => handleRelease(booking._id)}
                            disabled={isReleasing}
                            className="inline-flex items-center gap-1.5 rounded-lg bg-success/10 border border-success/20 px-3.5 py-2 text-xs font-bold text-success hover:bg-success/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                          >
                            {isReleasing ? (
                              <><Loader2 size={13} className="animate-spin" />Processing...</>
                            ) : (
                              <><ArrowRight size={13} />Release</>
                            )}
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
          <Pagination pagination={pagination} onPageChange={setPage} itemName="settlement" />
        </>
      )}

      <div className="flex items-start gap-3 rounded-2xl border border-primary/20 bg-primary/5 p-4">
        <AlertCircle size={18} className="text-primary shrink-0 mt-0.5" />
        <p className="text-sm text-foreground/80">
          <span className="font-bold text-primary">Auto-Settlement:</span> Bookings pending for more
          than 1 hour are automatically settled by the system. You may also manually release
          settlements above.
        </p>
      </div>
    </div>
  );
}
