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
        ACCOUNT_SETTINGS: '/user/accountsettings',
        WISHLIST: '/user/wishlist',
        BOOKINGS: '/user/bookings'
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
        
    }
}