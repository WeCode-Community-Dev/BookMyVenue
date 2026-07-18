import { api } from "../api/client.js";

export const getVenues = async (page = 1, filters = {}) => {
  const params = new URLSearchParams();

  params.set("page", page);

  if (filters.district) params.set("district", filters.district);
  if (filters.category) params.set("category", filters.category);
  if (filters.minPrice) params.set("minPrice", filters.minPrice);
  if (filters.maxPrice) params.set("maxPrice", filters.maxPrice);
  if (filters.limit) params.set("limit", filters.limit);
  if (filters.sort) params.set("sort", filters.sort);

  const response = await api.get(`/venues?${params.toString()}`);

  return response;
};

export const getVenueById = async (id) => {
  const venue = await api.get(`/venues/${id}`);
  return venue;
}