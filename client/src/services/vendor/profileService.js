import api from "@/lib/axios";
import { API_ROUTES } from "@/constants/apiRoutes";

export const getVendorProfileService = async () => {
  const response = await api.get(API_ROUTES.VENDOR.PROFILE);
  return response.data;
};

export const updateVendorProfileService = async (profileData) => {
  const response = await api.patch(
    API_ROUTES.VENDOR.PROFILE,
    profileData
  );
  return response.data;
};