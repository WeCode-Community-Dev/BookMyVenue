import { FiCalendar, FiClock, FiUsers, FiInfo } from 'react-icons/fi';
import type { BookingDetailDTO } from '@/types/booking.types';

export function BookingInfo({ booking }: { booking: BookingDetailDTO }) {
  return (
    <div className="bg-[var(--bg-tertiary)] border border-[var(--bg-grey)] rounded-3xl overflow-hidden shadow-sm">
      <div className="h-64 w-full relative">
        <img
          src={booking.coverImage}
          alt={booking.venueName}
          className="w-full h-full object-cover"
        />
      </div>
      <div className="p-6 md:p-8">
        <h3 className="text-xl font-bold text-[var(--text-primary)] mb-6">Booking Details</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex items-start gap-4">
            <div className="bg-[var(--bg-primary)] p-3 rounded-xl text-[var(--bg-green)] border border-[var(--bg-grey)]">
              <FiCalendar size={20} />
            </div>
            <div>
              <p className="text-sm text-[var(--text-secondary)] mb-1">Date</p>
              <p className="font-semibold text-lg text-[var(--text-primary)]">{booking.date}</p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="bg-[var(--bg-primary)] p-3 rounded-xl text-[var(--bg-green)] border border-[var(--bg-grey)]">
              <FiClock size={20} />
            </div>
            <div>
              <p className="text-sm text-[var(--text-secondary)] mb-1">Time Range</p>
              <p className="font-semibold text-lg text-[var(--text-primary)]">
                {booking.timeRange}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="bg-[var(--bg-primary)] p-3 rounded-xl text-[var(--bg-green)] border border-[var(--bg-grey)]">
              <FiUsers size={20} />
            </div>
            <div>
              <p className="text-sm text-[var(--text-secondary)] mb-1">Guest Count</p>
              <p className="font-semibold text-lg text-[var(--text-primary)]">
                {booking.guestCount || 'Not specified'}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="bg-[var(--bg-primary)] p-3 rounded-xl text-[var(--bg-green)] border border-[var(--bg-grey)]">
              <FiInfo size={20} />
            </div>
            <div>
              <p className="text-sm text-[var(--text-secondary)] mb-1">Event Type</p>
              <p className="font-semibold text-lg text-[var(--text-primary)] capitalize">
                {booking.eventType || 'Not specified'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
