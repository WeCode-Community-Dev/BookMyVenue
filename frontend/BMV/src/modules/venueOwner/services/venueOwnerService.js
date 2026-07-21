import client from "../../../core/api/client";

export const venueOwnerService = {
  // GET /venue-owners/dashboard/summary
  async getSummary() {
    const res = await client.get("/venue-owners/dashboard/summary");
    return res.data;
  },

  // GET /venue-owners/dashboard/bookings/requests
  async getBookingRequests() {
    const res = await client.get("/venue-owners/dashboard/bookings/requests");
    return res.data;
  },

  // GET /venue-owners/dashboard/bookings/all?tab=all&page=1&limit=10
  async getOwnerBookings({ tab = "all", page = 1, limit = 10 } = {}) {
    const res = await client.get("/venue-owners/dashboard/bookings/all", {
      params: { tab, page, limit },
    });
    return res.data;
  },

  // PATCH /venue-owners/dashboard/bookings/{id}/accept
  async acceptBookingRequest(id) {
    const res = await client.patch(`/venue-owners/dashboard/bookings/${id}/accept`);
    return res.data;
  },

  // PATCH /venue-owners/dashboard/bookings/{id}/reject
  async rejectBookingRequest(id) {
    const res = await client.patch(`/venue-owners/dashboard/bookings/${id}/reject`);
    return res.data;
  },

  // POST /venue-owners/dashboard/bookings/check-in
  async verifyBookingCheckIn(check_in_token) {
    const res = await client.post("/venue-owners/dashboard/bookings/check-in", {
      check_in_token,
    });
    return res.data;
  },

  // GET /venue-owners/dashboard/availability?month=YYYY-MM
  async getAvailabilityCalendar({ month, venue_id } = {}) {
     const params = { month };
     if (venue_id && venue_id !== "all") params.venue_id = venue_id;
     const res = await client.get("/venue-owners/dashboard/availability", { params });
     return res.data;
   },

  // GET /venue-owners/dashboard/venues
  async getMyVenues() {
    const res = await client.get("/venue-owners/dashboard/venues");
    return res.data;
  },

  // GET /venues/:id  — single venue with venue_type + amenities eager-loaded
  async getVenueById(id) {
    const res = await client.get(`/venues/${id}`);
    return res.data;
  },

  // PUT /venues/:id
  async updateVenue(id, payload) {
    const res = await client.put(`/venues/${id}`, payload);
    return res.data;
  },

  // DELETE /venues/:id  — hard delete for pending/rejected
  async deleteVenue(id) {
    const res = await client.delete(`/venues/${id}`);
    return res.data;
  },

  // PATCH /venues/:id/deactivate  — soft delete for approved
  async deactivateVenue(id) {
    const res = await client.patch(`/venues/${id}/deactivate`);
    return res.data;
  },

  // GET /venue-owners/dashboard/revenue?range=this_month
  async getRevenueOverview(range = "this_month") {
    const res = await client.get("/venue-owners/dashboard/revenue", { params: { range } });
    return res.data;
  },

  // GET /venue-owners/dashboard/reviews/recent
  async getRecentReviews() {
    const res = await client.get("/venue-owners/dashboard/reviews/recent");
    return res.data;
  },

  // GET /venue-owners/dashboard/notifications
  async getNotifications() {
    const res = await client.get("/venue-owners/dashboard/notifications");
    return res.data;
  },

  // POST /venues/
  async createVenue(payload) {
    const res = await client.post("/venues/", payload);
    return res.data;
  },

  // GET /venue-types/
  async getVenueTypes() {
    const res = await client.get("/venue-types/");
    return res.data;
  },

  // GET /amenities/
  async getAmenities() {
    const res = await client.get("/amenities/");
    return res.data;
  },

  // POST /venue-amenities/{venueId}/{amenityId}
  async linkAmenity(venueId, amenityId) {
    const res = await client.post(`/venue-amenities/${venueId}/${amenityId}`);
    return res.data;
  },

  // DELETE /venue-amenities/{venueId}/{amenityId}
  async unlinkAmenity(venueId, amenityId) {
    const res = await client.delete(`/venue-amenities/${venueId}/${amenityId}`);
    return res.data;
  },
};

export const verifyBookingCheckIn = (check_in_token) =>
  venueOwnerService.verifyBookingCheckIn(check_in_token);