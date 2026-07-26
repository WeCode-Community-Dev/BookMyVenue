import { axiosInstance } from "@/config/axios";
import { API_ENDPOINTS } from "@/constants";
import { DEFAULT_PAGE_LIMIT } from "@/constants/pagination";
import { ROLES } from "@/constants/roles";

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    totalItems: number;
    totalPages: number;
    currentPage: number;
    limit: number;
  };
}

export const adminService = {
  getVenues: async (
    page: number,
    limit: number = DEFAULT_PAGE_LIMIT,
    status?: string,
  ) => {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
    });
    if (status) params.append("status", status);
    const response = await axiosInstance.get(
      `${API_ENDPOINTS.ADMIN_VENUES}?${params.toString()}`,
    );
    return response.data.data; // { venues, pagination }
  },
  approveVenue: async (id: string) => {
    const response = await axiosInstance.post(
      `${API_ENDPOINTS.VENUES}/${id}/approve`,
    );
    return response.data;
  },
  rejectVenue: async (id: string, reason: string) => {
    const response = await axiosInstance.post(
      `${API_ENDPOINTS.VENUES}/${id}/reject`,
      { reason },
    );
    return response.data;
  },
  featureVenue: async (id: string, durationDays: string) => {
    const response = await axiosInstance.post(
      `${API_ENDPOINTS.VENUES}/${id}/feature`,
      { durationDays },
    );
    return response.data;
  },
  activateVenue: async (id: string) => {
    const response = await axiosInstance.post(
      `${API_ENDPOINTS.VENUES}/${id}/activate`,
    );
    return response.data;
  },
  deactivateVenue: async (id: string) => {
    const response = await axiosInstance.post(
      `${API_ENDPOINTS.VENUES}/${id}/deactivate`,
    );
    return response.data;
  },
  getBookings: async (page: number, limit: number = DEFAULT_PAGE_LIMIT) => {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
    });
    const response = await axiosInstance.get(
      `${API_ENDPOINTS.ADMIN_BOOKINGS}?${params.toString()}`,
    );
    return response.data.data; // { bookings, pagination }
  },
  getOwners: async (page: number, limit: number = DEFAULT_PAGE_LIMIT) => {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      role: ROLES.OWNER,
    });
    const response = await axiosInstance.get(
      `${API_ENDPOINTS.ADMIN_USERS}?${params.toString()}`,
    );
    return response.data.data; // { users, pagination }
  },
  getAdmins: async (page: number, limit: number = DEFAULT_PAGE_LIMIT) => {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
    });
    const response = await axiosInstance.get(
      `${API_ENDPOINTS.RBAC_ADMINS}?${params.toString()}`,
    );
    return response.data.data; // { admins, pagination }
  },
  promoteToAdmin: async (email: string) => {
    const response = await axiosInstance.post(API_ENDPOINTS.RBAC_PROMOTE, {
      email,
    });
    return response.data;
  },
  demoteAdmin: async (userId: string) => {
    const response = await axiosInstance.post(API_ENDPOINTS.RBAC_DEMOTE, {
      userId,
    });
    return response.data;
  },
  getModerationSummary: async () => {
    const response = await axiosInstance.get(API_ENDPOINTS.MODERATION_SUMMARY);
    return response.data.data;
  },
  moderateReview: async (
    reviewId: string,
    action: "flag" | "remove" | "restore" | "approve_hide" | "reject_hide",
    reason?: string,
  ) => {
    const response = await axiosInstance.post(
      `${API_ENDPOINTS.REVIEWS}/${reviewId}/moderate`,
      {
        action,
        reason,
      },
    );
    return response.data;
  },
  banUser: async (
    userId: string,
    scope: string,
    reason: string,
    venueId?: string | null,
    expiresAt?: string | null,
  ) => {
    const response = await axiosInstance.post(API_ENDPOINTS.MODERATION_BANS, {
      userId,
      scope,
      reason,
      venueId: venueId || undefined,
      expiresAt: expiresAt || undefined,
    });
    return response.data;
  },
  liftBan: async (banId: string) => {
    const response = await axiosInstance.delete(
      `${API_ENDPOINTS.MODERATION_BANS}/${banId}`,
    );
    return response.data;
  },
  getUserBans: async (userId: string) => {
    const response = await axiosInstance.get(
      `${API_ENDPOINTS.MODERATION_BANS}/user/${userId}`,
    );
    return response.data.data;
  },
  unbanUser: async (userId: string) => {
    const response = await axiosInstance.post(
      `${API_ENDPOINTS.TOGGLE_USER_STATUS}/${userId}/unban`,
    );
    return response.data;
  },
  liftAllBans: async (userId: string) => {
    const response = await axiosInstance.post(
      `${API_ENDPOINTS.MODERATION_BANS}/user/${userId}/lift-all`,
    );
    return response.data;
  },
};
