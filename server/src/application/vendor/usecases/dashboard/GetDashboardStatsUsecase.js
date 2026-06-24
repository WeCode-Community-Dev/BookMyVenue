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

    const rejectedBookings =
      await this._bookingRepository.countByOwnerIdAndStatus(
        ownerId,
        BookingStatus.REJECTED
      );

    const completedBookings =
      await this._bookingRepository.countByOwnerIdAndStatus(
        ownerId,
        BookingStatus.COMPLETED
      );

    return {
      totalVenues,

      totalBookings,

      pendingBookings,

      confirmedBookings,

      rejectedBookings,

      completedBookings,
    };
  }
}
