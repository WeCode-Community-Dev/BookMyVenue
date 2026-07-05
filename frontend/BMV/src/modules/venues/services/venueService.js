import apiClient from "../../../core/api/client";

export const getVenues = async () => {
  const response = await apiClient.get("/venues");
  return response.data;
};

export const getVenueById = async (venueId) => {
  const response = await apiClient.get(`/venues/${venueId}`);
  return response.data;
};