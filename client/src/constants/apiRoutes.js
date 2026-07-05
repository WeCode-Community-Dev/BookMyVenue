export const API_ROUTES = {
    USER: {
        VENUE:{
          VENUES: '/user/venues',
          TOP_VENUES: '/user/top-venues'
        }
    },
   ADMIN: {
    USER: {
      USERS: "/admin/users",
      UPDATE_STATUS: (userId) => `/admin/users/${userId}/status`,
    },

    VENDOR: {
      VENDORS: "/admin/vendors",
      GET_BY_ID: (vendorId) => `/admin/vendors/${vendorId}`,
      APPROVE: (vendorId) => `/admin/vendors/${vendorId}/approve`,
      REJECT: (vendorId) => `/admin/vendors/${vendorId}/reject`,
      UPDATE_STATUS: (vendorId) => `/admin/vendors/${vendorId}/status`,
    },

    VENUE: {
      VENUES: "/admin/venues",
      GET_BY_ID: (venueId) => `/admin/venues/${venueId}`,
      APPROVE: (venueId) => `/admin/venues/${venueId}/approve`,
      REJECT: (venueId) => `/admin/venues/${venueId}/reject`,
      UPDATE_STATUS: (venueId) => `/admin/venues/${venueId}/status`,
    },

    BOOKING: {
      BOOKINGS: "/admin/bookings",
      GET_BY_ID: (bookingId) => `/admin/bookings/${bookingId}`,
      STATISTICS: "/admin/bookings/statistics",
    },

    PAYMENT: {
      PAYMENTS: "/admin/payments",
      GET_BY_ID: (paymentId) => `/admin/payments/${paymentId}`,
      STATISTICS: "/admin/payments/statistics",
    },
  },

}