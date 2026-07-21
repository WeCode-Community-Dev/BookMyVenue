import { useSelector } from 'react-redux';
import { useGetUserBookingsQuery } from './venueApi.js';
import './MyBookings.scss';

function MyBookings() {
  const user = useSelector((state) => state.auth?.user);
  const { data, isLoading, isError } = useGetUserBookingsQuery(user?.id, {
    skip: !user?.id,
  });

  const bookings = data?.data ?? [];

  const getStatusBadgeClass = (status) => {
    const baseClass = 'booking-status-badge';
    return `${baseClass} ${baseClass}--${status.toLowerCase()}`;
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const formatCurrency = (value) =>
    new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(value);

  return (
    <div className="my-bookings">
      <header className="my-bookings__header">
        <h1>My Bookings</h1>
        <p>View and manage all your venue bookings in one place.</p>
      </header>

      {isLoading ? (
        <p className="my-bookings__loading">Loading your bookings...</p>
      ) : isError ? (
        <p className="my-bookings__error">
          Unable to load bookings. Please refresh and try again.
        </p>
      ) : bookings.length === 0 ? (
        <div className="my-bookings__empty">
          <p>You haven't made any bookings yet.</p>
          <a href="/browse-venues" className="my-bookings__cta">
            Browse Venues
          </a>
        </div>
      ) : (
        <div className="my-bookings__list">
          <div className="my-bookings__card-grid">
            {bookings.map((booking) => (
              <article key={booking.id} className="booking-card">
                <header className="booking-card__header">
                  <h3 className="booking-card__venue-name">{booking.venue?.name || 'Unknown Venue'}</h3>
                  <span className={getStatusBadgeClass(booking.status)}>
                    {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                  </span>
                </header>

                <div className="booking-card__details">
                  <div className="booking-detail">
                    <span className="booking-detail__label">Dates</span>
                    <span className="booking-detail__value">
                      {formatDate(booking.startDate)} to {formatDate(booking.endDate)}
                    </span>
                  </div>

                  {booking.startTime && booking.endTime && (
                    <div className="booking-detail">
                      <span className="booking-detail__label">Time</span>
                      <span className="booking-detail__value">
                        {booking.startTime} to {booking.endTime}
                      </span>
                    </div>
                  )}

                  <div className="booking-detail">
                    <span className="booking-detail__label">Total Amount</span>
                    <span className="booking-detail__value booking-detail__value--amount">
                      {formatCurrency(booking.totalAmount)}
                    </span>
                  </div>

                  {booking.note && (
                    <div className="booking-detail">
                      <span className="booking-detail__label">Note</span>
                      <span className="booking-detail__value">{booking.note}</span>
                    </div>
                  )}

                  <div className="booking-detail">
                    <span className="booking-detail__label">Location</span>
                    <span className="booking-detail__value">
                      {booking.venue?.city}, {booking.venue?.state}
                    </span>
                  </div>
                </div>

                <footer className="booking-card__footer">
                  <small>
                    Booked on {formatDate(booking.createdAt)}
                  </small>
                </footer>
              </article>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default MyBookings;
