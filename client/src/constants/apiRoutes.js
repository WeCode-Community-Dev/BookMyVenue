export const API_ROUTES = {
AUTH:{
  REGISTER:(role)=> `/auth/${role}/register`,
  VERIFY_OTP:(role)=>`/auth/${role}/verifyotp`,
  RESEND_OTP:(role)=>`/auth/${role}/resendotp`,
  LOGIN:(role)=>`/auth/${role}/login`,
  FORGOT_PASSWORD: (role) => `/auth/${role}/forgotpassword`,
  RESET_PASSWORD: (role) => `/auth/${role}/resetpassword`,
    

  LOGOUT: (role) => `/auth/${role}/logout`,
  REFRESH:(role)=>`/auth/${role}/refresh`,
  GETME: '/auth/getme'

  
  

},

    USER: {
        VENUE:{
          VENUES: '/user/venues',
          GET_BY_ID:(venueId)=>`/user/venue/${venueId}`,
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
        BOOKING: {
          GET_ALL: "/user/booking",
          GET_BY_ID: (bookingId) => `/user/booking/${bookingId}`,
          CANCEL: (bookingId) => `/user/bookings/${bookingId}/cancel`,
        }
    },
   ADMIN: {
    DASHBOARD:{
      STATISTICS: "/admin/dashboard/statistics",

    },
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
  VENDOR: {
    DASHBOARD: "/vendor/dashboard",
    PROFILE: "/vendor/profile",
    BOOKINGS: "/vendor/bookings",
    BOOKING_BY_ID: (bookingId) =>
                `/vendor/bookings/${bookingId}`,

    VENUES: "/vendor/venues",
    CREATE_VENUE: "/vendor/venue",
    UPDATE_VENUE:(venueId)=>`/vendor/venue/${venueId}`,
    DELETE_VENUE:(venueId)=>`/vendor/venue/${venueId}`,
    VENUE_BY_ID: (venueId) =>
              `/vendor/venues/${venueId}`,
    UPDATE_VENUE_STATUS: (venueId) =>
          `/vendor/venues/${venueId}/status`,
},

}