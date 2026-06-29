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

    async countByOwnerId(ownerId) {
      throw new Error("Method not implemented")
  }
  
  async countByOwnerIdAndStatus(ownerId, status) {
      throw new Error("Method not implemented")
  }

  async getTopVenues(ownerId) {
    throw new Error("Method not implemented");
}

async getRecentBookings(ownerId) {
    throw new Error("Method not implemented");
}
  }