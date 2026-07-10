import { useEffect, useState, useCallback } from 'react';
import {
  IndianRupee,
  Clock,
  CheckCircle2,
  TrendingUp,
  Building2,
  Calendar,
  AlertCircle,
} from 'lucide-react';
import { toast } from 'sonner';
import { ownerSettlementsApi } from '../services/owner-settlements.api';
import Pagination, { type PaginationInfo } from '@/shared/components/ui/Pagination';
import { Loading } from '@/shared/components/ui';

const statusStyles: Record<string, string> = {
  PENDING: 'bg-warning/10 text-warning border-warning/20',
  PROCESSING: 'bg-blue-500/10 text-blue-500 border-blue-500/20',
  SETTLED: 'bg-success/10 text-success border-success/20',
  FAILED: 'bg-error/10 text-error border-error/20',
};

export default function OwnerRevenue() {
  const [settlements, setSettlements] = useState<any[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState<PaginationInfo>({
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 1,
  });

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const [settlementsRes, statsRes] = await Promise.all([
        ownerSettlementsApi.getSettlements(page, 10),
        ownerSettlementsApi.getRevenueStats(),
      ]);
      if (settlementsRes.success && settlementsRes.data) {
        setSettlements(settlementsRes.data.settlements || []);
        setPagination(settlementsRes.data.pagination || { total: 0, page: 1, limit: 10, totalPages: 1 });
      }
      if (statsRes.success && statsRes.data) {
        setStats(statsRes.data);
      }
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Failed to load revenue data');
    } finally {
      setLoading(false);
    }
  }, [page]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const formatDate = (d: string) =>
    new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-extrabold tracking-tight text-foreground">Revenue & Settlements</h1>
        <p className="text-sm text-muted mt-1">Track your earnings from completed venue bookings.</p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        <div className="flex items-center gap-4 rounded-2xl border border-border bg-card p-5 shadow-sm">
          <div className="rounded-xl bg-success/10 p-3 text-success">
            <IndianRupee size={22} className="stroke-[1.5]" />
          </div>
          <div>
            <p className="text-xs font-semibold text-muted uppercase tracking-wider">Total Revenue</p>
            <p className="text-2xl font-bold text-foreground mt-0.5">
              {loading ? '...' : `₹${(stats?.totalRevenue || 0).toLocaleString()}`}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4 rounded-2xl border border-border bg-card p-5 shadow-sm">
          <div className="rounded-xl bg-warning/10 p-3 text-warning">
            <Clock size={22} className="stroke-[1.5]" />
          </div>
          <div>
            <p className="text-xs font-semibold text-muted uppercase tracking-wider">Pending Settlement</p>
            <p className="text-2xl font-bold text-foreground mt-0.5">
              {loading ? '...' : `₹${(stats?.pendingAmount || 0).toLocaleString()}`}
            </p>
            <p className="text-xs text-muted">{loading ? '' : `${stats?.pendingCount || 0} booking(s)`}</p>
          </div>
        </div>

        <div className="flex items-center gap-4 rounded-2xl border border-border bg-card p-5 shadow-sm">
          <div className="rounded-xl bg-primary/10 p-3 text-primary">
            <CheckCircle2 size={22} className="stroke-[1.5]" />
          </div>
          <div>
            <p className="text-xs font-semibold text-muted uppercase tracking-wider">Settled Bookings</p>
            <p className="text-2xl font-bold text-foreground mt-0.5">
              {loading ? '...' : stats?.settledCount || 0}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4 rounded-2xl border border-border bg-card p-5 shadow-sm">
          <div className="rounded-xl bg-error/10 p-3 text-error">
            <TrendingUp size={22} className="stroke-[1.5]" />
          </div>
          <div>
            <p className="text-xs font-semibold text-muted uppercase tracking-wider">Platform Fees Paid</p>
            <p className="text-2xl font-bold text-foreground mt-0.5">
              {loading ? '...' : `₹${(stats?.totalPlatformFee || 0).toLocaleString()}`}
            </p>
          </div>
        </div>
      </div>

      {/* Pending banner */}
      {!loading && stats?.pendingCount > 0 && (
        <div className="flex items-start gap-3 rounded-2xl border border-warning/20 bg-warning/5 p-4">
          <AlertCircle size={18} className="text-warning shrink-0 mt-0.5" />
          <p className="text-sm text-foreground/80">
            <span className="font-bold text-warning">Settlement Processing:</span> You have{' '}
            {stats.pendingCount} pending settlement(s) worth ₹{stats.pendingAmount.toLocaleString()}.
            Payments are automatically processed within 24 hours of event completion.
          </p>
        </div>
      )}

      {/* Settlement History */}
      <div>
        <h2 className="text-lg font-bold text-foreground mb-4">Settlement History</h2>
        {loading ? (
          <Loading />
        ) : settlements.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="rounded-full bg-background border border-border p-4 text-muted mb-4">
              <IndianRupee size={32} className="stroke-[1.2]" />
            </div>
            <h3 className="text-lg font-bold text-foreground">No settlements yet</h3>
            <p className="text-sm text-muted mt-1 max-w-sm">
              Settlements appear here once your completed bookings are processed.
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
                      <th className="p-4">Event Date</th>
                      <th className="p-4 text-right">Total Amount</th>
                      <th className="p-4 text-right">Platform Fee</th>
                      <th className="p-4 text-right">Your Earnings</th>
                      <th className="p-4 text-center">Status</th>
                      <th className="p-4">Settled Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {settlements.map((s) => {
                      const booking = s.bookingId || {};
                      const venue = s.venueId || {};
                      const badgeClass = statusStyles[s.status] || statusStyles.PENDING;
                      return (
                        <tr key={s._id} className="border-b border-border last:border-0 hover:bg-background/50 transition-colors">
                          <td className="p-4">
                            <span className="font-mono font-bold text-foreground text-sm">
                              {booking.bookingId || 'N/A'}
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
                            <div className="flex items-center gap-2 text-sm text-foreground">
                              <Calendar size={14} className="text-muted shrink-0" />
                              <span>{booking.startDateTime ? formatDate(booking.startDateTime) : 'N/A'}</span>
                            </div>
                          </td>
                          <td className="p-4 text-right">
                            <span className="text-sm font-bold text-foreground">
                              ₹{(s.totalBookingAmount || 0).toLocaleString()}
                            </span>
                          </td>
                          <td className="p-4 text-right">
                            <span className="text-sm font-semibold text-error">
                              -₹{(s.platformFee || 0).toLocaleString()}
                            </span>
                          </td>
                          <td className="p-4 text-right">
                            <span className="text-sm font-bold text-success">
                              ₹{(s.ownerEarnings || 0).toLocaleString()}
                            </span>
                          </td>
                          <td className="p-4 text-center">
                            <span className={`inline-flex items-center rounded-lg border px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider ${badgeClass}`}>
                              {s.status}
                            </span>
                          </td>
                          <td className="p-4">
                            <span className="text-sm text-muted">
                              {s.settledAt ? formatDate(s.settledAt) : '—'}
                            </span>
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
      </div>
    </div>
  );
}
