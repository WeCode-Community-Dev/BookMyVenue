import api from './api';

export const authService = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  getProfile: () => api.get('/auth/profile'),
  forgotPassword: (email) => api.post('/auth/forgot-password', { email }),
  resetPassword: (token, newPassword) => api.post('/auth/reset-password', { token, newPassword }),
};

export const userService = {
  getMe: () => api.get('/users/me'),
  updateProfile: (data) => api.patch('/users/me', data),
  updatePassword: (currentPassword, newPassword) => api.patch('/users/me/password', { currentPassword, newPassword }),
};

export const venueService = {
  getAll: (params) => api.get('/venues', { params }),
  getNearby: (lat, lng, radius) => api.get('/venues/nearby', { params: { latitude: lat, longitude: lng, radius } }),
  getById: (id) => api.get(`/venues/${id}`),
  create: (data) => api.post('/venues', data),
  update: (id, data) => api.put(`/venues/${id}`, data),
  delete: (id) => api.delete(`/venues/${id}`),
  getMyVenues: (params) => api.get('/venues/my-venues', { params }),
  getBlockedDates: (id) => api.get(`/venues/${id}/blocked-dates`),
  addBlockedDate: (id, data) => api.post(`/venues/${id}/blocked-dates`, data),
  removeBlockedDate: (id) => api.delete(`/venues/blocked-dates/${id}`),
  geocode: (query) => api.get('/venues/geocode', { params: { q: query } }),
};

export const bookingService = {
  create: (data) => api.post('/bookings', data),
  getMyBookings: (params) => api.get('/bookings', { params }),
  getOwnerBookings: (params) => api.get('/bookings/owner', { params }),
  getVenueBookings: (venueId, params) => api.get(`/bookings/venue/${venueId}`, { params }),
  getById: (id) => api.get(`/bookings/${id}`),
  updateStatus: (id, bookingStatus) => api.patch(`/bookings/${id}/status`, { bookingStatus }),
  lockSlot: (data) => api.post('/bookings/lock', data),
  releaseLock: (id) => api.delete(`/bookings/lock/${id}`),
  getActiveLock: () => api.get('/bookings/lock/active'),
};

export const reviewService = {
  getByVenue: (venueId, params) => api.get(`/venues/${venueId}/reviews`, { params }),
  create: (venueId, data) => api.post(`/venues/${venueId}/reviews`, data),
};

export const adminService = {
  getUsers: (params) => api.get('/admin/users', { params }),
  updateUserStatus: (id, status, reason) => api.patch(`/admin/users/${id}/status`, { status, reason }),
  getVenueOwners: (params) => api.get('/admin/venue-owners', { params }),
  getVenues: (params) => api.get('/admin/venues', { params }),
  updateVenueStatus: (id, status) => api.patch(`/admin/venues/${id}/status`, { status }),
  getBookings: (params) => api.get('/admin/bookings', { params }),
  updateBookingStatus: (id, bookingStatus) => api.patch(`/admin/bookings/${id}/status`, { bookingStatus }),
  getAnalytics: () => api.get('/admin/analytics'),
};
