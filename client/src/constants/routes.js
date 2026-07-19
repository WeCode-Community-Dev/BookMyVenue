export const ROUTES = {
    PUBLIC: {
        HOME: '/',
        SIGNUP: '/signup',
        LOGIN: '/login',
    },
    USER: {
        PROFILE: '/user/profile',
        BROWSE_VENUES: '/user/venues',
        VENUE_DETAILS: '/user/venue/:id',
        CHANGE_PASSWORD: '/user/changepassword',
        WISHLIST: '/user/wishlist',
        BOOKINGS: '/user/bookings',
        BOOKING_DETAIL: '/user/bookings/:bookingId'
    },
    VENDOR: {
        DASHBOARD: '/vendor/dashboard',
        VENUES: '/vendor/venues',
        BOOKINGS: '/vendor/bookings',
        ADD_VENUE: '/vendor/add-venue',
        PROFILE: '/vendor/profile',
        SETTINGS: '/vendor/settings',
    },
    ADMIN: {
        ROOT: "/admin", 
        DASHBOARD: "dashboard",
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