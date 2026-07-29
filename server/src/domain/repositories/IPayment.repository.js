export class IPaymentRepository {
    async create(payment) {
      throw new Error("Method not implemented");
    }
  
    async findById(paymentId) {
      throw new Error("Method not implemented");
    }
  
    async findByBookingId(bookingId) {
      throw new Error("Method not implemented");
    }
  
    async findByBookingIdAndType(bookingId, paymentType) {
      throw new Error("Method not implemented");
    }
  
    async update(paymentId, data) {
      throw new Error("Method not implemented");
    }
    
    async findAllFiltered(query = {}) {
      throw new Error("Method not implemented");
    }

    async getPaymentStatistics() {
      throw new Error("Method not implemented");
    }
  }