export const ROUTES = {
    PUBLIC: {
        HOME: '/',
        SIGNUP: '/signup',
        LOGIN: '/login',
        REGISTER:'/register',
        VERIFY_OTP:'/verify-otp',
        FORGOT_PASSWORD: "/forgot-password",
        RESET_PASSWORD: "/reset-password",
        
        
        
    },
    USER: {
        PROFILE: '/user/profile',
        BROWSE_VENUES: '/user/venues',
        VENUE_DETAILS: '/user/venue/:id',
        CHANGE_PASSWORD: '/user/changepassword',
        WISHLIST: '/user/wishlist',
        BOOKINGS: '/user/bookings',
        BOOKING_DETAIL: '/user/bookings/:bookingId',
        BOOKING_SUMMARY:`/user/booking-summary`,
        PAYMENT:`/user/payment`,
        PAYMENT_GATEWAY:`/user/payment-gateway`,
        PAYMENT_SUCCESS:`/user/payment-success`,
        PAYMENT_FAILURE:`/user/payment-failure`

    },
    VENDOR: {
        DASHBOARD: '/vendor/dashboard',
        VENUES: '/vendor/venues',
        VENUE_DETAILS: '/vendor/venues/:venueId',
        BOOKINGS: '/vendor/bookings',
        ADD_VENUE: '/vendor/add-venue',
        EDIT_VENUE: '/vendor/edit-venue/:venueId',
        PROFILE: '/vendor/profile',
        SETTINGS: '/vendor/settings',
    },
    ADMIN: {
        ROOT: "/admin", 
        LOGIN: "/admin/login",
        DASHBOARD: "admin/dashboard",
        USERS: "users",
        VENDORS: "vendors",
        VENUES: "venues",
        VENUE_DETAILS: "venues/:venueId",
        BOOKINGS: "bookings",
        BOOKING_DETAIL: "bookings/:bookingId",
        PAYMENTS: "payments",
        PAYMENT_DETAILS:"payments/:paymentId",
        CATEGORIES: "/admin/categories",
    }
}