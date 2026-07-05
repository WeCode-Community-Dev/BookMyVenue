import api from "./axios";

export async function getVenues(page = 1) {
  const response = await api.get("/venues/", {
    params: { page },
  });
  return response.data;
}

export async function getFeaturedVenues(page = 1) {
  const response = await api.get("/venues/featured/", {
    params: { page },
  });
  return response.data;
}

export async function getVenueBySlug(slug) {
  const response = await api.get(`/venues/${slug}/`);
  return response.data;
}
