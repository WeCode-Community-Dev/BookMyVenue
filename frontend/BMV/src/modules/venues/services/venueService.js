import client from "../../../core/api/client";

export const venueService = {
  /**
   * Fetch approved public venues.
   * Supports optional location, search, skip, limit query params.
   */
  fetchPublicVenues: async (params = {}) => {
    const { data } = await client.get("/venues/", { params });
    return data;
  },

  /**
   * Fetch a single approved venue by ID.
   */
  fetchVenueById: async (id) => {
    const { data } = await client.get(`/venues/${id}`);
    return data;
  },

  /**
   * Check availability for a venue on a date + time slot.
   */
  checkAvailability: async (venueId, bookingDate, timeSlot) => {
    const { data } = await client.get(`/venues/${venueId}/availability`, {
      params: { booking_date: bookingDate, time_slot: timeSlot },
    });
    return data;
  },
};