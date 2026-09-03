import { FiCalendar, FiClock, FiMapPin } from 'react-icons/fi';
import { MdOutlineMeetingRoom } from 'react-icons/md';

interface BookingSummaryCardProps {
  formattedTime: string;
  state: {
    venueImage?: string;
    venueName?: string;
    venueCity?: string;
    date?: string;
    slotTime?: string;
  };
  amountToPay?: number;
  isProcessing: boolean;
  isExpired: boolean;
  onCancel: () => void;
}

export function BookingSummaryCard({
  formattedTime,
  state,
  amountToPay,
  isProcessing,
  isExpired,
  onCancel,
}: BookingSummaryCardProps) {
  return (
    <div className="sticky top-48 bg-[var(--bg-tertiary)] border border-[var(--bg-grey)] rounded-3xl p-6 shadow-xl">
      <div className="hidden md:flex mb-6 bg-orange-50 dark:bg-orange-950/20 border border-orange-200 dark:border-orange-900/30 p-4 rounded-2xl items-center justify-between">
        <div className="flex items-center gap-3">
          <FiClock className="text-orange-600 text-xl animate-pulse" />
          <span className="text-orange-800 dark:text-orange-400 font-medium text-sm">
            Lock Timer
          </span>
        </div>
        <span className="text-orange-700 dark:text-orange-300 font-mono text-xl font-bold">
          {formattedTime}
        </span>
      </div>

      <h3 className="text-xl font-extrabold text-[var(--text-primary)] mb-6">Booking Details</h3>

      {state.venueImage && (
        <div className="w-full h-32 rounded-xl overflow-hidden mb-6 relative">
          <img
            src={state.venueImage}
            alt={state.venueName}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
          <div className="absolute bottom-3 left-3 text-white">
            <p className="font-bold">{state.venueName}</p>
            {state.venueCity && <p className="text-xs text-gray-200">{state.venueCity}</p>}
          </div>
        </div>
      )}

      <div className="space-y-5 mb-8">
        {!state.venueImage && (
          <div className="flex items-start gap-4">
            <div className="bg-[var(--bg-primary)] p-2.5 rounded-xl text-[var(--bg-green)] border border-[var(--bg-grey)]">
              <FiMapPin size={20} />
            </div>
            <div>
              <p className="text-xs text-[var(--text-secondary)] mb-1 uppercase tracking-wider font-semibold">
                Venue
              </p>
              <p className="font-bold text-[var(--text-primary)]">{state.venueName}</p>
            </div>
          </div>
        )}

        <div className="flex items-start gap-4">
          <div className="bg-[var(--bg-primary)] p-2.5 rounded-xl text-[var(--bg-green)] border border-[var(--bg-grey)]">
            <FiCalendar size={20} />
          </div>
          <div>
            <p className="text-xs text-[var(--text-secondary)] mb-1 uppercase tracking-wider font-semibold">
              Date
            </p>
            <p className="font-bold text-[var(--text-primary)]">{state.date}</p>
          </div>
        </div>

        <div className="flex items-start gap-4">
          <div className="bg-[var(--bg-primary)] p-2.5 rounded-xl text-[var(--bg-green)] border border-[var(--bg-grey)]">
            <MdOutlineMeetingRoom size={20} />
          </div>
          <div>
            <p className="text-xs text-[var(--text-secondary)] mb-1 uppercase tracking-wider font-semibold">
              Time Slot
            </p>
            <p className="font-bold text-[var(--text-primary)]">{state.slotTime}</p>
          </div>
        </div>
      </div>

      <div className="border-t border-[var(--bg-grey)] pt-6 mb-8">
        <div className="flex justify-between items-center bg-[var(--bg-primary)] border border-[var(--bg-grey)] p-4 rounded-2xl">
          <span className="text-[var(--text-secondary)] font-medium">Total Payable</span>
          <span className="text-3xl font-extrabold text-[var(--bg-green)]">₹{amountToPay}</span>
        </div>
      </div>

      <div className="space-y-3">
        <button
          type="submit"
          form="checkout-form"
          disabled={isProcessing || isExpired}
          className="w-full py-4 rounded-xl bg-[var(--bg-green)] text-white font-bold text-lg hover:bg-green-600 transition-all shadow-md hover:shadow-lg disabled:bg-[var(--bg-grey)] disabled:cursor-not-allowed flex justify-center items-center"
        >
          {isProcessing ? (
            <span className="flex items-center gap-2">
              <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>{' '}
              Processing...
            </span>
          ) : (
            'Proceed to Payment'
          )}
        </button>
        <button
          onClick={onCancel}
          disabled={isProcessing}
          type="button"
          className="w-full py-3 rounded-xl font-bold text-[var(--text-secondary)] hover:bg-[var(--bg-grey)] transition cursor-pointer disabled:opacity-50"
        >
          Cancel Booking
        </button>
      </div>
    </div>
  );
}
