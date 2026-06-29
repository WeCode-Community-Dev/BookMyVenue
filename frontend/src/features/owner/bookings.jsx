import { useSelector } from 'react-redux';
import { selectCurrentUser } from '../../redux/slices/authSlice';
import { useGetOwnerBookingsQuery } from './ownerApi.js';

function OwnerBookings() {
  const currentUser = useSelector(selectCurrentUser);
  const ownerId = currentUser?.id;
  const { data, isLoading, isError } = useGetOwnerBookingsQuery(ownerId, {
    skip: !ownerId,
  });

  const bookings = data?.data ?? [];

  const getStatusBadgeClass = (status) => {
    const baseClass = 'status-pill';
    return `${baseClass} ${baseClass}--${status?.toLowerCase()}`;
  };

  const formatDate = (dateString) =>
    new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });

  const formatCurrency = (value) =>
    new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(value);

  return (
    <div className="bookings-container">
      <div className="bookings-header-row">
        <h1 className="bookings-title">Bookings Manager</h1>
        <p className="bookings-subtitle">
          View all bookings made for your venues and track customer status.
        </p>
      </div>

      {isLoading ? (
        <p>Loading owner bookings...</p>
      ) : isError ? (
        <p>Unable to load bookings. Please refresh and try again.</p>
      ) : bookings.length === 0 ? (
        <div className="bookings-empty">
          <p>No bookings found for your venues yet.</p>
        </div>
      ) : (
        <div className="bookings-table-wrapper">
          <table className="bookings-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Venue</th>
                <th>Customer</th>
                <th>Dates</th>
                <th>Time Slot</th>
                <th>Status</th>
                <th>Amount</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map((booking) => (
                <tr key={booking.id}>
                  <td className="booking-id">{booking.id}</td>
                  <td className="booking-venue">{booking.venue?.name || 'Unknown Venue'}</td>
                  <td>{booking.booker?.username || booking.booker?.email || 'Guest'}</td>
                  <td>
                    {formatDate(booking.startDate)}
                    {booking.startDate !== booking.endDate && ` – ${formatDate(booking.endDate)}`}
                  </td>
                  <td>
                    {booking.startTime && booking.endTime
                      ? `${booking.startTime} – ${booking.endTime}`
                      : 'All day'}
                  </td>
                  <td>
                    <span className={getStatusBadgeClass(booking.status)}>
                      {booking.status?.charAt(0).toUpperCase() + booking.status?.slice(1)}
                    </span>
                  </td>
                  <td className="booking-amount">{formatCurrency(booking.totalAmount)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default OwnerBookings;
