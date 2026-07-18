
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CalendarDays, Clock, IndianRupee } from 'lucide-react';
import Logo from '../../components/common/Logo';

import { getMyBookings } from '../../api/bookings';
import { useAuth } from '../../context/AuthContext';

function BookerDashboard() {
  const navigate = useNavigate();
  const { token } = useAuth();

  const [bookings, setBookings] = useState([]);
  const [visibleCount, setVisibleCount] = useState(5);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function loadBookings() {
      try {
        setLoading(true);
        setError('');
        const data = await getMyBookings(token);
        setBookings(data);
      } catch (err) {
        setError(err.response?.data?.detail || 'Failed to load bookings');
      } finally {
        setLoading(false);
      }
    }

    if (token) {
      loadBookings();
    }
  }, [token]);

  function getStatusStyle(status) {
    if (status === 'confirmed') {
      return 'bg-green-50 text-green-700 border border-green-200';
    }
    if (status === 'rejected') {
      return 'bg-red-50 text-red-700 border border-red-200';
    }
    return 'bg-amber-50 text-amber-700 border border-amber-200';
  }

  function formatStatus(status) {
    if (!status) return '';
    return status.charAt(0).toUpperCase() + status.slice(1);
  }

  function formatTimeOnly(timeString) {
    if (!timeString) return '';
    return timeString.slice(0, 5);
  }

  if (loading) {
    return (
      <div className='flex min-h-screen items-center justify-center bg-white'>
        <div className='flex items-center gap-3 text-gray-600'>
          <div className='h-6 w-6 animate-spin rounded-full border-2 border-red-600 border-t-transparent' />
          <span className='text-sm font-medium'>Loading your bookings...</span>
        </div>
      </div>
    );
  }

  return (
    <div className='min-h-screen bg-gray-50'>
      {/* Header bar */}
      <header className='border-b border-gray-200 bg-white'>
        <div className='mx-auto flex max-w-6xl items-center justify-between px-6 py-4'>
          <Logo onClick={() => navigate('/')} />
          <button
            onClick={() => navigate('/')}
            className='rounded-full border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-700 transition hover:border-red-600 hover:text-red-600'
          >
            Browse venues
          </button>
        </div>
      </header>

      <div className='mx-auto max-w-5xl px-6 py-10'>
        {/* Page title */}
        <div className='mb-8'>
          <h1 className='text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl'>
            My bookings
          </h1>
          <p className='mt-2 text-sm text-gray-600'>
            Review and manage all venues you have booked in one place.
          </p>
        </div>

        {error && (
          <div className='mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700'>
            {error}
          </div>
        )}

        {/* Empty state */}
        {bookings.length === 0 && !error && (
          <div className='rounded-2xl border border-gray-200 bg-white p-12 text-center shadow-sm'>
            <div className='mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-red-50'>
              <CalendarDays className='h-8 w-8 text-red-600' />
            </div>
            <h2 className='mt-5 text-xl font-bold text-gray-900'>
              No bookings yet
            </h2>
            <p className='mt-2 text-sm text-gray-600'>
              Start exploring and book your ideal venue today.
            </p>
            <button
              onClick={() => navigate('/')}
              className='mt-6 rounded-full bg-red-600 px-8 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-red-700'
            >
              Browse venues
            </button>
          </div>
        )}

        {/* Bookings list */}
        <div className='space-y-6'>
          {bookings.slice(0, visibleCount).map((booking) => (
            <div
              key={booking.id}
              className='overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition hover:shadow-md'
            >
              {/* Top row */}
              <div className='flex items-center justify-between border-b border-gray-100 bg-white px-6 py-4'>
                <div>
                  <h2 className='text-lg font-bold text-gray-900'>
                    {booking.venue_name || ('Venue #' + booking.venue_id)}
                  </h2>
                  <div className='mt-1 flex items-center gap-2 text-xs font-medium text-gray-500'>
                    <span className='uppercase'>{booking.booking_type}</span>
                    <span className='inline-block h-1 w-1 rounded-full bg-gray-400' />
                    <span className='capitalize'>{booking.payment_status}</span>
                  </div>
                </div>

                <span
                  className={`h-fit rounded-full px-3 py-1.5 text-xs font-bold uppercase tracking-wide ${getStatusStyle(
                    booking.status
                  )}`}
                >
                  {formatStatus(booking.status)}
                </span>
              </div>

              {/* Body */}
              <div className='grid gap-6 p-6 md:grid-cols-2'>
                {/* Price breakdown */}
                <div className='rounded-xl border border-gray-200 bg-gray-50 p-5'>
                  <h3 className='flex items-center gap-2 text-sm font-bold uppercase tracking-wide text-gray-700'>
                    <IndianRupee size={16} />
                    Price breakdown
                  </h3>
                  <div className='mt-4 space-y-2.5 text-sm text-gray-700'>
                    <div className='flex justify-between'>
                      <span>Base price</span>
                      <span className='font-medium text-gray-900'>
                        &#8377;{booking.base_price}
                      </span>
                    </div>
                    <div className='flex justify-between'>
                      <span>Tax</span>
                      <span className='font-medium text-gray-900'>
                        &#8377;{booking.tax_amount}
                      </span>
                    </div>
                    <div className='flex justify-between'>
                      <span>Platform fee</span>
                      <span className='font-medium text-gray-900'>
                        &#8377;{booking.platform_fee}
                      </span>
                    </div>
                    <div className='my-3 border-t border-gray-200' />
                    <div className='flex justify-between text-base'>
                      <span className='font-bold text-gray-900'>Total</span>
                      <span className='font-extrabold text-red-600'>
                        &#8377;{booking.total_amount}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Slots */}
                <div className='rounded-xl border border-gray-200 bg-white p-5'>
                  <h3 className='flex items-center gap-2 text-sm font-bold uppercase tracking-wide text-gray-700'>
                    <CalendarDays size={16} />
                    Booked slots
                  </h3>
                  {booking.slots?.length > 0 ? (
                    <div className='mt-4 max-h-[200px] overflow-y-auto space-y-3 pr-1 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100'>
                      {booking.slots.map((slot) => {
                        const slotDate = slot.date ? new Date(slot.date + 'T00:00:00') : null;
                        const dayNum = slotDate ? slotDate.toLocaleDateString('en-IN', { day: 'numeric' }) : '';
                        const monthStr = slotDate ? slotDate.toLocaleDateString('en-IN', { month: 'short' }) : '';
                        const timeDisplay =
                          slot.booking_type === 'daily'
                            ? 'Full Day'
                            : formatTimeOnly(slot.start_time) + ' - ' + formatTimeOnly(slot.end_time);

                        return (
                          <div
                            key={slot.id}
                            className='flex items-start gap-4 rounded-lg border border-gray-100 bg-white p-4 shadow-sm'
                          >
                            {/* Date badge */}
                            <div className='flex min-w-[60px] flex-col items-center justify-center rounded-lg bg-red-50 px-3 py-2'>
                              <span className='text-lg font-extrabold leading-none text-red-600'>{dayNum}</span>
                              <span className='mt-0.5 text-xs font-semibold uppercase text-red-500'>{monthStr}</span>
                            </div>

                            {/* Slot details */}
                            <div className='flex-1'>
                              <div className='flex items-center gap-2 text-sm font-semibold text-gray-900'>
                                <Clock size={14} className='text-gray-400' />
                                {timeDisplay}
                              </div>
                              <div className='mt-1 text-xs text-gray-500'>
                                {slot.booking_type === 'daily' ? 'Full day booking' : 'Hourly slot'}
                              </div>
                            </div>

                            {/* Booking type chip */}
                            <span className='h-fit rounded-md bg-gray-100 px-2 py-1 text-[10px] font-bold uppercase tracking-wide text-gray-600'>
                              {slot.booking_type}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <p className='mt-4 text-sm text-gray-500'>
                      No slots recorded.
                    </p>
                  )}
                  {booking.slots?.length > 3 && (
                    <p className='mt-3 text-center text-xs font-medium text-gray-400'>
                      Scroll for all {booking.slots.length} slots
                    </p>
                  )}
                </div>
              </div>

              {/* Footer */}
              <div className='flex items-center justify-between border-t border-gray-100 bg-gray-50 px-6 py-3 text-xs text-gray-500'>
                <span>
                  Created on{' '}
                  <span className='font-semibold text-gray-700'>
                    {new Date(booking.created_at).toLocaleDateString('en-IN', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric',
                    })}
                  </span>
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Load more */}
        {visibleCount < bookings.length && (
          <div className='mt-8 text-center'>
            <button
              onClick={() => setVisibleCount((prev) => prev + 5)}
              className='inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-6 py-2.5 text-sm font-semibold text-gray-700 transition hover:border-red-300 hover:bg-red-50 hover:text-red-700'
            >
              Load more ({visibleCount} of {bookings.length})
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default BookerDashboard;