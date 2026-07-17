import api from "@/lib/axios";
import { API_ROUTES } from "@/constants/apiRoutes";

export const getDashboardStatsService = async () => {
  const response = await api.get(API_ROUTES.VENDOR.DASHBOARD);
  return response.data;
};