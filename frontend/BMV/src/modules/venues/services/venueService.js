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

export const getVenueReviews = async (venueId) => {
  const response = await client.get(`/venues/${venueId}/reviews`);
  return response.data;
};

export const checkAvailability = async (venueId, booking_date, time_slot) => {
  const response = await client.get(`/venues/${venueId}/availability`, {
    params: { booking_date, time_slot },
  });
  return response.data;
};

export const checkAvailabilityRange = async (
  venueId,
  { check_in_date, check_in_time, check_out_date, check_out_time },
) => {
  const response = await client.get(`/venues/${venueId}/availability/range`, {
    params: { check_in_date, check_in_time, check_out_date, check_out_time },
  });
  return response.data;
};
