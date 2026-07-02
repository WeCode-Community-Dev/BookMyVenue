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

  // PATCH /venue-owners/dashboard/bookings/{id}/accept
  async acceptBookingRequest(id) {
    const res = await client.patch(
      `/venue-owners/dashboard/bookings/${id}/accept`,
    );
    return res.data;
  },

  // PATCH /venue-owners/dashboard/bookings/{id}/reject
  async rejectBookingRequest(id) {
    const res = await client.patch(
      `/venue-owners/dashboard/bookings/${id}/reject`,
    );
    return res.data;
  },

  // GET /venue-owners/dashboard/availability?month=YYYY-MM
  async getAvailabilityCalendar(month) {
    const res = await client.get("/venue-owners/dashboard/availability", {
      params: { month },
    });
    return res.data;
  },

  // GET /venue-owners/dashboard/venues
  async getMyVenues() {
    const res = await client.get("/venue-owners/dashboard/venues");
    return res.data;
  },

  // GET /venue-owners/dashboard/revenue?range=this_month
  async getRevenueOverview(range = "this_month") {
    const res = await client.get("/venue-owners/dashboard/revenue", {
      params: { range },
    });
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
  // Backend returns the venue's updated amenity list (list[AmenityOut]).
  async linkAmenity(venueId, amenityId) {
    const res = await client.post(`/venue-amenities/${venueId}/${amenityId}`);
    return res.data;
  },
 
  // DELETE /venue-amenities/{venueId}/{amenityId}
  // Backend returns the venue's updated amenity list (list[AmenityOut]).
  async unlinkAmenity(venueId, amenityId) {
    const res = await client.delete(`/venue-amenities/${venueId}/${amenityId}`);
    return res.data;
  },


};


