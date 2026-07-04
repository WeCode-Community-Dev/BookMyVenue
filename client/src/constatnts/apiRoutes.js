export const API_ROUTES = {
    USER: {
        VENUE:{
          VENUES: '/user/venues',
          TOP_VENUES: '/user/top-venues'
        }
    },
    VENDOR: {
        DASHBOARD: '/vendor/dashboard',
        CREATE_VENUE: '/vendor/venue',
        VENUE: {
            GET_BY_ID: '/vendor/venue/:venueId/:ownerId',
            UPDATE: '/vendor/venue/:venueId'
        },
        VENUES: '/vendor/venues',
        BOOKINGS: '/vendor/bookings',
        PROFILE: '/vendor/profile',
    }
}