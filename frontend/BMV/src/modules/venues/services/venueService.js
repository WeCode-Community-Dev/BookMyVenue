import apiClient from "../../../core/api/client";

export const getVenues = async (params = {}) => {
  const response = await apiClient.get("/venues", { params });
  return response.data;
};

export const getVenueById = async (venueId) => {
  const response = await apiClient.get(`/venues/${venueId}`);
  return response.data;
};

export const createVenue = async (venueData) => {
  const response = await apiClient.post("/venues", venueData);
  return response.data;
};

export const updateVenue = async (venueId, venueData) => {
  const response = await apiClient.put(`/venues/${venueId}`, venueData);
  return response.data;
};

export const deleteVenue = async (venueId) => {
  const response = await apiClient.delete(`/venues/${venueId}`);
  return response.data;
};

export const getMyVenues = async () => {
  const response = await apiClient.get("/venues/my-venues");
  return response.data;
};

export const checkAvailability = async (venueId, bookingDate, timeSlot) => {
  const response = await apiClient.get(`/venues/${venueId}/availability`, {
    params: { booking_date: bookingDate, time_slot: timeSlot }
  });
  return response.data;
};