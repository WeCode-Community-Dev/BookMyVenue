import { useMutation, useQuery } from "@tanstack/react-query";
import { createVenueRequest, getMyVenues, updateVenueRequest } from "@/api/venue-api";

export const MY_VENUES_QUERY_KEY = ["my-venues"];

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
