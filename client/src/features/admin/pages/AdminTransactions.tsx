import { useState, useEffect, useCallback } from 'react';
import { toast } from 'sonner';
import { adminTransactionsApi } from '../services/admin-transactions.api';
import { TransactionTable } from '@/shared/components/table/TransactionTable';
import type { Column } from '@/shared/components/table/interfaces/table.interfaces';
import type { TableFilterConfig } from '@/shared/components/table/TableFilters';
import { IndianRupee, Activity, TrendingUp, RefreshCw, HandCoins } from 'lucide-react';

export default function AdminTransactions() {
  const [data, setData] = useState<any[]>([]);
  const [stats, setStats] = useState<any>(null);
  
  const [loading, setLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  
  const [searchValue, setSearchValue] = useState('');
  const [filterValues, setFilterValues] = useState<Record<string, string>>({});
  const [sortKey, setSortKey] = useState<string>('date');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');

  const fetchData = useCallback(async () => {
    setLoading(true);
    setIsError(false);
    try {
      let sortParam = 'latest';
      if (sortKey === 'amount') {
        sortParam = sortDirection === 'desc' ? 'highest' : 'lowest';
      } else if (sortKey === 'date' && sortDirection === 'asc') {
        sortParam = 'oldest';
      }

      const [txnsRes, statsRes] = await Promise.all([
        adminTransactionsApi.getTransactions({
          page,
          limit,
          search: searchValue,
          type: filterValues.type,
          status: filterValues.status,
          sort: sortParam
        }),
        adminTransactionsApi.getTransactionStats()
      ]);

      if (txnsRes.success && txnsRes.data) {
        setData(txnsRes.data.data);
        setTotal(txnsRes.data.total);
        setTotalPages(txnsRes.data.totalPages);
      }
      
      if (statsRes.success && statsRes.data) {
        setStats(statsRes.data);
      }
    } catch (err: any) {
      console.error(err);
      setIsError(true);
      toast.error('Failed to load transaction data');
    } finally {
      setLoading(false);
    }
  }, [page, limit, searchValue, filterValues, sortKey, sortDirection]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const columns: Column<any>[] = [
    {
      key: 'date',
      header: 'Date',
      sortable: true,
      render: (item) => new Date(item.date).toLocaleDateString(),
    },
    {
      key: 'type',
      header: 'Type',
      render: (item) => (
        <span className="font-semibold text-xs uppercase text-primary tracking-wider">
          {item.type}
        </span>
      ),
    },
    {
      key: 'bookingId',
      header: 'Booking ID',
      render: (item) => (
        <span className="text-xs font-mono font-bold text-foreground truncate block w-24" title={item.bookingId}>
          {item.bookingId}
        </span>
      ),
    },
    {
      key: 'userName',
      header: 'Customer',
      render: (item) => <span className="text-sm">{item.userName}</span>,
    },
    {
      key: 'ownerName',
      header: 'Owner',
      render: (item) => <span className="text-sm">{item.ownerName}</span>,
    },
    {
      key: 'venueName',
      header: 'Venue',
      render: (item) => <span className="text-sm truncate block max-w-[120px]" title={item.venueName}>{item.venueName}</span>,
    },
    {
      key: 'amount',
      header: 'Amount',
      sortable: true,
      render: (item) => (
        <span className="text-sm font-bold text-foreground">
          ₹{(item.amount || 0).toLocaleString()}
        </span>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      render: (item) => (
        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
          item.status === 'SUCCESS' ? 'bg-success/10 text-success' : 
          item.status === 'PENDING' ? 'bg-warning/10 text-warning' : 
          'bg-error/10 text-error'
        }`}>
          {item.status}
        </span>
      ),
    },
  ];

  const filters: TableFilterConfig[] = [
    {
      key: 'type',
      label: 'Transaction Type',
      options: [
        { label: 'All Types', value: 'ALL' },
        { label: 'Booking Payment', value: 'Booking Payment' },
        { label: 'Refund', value: 'Refund' },
        { label: 'Owner Payout', value: 'Owner Payout' },
      ],
    },
    {
      key: 'status',
      label: 'Status',
      options: [
        { label: 'All Statuses', value: 'ALL' },
        { label: 'Success', value: 'SUCCESS' },
        { label: 'Pending', value: 'PENDING' },
        { label: 'Failed', value: 'FAILED' },
      ],
    },
  ];

  const handleSearchChange = (value: string) => {
    setSearchValue(value);
    setPage(1);
  };

  const handleFilterChange = (key: string, value: string) => {
    setFilterValues((prev) => ({ ...prev, [key]: value }));
    setPage(1);
  };

  const handleSortChange = (key: string) => {
    if (sortKey === key) {
      setSortDirection(sortDirection === 'desc' ? 'asc' : 'desc');
    } else {
      setSortKey(key);
      setSortDirection('desc');
    }
    setPage(1);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-extrabold tracking-tight text-foreground">Transactions Overview</h1>
        <p className="text-sm text-muted mt-1">Monitor all platform financial activities, payments, and payouts.</p>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        <div className="col-span-1 sm:col-span-2 lg:col-span-3 xl:col-span-2 flex items-center gap-4 rounded-2xl border border-border bg-card p-5 shadow-sm">
          <div className="rounded-xl bg-primary/10 p-3 text-primary">
            <Activity size={22} className="stroke-[1.5]" />
          </div>
          <div>
            <p className="text-xs font-semibold text-muted uppercase tracking-wider">Total Volume</p>
            <p className="text-2xl font-bold text-foreground mt-0.5">
              {stats ? `₹${stats.totalTransactionVolume.toLocaleString()}` : '...'}
            </p>
            <p className="text-xs text-muted mt-1">{stats?.totalTransactions || 0} Total Transactions</p>
          </div>
        </div>

        <div className="flex items-center gap-4 rounded-2xl border border-border bg-card p-5 shadow-sm">
          <div className="rounded-xl bg-success/10 p-3 text-success">
            <IndianRupee size={22} className="stroke-[1.5]" />
          </div>
          <div>
            <p className="text-xs font-semibold text-muted uppercase tracking-wider">Payments</p>
            <p className="text-xl font-bold text-foreground mt-0.5">
              {stats ? `₹${stats.totalBookingPayments.toLocaleString()}` : '...'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4 rounded-2xl border border-border bg-card p-5 shadow-sm">
          <div className="rounded-xl bg-warning/10 p-3 text-warning">
            <RefreshCw size={22} className="stroke-[1.5]" />
          </div>
          <div>
            <p className="text-xs font-semibold text-muted uppercase tracking-wider">Refunds</p>
            <p className="text-xl font-bold text-foreground mt-0.5">
              {stats ? `₹${stats.totalRefundAmount.toLocaleString()}` : '...'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4 rounded-2xl border border-border bg-card p-5 shadow-sm">
          <div className="rounded-xl bg-blue-500/10 p-3 text-blue-500">
            <TrendingUp size={22} className="stroke-[1.5]" />
          </div>
          <div>
            <p className="text-xs font-semibold text-muted uppercase tracking-wider">Payouts</p>
            <p className="text-xl font-bold text-foreground mt-0.5">
              {stats ? `₹${stats.totalOwnerPayouts.toLocaleString()}` : '...'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4 rounded-2xl border border-warning/30 bg-warning/5 p-5 shadow-sm">
          <div className="rounded-xl bg-warning/20 p-3 text-warning">
            <HandCoins size={22} className="stroke-[1.5]" />
          </div>
          <div>
            <p className="text-xs font-semibold text-warning uppercase tracking-wider">Pending Payouts</p>
            <p className="text-xl font-bold text-foreground mt-0.5">
              {stats ? `₹${stats.pendingOwnerPayouts.toLocaleString()}` : '...'}
            </p>
          </div>
        </div>
      </div>

      {/* Transaction Table */}
      <TransactionTable
        data={data}
        columns={columns}
        isLoading={loading}
        isError={isError}
        onRetry={fetchData}
        emptyMessage="No transactions found matching your criteria."
        searchValue={searchValue}
        onSearchChange={handleSearchChange}
        searchPlaceholder="Search ID, Booking, User, Owner..."
        filters={filters}
        filterValues={filterValues}
        onFilterChange={handleFilterChange}
        sortKey={sortKey}
        sortDirection={sortDirection}
        onSortChange={handleSortChange}
        pagination={{
          page,
          limit,
          total,
          totalPages,
        }}
        onPageChange={setPage}
      />
    </div>
  );
}
