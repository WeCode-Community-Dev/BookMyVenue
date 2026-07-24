import client from "../../../core/api/client";

export const venueOwnerService = {
  async getSummary() {
    const res = await client.get("/venue-owners/dashboard/summary");
    return res.data;
  },

  async getBookingRequests() {
    const res = await client.get("/venue-owners/dashboard/bookings/requests");
    return res.data;
  },

  async getOwnerBookings({ tab = "all", page = 1, limit = 10 } = {}) {
    const res = await client.get("/venue-owners/dashboard/bookings/all", {
      params: { tab, page, limit },
    });
    return res.data;
  },

  async acceptBookingRequest(id) {
    const res = await client.patch(`/venue-owners/dashboard/bookings/${id}/accept`);
    return res.data;
  },

  async rejectBookingRequest(id) {
    const res = await client.patch(`/venue-owners/dashboard/bookings/${id}/reject`);
    return res.data;
  },

  async collectBookingBalance(id) {
    const res = await client.post(
      `/venue-owners/dashboard/bookings/${id}/collect-balance`,
    );
    return res.data;
  },

  async verifyBookingCheckIn(check_in_token) {
    const res = await client.post("/venue-owners/dashboard/bookings/check-in", {
      check_in_token,
    });
    return res.data;
  },

  async collectBalance(bookingId) {
    const res = await client.post(
      `/venue-owners/dashboard/bookings/${bookingId}/collect-balance`,
    );
    return res.data;
  },

  async getAvailabilityCalendar({ month, venue_id } = {}) {
     const params = { month };
     if (venue_id && venue_id !== "all") params.venue_id = venue_id;
     const res = await client.get("/venue-owners/dashboard/availability", { params });
     return res.data;
   },

  async getMyVenues() {
    const res = await client.get("/venue-owners/dashboard/venues");
    return res.data;
  },

  async getVenueById(id) {
    const res = await client.get(`/venues/${id}`);
    return res.data;
  },

  async updateVenue(id, payload) {
    const res = await client.put(`/venues/${id}`, payload);
    return res.data;
  },

  async deleteVenue(id) {
    const res = await client.delete(`/venues/${id}`);
    return res.data;
  },

  async deactivateVenue(id) {
    const res = await client.patch(`/venues/${id}/deactivate`);
    return res.data;
  },

  async getRevenueOverview(range = "this_month") {
    const res = await client.get("/venue-owners/dashboard/revenue", { params: { range } });
    return res.data;
  },

  async getRecentReviews() {
    const res = await client.get("/venue-owners/dashboard/reviews/recent");
    return res.data;
  },

  async getNotifications() {
    const res = await client.get("/venue-owners/dashboard/notifications");
    return res.data;
  },

  async createVenue(payload) {
    const res = await client.post("/venues/", payload);
    return res.data;
  },

  async getVenueTypes() {
    const res = await client.get("/venue-types/");
    return res.data;
  },

  async getAmenities() {
    const res = await client.get("/amenities/");
    return res.data;
  },

  async linkAmenity(venueId, amenityId) {
    const res = await client.post(`/venue-amenities/${venueId}/${amenityId}`);
    return res.data;
  },

  async unlinkAmenity(venueId, amenityId) {
    const res = await client.delete(`/venue-amenities/${venueId}/${amenityId}`);
    return res.data;
  },
};

export const verifyBookingCheckIn = (check_in_token) =>
  venueOwnerService.verifyBookingCheckIn(check_in_token);
