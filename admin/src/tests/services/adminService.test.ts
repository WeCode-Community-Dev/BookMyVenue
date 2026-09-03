import { describe, it, expect, vi, beforeEach } from "vitest";
import { adminService } from "@/services/adminService";
import { axiosInstance } from "@/config/axios";
import { API_ENDPOINTS } from "@/constants";

vi.mock("@/config/axios", () => ({
  axiosInstance: {
    get: vi.fn(),
    post: vi.fn(),
    delete: vi.fn(),
  },
}));

describe("admin adminService API handlers", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("Venue Moderation API", () => {
    it("should fetch paginated venues list with query parameters", async () => {
      const mockResult = {
        venues: [{ _id: "v_1", name: "Kochi Convention Center" }],
        pagination: { totalItems: 1, totalPages: 1, currentPage: 1, limit: 10 },
      };

      vi.mocked(axiosInstance.get).mockResolvedValueOnce({
        data: { data: mockResult },
      });

      const data = await adminService.getVenues(1, 10, "PendingReview");

      expect(axiosInstance.get).toHaveBeenCalledWith(
        `${API_ENDPOINTS.ADMIN_VENUES}?page=1&limit=10&status=PendingReview`,
      );
      expect(data).toEqual(mockResult);
    });

    it("should approve venue by ID", async () => {
      vi.mocked(axiosInstance.post).mockResolvedValueOnce({
        data: { success: true, message: "Venue approved successfully" },
      });

      const res = await adminService.approveVenue("v_123");

      expect(axiosInstance.post).toHaveBeenCalledWith(
        `${API_ENDPOINTS.VENUES}/v_123/approve`,
      );
      expect(res.success).toBe(true);
    });

    it("should reject venue with reason", async () => {
      vi.mocked(axiosInstance.post).mockResolvedValueOnce({
        data: { success: true, message: "Venue rejected" },
      });

      const res = await adminService.rejectVenue(
        "v_123",
        "Incomplete address documents",
      );

      expect(axiosInstance.post).toHaveBeenCalledWith(
        `${API_ENDPOINTS.VENUES}/v_123/reject`,
        { reason: "Incomplete address documents" },
      );
      expect(res.success).toBe(true);
    });
  });

  describe("RBAC & User Moderation API", () => {
    it("should promote user to admin role by email", async () => {
      vi.mocked(axiosInstance.post).mockResolvedValueOnce({
        data: { success: true, message: "User promoted to admin" },
      });

      const res = await adminService.promoteToAdmin("newadmin@example.com");

      expect(axiosInstance.post).toHaveBeenCalledWith(
        API_ENDPOINTS.RBAC_PROMOTE,
        {
          email: "newadmin@example.com",
        },
      );
      expect(res.success).toBe(true);
    });

    it("should ban user with scope and reason", async () => {
      vi.mocked(axiosInstance.post).mockResolvedValueOnce({
        data: { success: true, message: "User banned successfully" },
      });

      const res = await adminService.banUser(
        "user_999",
        "global",
        "Terms violation",
      );

      expect(axiosInstance.post).toHaveBeenCalledWith(
        API_ENDPOINTS.MODERATION_BANS,
        {
          userId: "user_999",
          scope: "global",
          reason: "Terms violation",
          venueId: undefined,
          expiresAt: undefined,
        },
      );
      expect(res.success).toBe(true);
    });

    it("should unban user by userId", async () => {
      vi.mocked(axiosInstance.post).mockResolvedValueOnce({
        data: { success: true, message: "User unbanned" },
      });

      const res = await adminService.unbanUser("user_999");

      expect(axiosInstance.post).toHaveBeenCalledWith(
        `${API_ENDPOINTS.TOGGLE_USER_STATUS}/user_999/unban`,
      );
      expect(res.success).toBe(true);
    });
  });

  describe("Review Moderation API", () => {
    it("should moderate review with action and reason", async () => {
      vi.mocked(axiosInstance.post).mockResolvedValueOnce({
        data: { success: true, message: "Review removed" },
      });

      const res = await adminService.moderateReview(
        "rev_555",
        "remove",
        "Abusive language",
      );

      expect(axiosInstance.post).toHaveBeenCalledWith(
        `${API_ENDPOINTS.REVIEWS}/rev_555/moderate`,
        { action: "remove", reason: "Abusive language" },
      );
      expect(res.success).toBe(true);
    });
  });

  describe("Venue Management API", () => {
    it("should feature venue with duration", async () => {
      vi.mocked(axiosInstance.post).mockResolvedValueOnce({
        data: { success: true, message: "Venue featured" },
      });

      const res = await adminService.featureVenue("v_123", "7");

      expect(axiosInstance.post).toHaveBeenCalledWith(
        `${API_ENDPOINTS.VENUES}/v_123/feature`,
        { durationDays: "7" },
      );
      expect(res.success).toBe(true);
    });

    it("should activate venue by ID", async () => {
      vi.mocked(axiosInstance.post).mockResolvedValueOnce({
        data: { success: true, message: "Venue activated" },
      });

      const res = await adminService.activateVenue("v_123");

      expect(axiosInstance.post).toHaveBeenCalledWith(
        `${API_ENDPOINTS.VENUES}/v_123/activate`,
      );
      expect(res.success).toBe(true);
    });

    it("should deactivate venue by ID", async () => {
      vi.mocked(axiosInstance.post).mockResolvedValueOnce({
        data: { success: true, message: "Venue deactivated" },
      });

      const res = await adminService.deactivateVenue("v_123");

      expect(axiosInstance.post).toHaveBeenCalledWith(
        `${API_ENDPOINTS.VENUES}/v_123/deactivate`,
      );
      expect(res.success).toBe(true);
    });
  });

  describe("Admin List API", () => {
    it("should fetch paginated bookings list", async () => {
      const mockResult = {
        bookings: [{ _id: "b_1", venue: "Grand Palace" }],
        pagination: { totalItems: 1, totalPages: 1, currentPage: 1, limit: 10 },
      };

      vi.mocked(axiosInstance.get).mockResolvedValueOnce({
        data: { data: mockResult },
      });

      const data = await adminService.getBookings(1, 10);

      expect(axiosInstance.get).toHaveBeenCalledWith(
        `${API_ENDPOINTS.ADMIN_BOOKINGS}?page=1&limit=10`,
      );
      expect(data).toEqual(mockResult);
    });

    it("should fetch paginated owners list with owner role filter", async () => {
      const mockResult = {
        users: [{ _id: "u_1", name: "Owner One" }],
        pagination: { totalItems: 1, totalPages: 1, currentPage: 1, limit: 10 },
      };

      vi.mocked(axiosInstance.get).mockResolvedValueOnce({
        data: { data: mockResult },
      });

      const data = await adminService.getOwners(1, 10);

      expect(axiosInstance.get).toHaveBeenCalledWith(
        `${API_ENDPOINTS.ADMIN_USERS}?page=1&limit=10&role=owner`,
      );
      expect(data).toEqual(mockResult);
    });

    it("should fetch paginated admins list", async () => {
      const mockResult = {
        admins: [{ _id: "a_1", name: "Admin One" }],
        pagination: { totalItems: 1, totalPages: 1, currentPage: 1, limit: 10 },
      };

      vi.mocked(axiosInstance.get).mockResolvedValueOnce({
        data: { data: mockResult },
      });

      const data = await adminService.getAdmins(1, 10);

      expect(axiosInstance.get).toHaveBeenCalledWith(
        `${API_ENDPOINTS.RBAC_ADMINS}?page=1&limit=10`,
      );
      expect(data).toEqual(mockResult);
    });
  });

  describe("RBAC Management API", () => {
    it("should demote admin by userId", async () => {
      vi.mocked(axiosInstance.post).mockResolvedValueOnce({
        data: { success: true, message: "Admin demoted" },
      });

      const res = await adminService.demoteAdmin("user_456");

      expect(axiosInstance.post).toHaveBeenCalledWith(
        API_ENDPOINTS.RBAC_DEMOTE,
        { userId: "user_456" },
      );
      expect(res.success).toBe(true);
    });
  });

  describe("Moderation Summary API", () => {
    it("should fetch moderation summary", async () => {
      const mockSummary = {
        pendingReviews: 5,
        flaggedVenues: 2,
      };

      vi.mocked(axiosInstance.get).mockResolvedValueOnce({
        data: { data: mockSummary },
      });

      const data = await adminService.getModerationSummary();

      expect(axiosInstance.get).toHaveBeenCalledWith(
        API_ENDPOINTS.MODERATION_SUMMARY,
      );
      expect(data).toEqual(mockSummary);
    });
  });

  describe("Ban Management API", () => {
    it("should lift ban by banId", async () => {
      vi.mocked(axiosInstance.delete).mockResolvedValueOnce({
        data: { success: true, message: "Ban lifted" },
      });

      const res = await adminService.liftBan("ban_789");

      expect(axiosInstance.delete).toHaveBeenCalledWith(
        `${API_ENDPOINTS.MODERATION_BANS}/ban_789`,
      );
      expect(res.success).toBe(true);
    });

    it("should get user bans by userId", async () => {
      const mockBans = [{ _id: "ban_1", scope: "global" }];

      vi.mocked(axiosInstance.get).mockResolvedValueOnce({
        data: { data: mockBans },
      });

      const data = await adminService.getUserBans("user_999");

      expect(axiosInstance.get).toHaveBeenCalledWith(
        `${API_ENDPOINTS.MODERATION_BANS}/user/user_999`,
      );
      expect(data).toEqual(mockBans);
    });

    it("should lift all bans for a user", async () => {
      vi.mocked(axiosInstance.post).mockResolvedValueOnce({
        data: { success: true, message: "All bans lifted" },
      });

      const res = await adminService.liftAllBans("user_999");

      expect(axiosInstance.post).toHaveBeenCalledWith(
        `${API_ENDPOINTS.MODERATION_BANS}/user/user_999/lift-all`,
      );
      expect(res.success).toBe(true);
    });

    it("should ban user without optional venueId and expiresAt", async () => {
      vi.mocked(axiosInstance.post).mockResolvedValueOnce({
        data: { success: true, message: "User banned" },
      });

      const res = await adminService.banUser("user_111", "venue", "Spam");

      expect(axiosInstance.post).toHaveBeenCalledWith(
        API_ENDPOINTS.MODERATION_BANS,
        {
          userId: "user_111",
          scope: "venue",
          reason: "Spam",
          venueId: undefined,
          expiresAt: undefined,
        },
      );
      expect(res.success).toBe(true);
    });
  });
});
