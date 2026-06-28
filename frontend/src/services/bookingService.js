import api from "./axios";

export const getMyBookings = async () => {
  const { data } = await api.get("/bookings/my-bookings");
  return data;
};

export const getProviderBookings = async () => {
  const { data } = await api.get("/bookings/provider-bookings");
  return data;
};
