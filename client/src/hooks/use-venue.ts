import { keepPreviousData, useMutation, useQuery } from "@tanstack/react-query";
import {
  createVenueRequest,
  getMyVenues,
  getVenues,
  getVenueById,
  updateVenueRequest,
  type VenuesQuery,
} from "@/api/venue-api";

export const MY_VENUES_QUERY_KEY = ["my-venues"];

export const useVenues = (params: VenuesQuery) =>
  useQuery({
    queryKey: ["venues", params],
    queryFn: () => getVenues(params),
    placeholderData: keepPreviousData,
  });

export const useVenue = (venueId: string) =>
  useQuery({
    queryKey: ["venue", venueId],
    queryFn: () => getVenueById(venueId),
    enabled: Boolean(venueId),
  });

export const useMyVenues = () =>
  useQuery({
    queryKey: MY_VENUES_QUERY_KEY,
    queryFn: getMyVenues,
  });

export const useCreateVenue = () =>
  useMutation({
    mutationFn: createVenueRequest,
  });

export const useUpdateVenue = () =>
  useMutation({
    mutationFn: updateVenueRequest,
  });
