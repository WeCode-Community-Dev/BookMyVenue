import { FiCalendar } from 'react-icons/fi';
import { Calendar } from '@/components/ui/calendar';
import { toLocalDateString } from '@/utils/timeUtils';
import type { VenueDetail } from '@/types/venue.types';
import type { Slot } from '@/types/booking.types';
import { BOOKING_TYPES } from '@/constants/venueConstants';

interface BookingSidebarProps {
  venue: VenueDetail;
  selectedSlots: Slot[];
  setSelectedSlots: (slots: Slot[]) => void;
  selectedDate: string;
  setSelectedDate: (date: string) => void;
  calendarVisible: boolean;
  setCalendarVisible: (visible: boolean) => void;
  bookableDatesData: { disabledDates: string[]; maxDate: string } | undefined;
  isCalendarLoading: boolean;
  availabilityResponse:
    | {
        slots: {
          slotId: string;
          name: string | null;
          startTime: string;
          endTime: string;
          price: number;
          isAvailable: boolean;
          reason: string | null;
        }[];
      }
    | undefined;
  isSlotsLoading: boolean;
  totalPrice: number;
  finalStartTime: string | null;
  finalEndTime: string | null;
  handleSlotSelect: (slot: Slot) => void;
  handleProceedToBook: () => void;
  isBlocking: boolean;
  getStartingPrice: () => string;
}

export function BookingSidebar({
  venue,
  selectedSlots,
  setSelectedSlots,
  selectedDate,
  setSelectedDate,
  calendarVisible,
  setCalendarVisible,
  bookableDatesData,
  isCalendarLoading,
  availabilityResponse,
  isSlotsLoading,
  totalPrice,
  finalStartTime,
  finalEndTime,
  handleSlotSelect,
  handleProceedToBook,
  isBlocking,
}: BookingSidebarProps) {
  return (
    <div className="flex flex-col gap-2">
      <div className="mb-5">
        <span className="text-[11px] uppercase tracking-[0.25em] text-[var(--bg-green)] font-bold">
          Booking
        </span>

        <h2 className="text-3xl font-black text-[var(--text-primary)] mt-1">Reserve your venue</h2>

        <p className="text-sm text-[var(--text-secondary)] mt-1">
          Pick a date, choose your slots and continue to payment.
        </p>
      </div>

      <div className="mt-1">
        <div className="flex justify-between items-center mb-2">
          <label className="block text-xs font-bold uppercase tracking-wider text-[var(--text-secondary)]">
            Select Date
          </label>
          {!calendarVisible && selectedDate && (
            <button
              onClick={() => setCalendarVisible(true)}
              className="text-[10px] px-2 py-0.5 bg-[var(--bg-grey)]/50 hover:bg-[var(--bg-grey)] text-[var(--text-primary)] rounded-full font-bold transition-colors cursor-pointer"
            >
              Change Date
            </button>
          )}
        </div>

        <div
          className={`overflow-hidden transition-all duration-300 ease-in-out ${
            calendarVisible ? 'opacity-100 max-h-[400px]' : 'opacity-0 max-h-0'
          }`}
        >
          {isCalendarLoading ? (
            <div className="flex justify-center items-center h-[320px] bg-[var(--bg-tertiary)] border border-[var(--bg-grey)] rounded-2xl">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[var(--bg-green)]"></div>
            </div>
          ) : (
            <div className="bg-[var(--bg-tertiary)] border border-[var(--bg-grey)] rounded-2xl p-2 flex justify-center shadow-inner">
              <Calendar
                mode="single"
                selected={selectedDate ? new Date(selectedDate + 'T00:00:00') : undefined}
                onSelect={(date) => {
                  if (date) {
                    const formatted = toLocalDateString(date);
                    setSelectedDate(formatted);
                    setSelectedSlots([]);
                    setCalendarVisible(false);
                  }
                }}
                disabled={(date) => {
                  if (!bookableDatesData) return true;

                  const dateStr = toLocalDateString(date);
                  if (bookableDatesData.disabledDates.includes(dateStr)) {
                    return true;
                  }

                  const today = new Date();
                  today.setHours(0, 0, 0, 0);
                  const tomorrow = new Date(today);
                  tomorrow.setDate(tomorrow.getDate() + 1);
                  const maxDate = new Date(today);
                  maxDate.setDate(maxDate.getDate() + 90);
                  return date < tomorrow || date > maxDate;
                }}
                startMonth={new Date()}
                endMonth={
                  bookableDatesData?.maxDate
                    ? new Date(bookableDatesData.maxDate + 'T00:00:00')
                    : undefined
                }
                className="rounded-xl w-full flex justify-center"
              />
            </div>
          )}
        </div>

        {!calendarVisible && selectedDate && (
          <div className="mt-3 rounded-2xl border border-[var(--bg-green)]/25 bg-[var(--bg-green)]/10 px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-[var(--bg-green)]/10 flex items-center justify-center">
                <FiCalendar className="text-[var(--bg-green)]" />
              </div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-[var(--text-secondary)]">
                Date
              </span>
            </div>
            <h3 className="font-bold text-sm text-[var(--text-primary)]">
              {new Date(selectedDate + 'T00:00:00').toLocaleDateString('en-GB', {
                weekday: 'short',
                day: 'numeric',
                month: 'short',
                year: 'numeric',
              })}
            </h3>
          </div>
        )}
      </div>

      <div className="mt-6">
        <div className="flex justify-between items-center mb-3">
          <h3 className="font-bold text-[var(--text-primary)] text-sm uppercase tracking-wider">
            Available Slots
          </h3>
          <span className="text-[10px] px-2 py-0.5 bg-[var(--bg-green)]/10 text-[var(--bg-green)] border border-[var(--bg-green)]/20 rounded-full font-bold">
            {venue?.bookingType === BOOKING_TYPES.FIXED ? 'Fixed' : 'Flexible'}
          </span>
        </div>

        {isSlotsLoading ? (
          <div className="mt-8 flex flex-col items-center justify-center gap-3">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[var(--bg-green)]"></div>
            <p className="text-xs text-[var(--text-secondary)] font-medium animate-pulse">
              Calculating availability...
            </p>
          </div>
        ) : (
          <div className="max-h-[350px] overflow-y-auto pr-1.5 custom-scrollbar">
            {!availabilityResponse?.slots || availabilityResponse.slots.length === 0 ? (
              <div className="text-center py-10 text-xs font-semibold text-[var(--text-secondary)] bg-[var(--bg-grey)]/20 rounded-2xl border border-dashed border-[var(--bg-grey)] px-4">
                {selectedDate
                  ? 'No slots available for the selected date.'
                  : 'Please pick a date to check slots availability.'}
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-2.5 p-2.5 rounded-2xl border border-dashed border-[var(--bg-grey)] bg-[var(--bg-grey)]/5">
                {availabilityResponse.slots.map((slot) => {
                  const isSelected = selectedSlots.some((s) => s.slotId === slot.slotId);
                  return (
                    <button
                      key={slot.slotId}
                      disabled={!slot.isAvailable}
                      onClick={() => handleSlotSelect(slot)}
                      className={`w-full text-left border rounded-xl p-4 transition-all duration-200 active:scale-[0.98]
                        ${!slot.isAvailable ? 'opacity-40 cursor-not-allowed bg-[var(--bg-grey)]/50 border-[var(--bg-grey)]' : 'cursor-pointer'}
                        ${
                          isSelected && slot.isAvailable
                            ? 'border-[var(--bg-green)] bg-gradient-to-br from-emerald-500/10 to-teal-500/10 ring-1 ring-[var(--bg-green)]'
                            : slot.isAvailable
                              ? 'bg-[var(--bg-primary)] border-[var(--bg-grey)] hover:border-[var(--bg-green)]/40 hover:shadow-md hover:-translate-y-[2px]'
                              : ''
                        }
                      `}
                    >
                      <div className="flex justify-between items-center gap-3">
                        <div>
                          <h4 className="font-bold text-[var(--text-primary)] text-sm sm:text-[15px]">
                            {slot.startTime} → {slot.endTime}
                            {!slot.isAvailable && (
                              <span className="text-rose-600 dark:text-rose-400 text-[10px] ml-1 uppercase">
                                {slot.reason ? `(${slot.reason})` : '(Booked)'}
                              </span>
                            )}
                          </h4>
                          {slot.name && (
                            <p className="text-[10px] text-[var(--text-secondary)] mt-0.5 font-semibold tracking-wide">
                              {slot.name}
                            </p>
                          )}
                        </div>
                        <div className="text-right shrink-0">
                          <span
                            className={`font-black text-base ${!slot.isAvailable ? 'text-[var(--text-secondary)]' : 'text-[var(--bg-green)]'}`}
                          >
                            ₹{slot.price}
                          </span>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>

      <div className="sticky rounded-2xl bg-[var(--bg-grey)]/20 border border-[var(--bg-grey)] p-4">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-xs uppercase tracking-wider text-[var(--text-secondary)]">Total</p>

            <h2 className="text-3xl font-black text-[var(--text-primary)]">₹{totalPrice}</h2>
          </div>

          <div className="text-right">
            <p className="text-sm font-semibold text-[var(--bg-green)]">
              {selectedSlots.length} {selectedSlots.length === 1 ? 'Slot' : 'Slots'}
            </p>

            {finalStartTime && finalEndTime && (
              <p className="text-xs text-[var(--text-secondary)] mt-1">
                {finalStartTime} → {finalEndTime}
              </p>
            )}
          </div>
        </div>
      </div>

      <button
        onClick={handleProceedToBook}
        disabled={isBlocking || selectedSlots.length === 0}
        className={`w-full py-4 rounded-2xl font-bold text-sm uppercase tracking-wider transition-all duration-300 shadow-md flex items-center justify-center gap-2
          ${
            selectedSlots.length > 0
              ? 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white hover:from-emerald-600 hover:to-teal-700 hover:shadow-lg transform hover:scale-[1.02] active:scale-[0.98] cursor-pointer'
              : 'bg-[var(--bg-grey)] text-[var(--text-secondary)] cursor-not-allowed'
          }
        `}
      >
        {isBlocking && (
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
        )}
        {isBlocking ? 'Locking Slot...' : 'Proceed to Book'}
      </button>
    </div>
  );
}
