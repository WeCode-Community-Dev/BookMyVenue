import apiClient from "./apiClient";

export const uploadVenueImages = async (files) => {
  const formData = new FormData();

  files.forEach((file) => {
    formData.append("images", file);
  });

  const response = await apiClient.post("/uploads/venue-images", formData);

  return response.data;
};