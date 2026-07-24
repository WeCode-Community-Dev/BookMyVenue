import client from "../../../core/api/client";

export const adminService = {
  async getDashboard() {
    const res = await client.get("/admin/dashboard");
    return res.data;
  },

  async getPendingVenues() {
    const res = await client.get("/admin/pending-venues", { params: { limit: 100 } });
    return res.data;
  },

  async approveVenue(venueId) {
    const res = await client.patch(`/admin/venues/${venueId}/approve`);
    return res.data;
  },

  async rejectVenue(venueId, rejection_reason = "") {
    const res = await client.patch(`/admin/venues/${venueId}/reject`, {
      rejection_reason,
    });
    return res.data;
  },

  async getVenues({ approval_status = "", skip = 0, limit = 100 } = {}) {
    const params = { skip, limit };
    if (approval_status) params.approval_status = approval_status;
    const res = await client.get("/admin/venues", { params });
    return res.data;
  },

  async getVenue(venueId) {
    const res = await client.get(`/admin/venues/${venueId}`);
    return res.data;
  },

  async createVenue(data) {
    const res = await client.post("/admin/venues", data);
    return res.data;
  },

  async updateVenue(venueId, data) {
    const res = await client.put(`/admin/venues/${venueId}`, data);
    return res.data;
  },

  async blockVenue(venueId) {
    const res = await client.delete(`/admin/venues/${venueId}`);
    return res.data;
  },

  async unblockVenue(venueId) {
    const res = await client.patch(`/admin/venues/${venueId}/unblock`);
    return res.data;
  },

  async getVenueTypes() {
    const res = await client.get("/venue-types/");
    return res.data;
  },

  async getBookings({ skip = 0, limit = 100 } = {}) {
    const res = await client.get("/admin/bookings", { params: { skip, limit } });
    return res.data;
  },

  async getUsers({ role = "", is_active, skip = 0, limit = 100 } = {}) {
    const params = { skip, limit };
    if (role) params.role = role;
    if (is_active !== undefined && is_active !== "") params.is_active = is_active;
    const res = await client.get("/admin/users", { params });
    return res.data;
  },

  async getUser(userId) {
    const res = await client.get(`/admin/users/${userId}`);
    return res.data;
  },

  async createUser(data) {
    const res = await client.post("/admin/users", data);
    return res.data;
  },

  async updateUser(userId, data) {
    const res = await client.put(`/admin/users/${userId}`, data);
    return res.data;
  },

  async deleteUser(userId) {
    const res = await client.delete(`/admin/users/${userId}`);
    return res.data;
  },

  async activateUser(userId) {
    const res = await client.patch(`/admin/users/${userId}/activate`);
    return res.data;
  },

  async deactivateUser(userId) {
    const res = await client.patch(`/admin/users/${userId}/deactivate`);
    return res.data;
  },
};
