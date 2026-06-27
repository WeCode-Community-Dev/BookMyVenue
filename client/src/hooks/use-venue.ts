import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import {
  setVenueStatusRequest,
  createVenueRequest,
  deleteVenueRequest,
  getAllVenues,
  getMyVenues,
  getVenues,
  getVenueById,
  updateVenueRequest,
  type VenuesQuery,
} from "@/api/venue-api";

export const MY_VENUES_QUERY_KEY = ["my-venues"];
export const ALL_VENUES_QUERY_KEY = ["all-venues"];

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

export const useAllVenues = () =>
  useQuery({
    queryKey: ALL_VENUES_QUERY_KEY,
    queryFn: getAllVenues,
  });

export const useSetVenueStatus = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: setVenueStatusRequest,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ALL_VENUES_QUERY_KEY });
    },
  });
};

export const useDeleteVenue = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteVenueRequest,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ALL_VENUES_QUERY_KEY });
    },
  });
};

export const useCreateVenue = () =>
  useMutation({
    mutationFn: createVenueRequest,
  });

export const useUpdateVenue = () =>
  useMutation({
    mutationFn: updateVenueRequest,
  });
