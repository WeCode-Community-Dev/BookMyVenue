import apiClient from "./apiClient";

export const getAdminVenues = async (filters = {}) => {
  const response = await apiClient.get("/admin/venues", {
    params: filters,
  });

  return response.data;
};

export const updateVenueApprovalStatus = async (venueId, status) => {
  const response = await apiClient.patch(`/admin/venues/${venueId}/status`, {
    status,
  });

  return response.data;
};