import { useState } from 'react';
import { useSelector } from 'react-redux';
import { FiMessageSquare } from 'react-icons/fi';
import { selectCurrentUser } from '../../redux/slices/authSlice';
import { isChatEnabled } from '../../config/featureFlags';
import { useGetOwnerBookingsQuery } from './ownerApi.js';
import { useStartConversation } from '../../hooks/useStartConversation';

function OwnerBookings() {
  const currentUser = useSelector(selectCurrentUser);
  const ownerId = currentUser?.id;
  const { data, isLoading, isError } = useGetOwnerBookingsQuery(ownerId, {
    skip: !ownerId,
  });
  const { startConversation, isLoading: isStartingChat } = useStartConversation();
  const [messagingUserId, setMessagingUserId] = useState(null);

  const bookings = data?.data ?? [];

  const handleMessageCustomer = async (bookerId) => {
    if (!bookerId) return;
    setMessagingUserId(bookerId);
    try {
      await startConversation({ userId: bookerId });
    } catch (err) {
      console.error('Failed to start conversation', err);
    } finally {
      setMessagingUserId(null);
    }
  };

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
          {isChatEnabled
            ? 'View all bookings made for your venues and message customers directly.'
            : 'View all bookings made for your venues and track customer status.'}
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
                {isChatEnabled && <th>Actions</th>}
              </tr>
            </thead>
            <tbody>
              {bookings.map((booking) => {
                const bookerId = booking.booker?.id;
                const isMessaging =
                  isStartingChat && messagingUserId === bookerId;

                return (
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
                    {isChatEnabled && (
                      <td>
                        {bookerId ? (
                          <button
                            type="button"
                            className="booking-message-btn"
                            onClick={() => handleMessageCustomer(bookerId)}
                            disabled={isMessaging}
                          >
                            <FiMessageSquare aria-hidden="true" />
                            {isMessaging ? 'Opening…' : 'Message'}
                          </button>
                        ) : (
                          '—'
                        )}
                      </td>
                    )}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default OwnerBookings;
