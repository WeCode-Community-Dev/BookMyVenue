import { useEffect, useState } from "react";
import { adminService } from "../../modules/admin/services/adminService";
import { AdminPageHeader, AdminTable, StatusBadge } from "../../components/admin/AdminCard";
import { formatBookingPeriod } from "../../utils/bookingFormat";

function BookingsPage() {
  const [bookings, setBookings] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminService
      .getBookings({ limit: 100 })
      .then(setBookings)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div>
      <AdminPageHeader title="Bookings" subtitle={`${bookings.length} orders`} />
      {error && <p className="text-rose-600 mb-4 text-sm">{error}</p>}

      <AdminTable columns={["ID", "User", "Venue", "Period", "Status", "Amount", "Payment"]}>
        {bookings.map((b) => (
          <tr key={b.id} className="hover:bg-slate-50/50">
            <td className="px-4 py-3 text-slate-400">#{b.id}</td>
            <td className="px-4 py-3">{b.user_name}</td>
            <td className="px-4 py-3">{b.venue_name}</td>
            <td className="px-4 py-3 text-sm">{formatBookingPeriod(b)}</td>
            <td className="px-4 py-3">
              <StatusBadge status={b.status} />
            </td>
            <td className="px-4 py-3 font-medium">₹{b.amount}</td>
            <td className="px-4 py-3">{b.payment_status || "-"}</td>
          </tr>
        ))}
      </AdminTable>
    </div>
  );
}

export default BookingsPage;
