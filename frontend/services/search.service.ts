import { api } from "@/lib/api";
import { mapBackendVenue, toBackendCategory } from "@/lib/backend-mappers";
import { BackendVenue, BackendVenueSearchResponse } from "@/types/backend";

export async function getRecommendedVenues() {
  const response = await api.get<BackendVenue[]>("/search/recommended");
  return response.data.map(mapBackendVenue);
}

export async function searchVenues(params: {
  city?: string;
  category?: string | null;
  capacity?: number | null;
  skip?: number;
  take?: number;
}) {
  const response = await api.get<BackendVenueSearchResponse>("/search", {
    params: {
      city: params.city || undefined,
      category: toBackendCategory(params.category),
      capacity: params.capacity || undefined,
      skip: params.skip ?? 0,
      take: params.take ?? 10,
    },
  });

  return {
    data: response.data.data.map(mapBackendVenue),
    pagination: response.data.pagination,
  };
}

export async function searchNavbar(query: string) {
  const response = await api.get<BackendVenue[] | { results: BackendVenue[] }>("/search/navbar", {
    params: { q: query },
  });

  const results = Array.isArray(response.data) ? response.data : response.data.results;
  return results.map(mapBackendVenue);
}
