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

  // ← CHANGED: now accepts an optional rejectionReason string and sends it in the body
  async rejectBookingRequest(id, rejectionReason = null) {
    const res = await client.patch(`/venue-owners/dashboard/bookings/${id}/reject`, {
      rejection_reason: rejectionReason || null,
    });
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