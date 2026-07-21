import client from "../../../core/api/client";

export const getVenues = async ({ search = "", location = "" } = {}) => {
  const params = {};
  if (search) params.search = search;
  if (location) params.location = location;
  const response = await client.get("/venues/", { params });
  return response.data;
};

export const getVenueById = async (venueId) => {
  const response = await client.get(`/venues/${venueId}`);
  return response.data;
};

export const checkAvailability = async (venueId, booking_date, time_slot) => {
  const response = await client.get(`/venues/${venueId}/availability`, {
    params: { booking_date, time_slot },
  });
  return response.data;
};
