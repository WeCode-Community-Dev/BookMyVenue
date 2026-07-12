import apiClient from "./apiClient.js";

export const getVenues = async (filters = {}) => {
  const response = await apiClient.get("/venues", {
    params: filters,
  });

  return response.data;
};

export const getVenueById = async (venueId) => {
  const response = await apiClient.get(`/venues/${venueId}`);

  return response.data;
};

export const getNearbyVenues = async (filters = {}) => {
  const response = await apiClient.get("/venues/nearby", {
    params: filters,
  });

  return response.data;
};

export const getTownSuggestions = async (filters = {}) => {
  const response = await apiClient.get("/venues/town-suggestions", {
    params: filters,
  });

  return response.data;
};