import { FiPhone, FiMail } from 'react-icons/fi';
import type { BookingDetailDTO } from '@/types/booking.types';

export function BookingSidebarDetails({ booking }: { booking: BookingDetailDTO }) {
  return (
    <div className="space-y-8">
      <div className="bg-[var(--bg-tertiary)] border border-[var(--bg-grey)] rounded-3xl p-6 shadow-sm">
        <h3 className="text-lg font-bold text-[var(--text-primary)] mb-6">Payment Summary</h3>
        <div className="space-y-4 mb-6">
          <div className="flex justify-between items-center text-sm">
            <span className="text-[var(--text-secondary)]">Total Amount</span>
            <span className="font-bold text-[var(--text-primary)]">₹{booking.totalPrice}</span>
          </div>
          <div className="flex justify-between items-center text-sm">
            <span className="text-[var(--text-secondary)]">Payment Method</span>
            <span className="font-medium text-[var(--text-primary)] uppercase">
              {booking.paymentMethod || 'Online'}
            </span>
          </div>
          <div className="flex justify-between items-center text-sm">
            <span className="text-[var(--text-secondary)]">Payment Status</span>
            <span
              className={`px-2 py-0.5 text-xs rounded-full font-medium ${
                booking.paymentStatus === 'paid'
                  ? 'bg-green-100 text-green-700'
                  : booking.paymentStatus === 'pending'
                    ? 'bg-yellow-100 text-yellow-700'
                    : 'bg-gray-100 text-gray-600'
              }`}
            >
              {(booking.paymentStatus || 'PAID').toUpperCase()}
            </span>
          </div>
          <div className="flex justify-between items-center text-sm">
            <span className="text-[var(--text-secondary)]">Transaction ID</span>
            <span className="font-mono bg-[var(--bg-primary)] px-2 py-1 rounded text-xs">
              {booking.paymentReference}
            </span>
          </div>
        </div>
        <div className="pt-4 border-t border-[var(--bg-grey)] flex justify-between items-center">
          <span className="font-bold text-[var(--text-primary)]">Amount Paid</span>
          <span className="text-2xl font-extrabold text-[var(--bg-green)]">
            ₹{booking.totalPrice}
          </span>
        </div>
      </div>

      <div className="bg-[var(--bg-tertiary)] border border-[var(--bg-grey)] rounded-3xl p-6 shadow-sm">
        <h3 className="text-lg font-bold text-[var(--text-primary)] mb-4">Contact Venue</h3>
        <div className="space-y-4">
          <a
            href={`tel:${booking.contactPhone}`}
            className="flex items-center gap-3 text-[var(--text-primary)] hover:text-[var(--bg-green)] transition"
          >
            <div className="w-10 h-10 bg-[var(--bg-primary)] rounded-full flex items-center justify-center border border-[var(--bg-grey)]">
              <FiPhone />
            </div>
            <span className="font-medium">{booking.contactPhone}</span>
          </a>
          {booking.contactEmail && (
            <a
              href={`mailto:${booking.contactEmail}`}
              className="flex items-center gap-3 text-[var(--text-primary)] hover:text-[var(--bg-green)] transition"
            >
              <div className="w-10 h-10 bg-[var(--bg-primary)] rounded-full flex items-center justify-center border border-[var(--bg-grey)]">
                <FiMail />
              </div>
              <span className="font-medium truncate">{booking.contactEmail}</span>
            </a>
          )}
        </div>
        <div className="mt-6 pt-6 border-t border-[var(--bg-grey)]">
          <p className="text-sm font-medium text-[var(--text-secondary)] mb-2">Venue Address</p>
          <p className="text-sm text-[var(--text-primary)]">{booking.address}</p>
        </div>
      </div>

      <div className="bg-orange-50 dark:bg-orange-950/20 border border-orange-200 dark:border-orange-900/30 rounded-3xl p-6">
        <h3 className="text-lg font-bold text-orange-800 dark:text-orange-400 mb-2">
          Cancellation Policy
        </h3>
        <p className="text-sm text-orange-700 dark:text-orange-300">{booking.cancellationPolicy}</p>
      </div>
    </div>
  );
}
