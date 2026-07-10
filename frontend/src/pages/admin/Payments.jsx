import { useCallback, useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { getAdminPaymentOrders, getAdminPaymentHistory, getAdminAbandonedPayments, } from "../../services/adminService";
import AdminPageHeader from "../../components/admin/AdminPageHeader";
import AdminFilterSelect from "../../components/admin/AdminFilterSelect";
import AdminTextFilter from "../../components/admin/AdminTextFilter";
import AdminTable from "../../components/admin/AdminTable";
import AdminPagination from "../../components/admin/AdminPagination";
import Loader from "../../components/common/Loader";
import EmptyState from "../../components/common/EmptyState";
import ErrorState from "../../components/common/ErrorState";
import StatusBadge from "../../components/profile/StatusBadge";
import { resolvePopulatedRef } from "../../utils/booking";
import { formatPrice } from "../../utils/formatPrice";
import { formatSlotDateCompact } from "../../utils/formatDate";
import { formatStatusLabel } from "../../utils/adminFormat";

const TABS = [
  { id: "orders", label: "Payment orders" },
  { id: "history", label: "Payment history" },
  { id: "abandoned", label: "Abandoned" },
];

const ORDER_STATUS_OPTIONS = [
  { value: "", label: "All statuses" },
  { value: "created", label: "Created" },
  { value: "completed", label: "Completed" },
];

const AdminPayments = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = searchParams.get("tab") || "orders";

  const [items, setItems] = useState([]);
  const [count, setCount] = useState(0);
  const [page, setPage] = useState(1);
  const [limit] = useState(6);
  const [status, setStatus] = useState("");
  const [hours, setHours] = useState("24");
  const [debouncedHours, setDebouncedHours] = useState("24");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedHours(hours);
      setPage(1);
    }, 300);
    return () => clearTimeout(timer);
  }, [hours]);

  const setTab = (tabId) => {
    setSearchParams({ tab: tabId });
    setPage(1);
    setStatus("");
    setError("");
  };

  const fetchPayments = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      let data;

      if (activeTab === "history") {
        data = await getAdminPaymentHistory({ page, limit });
      } else if (activeTab === "abandoned") {
        data = await getAdminAbandonedPayments({
          page,
          limit,
          hours: debouncedHours || 24,
        });
      } else {
        data = await getAdminPaymentOrders({ page, limit, status });
      }

      if (data.success) {
        setItems(data.data ?? []);
        setCount(data.count ?? 0);
      } else {
        setItems([]);
        setCount(0);
        setError(data.message || "Failed to load payments.");
      }
    } catch (err) {
      setItems([]);
      setCount(0);
      setError(
        err.response?.data?.message ||
        "Unable to load payments. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }, [activeTab, page, limit, status, debouncedHours]);

  useEffect(() => {
    fetchPayments();
  }, [fetchPayments]);

  return (
    <>
      <AdminPageHeader
        title="Payments"
        description="Payment orders, successful transactions, and abandoned checkouts."
      />

      <div className="mb-4 flex flex-wrap gap-2">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setTab(tab.id)}
            className={[
              "rounded-full px-3.5 py-1.5 text-sm font-medium transition-colors",
              activeTab === tab.id
                ? "bg-red-600 text-white shadow-sm shadow-red-600/20"
                : "border border-gray-200 bg-white text-gray-600 hover:border-gray-300 hover:text-gray-900",
            ].join(" ")}
            aria-pressed={activeTab === tab.id}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="mb-4 flex flex-wrap gap-3">
        {activeTab === "orders" && (
          <AdminFilterSelect
            label="Order status"
            value={status}
            onChange={(value) => {
              setStatus(value);
              setPage(1);
            }}
            options={ORDER_STATUS_OPTIONS}
          />
        )}

        {activeTab === "abandoned" && (
          <AdminTextFilter
            label="Older than (hours)"
            type="number"
            min="1"
            value={hours}
            onChange={setHours}
            className="w-32"
          />
        )}
      </div>

      {loading && <Loader label="Loading payments..." />}

      {!loading && error && (
        <ErrorState message={error} onRetry={fetchPayments} />
      )}

      {!loading && !error && items.length === 0 && (
        <EmptyState
          title="No payment records"
          description="Try adjusting your filters or check back later."
        />
      )}

      {!loading && !error && items.length > 0 && (
        <AdminTable>
          <div className="divide-y divide-gray-100">
            {activeTab === "history" &&
              items.map((booking) => (
                <PaymentHistoryRow key={booking._id} booking={booking} />
              ))}

            {activeTab !== "history" &&
              items.map((order) => (
                <PaymentOrderRow key={order._id} order={order} />
              ))}
          </div>

          <AdminPagination
            page={page}
            limit={limit}
            count={count}
            onPageChange={setPage}
          />
        </AdminTable>
      )}
    </>
  );
};

const PaymentOrderRow = ({ order }) => {
  const user = resolvePopulatedRef(order.userId);
  const venue = resolvePopulatedRef(order.venueId);
  const amount = formatPrice(order.amountInPaise / 100).amount;

  return (
    <div className="flex flex-col gap-2 px-4 py-3 lg:grid lg:grid-cols-[1.2fr_1fr_auto_auto] lg:items-center lg:gap-3">
      <div>
        <p className="text-sm font-medium text-gray-900">
          {order.razorpayOrderId}
        </p>
        <p className="text-xs text-gray-500">{user?.name || "User"}</p>
      </div>
      <p className="text-sm text-gray-600">{venue?.title || "Venue"}</p>
      <p className="text-sm font-medium text-gray-900">{amount}</p>
      <StatusBadge
        label={formatStatusLabel(order.status)}
        tone={order.status === "completed" ? "success" : "warning"}
      />
    </div>
  );
};

const PaymentHistoryRow = ({ booking }) => {
  const user = resolvePopulatedRef(booking.userId);
  const venue = resolvePopulatedRef(booking.venueId);
  const { amount } = formatPrice(booking.amount);

  return (
    <div className="flex flex-col gap-2 px-4 py-3 lg:grid lg:grid-cols-[1.2fr_1fr_auto_auto] lg:items-center lg:gap-3">
      <div>
        <Link
          to={`/admin/bookings/${booking._id}`}
          className="text-sm font-medium text-gray-900 hover:text-red-600"
        >
          {booking.bookingReference || booking._id}
        </Link>
        <p className="text-xs text-gray-500">{user?.name || "Customer"}</p>
      </div>
      <p className="text-sm text-gray-600">{venue?.title || "Venue"}</p>
      <p className="text-sm font-medium text-gray-900">{amount}</p>
      <p className="text-xs text-gray-500">
        {formatSlotDateCompact(booking.createdAt)}
      </p>
    </div>
  );
};

export default AdminPayments;
