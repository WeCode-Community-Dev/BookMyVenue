import api from "@/lib/axios";
import { API_ROUTES } from "@/constants/apiRoutes";

export const fetchVendorProfileService = async () => {
  const response = await api.get(API_ROUTES.VENDOR.PROFILE);
  return response.data;
};

export const createVenueService = async (formData) => {
  const response = await api.post(
    API_ROUTES.VENDOR.CREATE_VENUE,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );

  return response.data;
};

export const getVendorVenuesService = async (params) => {
  const response = await api.get(API_ROUTES.VENDOR.VENUES, {
    params,
  });

  return response.data;
};

export const getVenueByIdService = async (venueId) => {
  const response = await api.get(
    API_ROUTES.VENDOR.VENUE_BY_ID(venueId)
  );

  return response.data;
};

export const updateVenueService = async ({ venueId, formData }) => {
  const response = await api.patch(
    API_ROUTES.VENDOR.VENUE_BY_ID(venueId),
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );

  return response.data;
};

export const deleteVenueService = async (venueId) => {
  const response = await api.delete(
    API_ROUTES.VENDOR.VENUE_BY_ID(venueId)
  );

  return response.data;
};

export const updateVenueStatusService = async ({
  venueId,
  status,
}) => {
  const response = await api.patch(
    `${API_ROUTES.VENDOR.VENUE_BY_ID(venueId)}/status`,
    { status }
  );

  return response.data;
};