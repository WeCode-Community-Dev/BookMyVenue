import api from "./axios";
import { buildAdminQueryParams } from "../utils/adminQuery";

export const getDashboardStats = async () => {
  const { data } = await api.get("/admin/dashboard/stats");
  return data;
};

export const getRecentActivity = async () => {
  const { data } = await api.get("/admin/dashboard/recent-activity");
  return data;
};

export const getAdminUsers = async (params = {}) => {
  const { data } = await api.get("/admin/users", {
    params: buildAdminQueryParams(params),
  });
  return data;
};

export const getAdminUserById = async (id) => {
  const { data } = await api.get(`/admin/users/${id}`);
  return data;
};

export const activateAdminUser = async (id) => {
  const { data } = await api.patch(`/admin/users/${id}/activate`);
  return data;
};

export const deactivateAdminUser = async (id) => {
  const { data } = await api.patch(`/admin/users/${id}/deactivate`);
  return data;
};

export const getAdminVenues = async (params = {}) => {
  const { data } = await api.get("/admin/venues", {
    params: buildAdminQueryParams(params),
  });
  return data;
};

export const getAdminVenueById = async (id) => {
  const { data } = await api.get(`/admin/venues/${id}`);
  return data;
};

export const activateAdminVenue = async (id) => {
  const { data } = await api.patch(`/admin/venues/${id}/activate`);
  return data;
};

export const deactivateAdminVenue = async (id) => {
  const { data } = await api.patch(`/admin/venues/${id}/deactivate`);
  return data;
};

export const getAdminBookings = async (params = {}) => {
  const { data } = await api.get("/admin/bookings", {
    params: buildAdminQueryParams(params),
  });
  return data;
};

export const getAdminBookingById = async (id) => {
  const { data } = await api.get(`/admin/bookings/${id}`);
  return data;
};

export const getAdminPaymentOrders = async (params = {}) => {
  const { data } = await api.get("/admin/payments/orders", {
    params: buildAdminQueryParams(params),
  });
  return data;
};

export const getAdminPaymentHistory = async (params = {}) => {
  const { data } = await api.get("/admin/payments/history", {
    params: buildAdminQueryParams(params),
  });
  return data;
};

export const getAdminAbandonedPayments = async (params = {}) => {
  const { data } = await api.get("/admin/payments/abandoned", {
    params: buildAdminQueryParams(params),
  });
  return data;
};
