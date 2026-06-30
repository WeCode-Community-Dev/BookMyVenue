export const ROUTES = {
    AUTH: {
        LOGOUT: '/logout'
    },
    ADMIN: {
        USER:{
            GET_ALL:'/users',
            UPDATE_STATUS: '/users/:userId/status',
        },
        VENDOR:{
            GET_ALL:'/vendors',
            GET_BY_ID:'/vendors/:vendorId',
            APPROVE_VENDOR:"/vendors/:vendorId/approve",
            REJECT_VENDOR:"/vendors/:vendorId/reject",
            UPDATE_STATUS:'/vendors/:vendorId/status'
        },
        VENUE:{
            GET_ALL:'/venues',
            GET_BY_ID:'/venues/:venueId',
            APPROVE_VENUE:'/venues/:venueId/approve',
            REJECT_VENUE:'/venues/:venueId/reject',
            UPDATE_STATUS:'/venues/:venueId/status'
        },
        BOOKING:{
            GET_ALL:'/bookings',
            GET_BY_ID:'/bookings/:bookingId',
            GET_STATISTICS:'/bookings/statistics',
        }

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