import apiClient from "./apiClient";

export const createOwnerVenue = async (venueData) => {
  const response = await apiClient.post("/owner/venues", venueData);
  return response.data;
};

export const getOwnerVenues = async () => {
  const response = await apiClient.get("/owner/venues");
  return response.data;
};

export const getOwnerVenueById = async (venueId) => {
  const response = await apiClient.get(`/owner/venues/${venueId}`);
  return response.data;
};

export const updateOwnerVenue = async (venueId, venueData) => {
  const response = await apiClient.patch(`/owner/venues/${venueId}`, venueData);
  return response.data;
};