
const CLEANING_BUFFER_HOURS = 1;

export class UserAvailabilityUsecase {
  constructor(bookingRepository, venueRepository) {
    this._bookingRepository = bookingRepository;
    this._venueRepository = venueRepository;
  }

  async execute(venueId, month, year) {
    const venue = await this._venueRepository.findById(venueId);

    if (!venue) {
      throw new Error("Venue not found");
    }

    const bookings = await this._bookingRepository.findByVenue(
      venueId,
      month,
      year
    );

    const availability = {};

    const openTime = venue.availabilityRules?.openTime || "08:00";
    const closeTime = venue.availabilityRules?.closeTime || "22:00";

    const minimumBookingHours =
      venue.minimumBookingHours || 1;

    const closedDays =
      venue.availabilityRules?.closedDays || [];

    /*
     * Convert HH:mm to minutes.
     */
    const timeToMinutes = (time) => {
      const [hours, minutes] = time.split(":").map(Number);

      return hours * 60 + minutes;
    };

    /*
     * Convert minutes back to HH:mm.
     */
    const minutesToTime = (minutes) => {
      const hours = Math.floor(minutes / 60);
      const mins = minutes % 60;

      return `${String(hours).padStart(2, "0")}:${String(mins).padStart(
        2,
        "0"
      )}`;
    };

    const openMinutes = timeToMinutes(openTime);
    const closeMinutes = timeToMinutes(closeTime);

    /*
     * Group bookings by date.
     */
    const bookingsByDate = {};

    bookings.forEach((booking) => {
      if (!booking.bookingDate) return;

      const dateKey = booking.bookingDate
        .toISOString()
        .split("T")[0];

      if (!bookingsByDate[dateKey]) {
        bookingsByDate[dateKey] = [];
      }

      bookingsByDate[dateKey].push({
        startTime: booking.startTime,
        endTime: booking.endTime,
        bookingType: booking.bookingType,
      });
    });

    /*
     * Generate every date in the requested month.
     */
    const daysInMonth = new Date(year, month, 0).getDate();

    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month - 1, day);

      const dateKey = `${year}-${String(month).padStart(2, "0")}-${String(
        day
      ).padStart(2, "0")}`;

      /*
       * Check closed days.
       *
       * Assumes closedDays contains values such as:
       * ["Sunday", "Monday"]
       */
      const dayName = date.toLocaleDateString("en-US", {
        weekday: "long",
      });

      if (closedDays.includes(dayName)) {
        availability[dateKey] = {
          status: "booked",
          slots: [],
        };

        continue;
      }

      const dateBookings = bookingsByDate[dateKey] || [];

      /*
       * Daily booking means the whole day is unavailable.
       */
      const hasDailyBooking = dateBookings.some(
        (booking) => booking.bookingType === "daily"
      );

      if (hasDailyBooking) {
        availability[dateKey] = {
          status: "booked",
          slots: [],
        };

        continue;
      }

      /*
       * Generate hourly booking slots.
       *
       * Example:
       *
       * minimumBookingHours = 2
       * cleaning buffer = 1 hour
       *
       * 09:00 - 11:00 booking
       * 11:00 - 12:00 cleaning
       * 12:00 - 14:00 booking
       * 14:00 - 15:00 cleaning
       * 15:00 - 17:00 booking
       */
      const slots = [];

      let slotStart = openMinutes;

      while (
        slotStart + minimumBookingHours * 60 <= closeMinutes
      ) {
        const slotEnd =
          slotStart + minimumBookingHours * 60;

        const hasConflict = dateBookings.some((booking) => {
          if (!booking.startTime || !booking.endTime) {
            return false;
          }

          const bookingStart = timeToMinutes(
            booking.startTime
          );

          const bookingEnd = timeToMinutes(
            booking.endTime
          );

          /*
           * Add the cleaning buffer around existing bookings.
           *
           * Existing booking:
           * 09:00 - 11:00
           *
           * Protected period:
           * 09:00 - 12:00
           */
          const protectedStart = bookingStart;

          const protectedEnd =
            bookingEnd + CLEANING_BUFFER_HOURS * 60;

          return (
            slotStart < protectedEnd &&
            slotEnd > protectedStart
          );
        });

        if (!hasConflict) {
          slots.push({
            startTime: minutesToTime(slotStart),
            endTime: minutesToTime(slotEnd),
          });
        }

        /*
         * Move to the next slot after:
         *
         * booking duration + cleaning buffer
         */
        slotStart =
          slotEnd + CLEANING_BUFFER_HOURS * 60;
      }

      /*
       * Determine date status.
       */
      let status = "available";

      if (slots.length === 0) {
        status = "booked";
      } else if (dateBookings.length > 0) {
        status = "partial";
      }

      availability[dateKey] = {
        status,
        slots,
      };
    }

    return availability;
  }
}

