import { axiosInstance } from '@/config/axios';
import { API_ENDPOINTS } from '@/constants';
import type { VenueFilters } from '@/types/venue.types';

export async function createVenue(dto: unknown) {
  const res = await axiosInstance.post(API_ENDPOINTS.VENUES, dto);
  return res.data?.data ?? res.data;
}

export async function submitVenue(venueId: string) {
  const res = await axiosInstance.post(API_ENDPOINTS.VENUE_SUBMIT(venueId));
  return res.data?.data ?? res.data;
}

export async function getUploadSignature() {
  const res = await axiosInstance.get(API_ENDPOINTS.UPLOAD_SIGNATURE);
  return res.data?.data ?? res.data;
}

export async function getMyVenues() {
  const res = await axiosInstance.get(API_ENDPOINTS.MY_VENUES);
  return res.data?.data ?? res.data;
}

// PUT /venues/draft
export async function upsertVenueDraft(step: number, formValues: unknown) {
  const res = await axiosInstance.put(API_ENDPOINTS.VENUE_DRAFT, { step, formValues });
  return res.data?.data ?? res.data;
}

// GET /venues/draft
export async function getMyDraft(): Promise<Record<string, unknown> | null> {
  const res = await axiosInstance.get(API_ENDPOINTS.VENUE_DRAFT);
  return res.data?.data ?? null;
}

// PUT /venues/:id
export async function updateVenue(venueId: string, dto: unknown) {
  const res = await axiosInstance.put(API_ENDPOINTS.VENUE_UPDATE(venueId), dto);
  return res.data?.data ?? res.data;
}
// GET /venues
export async function getPublicVenues(filters: VenueFilters, page: number, limit: number) {
  const res = await axiosInstance.get(API_ENDPOINTS.VENUES, {
    params: { ...filters, page, limit },
  });
  return res.data?.data ?? res.data;
}

// GET /venues/:id
export async function getVenueById(id: string) {
  const res = await axiosInstance.get(API_ENDPOINTS.VENUE_BY_ID(id));
  return res.data?.data ?? res.data;
}
