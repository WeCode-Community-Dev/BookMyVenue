import { CalendarDays, Clock3 } from "lucide-react";
import { getTodayDate, formatTime } from "./utils";

function BookingPanel({
  venue,
  selectedDate,
  onDateChange,
  availabilityGroups,
  selectedBookingType,
  onBookingTypeChange,
  bookingLoading,
  bookingSummary,
  bookingError,
  bookingSuccess,
  selectedSlotIds,
  toggleSlot,
  handleBookNow,
}) {
  const currentGroup = availabilityGroups.find(
    (g) => g.booking_type === selectedBookingType
  );

  const slots = currentGroup?.slots || [];

  const showTypeSelector =
    venue.supports_hourly && venue.supports_daily;

  return (
    <div className="sticky top-6 rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
      <h2 className="text-2xl font-bold text-gray-900">Book Venue</h2>
      <p className="mt-2 text-gray-500">Select a date and your preferred time slot.</p>

      {/* Pricing */}
      <div className="mt-6 rounded-2xl bg-gray-50 p-5">
        {venue.supports_hourly && (
          <div className="flex justify-between">
            <span className="text-gray-600">Hourly</span>
            <span className="font-semibold">₹{venue.hourly_price}/hr</span>
          </div>
        )}
        {venue.supports_daily && (
          <div className="mt-3 flex justify-between">
            <span className="text-gray-600">Daily</span>
            <span className="font-semibold">₹{venue.daily_price}/day</span>
          </div>
        )}
      </div>

      {/* Date */}
      <div className="mt-8">
        <label className="mb-2 flex items-center gap-2 font-medium">
          <CalendarDays size={18} /> Booking Date
        </label>
        <input type="date" value={selectedDate} min={getTodayDate()} onChange={onDateChange}
          className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none transition focus:border-red-500" />
      </div>

      {/* Booking Type Selector */}
      {showTypeSelector && selectedDate && (
        <div className="mt-6">
          <label className="mb-3 flex items-center gap-2 font-medium"><Clock3 size={18} /> Booking Type</label>
          <div className="flex gap-3">
            {venue.supports_hourly && (
              <button type="button" onClick={() => onBookingTypeChange("hourly")}
                className={'flex-1 rounded-xl border-2 px-4 py-3 text-center font-semibold transition ' + (
                  selectedBookingType === "hourly"
                    ? "border-red-600 bg-red-50 text-red-700"
                    : "border-gray-300 text-gray-600 hover:border-red-500"
                )}>Hourly</button>
            )}
            {venue.supports_daily && (
              <button type="button" onClick={() => onBookingTypeChange("daily")}
                className={'flex-1 rounded-xl border-2 px-4 py-3 text-center font-semibold transition ' + (
                  selectedBookingType === "daily"
                    ? "border-red-600 bg-red-50 text-red-700"
                    : "border-gray-300 text-gray-600 hover:border-red-500"
                )}>Daily</button>
            )}
          </div>
        </div>
      )}

      {bookingLoading && <div className="mt-6 text-center text-gray-500">Loading availability...</div>}

      {/* Slots */}
      {!bookingLoading && selectedBookingType && slots.length > 0 && (
        <div className="mt-8">
          <div className="mb-4 flex items-center gap-2 font-semibold"><Clock3 size={18} /> Available Slots</div>
          <div className="grid gap-3">
            {slots.map((slot) => {
              const selected = selectedSlotIds.includes(slot.id);
              const slotLabel = selectedBookingType === "daily"
                ? "Full Day"
                : (formatTime(slot.start_time) + " - " + formatTime(slot.end_time));
              return (
                <button key={slot.id} type="button" disabled={slot.is_booked} onClick={() => toggleSlot(slot)}
                  className={'rounded-xl border p-4 text-left transition ' + (
                    slot.is_booked
                      ? "cursor-not-allowed border-gray-200 bg-gray-100 text-gray-400"
                      : selected
                      ? "border-red-600 bg-red-50 text-red-700"
                      : "border-gray-300 hover:border-red-500 hover:bg-red-50"
                  )}>
                  <div className="flex items-center justify-between">
                    <span className="font-medium">{slotLabel}</span>
                    {slot.is_booked && <span className="text-xs font-semibold">Booked</span>}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {!bookingLoading && selectedBookingType && slots.length === 0 && (
        <div className="mt-6 rounded-xl bg-yellow-50 p-4 text-yellow-700">No {selectedBookingType} slots available for this date.</div>
      )}

      {bookingSummary && (
        <div className="mt-8 rounded-2xl bg-gray-50 p-5">
          <h3 className="font-semibold">Booking Summary</h3>
          <div className="mt-4 space-y-2 text-sm">
            <div className="flex justify-between"><span>Base Price</span><span>₹{bookingSummary.base_price.toFixed(2)}</span></div>
            <div className="flex justify-between"><span>GST</span><span>₹{bookingSummary.tax_amount.toFixed(2)}</span></div>
            <div className="flex justify-between"><span>Platform Fee</span><span>₹{bookingSummary.platform_fee.toFixed(2)}</span></div>
            <hr className="my-2" />
            <div className="flex justify-between text-lg font-bold"><span>Total</span><span className="text-red-600">₹{bookingSummary.total_amount.toFixed(2)}</span></div>
          </div>
        </div>
      )}

      {bookingError && <div className="mt-6 rounded-xl bg-red-50 p-4 text-red-700">{bookingError}</div>}
      {bookingSuccess && <div className="mt-6 rounded-xl bg-green-50 p-4 text-green-700">Booking completed successfully.</div>}

      <button onClick={handleBookNow} disabled={bookingLoading || selectedSlotIds.length === 0}
        className="mt-8 w-full rounded-xl bg-red-600 py-3 font-semibold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:bg-gray-300">
        Book Now
      </button>
    </div>
  );
}

export default BookingPanel;


