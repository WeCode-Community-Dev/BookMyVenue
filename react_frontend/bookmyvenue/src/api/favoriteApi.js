import api from "./axios";
import { hasAuthSession } from "./authApi";

export function hasAccessToken() {
  return hasAuthSession();
}

export async function getFavorites() {
  const response = await api.get("/favorites/", { requiresAuth: true });
  return Array.isArray(response.data) ? response.data : response.data.results;
}

export async function addFavorite(venueId) {
  const response = await api.post(
    "/favorites/",
    { venue_id: venueId },
    { requiresAuth: true }
  );
  return response.data;
}

export async function removeFavorite(favoriteId) {
  await api.delete(`/favorites/${favoriteId}/`, { requiresAuth: true });
}
