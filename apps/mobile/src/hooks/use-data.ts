// Mobile data hooks — call the shared @repo/application use cases through
// repos built from the mobile Supabase client. Same business rules as web.
import { useQuery } from "@tanstack/react-query";
import { makeHttpVenuesRepo, makeHttpBookingsRepo } from "@repo/infrastructure";
import { listVenuesUseCase, getVenueUseCase, listMyBookingsUseCase } from "@repo/application";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Constants from "expo-constants";

const extra = (Constants.expoConfig?.extra ?? {}) as Record<string, string>;
const API_URL = extra.API_URL ?? process.env.EXPO_PUBLIC_API_URL ?? "http://localhost:3000";

const venuesRepo = makeHttpVenuesRepo({ apiUrl: API_URL });
const bookingsRepo = makeHttpBookingsRepo({
  apiUrl: API_URL,
  getToken: () => AsyncStorage.getItem("better-auth.session_token"),
});

const listVenues = listVenuesUseCase(venuesRepo);
const getVenue = getVenueUseCase(venuesRepo);
const listMyBookings = listMyBookingsUseCase(bookingsRepo);

export const useVenues = (search?: string) =>
  useQuery({
    queryKey: ["venues", search ?? ""],
    queryFn: () => listVenues({ search }),
  });

export const useVenue = (id: string) =>
  useQuery({
    queryKey: ["venue", id],
    queryFn: () => getVenue(id),
    enabled: !!id,
  });

export const useMyBookings = (userId: string | null) =>
  useQuery({
    queryKey: ["my-bookings", userId],
    queryFn: () => listMyBookings(userId!),
    enabled: !!userId,
  });
