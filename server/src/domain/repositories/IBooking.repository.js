export class BookingRepository {
    async create(booking) {
      throw new Error("Method not implemented");
    }
  
    async findById(id) {
      throw new Error("Method not implemented");
    }
  
    async findByUserId(userId) {
      throw new Error("Method not implemented");
    }
  
    async findByOwnerId(vendorId, filters) {
      throw new Error("Method not implemented");
    }
  
    async findByVenueAndDate(venueId, bookingDate) {
      throw new Error("Method not implemented");
    }
  
    async update(id, booking) {
      throw new Error("Method not implemented");
    }
    async findAllFiltered(query={}) {
      throw new Error("Method not implemented");
    }
    async getBookingStatistics() {
      throw new Error("Method not implemented");
    }

    async countByOwnerId(vendorId) {
      throw new Error("Method not implemented")
  }
  
  async countByOwnerIdAndStatus(vendorId, status) {
      throw new Error("Method not implemented")
  }

  async getTopVenues(vendorId) {
    throw new Error("Method not implemented");
}

async getRecentBookings(vendorId) {
    throw new Error("Method not implemented");
}
async hasOverlappingBooking(
    venueId,
    bookingDate,
    startTime,
    endTime
) {
    throw new Error("Method not implemented.");
}
  }