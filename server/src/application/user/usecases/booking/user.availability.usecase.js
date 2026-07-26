export class UserAvailabilityUsecase {
  constructor(bookingRepository) {
    this._bookingRepository = bookingRepository;
  }

  async execute(venueId, month, year) {
    const bookings = await this._bookingRepository.findByVenue(venueId, month, year);

    const availability = {};

    bookings.forEach((b) => {
      if (!b.bookingDate) return; // guard

      const dateKey = b.bookingDate.toISOString().split("T")[0];

      if (!availability[dateKey]) {
        availability[dateKey] = { slots: [], status: "available" };
      }

      availability[dateKey].slots.push({
        startTime: b.startTime,
        endTime: b.endTime,
      });

      if (b.bookingType === "daily") {
        availability[dateKey].status = "booked";
      } else if (availability[dateKey].status !== "booked") {
        availability[dateKey].status = "partial";
      }
    });

    return availability;
  }
}