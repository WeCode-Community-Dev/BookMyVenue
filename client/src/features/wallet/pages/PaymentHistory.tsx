import React, { useState, useEffect, useCallback } from 'react';
import { TransactionTable } from '@/shared/components/table/TransactionTable';
import { type TableFilterConfig } from '@/shared/components/table/TableFilters';
import apiClient from '@/services/apiClient';
import { toast } from 'sonner';
import type { Column } from '@/shared/components/table/interfaces/table.interfaces';

export interface PaymentHistoryItem {
  id: string;
  venueName: string;
  date: string;
  totalAmount: number;
  amountPaid: number;
  refundAmount: number;
  paymentStatus: string;
  refundStatus: string;
  bookingStatus: string;
}

export default function PaymentHistory() {
  const [data, setData] = useState<PaymentHistoryItem[]>([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);

  // State for query params
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [searchValue, setSearchValue] = useState('');
  const [filterValues, setFilterValues] = useState<Record<string, string>>({});
  const [sortKey, setSortKey] = useState<string>('date');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');

  const fetchTransactions = useCallback(async () => {
    setIsLoading(true);
    setIsError(false);
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
        ...(searchValue && { search: searchValue }),
        ...(filterValues.paymentStatus && { paymentStatus: filterValues.paymentStatus }),
        ...(filterValues.refundStatus && { refundStatus: filterValues.refundStatus }),
      });

      // Handle custom sorting format for backend
      if (sortKey === 'date' && sortDirection === 'asc') {
        params.append('sort', 'oldest');
      } else if (sortKey === 'totalAmount' && sortDirection === 'desc') {
        params.append('sort', 'highestAmount');
      } else if (sortKey === 'totalAmount' && sortDirection === 'asc') {
        params.append('sort', 'lowestAmount');
      }

      const response = await apiClient.get(`/users/payment-history?${params.toString()}`);
      if (response.data?.success) {
        setData(response.data.data.data);
        setTotal(response.data.data.total);
        setTotalPages(response.data.data.totalPages);
      }
    } catch (error) {
      console.error('Failed to fetch payment history:', error);
      setIsError(true);
      toast.error('Failed to load payment history');
    } finally {
      setIsLoading(false);
    }
  }, [page, limit, searchValue, filterValues, sortKey, sortDirection]);

  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions]);

  const columns: Column<PaymentHistoryItem>[] = [
    {
      key: 'date',
      header: 'Date',
      sortable: true,
      render: (item) => new Date(item.date).toLocaleDateString(),
    },
    {
      key: 'id',
      header: 'Booking ID',
      render: (item) => (
        <span className="text-xs font-mono text-gray-500 truncate block w-24" title={item.id}>
          {item.id}
        </span>
      ),
    },
    {
      key: 'venueName',
      header: 'Venue',
      render: (item) => (
        <span className="font-medium text-foreground">
          {item.venueName}
        </span>
      ),
    },
    {
      key: 'totalAmount',
      header: 'Total',
      sortable: true,
      render: (item) => (
        <span className="text-foreground font-medium">
          ₹{item.totalAmount.toLocaleString()}
        </span>
      ),
    },
    {
      key: 'amountPaid',
      header: 'Paid',
      render: (item) => (
        <span className="text-green-600 dark:text-green-400 font-medium">
          ₹{item.amountPaid.toLocaleString()}
        </span>
      ),
    },
    {
      key: 'refundAmount',
      header: 'Refunded',
      render: (item) => (
        <span className={item.refundAmount > 0 ? 'text-primary font-medium' : 'text-muted'}>
          {item.refundAmount > 0 ? `₹${item.refundAmount.toLocaleString()}` : '—'}
        </span>
      ),
    },
    {
      key: 'paymentStatus',
      header: 'Payment Status',
      render: (item) => (
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${item.paymentStatus === 'COMPLETED' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' :
            item.paymentStatus === 'PENDING' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400' :
              item.paymentStatus === 'PARTIAL' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400' :
                'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
          }`}>
          {item.paymentStatus.replace('_', ' ')}
        </span>
      ),
    },
    {
      key: 'refundStatus',
      header: 'Refund Status',
      render: (item) => (
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
          item.refundStatus === 'PROCESSED' || item.refundStatus === 'COMPLETED'
            ? 'bg-primary/10 text-primary'
            : item.refundStatus === 'PENDING'
            ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400'
            : 'bg-muted/20 text-muted'
        }`}>
          {item.refundStatus.replace(/_/g, ' ')}
        </span>
      ),
    },
  ];

  const filters: TableFilterConfig[] = [
    {
      key: 'paymentStatus',
      label: 'Payment Status',
      options: [
        { label: 'Completed', value: 'COMPLETED' },
        { label: 'Pending', value: 'PENDING' },
        { label: 'Partial', value: 'PARTIAL' },
        { label: 'Failed', value: 'FAILED' },
      ],
    },
    {
      key: 'refundStatus',
      label: 'Refund Status',
      options: [
        { label: 'Not Eligible', value: 'NOT_ELIGIBLE' },
        { label: 'Pending', value: 'PENDING' },
        { label: 'Processed', value: 'PROCESSED' },
        { label: 'Completed', value: 'COMPLETED' },
      ],
    },
  ];

  const handleFilterChange = (key: string, value: string) => {
    setFilterValues((prev) => ({ ...prev, [key]: value }));
    setPage(1);
  };

  const handleSearchChange = (value: string) => {
    setSearchValue(value);
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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-foreground">Payment History</h1>
        <p className="mt-1 text-sm text-muted">
          View the financial status of all your bookings, including payments and refunds.
        </p>
      </div>

      <TransactionTable
        data={data}
        columns={columns}
        isLoading={isLoading}
        isError={isError}
        onRetry={fetchTransactions}
        emptyMessage="No payment records found matching your criteria."
        searchValue={searchValue}
        onSearchChange={handleSearchChange}
        searchPlaceholder="Search by Venue Name or Booking ID..."
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
