import { BookingStatus } from "../../../../domain/enums/Booking.enum.js";

export class GetDashboardStatsUsecase {
  constructor(
    venueRepository,

    bookingRepository
  ) {
    this._venueRepository = venueRepository;

    this._bookingRepository = bookingRepository;
  }

  async execute(vendorId) {
    const totalVenues = await this._venueRepository.countByOwnerId(vendorId);

    const totalBookings = await this._bookingRepository.countByOwnerId(vendorId);

    const topVenues = await this._bookingRepository.getTopVenues(vendorId);

    const recentBookings = await this._bookingRepository.getRecentBookings(
      vendorId
    );

    const pendingBookings =
      await this._bookingRepository.countByOwnerIdAndStatus(
        vendorId,
        BookingStatus.PENDING
      );

    const confirmedBookings =
      await this._bookingRepository.countByOwnerIdAndStatus(
        vendorId,
        BookingStatus.CONFIRMED
      );

    const completedBookings =
      await this._bookingRepository.countByOwnerIdAndStatus(
        vendorId,
        BookingStatus.COMPLETED
      );

    return {
      stats: {
        totalVenues,

        totalBookings,

        pendingBookings,

        confirmedBookings,

        completedBookings,
      },

      topVenues,

      recentBookings,
    };
  }
}
