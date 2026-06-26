import { BookingStatus } from "../../../../domain/enums/Booking.enum.js";

export class GetDashboardStatsUsecase {
  constructor(
    venueRepository,

    bookingRepository
  ) {
    this._venueRepository = venueRepository;

    this._bookingRepository = bookingRepository;
  }

  async execute(ownerId) {
    const totalVenues = await this._venueRepository.countByOwnerId(ownerId);

    const totalBookings = await this._bookingRepository.countByOwnerId(ownerId);

    const topVenues = await this._bookingRepository.getTopVenues(ownerId);

    const recentBookings = await this._bookingRepository.getRecentBookings(
      ownerId
    );

    const pendingBookings =
      await this._bookingRepository.countByOwnerIdAndStatus(
        ownerId,
        BookingStatus.PENDING
      );

    const confirmedBookings =
      await this._bookingRepository.countByOwnerIdAndStatus(
        ownerId,
        BookingStatus.CONFIRMED
      );

    const completedBookings =
      await this._bookingRepository.countByOwnerIdAndStatus(
        ownerId,
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
