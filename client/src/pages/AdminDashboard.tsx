import { useEffect, useState } from "react";
import api from "../services/api";

type UsersSummary = {
  total_customers: number;
  total_owners: number;
  total_root_admins: number;
};

type VenuesSummary = {
  total_venues: number;
  pending_venues: number;
  approved_venues: number;
  rejected_venues: number;
  active_venues: number;
};

type BookingsSummary = {
  total_bookings: number;
  pending_payment_bookings: number;
  confirmed_bookings: number;
  cancelled_bookings: number;
  failed_bookings: number;
};

type PaymentsSummary = {
  total_payments: number;
  pending_payments: number;
  successful_payments: number;
  failed_payments: number;
  refunded_payments: number;
  total_revenue: string;
};

type RecentBooking = {
  booking_id: number;
  booking_date: string;
  start_time: string;
  end_time: string;
  total_amount: string;
  booking_status: string;

  venue_name: string;
  venue_city: string;

  customer_name: string;
  owner_name: string;

  payment_status: string | null;
};

type DashboardSummary = {
  users: UsersSummary;
  venues: VenuesSummary;
  bookings: BookingsSummary;
  payments: PaymentsSummary;
  recent_bookings: RecentBooking[];
};

function AdminDashboard() {
  const [summary, setSummary] = useState<DashboardSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        setLoading(true);

        const response = await api.get("/dashboard/admin");

        setSummary(response.data.summary);
        setError("");

        console.log(response.data.summary);
      } catch (err) {
        console.error(err);
        setError("Failed to load dashboard.");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  if (loading) {
    return <h2>Loading dashboard...</h2>;
  }

  if (error) {
    return <h2>{error}</h2>;
  }

  if (!summary) {
    return <h2>No dashboard data found.</h2>;
  }

  return (
    <div style={{ padding: "20px" }}>
      <h1>Admin Dashboard</h1>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: "20px",
          marginTop: "30px",
        }}
      >
        <div style={cardStyle}>
          <h3>Customers</h3>
          <h2 style={cardValueStyle}>
            {summary.users.total_customers}
          </h2>
        </div>

        <div style={cardStyle}>
          <h3>Owners</h3>
          <h2 style={cardValueStyle}>
            {summary.users.total_owners}
          </h2>
        </div>

        <div style={cardStyle}>
          <h3>Venues</h3>
          <h2 style={cardValueStyle}>
            {summary.venues.total_venues}
          </h2>
        </div>

        <div style={cardStyle}>
          <h3>Total Revenue</h3>
          <h2 style={cardValueStyle}>
            € {summary.payments.total_revenue}
          </h2>
        </div>

        <div style={cardStyle}>
          <h3>Total Bookings</h3>
          <h2 style={cardValueStyle}>
            {summary.bookings.total_bookings}
          </h2>
        </div>

        <div style={cardStyle}>
          <h3>Pending Venues</h3>
          <h2 style={cardValueStyle}>
            {summary.venues.pending_venues}
          </h2>
        </div>

        <div style={cardStyle}>
          <h3>Approved Venues</h3>
          <h2 style={cardValueStyle}>
            {summary.venues.approved_venues}
          </h2>
        </div>

        <div style={cardStyle}>
          <h3>Rejected Venues</h3>
          <h2 style={cardValueStyle}>
            {summary.venues.rejected_venues}
          </h2>

          <h2 style={{ marginTop: "50px" }}>Recent Bookings</h2>

<table
  style={{
    width: "100%",
    borderCollapse: "collapse",
    marginTop: "20px",
  }}
>
  <thead>
    <tr>
      <th style={tableHeaderStyle}>Booking ID</th>
      <th style={tableHeaderStyle}>Customer</th>
      <th style={tableHeaderStyle}>Venue</th>
      <th style={tableHeaderStyle}>City</th>
      <th style={tableHeaderStyle}>Date</th>
      <th style={tableHeaderStyle}>Time</th>
      <th style={tableHeaderStyle}>Amount</th>
      <th style={tableHeaderStyle}>Booking Status</th>
      <th style={tableHeaderStyle}>Payment Status</th>
    </tr>
  </thead>

  <tbody>
    {summary.recent_bookings.map((booking) => (
      <tr key={booking.booking_id}>
        <td style={tableCellStyle}>{booking.booking_id}</td>

        <td style={tableCellStyle}>{booking.customer_name}</td>

        <td style={tableCellStyle}>{booking.venue_name}</td>

        <td style={tableCellStyle}>{booking.venue_city}</td>

        <td style={tableCellStyle}>{booking.booking_date}</td>

        <td style={tableCellStyle}>
          {booking.start_time} - {booking.end_time}
        </td>

        <td style={tableCellStyle}>
          € {booking.total_amount}
        </td>

        <td style={tableCellStyle}>
          {booking.booking_status}
        </td>

        <td style={tableCellStyle}>
          {booking.payment_status ?? "N/A"}
        </td>
      </tr>
    ))}
  </tbody>
</table>

        </div>
      </div>
    </div>
  );
  
}

const cardStyle: React.CSSProperties = {
  border: "1px solid #ddd",
  borderRadius: "10px",
  padding: "20px",
  textAlign: "center",
  boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
  backgroundColor: "#ffffff",
  color: "#222",
};

const cardValueStyle: React.CSSProperties = {
  fontSize: "36px",
  marginTop: "15px",
  color: "#1976d2",
  fontWeight: "bold",
};

const tableHeaderStyle: React.CSSProperties = {
  border: "1px solid #ddd",
  padding: "12px",
  backgroundColor: "#1976d2",
  color: "#fff",
  textAlign: "left",
};

const tableCellStyle: React.CSSProperties = {
  border: "1px solid #ddd",
  padding: "10px",
  backgroundColor: "#fff",
  color: "#222",
};

export default AdminDashboard;