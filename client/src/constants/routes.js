export const ROUTES = {
    PUBLIC: {
        HOME: '/',
        SIGNUP: '/signup',
        LOGIN: '/login',
    },
    USER: {
        PROFILE: '/user/profile',
        BROWSE_VENUES: '/user/venues',
        VENUE_DETAILS: '/user/venue/:id'
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
        DASHBOARD: "/admin/dashboard",
        USERS: "users",
        VENDORS: "vendors",
        VENUES: "/admin/venues",
        BOOKINGS: "/admin/bookings",
        PAYMENTS: "/admin/payments",
        CATEGORIES: "/admin/categories",
    }
}