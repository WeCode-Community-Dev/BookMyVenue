export const ROUTES = {
    AUTH: {
        LOGOUT: '/logout'
    },
    ADMIN: {
        USERS: '/users',
        UPDATE_USER_STATUS: '/users/:userId/status',
    },
    OWNER: {
        VENUE: {
            CREATE: '/venue',
            EDIT: '/venue/:venueId',
            GET_BY_ID: '/venue/:venueId/:ownerId',
            GET_ALL: '/venues',
            DELETE: '/venue/:venueId/:ownerId',
            UPDATE_STATUS: '/venue/:venueId/:ownerId/status'
        },
        PROFILE: {
            GET: '/profile',
            UPDATE: '/profile'
        },
        BOOKING: {

            GET_ALL: '/bookings',
            GET_BY_ID: '/bookings/:bookingId'
        },
        DASHBOARD: '/dashboard'
    },
    USER: {
        VENUE: {
            GET_ALL: '/venues',
            GET_BY_ID: '/venue/:venueId'
        }
    }
}