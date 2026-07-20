export const API_ROUTES = {
    USER: {
        VENUE:{
          VENUES: '/user/venues',
          TOP_VENUES: '/user/top-venues'
        },
        PROFILE: {
          PROFILE: "/user/profile",
          PROFILE_IMAGE: "/user/profile/image",
          REQUEST_EMAIL_CHANGE_OTP: "/user/profile/email/request-otp",
          VERIFY_EMAIL_CHANGE_OTP: "/user/profile/email/verify-otp",
          RESEND_EMAIL_CHANGE_OTP: "/user/profile/email/resend-otp",
          CHANGE_PASSWORD: "/user/profile/change-password"
        },
        CHANGE_PASSWORD: {
          CHANGE_PASSWORD: "user/changepassword",
        },
        WISHLIST: {
          GET: "/user/wishlist",
          ADD: (venueId) => `/user/wishlist/${venueId}`,
          REMOVE: (venueId) => `/user/wishlist/${venueId}`,
        },
        BOOKINGS: {
          BOOKINGS: "user/bookings"
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